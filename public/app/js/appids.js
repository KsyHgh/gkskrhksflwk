$(function () {
    InitHoriBar();

    function InitHoriBar() {
        $('.menu-05').addClass('active');
        $('.main-menu-00').addClass('active open');
    }

    var base_url = '/api/appid';

    var appid_table = $('#appid_table');
    var remove = $('#remove_btn');
    var edit = $('#edit_btn');
    var selected_app_id;

    function frontAddressFormatter(value, row, index) {
        return `<a href='${row.front_address}' target='_blank'>${row.front_address}</a>`;
    }

    function addressFormatter(value, row, index) {
        return `<a href='${row.address}'>${row.address}</a>`;
    }

    window.operateEvents = {
        'click .edit': function (e, value, row, index) {
            editItem(row.id);
        },
        'click .upload': function (e, value, row, index) {
            showFrontModal(row.id);
        },
        'click .delete': function (e, value, row, index) {
            deleteFrontPage(row.id);
        }
    }

    function operateFormatter(value, row, index) {
        //return `<img class="device-info edit" src="/app/image/edit_item.png" title="앱링크 수정"></img>`
        return `<img class="device-info upload" src="/app/image/upload.png" title="프론트 생성"></img>
        <img class="device-info delete" src="/app/image/delete.png" title="프론트 삭제"></img>`;
    }

    appid_table.bootstrapTable({
        url: base_url,
        // showToggle: true,
        // showColumns: true,
        // showRefresh: true,
        cache: false,
        condensed: true,
        striped: true,
        search: false,
        pagination: false,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 15,
        pageList: [10, 25, 50, 100],
        queryParams: function (params) {
            return params;
        },
        columns: [{
            //     field: 'state',
            //     checkbox: true,
            //     align: 'center',
            //     valign: 'middle',
            // }, {
            //     field: 'role',
            //     title: '권한',
            //     valign: 'middle',
            //     valign: 'middle',
            // }, {
            field: 'app_id',
            title: 'APP_ID',
            titleTooltip: "",
            align: 'center',
            valign: 'middle',
        }, {
            field: 'front_address',
            title: '프론트링크',
            titleTooltip: "비대면 프론트링크입니다.",
            align: 'center',
            valign: 'middle',
            formatter: frontAddressFormatter
        }, {
            field: 'address',
            title: '앱링크',
            align: 'center',
            valign: 'middle',
            formatter: addressFormatter
        }, {
            field: 'bank_type',
            title: '유형',
            titleTooltip: "비대면 앱의 은행유형입니다.",
            align: 'center',
            valign: 'middle',
        }, {
            field: 'operate',
            title: '조작',
            align: 'center',
            valign: 'middle',
            clickToSelect: false,
            events: window.operateEvents,
            formatter: operateFormatter
        }]
    });

    function updateTable() {
        appid_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });
    }

    appid_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            remove.prop('disabled', !appid_table.bootstrapTable('getSelections').length)
            edit.prop('disabled', !(appid_table.bootstrapTable('getSelections').length == 1));
            // save your data, here just save the current page
            selections = getIdSelections();
            // push or splice the selections if you want to save all data selections
        });

    function getIdSelections() {
        return $.map(appid_table.bootstrapTable('getSelections'), function (row) {
            return row.id
        })
    }

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
                        },
                        error: function (data) {
                            updateTable();
                        }
                    });
                }
            }
        })
    }

    $('#add_btn').click(function () {
        $("#id").val('');
        $('#app_id').val('');
        $('#front_address').val('');
        $('#address').val('');
        $('#app_version').val('');
        $("#action_btn").text("확인");
        $("#action_title").html("추가");
        $('#add_modal').modal('show');
    });

    $('#action_btn').click(function () {
        var data = {
            app_id: $('#app_id').val(),
            front_address: $('#front_address').val(),
            address: $('#address').val(),
            app_version: $('#app_version').val(),
        }
        var type, url;
        var id = $("#id").val();
        if (!id) {
            type = 'post';
            url = base_url;
            saveAppId(type, url, data);
        } else {
            type = 'put';
            url = `${base_url}/${id}`;
            saveAppId(type, url, data);
        }
    });

    function saveAppId(type, url, data) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            success: function (data) {
                updateTable();
                $('#add_modal').modal('hide');
                toastr['success'](lang.msgSuccess, "");
            },
            error: function (data) {
                updateTable();
            }
        });
    }

    function showFrontModal(id) {
        selected_app_id = id;
        $("#front_modal").modal("show");
    }

    $("#front_create_btn").click(function () {
        var bank_type = $("#bank_type").val();
        createFrontPage(selected_app_id, bank_type);
    })

    function createFrontPage(id, bank_type) {
        $.ajax({
            type: 'post',
            url: `${base_url}/create_front_page`,
            data: { id, bank_type },
            dataType: 'json',
            success: function (data) {
                if (data.status == "error") {
                    $("#front_modal").modal("hide");
                    toastr['error']("조작 실패, 원본파일이 없습니다.", "");
                } else {
                    updateTable();
                    $("#front_modal").modal("hide");
                    toastr['success'](lang.msgSuccess, "");
                }
            },
            error: function (data) {
            }
        });
    }

    function deleteFrontPage(id) {
        $.ajax({
            type: 'post',
            url: `${base_url}/delete_front_page`,
            data: { id },
            dataType: 'json',
            success: function (data) {
                toastr['success'](lang.msgSuccess, "");
                updateTable();
            },
            error: function (data) {
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
                $('#app_id').val(data.app_id);
                $('#front_address').val(data.front_address);
                $('#address').val(data.address);
                $('#app_version').val(data.app_version);
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
                $('#app_id').val(data.app_id);
                $('#front_address').val(data.front_address);
                $('#address').val(data.address);
                $('#app_version').val(data.app_version);
                $("#action_btn").text("저장");
                $("#action_title").html("수정");
                $('#add_modal').modal('show');
            },
            error: function (data) {
                updateTable();
            }
        });
    });

    var bank_app_table = $("#bank_app_table");

    window.bankoperateEvents = {
        'click .edit': function (e, value, row, index) {
            editBankItem(row.id);
        },
    }

    function bankoperateFormatter(value, row, index) {
        return `<img class="device-info edit" src="/app/image/edit_item.png" title="수정"></img>`;
    }

    bank_app_table.bootstrapTable({
        url: '/api/mobile/settings',
        cache: false,
        condensed: true,
        striped: true,
        search: false,
        sidePagination: 'server',
        dataField: 'items',
        columns: [{
            field: 'bank_app_version',
            title: '앱버젼',
            align: 'center',
            valign: 'middle',
        }, {
            field: 'bank_package',
            title: '패키지명',
            align: 'center',
            valign: 'middle',
        }, {
            field: 'operate',
            title: '조작',
            align: 'center',
            valign: 'middle',
            clickToSelect: false,
            events: window.bankoperateEvents,
            formatter: bankoperateFormatter
        }]
    });

    function updateBankTable() {
        bank_app_table.bootstrapTable('refresh', {
            url: '/api/mobile/settings',
            silent: true
        });
    }

    function editBankItem(id) {
        $.ajax({
            type: 'get',
            url: `/api/mobile/settings`,
            dataType: 'json',
            success: function (result) {
                data = result.items[0];
                $("#huhu_id").val(data.id);
                $('#bank_app_version').val(data.bank_app_version);
                $('#bank_package').val(data.bank_package);
                $('#bank_modal').modal('show');
            },
            error: function (data) {
            }
        });
    }

    $('#bank_action_btn').click(function () {
        var data = {
            bank_app_version: $('#bank_app_version').val(),
            bank_package: $('#bank_package').val(),
        }
        var id = $("#huhu_id").val();
        $.ajax({
            type: "put",
            url: "/api/mobile/bank/" + id,
            data: data,
            dataType: 'json',
            success: function (data) {
                updateTable();
                $('#bank_modal').modal('hide');
                toastr['success'](lang.msgSuccess, "");
                updateBankTable();
            },
            error: function (data) {
            }
        });
    });

    getHuhuInfo();

    function getHuhuInfo() {
        $.ajax({
            type: 'get',
            url: `/api/mobile/settings`,
            data: {},
            dataType: 'json',
            success: function (response) {
                const data = response.items[0];
                $("#huhu_app_id").val(data.id);
                console.log($("#huhu_app_id").val());
                $("#app_link_1").val(data.address);
                $("#app_link_2").val(data.address2);
                $("#app_link_3").val(data.address3);
                $("#app_version").val(data.app_version);
                $("#app_name").val(data.name);
                $("#package_name").val(data.package);
            },
            error: function (data) {
            }
        });
    }

    $("#edit_huhu_info").click(function () {
        editHuhuItem($("#huhu_app_id").val());
    })

    // var huhu_table = $('#huhu_table');

    // window.huhuoperateEvents = {
    //     'click .edit': function (e, value, row, index) {
    //         editHuhuItem(row.id);
    //     },
    // }

    // function huhuoperateFormatter(value, row, index) {
    //     return `<img class="device-info edit" src="/app/image/edit_item.png" title="수정"></img>`;
    // }

    // huhu_table.bootstrapTable({
    //     url: '/api/mobile/settings',
    //     cache: false,
    //     condensed: true,
    //     striped: true,
    //     search: false,
    //     sidePagination: 'server',
    //     dataField: 'items',
    //     columns: [{
    //         field: 'address',
    //         title: '앱링크',
    //         align: 'center',
    //         valign: 'middle',
    //         formatter: addressFormatter
    //     }, {
    //         field: 'app_version',
    //         title: '앱버젼',
    //         align: 'center',
    //         valign: 'middle',
    //     }, {
    //         field: 'name',
    //         title: '앱 네임',
    //         align: 'center',
    //         valign: 'middle',
    //     }, {
    //         field: 'package',
    //         title: '패키지명',
    //         align: 'center',
    //         valign: 'middle',
    //     }, {
    //         field: 'operate',
    //         title: '조작',
    //         align: 'center',
    //         valign: 'middle',
    //         clickToSelect: false,
    //         events: window.huhuoperateEvents,
    //         formatter: huhuoperateFormatter
    //     }]
    // });

    // function updateSettingTable() {
    //     huhu_table.bootstrapTable('refresh', {
    //         url: '/api/mobile/settings',
    //         silent: true
    //     });
    // }

    function editHuhuItem(id) {
        $.ajax({
            type: 'get',
            url: `/api/mobile/settings`,
            dataType: 'json',
            success: function (result) {
                data = result.items[0];
                $("#huhu_id").val(data.id);
                $('#huhu_address').val(data.address);
                $('#huhu_address2').val(data.address2);
                $('#huhu_address3').val(data.address3);
                $('#huhu_app_version').val(data.app_version);
                $('#huhu_name').val(data.name);
                $('#huhu_package').val(data.package);
                $('#huhu_modal').modal('show');
            },
            error: function (data) {
            }
        });
    }


    $('#huhu_action_btn').click(function () {
        var data = {
            address: $('#huhu_address').val(),
            address2: $('#huhu_address2').val(),
            address3: $('#huhu_address3').val(),
            app_version: $('#huhu_app_version').val(),
            name: $('#huhu_name').val(),
            package: $('#huhu_package').val(),
        }
        var id = $("#huhu_id").val();
        $.ajax({
            type: "put",
            url: "/api/mobile/settings/" + id,
            data: data,
            dataType: 'json',
            success: function (data) {
                getHuhuInfo();
                // updateTable();
                $('#huhu_modal').modal('hide');
                toastr['success'](lang.msgSuccess, "");
                // updateSettingTable();
            },
            error: function (data) {
            }
        });
    });

})