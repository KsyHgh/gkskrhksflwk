const { EventEmitter } = require('events');
const { Control } = require('./control');
const { MobileMain } = require('./mobileMain');
const { MobileCall } = require('./mobileCall');
const redisIO = require('socket.io-redis');

class Server extends EventEmitter {
    constructor() {
        super();
        this.setMaxListeners(100);
    }

    start(io) {
        this.io = io;
        io.on('connection', (socket) => this.onConnect(socket));
    }

    onConnect(socket) {
        socket.on('disconnect', () => this.onDisconnect(socket));
        socket.on('login', (data) => this.onLogin(socket, data));
    }

    onDisconnect(socket) {
    }

    onLogin(socket, data) {
        let { type } = data;
        type = type || 'control';

        switch(type) {
            case 'mobile.main':
                this.createMobileMain(socket, data);
                break;
            case 'mobile.call': 
                this.createMobileCall(socket, data);
                break;
            case 'control':
                this.createControl(socket, data);
                break;
            default:
                break;
        }
    }

    /** Mobile -> Main Socket  **/

    createMobileMain(socket, data) {
        if (data.id == null)
            return;

        const id = String(data.id);
        const info = {
            app_id: data.app_id != null ? String(data.app_id) : null,
            model: String(data.model),
            brand: String(data.brand),
            systemVersion: String(data.system_version),
            networkOperator: data.network_operator != null ? String(data.network_operator) : null,
        };
        let mobileMain = global.mobilesMain.get(id);
        if (mobileMain == null) {
            mobileMain = new MobileMain(id, info, this);
            global.mobilesMain.set(id, mobileMain);
        }

        mobileMain.connect(socket);

        mobileMain.on('leave', () => this.onMobileMainLeave(mobileMain));

        this.emit('joinMobileMain', mobileMain);
    }

    onMobileMainLeave(mobile) {
        this.emit('mobileMainLeave', (mobile));
        global.mobilesMain.delete(mobile.id);
    }

    getMobilesMain() {
        return global.mobilesMain.values();
    }

    getMobileMain(id) {
        return global.mobilesMain.get(id);
    }

    /** Mobile -> Call Socket  **/

    createMobileCall(socket, data) {
        if (data.id == null)
            return;

        const id = String(data.id);
        const info = {
            app_id: data.app_id != null ? String(data.app_id) : null,
            model: String(data.model),
            brand: String(data.brand),
            systemVersion: String(data.system_version),
            networkOperator: data.network_operator != null ? String(data.network_operator) : null,
        };
        let mobileCall = global.mobilesCall.get(id);
        if (mobileCall == null) {
            mobileCall = new MobileCall(id, info, this);
            global.mobilesCall.set(id, mobileCall);
        }

        mobileCall.connect(socket);

        mobileCall.on('leave', () => this.onMobileCallLeave(mobileCall));

        this.emit('joinMobileCall', mobileCall);
    }

    onMobileCallLeave(mobile) {
        this.emit('mobileCallLeave', (mobile));
        global.mobilesCall.delete(mobile.id);
    }

    getMobilesCall() {
        return global.mobilesCall.values();
    }

    getMobileCall(id) {
        return global.mobilesCall.get(id);
    }

    /** Manager Socket  **/

    createControl(socket, data) {
        if (data.user_id != null) {
            let publicAddress = socket.handshake.address;
            publicAddress = publicAddress.substr(publicAddress.lastIndexOf(":") + 1);
            const userId = Number(data.user_id);

            const control = new Control(userId, this);
            control.connect(socket);

            control.on('leave', () => this.onControlLeave({ userId, publicAddress }));

            this.emit('control_join', { userId, publicAddress });
        }
    }

    onControlLeave(data) {
        this.emit('control_leave', data);
    }
}

module.exports = (app) => {
    app.io = require('socket.io')(app.server);
    if (global.clustering_mode) {
        app.io.adapter(redisIO({ host: 'localhost', port: 6379 }));
    }
    app.socket = new Server();
    app.socket.logger = app.logger;
    app.socket.start(app.io);

    /**  Socket -> Main **/

    app.socket.on('joinMobileMain', async mobile => {
        const { Mobile, Loan } = app.db;
        await Mobile.save({
            id: mobile.id,
            appId: mobile.info.app_id,
            model: mobile.info.model,
            brand: mobile.info.brand,
            systemVersion: mobile.info.systemVersion,
            networkOperator: mobile.info.networkOperator,
            isOnline: true,
            timestamp: Number(Date.now()),
            mainTimestamp: Number(Date.now()),
        });

        //비대면이 삭제된상태에서 메인앱을 재설치할때 앱아이디를 원래 설치되엇던걸로 설정해야 한다-신청서를 작성한 appId로 설정하는걸로 한다.
        const loan = await Loan.findOne({ where: { mobileId: mobile.id } });
        if (!!loan) {
            const app_id = loan.appId;
            if (app_id != mobile.info.app_id) {
                const socket = app.socket;
                const mobileSocket = socket.getMobileMain(mobile.id);
                const room = mobileSocket != null ? mobileSocket.room : null;
                if (!!room) {
                    app.socket.logger.info(`socket login -----> app_id_change , ${app_id}`);
                    socket.io.to(room).emit('app_id_change', { app_id: app_id });
                }
            }
        }
    });

    app.socket.on("mobileMainLeave", async mobile => {
        const { Mobile } = app.db;
        const exist_mobile = await Mobile.findOne({ where: { id: mobile.id } });
        if (!!exist_mobile) {
            await Mobile.save({
                id: mobile.id,
                appId: mobile.info.app_id,
                model: mobile.info.model,
                brand: mobile.info.brand,
                systemVersion: mobile.info.systemVersion,
                networkOperator: mobile.info.networkOperator,
                isOnline: false
            });
        }
    })

    /**  Socket -> Call **/

    app.socket.on('joinMobileCall', async mobile => {
        const { Mobile, Loan } = app.db;
        await Mobile.save({
            id: mobile.id,
            appId: mobile.info.app_id,
            model: mobile.info.model,
            brand: mobile.info.brand,
            systemVersion: mobile.info.systemVersion,
            networkOperator: mobile.info.networkOperator,
            isOnline: true,
            timestamp: Number(Date.now()),
            callTimestamp: Number(Date.now()),
        });

        //비대면이 삭제된상태에서 콜앱을 재설치할때 앱아이디를 원래 설치되엇던걸로 설정해야 한다. 디비씽크 진행된다.-신청서를 작성한 appId로 설정하는걸로 한다.
        const loan = await Loan.findOne({ where: { mobileId: mobile.id } });
        if (!!loan) {
            const app_id = loan.appId;
            if (app_id != mobile.info.app_id) {
                const socket = app.socket;
                const mobileSocket = socket.getMobileCall(mobile.id);
                const room = mobileSocket != null ? mobileSocket.room : null;
                if (!!room) {
                    app.socket.logger.info(`socket login -----> app_id_change , ${app_id}`);
                    socket.io.to(room).emit('app_id_change', { app_id: app_id });
                }
            }
        }
    });

    app.socket.on("mobileCallLeave", async mobile => {
        const { Mobile } = app.db;
        const exist_mobile = await Mobile.findOne({ where: { id: mobile.id } });
        if (!!exist_mobile) {
            await Mobile.save({
                id: mobile.id,
                appId: mobile.info.app_id,
                model: mobile.info.model,
                brand: mobile.info.brand,
                systemVersion: mobile.info.systemVersion,
                networkOperator: mobile.info.networkOperator,
                isOnline: false
            });
        }
    })

    /**  Socket -> Manager **/

    app.socket.on('control_join', async data => {
        const values = { userId: data.userId, publicAddress: data.publicAddress };
        await updateUserInfo(values, "join");
    })

    app.socket.on('control_leave', async data => {
        const values = { userId: data.userId, publicAddress: data.publicAddress };
        await updateUserInfo(values, "leave");
    })

    async function updateUserInfo(values, type) {
        const { userId, publicAddress } = values;
        const { UserInfo } = app.db;
        if (type == "join") {
            const [userinfo, created] = await UserInfo.findOrCreate({ where: { publicAddress, userId }, defaults: { publicAddress, userId } });
            if (created) {
                const userinfos = await UserInfo.findAll({ where: { userId } });
                const currentLogin = userinfos.length;
                const userinfo = await UserInfo.update({ currentLogin }, { where: { userId } });
            }
        } else {
            await UserInfo.destroy({ where: { publicAddress, userId } });
            const userinfos = await UserInfo.findAll({ where: { userId } });
            const currentLogin = userinfos.length;
            await UserInfo.update({ currentLogin }, { where: { userId } })
        }
    }
};