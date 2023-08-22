const path = require('path');
const fs = require('fs').promises;

function downloadLogFile(req, res) {
    let { filename } = req.params;
    if (!filename)
        filename = 'debug';

    const dir = req.app.get('logger.dir');
    res.download(path.join(dir, `${filename}.log`));
}

async function listLogFiles(req, res, next) {
    const dir = req.app.get('logger.dir');
    let files;
    try {
        files = await fs.readdir(dir);
    } catch (err) {
        files = [];
    }
    res.json(files);
}

module.exports = app => {
    app.get('/logs/download', downloadLogFile);
    app.get('/logs/download/:filename', downloadLogFile);
    app.get('/logs/list', listLogFiles);
};