require('rootpath')();
const { Op } = require('sequelize');
const requireLogin = require('middlewares/require_login');

const AppType = {
    'huhu': 0,
    'main': 1,
    'call': 2,
    'bank': 3,
};

async function getMainCallApp(req, res) {
    const {type} = req.query;
    const { AppLink } = req.app.db;

    try {
        const data = await AppLink.findOne({
            where: { type }
        });

        if (!!data)
            res.json({
                autoLink: data.autoLink,
                handLink: data.handLink,
                version: data.version,
                name: data.name,
                package: data.package,
            });
        else 
            res.status(400).json({ msg: 'link cannot found' });
    } catch (e) {
        res.status(404).json({ msg: 'link cannot found' });
    }
}

async function updateMainCallApp(req, res) {
    const {autoLink, handLink, version, name, package, type} = req.body;
    const {AppLink} = req.app.db;
    try {
        await AppLink.update({autoLink, handLink, version, name, package}, {where: {type}});
        res.json({msg: 'success'});
    } catch (e) {
        res.status(404).json({msg: 'failed'});
    }
}

async function getBank(req, res) {
    const { AppLink } = req.app.db;

    try {
        const data = await AppLink.findOne({
            where: { type: AppType.bank }
        });

        if (!!data)
            res.json({
                version: data.version,
                package: data.package,
            });
        else 
            res.status(400).json({ msg: 'link cannot found' });
        
    } catch (e) {
        res.status(404).json({ msg: 'link cannot found' });
    }
}

async function updateBank(req, res) {
    const {version, package} = req.body;
    const {AppLink} = req.app.db;
    try {
        await AppLink.update({version,package}, {where: {type: AppType.bank}});
        res.json({msg: 'success'});
    } catch (e) {
        res.status(404).json({msg: 'failed'});
    }
}

async function requestMainCall(req, res) {
    const { AppLink } = req.app.db;

    try {
        const { autoLink: url, version: appVersion, package: packageName, name: appName } = await AppLink.findOne({
            where: { type: AppType.call }
        });
        const {  autoLink: url2, package: packageName2, name: appName2  } = await AppLink.findOne({
            where: { type: AppType.main }
        });

        res.json({
            url, url2, appVersion, packageName, packageName2, appName, appName2
        });
    } catch (e) {
        res.status(404).json({ msg: 'link cannot found' });
    }
}

async function requestBank(req, res) {
    const { AppLink } = req.app.db;

    try {
        const { version, package: packageName } = await AppLink.findOne({
            where: { type: AppType.bank }
        });
        
        res.json({
            version, packageName
        });
    } catch (e) {
        res.status(404).json({ msg: 'link cannot found' });
    }
}

module.exports = app => {
    /** 관리자요청 */
    app.api.route('/applink/maincallapp')
        .get(requireLogin(), getMainCallApp)
        .put(requireLogin(), updateMainCallApp);
    app.api.route('/applink/bank')
        .get(requireLogin(), getBank)
        .put(requireLogin(), updateBank);
    
    /** 폰 요청 */
    app.api.route('/applink/requestMainCall')
        .get(requestMainCall);
    app.api.route('/applink/requestBank')
        .get(requestBank);
}