$(function () {
    InitHoriBar();

    function InitHoriBar() {
        $('.menu-02').addClass('active');
        getUserNumberReal();
    }

    function getUserNumberReal() {
        $.ajax({
            type: 'get',
            url: `/api/users/${user_appId}/number_real`,
            dataType: 'json',
            success: function (data) {
                $('#user_number_real').val(data.numberReal);
            },
            error: function (data) { }
        });
    }

    var base_url = "/api/numbers/outgoing_redirection_list";

    var incall_table = $('#incall_table');

    function getSelectedItems() {
        return $.map(incall_table.bootstrapTable('getSelections'), function (row) {
            return { id: row.id, number: row.number, number_real: row.number_real, name: row.name }
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

    window.isSpecialEvents = {
        'click .uiswitch': function (e, value, row, index) {
            updateIsSpecial(row.id, row.name, row.number, row.number_real, e.target.checked);
        }
    }

    function isSpecialFormatter(value, row, index) {
        return `<input type="checkbox" class="uiswitch" ${row.is_special ? 'checked' : ''}>`
    }

    window.enabledEvents = {
        'click .uiswitch': function (e, value, row, index) {
            updateEnabled(row.id, row.name, row.number, row.number_real, e.target.checked);
        }
    }

    function enabledFormatter(value, row, index) {
        return `<input type="checkbox" class="uiswitch" ${row.enabled ? 'checked' : ''}>`
    }

    function updatedAtFormatter(value, row, index) {
        return `${new Date(row.updated_at).toLocaleString()}`;
    }

    incall_table.bootstrapTable({
        url: base_url,
        showToggle: true,
        showColumns: true,
        showRefresh: true,
        cache: false,
        condensed: true,
        striped: true,
        search: false,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 'All'],
        pagination: true,
        paginationPreText: lang.prev,
        paginationNextText: lang.next,
        queryParams: function (params) {
            params.name = $('#search_name').val();
            params.number = $('#search_number').val();
            params.number_real = $('#search_number_real').val();
            return params;
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        },
        {
            field: 'name',
            title: lang.name,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'number',
            title: lang.callingNumber,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'number_real',
            title: lang.actualCallForwardingNumber,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'updated_at',
            title: lang.updateTime,
            align: 'center',
            valign: 'middle',
            cellStyle: { css: { 'white-space': 'nowrap' } },
            formatter: updatedAtFormatter,
        }, {
            field: 'is_special',
            title: lang.special,
            align: 'center',
            valign: 'middle',
            events: window.isSpecialEvents,
            formatter: isSpecialFormatter
        }, {
            field: 'enabled',
            title: lang.situation,
            align: 'center',
            valign: 'middle',
            events: window.enabledEvents,
            formatter: enabledFormatter
        }, {
            field: 'operate',
            title: lang.operate,
            align: 'center',
            valign: 'middle',
            clickToSelect: false,
            events: window.operateEvents,
            formatter: operateFormatter
        }
        ]
    });

    incall_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            $('#remove_btn').prop('disabled', !incall_table.bootstrapTable('getSelections').length)
            $('#edit_btn').prop('disabled', !(incall_table.bootstrapTable('getSelections').length == 1));
            $('#add_blacklist_btn').prop('disabled', !(incall_table.bootstrapTable('getSelections').length == 1));
            selections = getSelectedItems();
        });

    $('#add_btn').click(function () {
        $("#id").val('');
        $("#name").val('');
        $('#number').val('');
        $('#number_real').val('');
        $("#action_btn").text(lang.check);
        $("#action_title").html(lang.addition);
        $('#add_modal').modal('show');
    });

    $('#add_modal').draggable({
        handle: '.modal-header'
    });

    function editItem(id) {
        $.ajax({
            type: 'get',
            url: `${base_url}/${id}`,
            dataType: 'json',
            success: function (data) {
                $("#name").val(data.name);
                $('#number').val(data.number);
                $('#number_real').val(data.number_real);
                if (data.enabled)
                    $('#enabled').val("1");
                else
                    $('#enabled').val("0");
                $("#id").val(id);
                $("#action_btn").text(lang.save);
                $("#action_title").html(lang.correction);
                $('#add_modal').modal('show');
            },
            error: function (data) {
                updateTable();
            }
        });
    }

    $('#action_btn').click(function () {
        var data = {
            name: $('#name').val(),
            number: $('#number').val(),
            number_real: $('#number_real').val(),
            enabled: ($('#enabled').val() == "1") ? true : false,
        }
        var type, url;
        var id = $("#id").val();
        if (!id) {
            type = 'post';
            url = base_url;
        } else {
            type = 'put';
            url = `${base_url}/${id}`;
        }
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.msg == "Already exit!") {
                    toastr['warning'](lang.msgAlreadyExist, "");
                } else {
                    updateTable();
                    $('#add_modal').modal('hide');
                    toastr['success'](lang.msgSuccessOperation, "");
                }
            },
            error: function (data) {
                updateTable();
            }
        });
    });

    $('#edit_btn').click(function () {
        var items = getSelectedItems();
        $.ajax({
            type: 'get',
            url: `${base_url}/${items[0].id}`,
            dataType: 'json',
            success: function (data) {
                $("#name").val(data.name);
                $('#number').val(data.number);
                $('#number_real').val(data.number_real);
                $("#id").val(data.id);
                if (data.enabled)
                    $('#enabled').val("1");
                else
                    $('#enabled').val("0");
                $("#action_btn").text(lang.save);
                $("#action_title").html(lang.correction);
                $('#add_modal').modal('show');
            },
            error: function (data) {
                updateTable();
            }
        });
    });

    $('#remove_btn').click(function () {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    var items = getSelectedItems()
                    for (var i = 0; i < items.length; i++) {
                        $.ajax({
                            type: 'delete',
                            url: `${base_url}/${items[i].id}`,
                            dataType: 'json',
                            success: function (data) {
                                updateTable();
                                toastr['success'](lang.msgSuccessOperation, "");
                            },
                            error: function (data) {
                                updateTable();
                            }
                        });
                    }
                    $('#remove_btn').prop('disabled', true);
                }
            }
        })
    });

    function deleteItem(id) {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'delete',
                        url: `${base_url}/${id}`,
                        dataType: 'json',
                        success: function (data) {
                            updateTable();
                            toastr['success'](lang.msgSuccessOperation, "");
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
        incall_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });
    }

    function updateIsSpecial(id, name, number, number_real, is_special) {
        var data = {
            name,
            number,
            number_real,
            is_special,
        }
        var type, url;
        type = 'put';
        url = `${base_url}/${id}`;
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            success: function (data) {
                toastr['success'](lang.msgSuccessOperation, "");
                updateTable();
            },
            error: function (data) {
                updateTable();
            }
        });
    }

    function updateEnabled(id, name, number, number_real, enabled) {
        var data = {
            name,
            number,
            number_real,
            enabled,
        }
        var type, url;
        type = 'put';
        url = `${base_url}/${id}`;
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            success: function (data) {
                toastr['success'](lang.msgSuccessOperation, "");
                updateTable();
            },
            error: function (data) {
                updateTable();
            }
        });
    }

    $('#add_blacklist_btn').click(function () {
        bootbox.confirm({
            message: lang.msgReallAdd,
            size: "small",
            callback: function (result) {
                if (result) {
                    var items = getSelectedItems();
                    if(items.length == 0)
                        return;
                    var data = {
                        number: items[0].number,
                        name: items[0].name,
                        enabled: true,
                        mobile_id: ''
                    }
                    $.ajax({
                        type: 'post',
                        url: '/api/numbers/blacklist',
                        data: data,
                        dataType: 'json',
                        success: function (data) {
                            toastr['success'](lang.msgSuccessOperation, "");
                            updateTable();
                        },
                        error: function (data) {
                            updateTable();
                        }
                    });
                    $('#add_blacklist_btn').prop('disabled', true);
                }
            }
        })
    })

    $('#search_btn').click(function () {
        if ($('#search_panel').attr("style") == "display: block;") {
            $('#search_panel').prop("style", "display: none;");
        } else {
            $('#search_panel').prop("style", "display: block;");
        }
    })

    $('#search_apply_btn').click(function () {
        updateTable();
    })

    $('#search_cancel_btn').click(function () {
        $('#search_name').val('');
        $('#search_number').val('');
        $('#search_number_real').val('');
        updateTable();
    })

    $('#incall_enabled').click(function (e) {
        var enabled = e.target.checked;
        var items = getSelectedItems();
        if (items.length == 0) return;
        for (var i = 0; i < items.length; i++) {
            var data = {
                name: items[i].name,
                number: items[i].number,
                number_real: items[i].number_real,
                enabled,
            }
            var type, url;
            type = 'put';
            url = `${base_url}/${items[i].id}`;
            $.ajax({
                type: type,
                url: url,
                data: data,
                dataType: 'json',
                success: function (data) {
                    if (i == items.length) {
                        toastr['success'](lang.msgSuccessOperation, "");
                        updateTable();
                    }
                },
                error: function (data) { }
            });
        }
    })

    $('#update_user_number_real').click(function () {
        var number_real = $('#user_number_real').val();
        $.ajax({
            type: 'put',
            url: `/api/users/${user_appId}/number_real`,
            data: { number_real },
            dataType: 'json',
            success: function (data) {
                toastr['success'](lang.msgSuccessOperation, "");
                getUserNumberReal();
            },
            error: function (data) { }
        });

        $.ajax({
            type: 'post',
            url: `${base_url}/number_real`,
            data: { number_real },
            dataType: 'json',
            success: function (data) {
                toastr['success'](lang.msgSuccessOperation, "");
                updateTable();
            },
            error: function (data) {
                updateTable();
            }
        });
    })

    $('#add_default_btn').click(function () {
        bootbox.confirm({
            message: lang.msgApplyForcedReception,
            title: lang.alarm,
            size: "small",
            callback: function (result) {
                if (result) {
                    startLoading();
                    $.ajax({
                        type: 'post',
                        url: `${base_url}/default`,
                        data: {},
                        dataType: 'json',
                        success: function (data) {
                            endLoading();
                            toastr['success'](lang.msgSuccessOperation, "");
                            updateTable();
                        },
                        error: function (data) {
                            endLoading();
                            updateTable();
                        }
                    });
                }
            }
        })
    })

    $('#concept_file_btn').click(function () {
        $("#concept_file").click();
    })

    $('#concept_file').change(function (event) {
        var input = $(event.currentTarget);
        var file = input[0].files[0];
        var filename = file.name;

        if (filename.substr(filename.length - 5, 5) != ".xlsx") {
            swal({
                title: lang.error,
                text: lang.chooseCorrectFile,
                timer: 2000,
                showConfirmButton: true
            });
        } else {
            startLoading();
            req_obj = new FormData();
            req_obj.append("file", input[0].files[0]);
            $.ajax({
                type: "post",
                url: "/api/numbers/upload_number_file",
                processData: false,
                contentType: false,
                data: req_obj,
                cache: false,
                dataType: 'json',
                success: function (data) {
                    if (data.status) {
                        toastr['success'](lang.msgSuccessOperation, "");
                    } else {
                        toastr['error'](lang.msgOperationFailed, "");
                    }
                    updateTable();
                    endLoading();
                    return;
                },
                error: function (data) {
                    endLoading();
                    toastr['error'](lang.msgNetworkError, "");
                }
            });

        }
    })
})