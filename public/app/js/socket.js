var socket;

$(function () {
    socket = io();
    socket.on("connect", function () {
        socket.emit("login", { type: "control", user_id: loginned_user_id });
    });
});
const encrypt = (text) => {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
};
const decrypt = (data) => {
    return CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
};