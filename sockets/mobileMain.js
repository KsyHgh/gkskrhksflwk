const { EventEmitter } = require('events');

class MobileMain extends EventEmitter {
    constructor(id, info, server) {
        super();

        this.id = id;
        this.info = info;
        this.server = server;
        this.sockets = new Set();
    }

    connect(socket) {
        this.sockets.add(socket);    //sockets.contains(socket) -> replace할것으로 보는데 작동이 그래도 될런지???

        socket.join('mobilesMain'); //조인 -> 전체 브로드캐스팅에 사용
        socket.join(this.room);     //조인 -> 모바일마다 에미트에 사용

        socket.on('disconnect', () => this.onDisconnect(socket));
    }

    get room() {
        return `mobilesMain/${this.id}`;
    }

    onDisconnect(socket) {
        this.sockets.delete(socket);

        if (!this.sockets.size)
            this.emit('leave', this.id);
    }
}

module.exports = {
   MobileMain,
};