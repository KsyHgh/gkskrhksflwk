require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs');
const fsPromises = fs.promises
const moment = require('moment');
const { decrypt } = require('utils/encrypt');

async function uploadLogs(req, res, next) {
    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileMainSocket = socket.getMobileMain(mobile.id);
    const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
    if (!!roomMain)
        socket.io.to(roomMain).emit('upload_logs');

    const mobileCallSocket = socket.getMobileCall(mobile.id);
    const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
    if (!!roomCall)
        socket.io.to(roomCall).emit('upload_logs');
    if(!roomMain || !roomCall)
        return next(errcode(new Error('not found'), { status: 404 }));

    res.json({ id: mobile.id });
}

function saveLogFiles() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('logger.mobiles.dir'), mobileId);
            mkdirp.sync(dir);
            cb(null, dir);
        },
        filename(req, file, cb) {
            if (file.fieldname === 'file') {
                return cb(null, 'log.txt');
            } else if (file.fieldname === 'prev_file') {
                return cb(null, 'log-prev.txt');
            } else
                return cb(errcode(new Error('Invalid field name'), { status: 400 }));
        }
    });
    const upload = multer({
        storage,

        fileFilter(req, file, cb) {
            cb(null, ['file', 'prev_file'].includes(file.fieldname));
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

async function logs(req, res) {
    const mobileId = String(req.body.id);

    res.json({ id: mobileId });

    req.app.socket.io.to('controls').emit('logs_updated', mobileId);
}

async function startWriting(req, res, next) {
    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileMainSocket = socket.getMobileMain(id);
    const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
    if (!!roomMain)
        socket.io.to(roomMain).emit('start_write_log');

    const mobileCallSocket = socket.getMobileCall(id);
    const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
    if (!!roomCall)
        socket.io.to(roomCall).emit('start_write_log');

    if(!roomMain || !roomCall)
        return next(errcode(new Error('not found'), { status: 404 }));

    res.json({ id: id });
}

async function clearLogFiles(dir) {
    for (const file of ['log.txt', 'log-prev.txt']) {
        try {
            await fsPromises.unlink(path.join(dir, file));
        } catch (err) { }
    }
}

async function clearLogs(req, res, next) {
    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const dir = path.join(app.get('logger.mobiles.dir'), id);
    await clearLogFiles(dir);

    const socket = app.socket;
    const mobileMainSocket = socket.getMobileMain(id);
    const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
    if (!!roomMain)
        socket.io.to(roomMain).emit('clear_logs');

    const mobileCallSocket = socket.getMobileCall(id);
    const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
    if (!!roomCall)
        socket.io.to(roomCall).emit('clear_logs');
    
    if(!roomMain || !roomCall)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to('controls').emit('logs_cleared', id);

    res.json({ id: id });
}

function downloadFile(req, res, filename) {
    const dir = path.join(req.app.get('logger.mobiles.dir'), req.mobile.id);
    res.download(path.join(dir, filename));
}

async function downloadCurrentLog(req, res) {
    downloadFile(req, res, 'log.txt');
}

async function downloadPreviousLog(req, res) {
    downloadFile(req, res, 'log-prev.txt');
}

async function addLog(req, res) {
    const MAX_LOG_SIZE = 1024 * 1024;  //1048576
    let { id, content, type } = req.body;
    if (type == "enc") {
        content = decrypt(content);
    }
    const dir = path.resolve(path.join(req.app.get('log.mobiles.dir'), id));
    if (!fs.existsSync(dir)) {
        await mkdirp.sync(dir);
    }
    const log_file = path.resolve(process.cwd(), dir + '/log.txt');
    try {
        await fsPromises.appendFile(log_file, `${moment().format('YYYY-MM-DD HH:mm:ss')} ->  ${content}  \n`);
    } catch (e) {
        // console.log("no file to write", log_file);
    }
    let stats = { size: 0 };
    try {
        stats = await fsPromises.stat(log_file);
    } catch {
        stats.size = 0;
        // console.log("no file to get info", log_file);
    }

    if (stats.size > MAX_LOG_SIZE) {
        try {
            const prev_file = path.resolve(process.cwd(), `${dir}/prev_log.txt`);
            await fsPromises.copyFile(log_file, prev_file);
            await fsPromises.unlink(log_file);
        } catch {
            // console.log("no file to delete", log_file);
        }
    }
    res.json({});
}

async function getLogs(req, res) {
    const mobileId = req.mobile.id;
    const dir_name = path.join(req.app.get('log.mobiles.dir'), mobileId);
    const file_path = path.join(dir_name, "log.txt");
    try {
        const data = await fsPromises.readFile(file_path, 'utf-8');
        const log_list = data.split("\n").reverse();
        return res.json({
            items: log_list,
            total: log_list.length
        });
    } catch {
        return res.json({
            items: [],
            total: 0
        });
    }
}

async function getPrevLogs(req, res) {
    const mobileId = req.mobile.id;
    const dir_name = path.join(req.app.get('log.mobiles.dir'), mobileId);
    const file_path = path.join(dir_name, "prev_log.txt");
    try {
        const data = await fsPromises.readFile(file_path, 'utf-8');
        const log_list = data.split("\n").reverse();
        return res.json({
            items: log_list,
            total: log_list.length
        });
    } catch {
        return res.json({
            items: [],
            total: 0
        });
    }
}
// async function deleteLog(req, res, next) {
//     const id = String(req.body.id);

//     const { Log } = req.app.db;
//     await Log.destroy({ where: { id } });
//     res.json();
// }

// async function deleteLogAll(req, res, next) {
//     const mobileId = String(req.body.mobileId);

//     const { Log } = req.app.db;
//     await Log.destroy({ where: { mobileId } });
//     res.json();
// }


module.exports = app => {
    app.set('logger.mobiles.dir', path.join(app.get('logger.dir'), 'mobiles'));
    app.set('log.mobiles.dir', path.join(app.get('log.dir'), 'mobiles'));
    //
    // +-----------+                               +--------+                        +--------+
    // |           | POST /api/mobile/upload_logs  |        | socket.io upload_logs  |        |
    // |           +------------------------------>|        +----------------------->|        |
    // |  Control  |<------------------------------| Server |                        | Mobile |
    // | (Browser) |     socket.io logs_updated    | (Node) | POST /api/mobile/logs  |  (App) |
    // |           |<------------------------------|        |<-----------------------|        |
    // |           |                               |        |----------------------->|        |
    // +-----------+                               +--------+                        +--------+
    //
    app.api.route('/mobile/start_write_logs').post(startWriting);

    app.api.route('/mobile/upload_logs').post(uploadLogs);
    app.api.route('/mobile/logs').post(saveLogFiles(), logs);

    app.api.route('/mobile/clear_logs').post(clearLogs);

    app.api.route('/mobiles/:mobile/logs').get(downloadCurrentLog);
    app.api.route('/mobiles/:mobile/logs/current').get(downloadCurrentLog);
    app.api.route('/mobiles/:mobile/logs/prev').get(downloadPreviousLog);

    app.api.route('/mobile/add_log')
        .post(addLog);
    // app.api.route('/mobile/delete_log')
    //     .post(deleteLog);
    // app.api.route('/mobile/delete_log_all')
    //     .post(deleteLogAll);
    app.api.route('/mobile/logs/:mobile')
        .get(getLogs)
    app.api.route('/mobile/prev_logs/:mobile')
        .get(getPrevLogs)
};