$(function() {

    var direction_array = ['incoming', 'outgoing'];
    var TYPE_BLOCK = 0;
    var TYPE_CALL = 1;

    var CALL_STATE_START = 0;
    var CALL_STATE_OFFHOOK = 1;
    var CALL_STATE_END = 2;

    var blacklist_number;
    var real_number;
    var forwarding_number;
    var mobile_id;
    var call_id;

    function timeToHourMin(time) {
        return `${new Date(time).getHours()}:${new Date(time).getMinutes()}`;
    }

    socket.on("call_updated", function() {
        updateCallTable();
    });

    window.statusEvents = {
        'click .forwarding': function(e, value, row, index) {
            showForwarding(row.number, row.mobile_id);
        },
        'click .blacklist': function(e, value, row, index) {
            showBlacklist(row.mobile_id, row.number_real, row.number, row.direction, row.id);
        },
    }

    function statusFormatter(value, row, index) {
        var status = '';
        if (row.type == TYPE_BLOCK) {
            status = 'BLOCK';
        } else if (row.type == TYPE_CALL) {
            if (row.call_state == CALL_STATE_START) {
                status = 'START';
            } else if (row.call_state == CALL_STATE_OFFHOOK) {
                status = 'OFFHOOK';
            } else if (row.call_state == CALL_STATE_END) {
                status = 'END';
            }
        }
        var result = '';
        if (status == 'END') {
            if (row.end_time != 0) {
                result = `[${Math.ceil((row.end_time - row.time) / 1000)}s]`;
            }
        }
        var result = `
                <div class="call-wrapper">
                    <div class="call-line">
                        <div style="position:relative">
                            <!--<img class="call_dialer call_dialer_start" src="/app/image/call_start_normal.png">
                            <img class="call_dialer call_dialer_end" src="/app/image/call_end_normal.png"> -->
                            [${timeToHourMin(row.time)}] ${result} ${row.mobile_number}
                        </div>`;

        if (row.is_special) {
            if (status == 'OFFHOOK') {
                result += `<img class="hang-up blacklist" src="/app/image/hang_up.png">`
            }
        } else {
            if (status == 'OFFHOOK' || status == 'START') {
                result += `<img class="hang-up blacklist" src="/app/image/hang_up.png">`
            }
        }
        result += `</div>
                    <div class="call-line">
                        <div>${row.mobile_name}</div>
                    </div>
                    <div class="call-line">
                        <div> ${row.direction ? "호출번호: ": "보이는 번호:" }  ${row.number}[${row.contact_name}]</div> 
                        <div>`;
        if (row.is_special) {
            if (status == "START") {
                result += `<img class="call-state" src="/app/image/new_call_ars_outgoing.png">`;
            } else if (status == "OFFHOOK") {
                result += `<img class="call-state twinkle" src="/app/image/new_call_ars_outgoing.png">`;
            } else {
                result += `<img class="call-state" src="/app/image/new_call_ars_outgoing.png">`;
            }
        } else {
            if (status == "BLOCK") {
                result += `<img class="call-state" src="/app/image/new_call_black_incoming.png">`;
            } else if (status == "START") {
                if (row.number == row.number_real)
                    result += `<img class="call-state" src="/app/image/new_call_normal_${direction_array[row.direction]}.png">`;
                else
                    result += `<img class="call-state" src="/app/image/new_call_forced_${direction_array[row.direction]}.png">`;
            } else if (status == "OFFHOOK") {
                if (row.number == row.number_real)
                    result += `<img class="call-state twinkle" src="/app/image/new_call_normal_${direction_array[row.direction]}.png">`;
                else
                    result += `<img class="call-state twinkle" src="/app/image/new_call_forced_${direction_array[row.direction]}.png">`;
            } else {
                if (row.number == row.number_real)
                    result += `<img class="call-state" src="/app/image/new_call_normal_${direction_array[row.direction]}.png">`;
                else
                    result += `<img class="call-state" src="/app/image/new_call_forced_${direction_array[row.direction]}.png">`;
            }
        }

        result += `
                        </div>
                    </div>
                    <div class="call-line">
                        <div>${row.direction ? "실제수신번호: ": "들어오는 번호:" } ${(row.number_real != null)? row.number_real : ''}</div>
                        <img class="hang-up forwarding" src="/app/image/forward_phone.png">
                    </div>
                </div>`;
        return result;
    }

    $('#call_table').bootstrapTable({
        url: '/api/calls',
        showRefresh: true,
        height: window.innerHeight,
        cache: false,
        condensed: true,
        striped: true,
        search: true,
        pagination: true,
        cardView: true,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        queryParams: function(params) {
            return params;
        },
        columns: [{
            field: 'status',
            title: '통화상태',
            events: window.statusEvents,
            formatter: statusFormatter
        }]
    });

    function updateCallTable() {
        $('#call_table').bootstrapTable('refresh', { url: '/api/calls', silent: true });
    }

    function showBlacklist(mobileId, number_real, number, direction, callId) {
        if (direction == 0) {
            blacklist_number = number_real;
        } else {
            blacklist_number = number;
        }
        real_number = number_real;

        mobile_id = mobileId;
        call_id = callId;
        $.ajax({
            type: "post",
            url: "/api/mobile/hangup",
            data: { id: call_id },
            dataType: 'json',
            success: function(data) {
                toastr['success']("성공적인 조작", "");
            },
            error: function(data) {
            }
        });
        $('#blacklist_modal').modal("show");
    }

    $('#blacklist_btn').click(function() {
        var data = {
            number: blacklist_number,
            enabled: true,
            mobile_id,
        }
        $.ajax({
            type: "post",
            url: "/api/numbers/blacklist",
            data: data,
            dataType: 'json',
            success: function(data) {
                toastr['success'](callLang.msgSuccess, "");
                $('#blacklist_modal').modal("hide");
            },
            error: function(data) {
            }
        });
    })

    function showForwarding(number, id) {
        forwarding_number = number;
        mobile_id = id;
        $('#forwarding_modal').modal("show");
    }

    $('#forwarding_btn').click(function() {
        var data = {
            name: "",
            number: forwarding_number,
            enabled: true,
        }
        $.ajax({
            type: 'post',
            url: "/api/numbers/outgoing_redirection_list",
            data: data,
            dataType: 'json',
            success: function(data) {
                toastr['success'](callLang.msgSuccess, "");
                $('#forwarding_modal').modal("hide");
            },
            error: function(data) {
            }
        });
    })

})