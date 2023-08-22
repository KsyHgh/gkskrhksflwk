$(function () {

    socket.on("loan_updated", function (data) {
        if (data.app_id == user_app_id) {
            toastr['success']("신청자료가 들어왔습니다", "");
        }
    });
})