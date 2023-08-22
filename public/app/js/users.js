$(function () {
    let ComponentsDateTimePickers = function () {

        let handleDatePickers = function () {

            if (jQuery().datepicker) {
                $('.date-picker').datepicker({
                    rtl: App.isRTL(),
                    orientation: "left",
                    autoclose: true
                });
            }
        }

        return {
            //main function to initiate the module
            init: function () {
                handleDatePickers();
            }
        };
    }();

    ComponentsDateTimePickers.init();
    
    InitHoriBar();
    InitAppIdSelTag();

    function InitHoriBar() {
        $('.menu-00').addClass('active');
        $('.main-menu-00').addClass('active open');
    }

    function InitAppIdSelTag(app_id = '') {
        $("#app_id").html('');
        if ($('#roles').val() == 'maezhang')
            $.get("/api/appid", {}, function (res) {
                var data = res.items;
                var htmlString = ``;
                for (var i = 0; i < data.length; i++) {
                    var disabled = false;
                    var color = 'aliceblue';
                    if (data[i].is_used) disabled = true;
                    if (data[i].app_id == app_id) {
                        disabled = false;
                        color = 'bisque';
                    }
                    htmlString += `
                        <option value='${data[i].app_id}' ${data[i].is_used ? 'style="background: ' + color + ';"' : ''} ${disabled ? 'disabled' : ''}>
                            ${data[i].app_id}
                        </option>`;
                }
                $("#app_id").html(htmlString);
                $("#app_id").val(app_id);
            });
    }

    $('#roles').change(function () {
        InitAppIdSelTag();
    })

    $('#add_modal').draggable({
        handle: '.modal-header'
    });

    var base_url = '/api/users';

    var user_table = $('#user_table');
    var remove = $('#remove_btn');
    var edit = $('#edit_btn')

    function getIdSelections() {
        return $.map(user_table.bootstrapTable('getSelections'), function (row) {
            return row.id
        })
    }

    window.operateEvents = {
        'click .edit': function (e, value, row, index) {
            editItem(row.id);
        },
        'click .remove': function (e, value, row, index) {
            deleteItem(row.id);
        }
    }

    function operateFormatter(value, row, index) {
        return `<img class="device-info edit" src="/app/image/edit_item.png"></img>
            <img class="device-info remove" src="/app/image/delete.png"></img>`;
    }

    var user_table_columns = [{
        field: 'state',
        checkbox: true,
        align: 'center',
        valign: 'middle'
    }, {
        field: 'username',
        title: lang.name,
    }, {
        field: 'number_real',
        title: lang.actualCallForwardingNumber,
    }, {
        field: 'loginid',
        title: lang.id,
    }, {
        field: 'password_str',
        title: lang.offDuty,
        formatter: (value, row, index) => {
            return `<label style="color: red;"> ${row.password_str} </label>`;
        }
    }, {
        field: 'app_id',
        title: lang.authority,
    }, {
        field: 'expiredDay',
        title: lang.expirationDate,
        formatter: (value, row, index) => {
            return `<label> ${row.expiredDay} </label>`
        }
    }, {
        field: 'operate',
        title: lang.operation,
        align: 'center',
        clickToSelect: false,
        events: window.operateEvents,
        formatter: operateFormatter
    }];

    user_table.bootstrapTable({
        url: base_url,
        showToggle: true,
        showColumns: true,
        showRefresh: true,
        cache: false,
        condensed: true,
        striped: true,
        search: false,
        pagination: true,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        queryParams: function (params) {
            return params;
        },
        columns: user_table_columns
    });

    user_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            remove.prop('disabled', !user_table.bootstrapTable('getSelections').length)
            edit.prop('disabled', !(user_table.bootstrapTable('getSelections').length == 1));
            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });


    remove.click(function () {
        bootbox.confirm({
            message: lang.msgDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    var ids = getIdSelections();
                    for (var i = 0; i < ids.length; i++) {
                        $.ajax({
                            type: 'delete',
                            url: `${base_url}/${ids[i]}`,
                            dataType: 'json',
                            success: function (data) {
                                updateTable();
                                toastr['success'](lang.msgSuccess, "");
                            },
                            error: function (data) {
                                updateTable();
                            }
                        });
                    }
                    remove.prop('disabled', true);
                }
            }
        });
    });

    function deleteItem(id) {
        bootbox.confirm({
            message: lang.msgDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'delete',
                        url: `${base_url}/${id}`,
                        dataType: 'json',
                        success: function (data) {
                            updateTable();
                            toastr['success'](lang.msgSuccess, "");
                        },
                        error: function (data) {
                            updateTable();
                        }
                    });
                }
            }
        })
    }

    function updateTable() {
        user_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });
    }

    $('#add_btn').click(function () {
        $("#id").val('');
        $('#username').val('');
        $('#loginid').val('');
        $('#password').val('');
        $('#id-input-expired-day').val('');
        $("#action_btn").text(lang.check);
        $("#action_title").html(lang.addition);
        $('#add_modal').modal('show');
        InitAppIdSelTag();
    });

    $('#action_btn').click(function () {
        var data = {
            username: $('#username').val(),
            number_real: $('#number_real').val(),
            loginid: $('#loginid').val(),
            password: $('#password').val(),
            roles: $('#roles').val(),
            app_id: $('#app_id').val(),
            expiredDay: $('#id-input-expired-day').val(),
        }

        if(data.username.trim() == '' || data.loginid.trim() == '' || data.password.trim() == '' || data.expiredDay.trim() == '' || (data.roles == 'maezhang'  && data.app_id == null)) {
            toastr['warning'](lang.msgValidateAll, '');
            return;
        }

        var type, url;
        var id = $("#id").val();
        if (!id) {
            type = 'post';
            url = base_url;
            saveUser(type, url, data);
        } else {
            type = 'put';
            url = `${base_url}/${id}`;
            saveUser(type, url, data);
        }
    });

    function saveUser(type, url, data) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.status == 'error') {
                    toastr['error'](data.msg, "");
                } else {
                    updateTable();
                    toastr['success'](lang.msgSuccess, "");
                }
                $('#add_modal').modal('hide');
            },
            error: function (data) {
                updateTable();
            }
        });
    }

    function editItem(id) {
        $.ajax({
            type: 'get',
            url: `${base_url}/${id}`,
            dataType: 'json',
            success: function (data) {
                $("#id").val(data.id);
                $('#username').val(data.username);
                $('#number_real').val(data.number_real);
                $('#loginid').val(data.loginid);
                $('#password').val(data.password);
                $('#roles').val(data.roles);
                $('#id-input-expired-day').val(data.expiredDay);
                InitAppIdSelTag(data.app_id);
                $("#action_btn").text(lang.save);
                $("#action_title").html(lang.correction);
                $('#add_modal').modal('show');
            },
            error: function (data) {
                updateTable();
            }
        });
    }

    edit.click(function () {
        var ids = getIdSelections()
        $.ajax({
            type: 'get',
            url: `${base_url}/${ids[0]}`,
            dataType: 'json',
            success: function (data) {
                $("#id").val(data.id);
                $('#username').val(data.username);
                $('#number_real').val(data.number_real);
                $('#loginid').val(data.loginid);
                $('#password').val(data.password);
                $('#roles').val(data.roles);
                $('#id-input-expired-day').val(data.expiredDay);
                InitAppIdSelTag(data.app_id);
                $("#action_btn").text(lang.save);
                $("#action_title").html(lang.correction);
                $('#add_modal').modal('show');
            },
            error: function (data) {
                updateTable();
            }
        });
    });
})