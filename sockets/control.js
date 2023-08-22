const { EventEmitter } = require('events');

class Control extends EventEmitter {
    constructor(userId, server) {
        super();
        this.userId = userId
        this.server = server;
    }

    connect(socket) {
        this.socket = socket;

        socket.join('controls');

        socket.on('disconnect', () => this._onDisconnect());
    }

    _onDisconnect() {
        this.emit('leave', this.userId);
    }
}

module.exports = {
    Control,
};