const schedule = require("node-schedule");
const moment = require("moment");
const crypto = require("crypto");
const auth_time = process.env.AUTH_TIME || 5;

async function updateAuthCode() {
    const { User } = global.app.db;
    const users = await User.findAll();
    const cur_time = moment();
    for (var i = 0; i < users.length; i++) {
        const user = users[i]
        const endTime = moment(user.updatedAt).add(auth_time, "minute");
        if (cur_time.valueOf() > endTime.valueOf()) {
            let hash_sha = crypto.createHash("sha256");
            hash_sha.update(cur_time.format("YYYY-MM-DD HH:mm") + user.authcode);
            const remember_token = hash_sha.digest("hex").substring(0, 8);
            user.update({ authcode: remember_token });
        }
    }
}

module.exports = () => {
    try {
        schedule.scheduleJob("* */1 * * * *", updateAuthCode);
    } catch (error) {
        app.logger.error(`[Schedule]: ${error.message}`);
    }
};
