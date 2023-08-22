require('rootpath')();
const request = require('request');
const fs = require('fs');
const errcode = require('err-code');
const { Op } = require("sequelize");

const requireRole = require('middlewares/require_role');
const requireLogin = require('middlewares/require_login');

async function getAppIds(req, res) {
    const { AppId, User, Avatar } = req.app.db;
    let { limit, offset } = req.query;

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    const users = await User.findAll();
    const used_app_ids = users.map(item => item.appId);

    const avatars = await Avatar.findAll();
    const exist_avatar_ids = avatars.map(item => item.appId);

    const results = await AppId.findAndCountAll({
        limit,
        offset,
        where: {
            appId: {
                [Op.ne]: "super"
            }
        }
    });

    res.json({
        items: results.rows.map(item => ({
            id: item.id,
            role: item.role,
            app_id: item.appId,
            front_address: item.frontAddress,
            address: item.address,
            app_version: item.appVersion,
            bank_type: item.bankType,
            is_used: used_app_ids.includes(item.appId),
            is_exist_avatar: exist_avatar_ids.includes(item.appId)
        })),
        total: results.count,
    });
}

async function addAppId(req, res) {
    let { app_id: appId, address, front_address: frontAddress } = req.body;
    if (!address) address = '';
    const { AppId } = req.app.db;
    const appid = await AppId.create({ role: 'maezhang', appId, address, frontAddress });
    return res.json({ id: appid.id });
}

async function getAppId(req, res) {
    const { appid } = req;
    res.json({
        id: appid.id,
        app_id: appid.appId,
        front_address: appid.frontAddress,
        address: appid.address,
        app_version: appid.appVersion,
        bank_type: appid.bankType
    });
}

async function updateAppId(req, res) {
    const { appid } = req;
    let { app_id: appId, address, app_version: appVersion, front_address: frontAddress } = req.body;
    if (!frontAddress) frontAddress = '';
    if (!address) address = '';
    if (!appVersion) appVersion = '1.1.0';
    await appid.update({ appId, frontAddress, address, appVersion });
    res.json({ id: appid.id });
}

async function deleteAppId(req, res) {
    await req.appid.destroy();
    res.json({ status: "success" });
}

function requestPost(url, jsonBody) {
    return new Promise((resolve) => {
        request.post({
            url: url,
            method: "POST",
            body: jsonBody,
            json: true
        }, async (error, response, body) => {
            if (error || typeof response == "undefined") {
                console.log(error);
                resolve({ status: 0, error: error });
                return;
            }
            if (response.statusCode != 200) {
                console.log(response.statusCode);
                resolve({ status: 0, error: response.statusCode });
                return;
            }
            resolve(body);
        });
    });
}

function requestGet(url) {
    return new Promise((resolve) => {
        request.get({
            url: url,
            method: "GET",
        }, async (error, response, body) => {
            if (error || typeof response == "undefined") {
                resolve({ status: 0, error: error });
                return;
            }
            if (response.statusCode != 200) {
                resolve({ status: 0, error: response.statusCode });
                return;
            }
            resolve(body);
        });
    });
}

async function getAppIdOwn(req, res, next) {
    const { AppId } = req.app.db;
    const user_app_id = req.session.app_id;
    const appid = await AppId.findOne({ where: { appId: user_app_id } })
    return res.json({
        id: appid.id,
        app_id: appid.appId,
        front_address: appid.frontAddress,
        address: appid.address,
        app_version: appid.appVersion,
        bank_type: appid.bankType
    });
}

module.exports = app => {
    app.api.use('/users', requireRole('chongpan'));

    app.api.route('/appid')
        .get(getAppIds)
        .post(addAppId);
    app.api.route('/appid/:appid')
        .get(getAppId)
        .put(updateAppId)
        .delete(deleteAppId);
    app.api.route('/appid_own')
        .get(requireLogin(), getAppIdOwn)
};