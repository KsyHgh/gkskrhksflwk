require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const multer = require('multer');
const mkdirp = require('mkdirp');

function saveAvatarFile() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const dir = req.app.get('avatar.dir');
            mkdirp.sync(dir);
            cb(null, dir);
        },
        filename(req, file, cb) {
            var originalname = file.originalname;
            var extention = originalname.substr(originalname.lastIndexOf("."));
            var new_file_name = Date.now() + extention;
            req.body.file_name = new_file_name;
            return cb(null, new_file_name);
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

async function addAvatar(req, res) {
    const { app_id, roles, file_name } = req.body;
    const { Avatar } = req.app.db;

    if (!app_id || typeof(app_id) == 'undefined') {
        res.json({ status: 0, msg: "invalid parameter." });
    }
    const [avatar, created] = await Avatar.findOrCreate({
        where: { appId: app_id },
        defaults: {
            avatar: file_name,
            roles
        }
    });
    if (!created) {
        await avatar.update({
            avatar: file_name,
            roles
        });
    }
    res.json({ id: avatar.id });
}

async function getAvatars(req, res) {
    let { offset, limit } = req.query;

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    const { Avatar } = req.app.db;
    const avatars = await Avatar.findAndCountAll({ offset, limit, });

    res.json({
        items: avatars.rows.map(avatar => ({
            id: avatar.id,
            roles: avatar.roles,
            app_id: avatar.appId,
            avatar: avatar.avatar,
            timestamp: avatar.createdAt,
        })),
        total: avatars.count,
    });
}

module.exports = app => {

    app.api.route('/avatar')
        .get(getAvatars)
        .post(saveAvatarFile(), addAvatar);
};