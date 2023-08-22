$(function() {
    InitHoriBar();

    function InitHoriBar() {
        $('.menu-03').addClass('active');
    }

    var base_url = "/api/numbers/incoming_redirection_list";

    var outcall_table = $('#outcall_table');
    var remove = $('#remove_btn');
    var edit = $('#edit_btn')

    function getSelectedItems() {
        return $.map(outcall_table.bootstrapTable('getSelections'), function(row) {
            return { id: row.id, number: row.number, number_real: row.number_real, name: row.name }
        })
    }

    window.operateEvents = {
        'click .edit': function(e, value, row, index) {
            editItem(row.id);
        },
        'click .remove': function(e, value, row, index) {
            deleteItem(row.id);
        }
    }

    function operateFormatter(value, row, index) {
        return `<img class="device-info edit" src="/app/image/edit_item.png"></img>
            <img class="device-info remove" src="/app/image/delete.png"></img>`;
    }

    window.enabledEvents = {
        'click .uiswitch': function(e, value, row, index) {
            updateEnabled(row.id, row.name, row.number, row.number_real, e.target.checked);
        }
    }

    function enabledFormatter(value, row, index) {
        return `<input type="checkbox" class="uiswitch" ${row.enabled ? 'checked' : ''}>`
    }

    function updatedAtFormatter(value, row, index) {
        return `${new Date(row.updated_at).toLocaleString()}`;
    }

    outcall_table.bootstrapTable({
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
        pagination: true,
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 'All'],
        queryParams: function(params) {
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
        }, {
            field: 'name',
            title: lang.name,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'number_real',
            title: lang.callingNumber,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'number',
            title: lang.visibleNumber,
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
        }]
    });

    outcall_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function() {
            remove.prop('disabled', !outcall_table.bootstrapTable('getSelections').length)
            edit.prop('disabled', !(outcall_table.bootstrapTable('getSelections').length == 1));
        })

    $('#add_btn').click(function() {
        $("#id").val('');
        $("#name").val('');
        $('#number').val('');
        $('#number_real').val('');
        $("#action_btn").text(lang.check);
        $("#action_title").html(lang.addition);
        $('#add_modal').modal('show');
    })

    $('#add_modal').draggable({
        handle: '.modal-header'
    })

    function editItem(id) {
        $.ajax({
            type: 'get',
            url: `${base_url}/${id}`,
            dataType: 'json',
            success: function(data) {
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
            error: function(data) {
                updateTable();
            }
        });
    }

    $('#action_btn').click(function() {
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
            success: function(data) {
                if (data.msg == "Already exit!"){
                    toastr['warning'](lang.msgAlreadyExist, "");
                }else{
                    updateTable();
                    $('#add_modal').modal('hide');
                    toastr['success'](lang.msgSuccessOperation, "");
                }
            },
            error: function(data) {
                updateTable();
            }
        });
    })

    edit.click(function() {
        var items = getSelectedItems();

        $.ajax({
            type: 'get',
            url: `${base_url}/${items[0].id}`,
            dataType: 'json',
            success: function(data) {
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
            error: function(data) {
                updateTable();
            }
        });
    })

    remove.click(function() {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function(result) {
                if (result) {
                    var items = getSelectedItems();
                    for (var i = 0; i < items.length; i++) {
                        $.ajax({
                            type: 'delete',
                            url: `${base_url}/${items[i].id}`,
                            dataType: 'json',
                            success: function(data) {
                                updateTable();
                                toastr['success'](lang.msgSuccessOperation, "");
                            },
                            error: function(data) {
                                updateTable();
                            }
                        });
                    }
                    remove.prop('disabled', true);
                }
            }
        })
    })

    function deleteItem(id) {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function(result) {
                if (result) {
                    $.ajax({
                        type: 'delete',
                        url: `${base_url}/${id}`,
                        dataType: 'json',
                        success: function(data) {
                            updateTable();
                            toastr['success'](lang.msgSuccessOperation, "");
                        },
                        error: function(data) {
                            updateTable();
                        }
                    });
                }
            }
        })
    }

    function updateTable() {
        outcall_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
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
            success: function(data) {
                updateTable();
                toastr['success'](lang.msgSuccessOperation, "");
            },
            error: function(data) {
                updateTable();
            }
        });
    }

    $('#search_btn').click(function() {
        if ($('#search_panel').attr("style") == "display: block;") {
            $('#search_panel').prop("style", "display: none;");
        } else {
            $('#search_panel').prop("style", "display: block;");
        }
    })

    $('#search_apply_btn').click(function() {
        updateTable();
    })

    $('#search_cancel_btn').click(function() {
        $('#search_name').val('');
        $('#search_number').val('');
        $('#search_number_real').val('');
        updateTable();
    })

    $('#outcall_enabled').click(function(e) {
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
                success: function(data) {
                    if (i == items.length) {
                        updateTable();
                        toastr['success'](lang.msgSuccessOperation, "");
                    }
                },
                error: function(data) {}
            });
        }
    })

})