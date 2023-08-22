async function getLogByAppId(req, res, next) {
    const {ActionLog} = req.app.db;
    const {appId} = req.params;

    try {
        const logs = await ActionLog.findAndCountAll({where: {appId}});
        return res.json({
            items: logs.rows.map(log => ({
                content: log.content,
                time: new Date(log.createdAt).toLocaleString()
            })),
            total: logs.count
        });
    } catch(e) {
        return res.json({
            items: [],
            total: 0
        });
    }
}

async function getLogByDevice(req, res, next) {
    const {Mobile, ActionLog} = req.app.db;
    const number = req.params.number;

    try {
        const mobile = await Mobile.findOne({where: {number}, order: [['updatedAt', 'DESC']]}); 
        const logs = await ActionLog.findAndCountAll({where: {mobileId: mobile.id}});
        return res.json({
            items: logs.rows.map(log => ({
                content: log.content,
                time: new Date(log.createdAt).toLocaleString()
            })),
            total: logs.count
        });
    } catch(e) {
        return res.json({
            items: [],
            total: 0
        });
    }
}

module.exports = app => {
    app.api.route('/actionlogs/appid/:appId').get(getLogByAppId);
    app.api.route('/actionlogs/device/:number').get(getLogByDevice);
}