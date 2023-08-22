const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
var RedisStore = require('connect-redis')(session);
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const i18n = require('./i18n');
global.rootPath = __dirname;


module.exports = () => {
    const app = express()
        .set('views', path.resolve(__dirname, 'views'))
        .set('view engine', 'ejs')
        .setMaxListeners(100);


    if (app.get('env') !== 'production')
        app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms'));

    app.use([
        cors(),
        express.static(path.resolve(__dirname, 'public')),
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
        // session({
        //     secret: process.env.SESSION_SECRET || 'secret',
        //     resave: false,
        //     saveUninitialized: false,
        // }),
    ]);
    if (global.clustering_mode) {
        app.use(
            session({
                store: new RedisStore({
                    port: 6379,
                    host: "localhost",
                    db: 0,
                    pass: ""
                }),
                secret: process.env.SESSION_SECRET || 'secret',
                // proxy: true,
                // cookie: { secure: true },
                // secret: process.env.SESSION_SECRET || 'secret',
                resave: false,
                saveUninitialized: false,
            })
        )
    } else {
        app.use(
            session({
                secret: process.env.SESSION_SECRET || 'secret',
                resave: false,
                saveUninitialized: false,
            }),
        )
    }

    //cookie 사용
    app.use(cookieParser());

    //i18n 초기화
    app.use(i18n);
    
    return app;
};