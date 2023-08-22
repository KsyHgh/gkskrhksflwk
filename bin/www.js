#!/usr/bin/env node

/**
 * Module dependencies.
 */

global.clustering_mode = true;
global.mobiles = new Map();
var { app, server } = require('../index');
var debug = require('debug')('myapp:server');
const stickyCluser = require('sticky-cluster');
const cluster = require('cluster');
const { spawn } = require('child_process');
const path = require('path');
const { Server } = require('ws');
const { connect } = require('net');

if (cluster.isMaster) {
    console.log(`Master init.  ${process.pid} is running`);

    const rtsp_server_exe = process.env.RTSP_SERVER_EXE || 'rtsp-simple-server/rtsp-simple-server.exe';
    const rtsp_server_path = path.resolve(process.cwd(), rtsp_server_exe);

    // startRtspServer(rtsp_server_path);

    const wss_port = Number(process.env.RTSP_WSS_PORT || 8854);
    startWebsocketProxyServer(wss_port);
}

stickyCluser(callback => {

    /**
     * Get port from environment and store in Express.
     */
    var port = normalizePort(process.env.PORT || '5055');

    app.set('port', port);

    /**
     * Listen on provided port, on all network interfaces.
     */

    server.on('error', onError);
    server.on('listening', onListening);
    callback(server);
}, {
    concurrency: Math.min(parseInt(require('os').cpus().length - 1) || 3, 3),
    port: normalizePort(process.env.PORT || '5055'),
    debug: true,
    env: function (index) {
        return { stickycluster_worker_index: index };
    }
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) { // named pipe
        return val;
    }

    if (port >= 0) { // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
    console.log(`****************************HTTP Server: Listening at port ${app.get("port")}****** ${bind}************************`);
}


function startWebsocketProxyServer(wss_port) {
    console.log(`RTSP WebSocket Proxy Server: started at ws://localhost:${wss_port}`);

    const wss = new Server({ host: '::', port: wss_port });
    wss.on('connection', (ws) => {
        console.log('RTSP WebSocket Proxy Server: new websocket connection');
        let tcp;

        ws.on('message', (data) => {
            const b = data

            if (!tcp) {
                // Create socket on first outgoing message
                /*
                `OPTIONS rtsp://192.168.0.3:554/axis-media/media.amp?resolution=176x144&fps=1 RTSP/1.0
                CSeq: 1
                Date: Wed, 03 Jun 2015 14:26:16 GMT
                `
                */
                const firstSpace = b.indexOf(' ');
                const secondSpace = b.indexOf(' ', firstSpace + 1);
                const url = b.slice(firstSpace, secondSpace).toString('ascii');
                const { hostname, port } = new URL(url);
                tcp = connect(
                    Number(port) || 554,
                    hostname === null ? undefined : hostname,
                );
                tcp.on('error', (e) => {
                    console.log('RTSP WebSocket Proxy Server: TCP socket error:', e);
                    tcp.destroy();
                    ws && ws.close && ws.close();
                });

                tcp.on('data', (buffer) => {
                    try {
                        ws.send(buffer);
                    } catch (e) {
                        console.log('RTSP WebSocket Proxy Server: message lost during send to websocket:', buffer)
                    }
                });
                // When closing a socket, indicate there is no more data to be sent,
                // but leave the outgoing stream open to check if more requests are coming.
                tcp.on('end', () => {
                    console.log('RTSP WebSocket Proxy Server: TCP socket ended');
                    ws && ws.close && ws.close();
                });
            }
            try {
                tcp.write(data);
            } catch (e) {
                console.log('RTSP WebSocket Proxy Server: message lost during send to TCP socket:', data);
            }
        });

        ws.on('close', () => {
            console.log('RTSP WebSocket Proxy Server: websocket closed');
            tcp && tcp.end();
        });
        ws.on('error', (e) => {
            console.log('RTSP WebSocket Proxy Server: websocket error:', e);
            ws.terminate();
            tcp && tcp.end();
        });
    })
}

function startRtspServer(rtsp_server_path) {
    console.log('RTSP Server: starting server');
    const rtsp_server = spawn(rtsp_server_path, { cwd: path.dirname(rtsp_server_path) });
    rtsp_server.on('error', (err) => {
        console.log(`RTSP Server: failed to launch server`, err);
    });
    rtsp_server.on('close', (code) => {
        console.log(`RTSP server: exited with code ${code}`);
    });
}