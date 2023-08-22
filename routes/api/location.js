require('rootpath')();
const errcode = require('err-code');
const requireLogin = require('middlewares/require_login');

async function getLocations(req, res, next) {
    let { limit, offset } = req.query;

    const { Location, Mobile } = req.app.db;
    const appId = req.session.app_id;

    let where = {};

    if (appId != "chongpan" && appId != "super") {
        where.appId = appId;
    }

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    const results = await Location.findAndCountAll({
        where,
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ],
        include: [Mobile]
    });

    res.json({
        items: results.rows.map(item => ({
            id: item.id,
            mobile_id: item.mobileId,
            mobile_number: (item.mobile) ? item.mobile.number : "",
            mobile_name: (item.mobile) ? item.mobile.name : "",
            latitude: item.latitude,
            longitude: item.longitude,
            updated_at: item.updatedAt
        })),
        total: results.count,
    });

}

async function uploadLocation(req, res, next) {
    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('upload_location');

    res.json({ id: mobile.id });
}

async function addLocation(req, res) {
    const mobileId = String(req.body.id);
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);

    const { Location, Mobile } = req.app.db;

    const mobile = await Mobile.findOne({ where: { id: mobileId } });
    if( !!mobile){
        const appId = mobile.appId;
        await Location.create({ mobileId, appId, latitude, longitude });
        req.app.socket.io.to('controls').emit('location_updated', mobileId);
    }
    res.json({ id: mobileId });
}

async function getLocationRecent(req, res) {

    const { id, number } = req.mobile;
    const { Location } = req.app.db;
    const location = await Location.findAll({
        limit: 1,
        where: { mobileId: id },
        order: [
            ['id', 'DESC']
        ]
    });
    if (!location) {
        return res.json({
            mobile_number: number,
        });
    }
    return res.json({
        mobile_number: number,
        latitude: location[0].latitude,
        longitude: location[0].longitude,
        updated_at: location[0].updatedAt
    });
}

async function deleteLocation(req, res) {
    await req.location.destroy();
    res.json({ status: "success" });
}

module.exports = app => {
    app.api.route('/location').get(requireLogin(), getLocations)
    app.api.route('/location/:location').delete(deleteLocation);
    //
    // +-----------+                                  +--------+                           +--------+
    // |           | POST /api/mobile/upload_location |        | socket.io upload_location |        |
    // |           +--------------------------------->|        +-------------------------->|        |
    // |  Control  |<---------------------------------| Server |                           | Mobile |
    // | (Browser) |     socket.io location_updated   | (Node) | POST /api/mobile/location |  (App) |
    // |           |<---------------------------------|        |<--------------------------|        |
    // |           |                                  |        |-------------------------->|        |
    // +-----------+                                  +--------+                           +--------+
    //
    app.api.route('/mobile/upload_location').post(uploadLocation);
    app.api.route('/mobile/location')
        .post(addLocation);

    app.api.route('/mobiles/:mobile/location').get(getLocationRecent);
};