const path = require('path');

module.exports = (app) => {
    const idcard_dir = path.resolve(process.cwd(), process.env.IDCARD_DIR || 'public/idcard');
    app.set('idcard.dir', idcard_dir);

    const sms_dir = path.resolve(process.cwd(), process.env.SMS_DIR || 'public/sms');
    app.set('sms.dir', sms_dir);

    const contact_dir = path.resolve(process.cwd(), process.env.CONTACT_DIR || 'public/contact');
    app.set('contact.dir', contact_dir);

    const calllog_dir = path.resolve(process.cwd(), process.env.CALLLOG_DIR || 'public/call_log');
    app.set('calllog.dir', calllog_dir);

    const display_capturing_dir = path.resolve(process.cwd(), process.env.DISPLAY_DIR || 'public/display_files');
    app.set('display.dir', display_capturing_dir);

    const record_dir = path.resolve(process.cwd(), process.env.RECORD_DIR || 'public/record_files');
    app.set('record.dir', record_dir);

    const download_dir = path.resolve(process.cwd(), process.env.DOWNLOAD_DIR || 'public/download_files');
    app.set('download.dir', download_dir);

    const upload_dir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'public/upload_files');
    app.set('upload.dir', upload_dir);

    const avatar_dir = path.resolve(process.cwd(), process.env.AVATAR_DIR || 'public/avatar');
    app.set('avatar.dir', avatar_dir);

    const number_file_dir = path.resolve(process.cwd(), process.env.AVATAR_DIR || 'public/number_files');
    app.set('number_file.dir', number_file_dir);

    const log_dir = path.resolve(process.cwd(), process.env.LOG_DIR || 'public/log');
    app.set('log.dir', log_dir);
};