const crypto = require('crypto');

function decrypt(data) {
    var key = "1114445556633558".substring(0, 16);
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, "");
    var decrypted = decipher.update(data, 'base64', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

module.exports = {
    decrypt
};