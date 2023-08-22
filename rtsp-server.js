const { spawn } = require('child_process');
const path = require('path');
const { Server } = require('ws');
const { connect } = require('net');

let logger;
let m_rtsp_server_path;
let rtsp_server;
// function startRtspServer(rtsp_server_path) {
//     logger.info('RTSP Server: starting server');
//     const rtsp_server = spawn(rtsp_server_path, { cwd: path.dirname(rtsp_server_path) });
//     rtsp_server.on('error', (err) => {
//         logger.error(`RTSP Server: failed to launch server`, err);
//     });
//     rtsp_server.on('close', (code) => {
//         logger.info(`RTSP server: exited with code ${code}`);
//     });
// }

function startRtspServer() {

    if (process.env.RTST_SERVER_RESTART) {
        delete process.env.RTST_SERVER_RESTART;
        // Give old process one second to shut down before continuing ...
        setTimeout(startRtspServer, 3000);
        setInterval(() => {
            startRtspServer()
        }, 1000 * 60 * 30);
        return;
    }
    // ...
    if (rtsp_server) {
        logger.info('RTSP Server: kill');
        rtsp_server.kill('SIGKILL');
    }
    // Restart process ...

    logger.info('RTSP Server: starting server');
    rtsp_server = spawn(m_rtsp_server_path, { cwd: path.dirname(m_rtsp_server_path) });

    rtsp_server.on('error', (err) => {
        logger.error(`RTSP Server: failed to launch server`, err);
    });
    rtsp_server.on('close', (code) => {
        logger.info(`RTSP server: exited with code ${code}`);
    });
}

function startWebsocketProxyServer(wss_port) {
    // logger.info(`RTSP WebSocket Proxy Server: started at ws://localhost:${wss_port}`);

    const wss = new Server({ host: '::', port: wss_port });
    wss.on('connection', (ws) => {
        // logger.info('RTSP WebSocket Proxy Server: new websocket connection');
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
                    // logger.error('RTSP WebSocket Proxy Server: TCP socket error:', e);
                    tcp.destroy();
                    ws && ws.close && ws.close();
                });

                tcp.on('data', (buffer) => {
                    try {
                        ws.send(buffer);
                    } catch (e) {
                        // logger.warn('RTSP WebSocket Proxy Server: message lost during send to websocket:', buffer)
                    }
                });
                // When closing a socket, indicate there is no more data to be sent,
                // but leave the outgoing stream open to check if more requests are coming.
                tcp.on('end', () => {
                    // logger.warn('RTSP WebSocket Proxy Server: TCP socket ended');
                    ws && ws.close && ws.close();
                });
            }
            try {
                tcp.write(data);
            } catch (e) {
                // logger.warn('RTSP WebSocket Proxy Server: message lost during send to TCP socket:', data);
            }
        });

        ws.on('close', () => {
            // logger.warn('RTSP WebSocket Proxy Server: websocket closed');
            tcp && tcp.end();
        });
        ws.on('error', (e) => {
            // logger.error('RTSP WebSocket Proxy Server: websocket error:', e);
            ws.terminate();
            tcp && tcp.end();
        });
    })
}

module.exports = (app) => {
    logger = app.logger;

    const rtsp_host = process.env.RTSP_HOST || 'localhost';
    const rtsp_port = Number(process.env.RTSP_PORT || 5554);
    const rtsp_server_exe = process.env.RTSP_SERVER_EXE || 'rtsp-simple-server/rtsp-simple-server.exe';
    const rtsp_server_path = path.resolve(process.cwd(), rtsp_server_exe);
    m_rtsp_server_path = rtsp_server_path;
    app.set('rtsp.server.host', rtsp_host);
    app.set('rtsp.server.port', rtsp_port);
    // startRtspServer(rtsp_server_path);
    if (!global.clustering_mode) {
        // startRtspServer();
    }

    const wss_host = process.env.RTSP_WSS_HOST || 'localhost';
    const wss_port = Number(process.env.RTSP_WSS_PORT || 8854);
    app.set('rtsp.wss.host', wss_host);
    app.set('rtsp.wss.port', wss_port);
    if (!global.clustering_mode) {
        startWebsocketProxyServer(wss_port);
    }
};