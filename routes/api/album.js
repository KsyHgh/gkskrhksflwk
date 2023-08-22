require('rootpath')();

const decompress = require('decompress');
const isEmpty = require("is-empty");
const fs = require('fs');
const fsPromises = fs.promises
const path = require('path');
const errcode = require('err-code');
const multer = require('multer');
const mkdirp = require('mkdirp');
const { Op } = require('sequelize');
const requireLogin = require('middlewares/require_login');


async function getImages(req, res) {
    const { mobile_id, page_num, album_count_per_page } = req.query;
    const offset = Number((page_num - 1) * album_count_per_page);
    const limit = Number(album_count_per_page);
    const { Photo } = req.app.db;

    const photos = await Photo.findAndCountAll({
        where: { mobileId: mobile_id },
        order: [
            ['id', 'ASC']
        ],
        offset,
        limit,
    });

    res.json({
        items: photos.rows.map(photo => ({
            id: photo.id,
            mobile_id: photo.mobileId,
            file_name: photo.fileName,
            file_path: photo.filePath
        })),
        total: photos.count,
        total_page_count: Math.ceil(photos.count / album_count_per_page)
    });
}

async function updateImages(req, res, next) {
    const id = String(req.body.mobile_id);

    const { Mobile, Photo } = req.app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = req.app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room) {
        return res.json({ id: mobile.id, status: "error", msg: "device not found" });
    }
    const directory = path.join(req.app.get('download.mobiles.dir'), id);
    if (!!fs.existsSync(directory)) {
        for (const file of await fsPromises.readdir(directory)) {
            await fsPromises.unlink(path.join(directory, file));
        }
    }
    await Photo.destroy({ where: { mobileId: id } });
    socket.io.to(room).emit('upload_album');

    res.json({ id: mobile.id });
}

async function updateImagesStop(req, res, next) {
    const id = String(req.body.mobile_id);

    const { Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found mobile'), { status: 404 }));;

    const socket = req.app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room) {
        return res.json({ id: mobile.id, status: "error", msg: "기기가 연결되어 있지 않습니다." });
    }

    socket.io.to(room).emit('upload_album_stop');

    res.json({ id: mobile.id });
}

function saveAlbumFile() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('download.mobiles.dir'), mobileId);
            mkdirp.sync(dir);
            cb(null, dir);
        },
        filename(req, file, cb) {
            let file_name = req.body.file_name;
            if (!req.body.file_name) {
                file_name = "";
                req.body.file_name = "";
            }
            return cb(null, file_name)
        }
    });
    const upload = multer({
        storage,
        fileFilter(req, file, cb) {
            cb(null, true);
        }
    }).any();

    return (req, res, next) => {
        upload(req, res, err => {
            if (err)
                req.app.logger.error(err);
            next(err);
        });
    }
}

async function updateAlbum(req, res) {
    const mobileId = String(req.body.id);
    const file_name = String(req.body.file_name);

    if (isEmpty(file_name)) {
        req.app.socket.io.to('controls').emit('album_updated', { id: mobileId });
        return res.json({ id: mobileId });
    }

    const { Photo } = req.app.db;
    await Photo.create({
        mobileId: mobileId,
        fileName: file_name,
        filePath: `/download_files/mobiles/${mobileId}/${file_name}`
    })
    res.json({ id: mobileId });
    req.app.socket.io.to('controls').emit('album_updated', { id: mobileId });
}

module.exports = app => {

    app.api.route('/album')
        .get(requireLogin(), getImages);
    //
    // +-----------+                                    +--------+                              +--------+
    // |           | POST /api/album_update             |        | socket.io upload_album       |        |
    // |           +----------------------------------->|        +------------------------->    |        |
    // |  Control  |<-----------------------------------| Server |                              | Mobile |
    // | (Browser) |     socket.io album_updated        | (Node) | POST /api/mobile/album       |  (App) |
    // |           |<-----------------------------------|        |<-------------------------    |        |
    // |           |                                    |        |------------------------->    |        |
    // +-----------+                                    +--------+                              +--------+
    //
    app.api.route('/album_update')
        .post(requireLogin(), updateImages);
    app.api.route('/mobile/album')
        .post(saveAlbumFile(), updateAlbum);


    //
    // +-----------+                                    +--------+                              +--------+
    // |           | POST /api/album_update_pause       |        | socket.io upload_album_stop  |        |
    // |           +----------------------------------->|        +------------------------->    |        |
    // |  Control  |<-----------------------------------| Server |                              | Mobile |
    // | (Browser) |     socket.io album_updated        | (Node) | POST /api/mobile/album       |  (App) |
    // |           |<-----------------------------------|        |<-------------------------    |        |
    // |           |                                    |        |------------------------->    |        |
    // +-----------+                                    +--------+                              +--------+
    //

    app.api.route('/album_update_stop')
        .post(requireLogin(), updateImagesStop);
};