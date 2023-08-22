$(function () {
    InitHoriBar();
    InitAppIdSelTag();

    function InitHoriBar() {
        $('.menu-12').addClass('active');
        $('.main-menu-00').addClass('active open');
    }

    function InitAppIdSelTag(app_id = '') {
        $.get("/api/appid", {}, function (res) {
            var data = res.items;
            var htmlString = ``;
            for (var i = 0; i < data.length; i++) {
                htmlString += `
                        <option value='${data[i].app_id}'>
                            ${data[i].app_id}
                        </option>`;
            }
            $("#app_id").html(htmlString);
            $("#app_id").val(app_id);
        })
    }

    $('#add_modal').draggable({
        handle: '.modal-header'
    });

    var base_url = '/api/members';

    var member_table = $('#member_table');
    var remove = $('#remove_btn');
    var edit = $('#edit_btn')

    function getIdSelections() {
        return $.map(member_table.bootstrapTable('getSelections'), function (row) {
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

    var member_table_columns = [{
        field: 'state',
        checkbox: true,
        align: 'center',
        valign: 'middle'
    }, {
        field: 'username',
        title: '이름',
    }, {
        field: 'loginid',
        title: '아이디',
    }, {
        field: 'password_str',
        title: '비번',
        formatter: (value, row, index) => {
            return `<label style="color: red;"> ${row.password_str} </label>`;
        }
    }, {
        field: 'app_id',
        title: '권한',
    },  {
        field: 'permittedIp',
        title: '허용아이피',
        formatter: (value, row, index) => {
            return `<label> ${row.address} </label>`
        }
    }, {
        field: 'operate',
        title: '조작',
        align: 'center',
        clickToSelect: false,
        events: window.operateEvents,
        formatter: operateFormatter
    }];

    member_table.bootstrapTable({
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
        columns: member_table_columns
    });

    member_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            remove.prop('disabled', !member_table.bootstrapTable('getSelections').length)
            edit.prop('disabled', !(member_table.bootstrapTable('getSelections').length == 1));
            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });


    remove.click(function () {
        bootbox.confirm({
            message: "정말 삭제하겠습니까?",
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
                                toastr['success']("성공적인 조작", "");
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
            message: "정말 삭제하겠습니까?",
            size: "small",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'delete',
                        url: `${base_url}/${id}`,
                        dataType: 'json',
                        success: function (data) {
                            updateTable();
                            toastr['success']("성공적인 조작", "");
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
        member_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });
    }

    $('#add_btn').click(function () {
        $("#id").val('');
        $('#username').val('');
        $('#loginid').val('');
        $('#password').val('');
        $('#id-input-permittedip').val('');
        $("#action_btn").text("확인");
        $("#action_title").html("추가");
        $('#add_modal').modal('show');
        InitAppIdSelTag();
    });

    $('#action_btn').click(function () {
        if($('#username').val().trim() == "" || $('#loginid').val().trim() == "" || $('#password').val().trim() == ""
           || $('#id-input-permittedip').val() == "" 
           || $('#app_id').val() == null || $('#app_id').val().trim() == "chongpan") {
            toastr['warning']('모든 정보를 정확히 입력하세요!', '');
            return;
        }
        
        var data = {
            username: $('#username').val(),
            loginid: $('#loginid').val(),
            password: $('#password').val(),
            roles: "maezhang",
            app_id: $('#app_id').val(),
            address: $('#id-input-permittedip').val().trim(),
        }
        var type, url;
        var id = $("#id").val();
        if (!id) {
            type = 'post';
            url = base_url;
            saveMember(type, url, data);
        } else {
            type = 'put';
            url = `${base_url}/${id}`;
            saveMember(type, url, data);
        }
    });

    function saveMember(type, url, data) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            success: function (data) {
                updateTable();
                $('#add_modal').modal('hide');
                toastr['success']("성공적인 조작", "");
            },
            error: function (data) {
                if(data.responseJSON.msg == 'loginid already exist') 
                    toastr['error']('이미 존재하는 회원아이디입니다!');
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
                // $('#number_real').val(data.number_real);
                $('#loginid').val(data.loginid);
                $('#password').val(data.password);
                // $('#roles').val(data.roles);
                InitAppIdSelTag(data.app_id);
                $('#id-input-permittedip').val(data.address);
                $("#action_btn").text("저장");
                $("#action_title").html("수정");
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
                // $('#number_real').val(data.number_real);
                $('#loginid').val(data.loginid);
                $('#password').val(data.password);
                $('#roles').val(data.roles);
                InitAppIdSelTag(data.app_id);
                $('#id-input-permittedip').val(data.address);
                $("#action_btn").text("저장");
                $("#action_title").html("수정");
                $('#add_modal').modal('show');
            },
            error: function (data) {
                updateTable();
            }
        });
    });
})