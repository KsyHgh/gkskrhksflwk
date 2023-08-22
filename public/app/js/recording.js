$(function() {
    InitHoriBar();
    InitMobilelist();

    function InitHoriBar() {
        $('.menu-08').addClass('active');
    }

    function InitMobilelist() {
        $("#mobile_id").html('');
        $.get("/api/mobiles", { online: true }, function(res) {
            var data = res.items;
            var htmlString = `<option value="">${lang.choose}</option>`;
            for (var i = 0; i < data.length; i++) {
                htmlString += `
                        <option value='${data[i].id}'>
                           ${String(data[i].name) ? lang.name + ': ' + data[i].name + ',' : ''}  ${lang.phoneNumber}: ${data[i].number}
                        </option>`;
            }
            $("#mobile_id").html(htmlString);
        });
    }

    var base_url = "/api/recording";

    var recording_table = $('#recording_table');
    var remove = $('#remove_btn');

    function getIdSelections() {
        return $.map(recording_table.bootstrapTable('getSelections'), function(row) {
            return row.id
        })
    }

    window.operateEvents = {
        'click .remove': function(e, value, row, index) {
            deleteItem(row.id);
        },
        'click .download': function(e, value, row, index) {
            if (row.status) {
                window.location.href = `/api/mobiles/${row.mobile_id}/${row.file_name}/record_file`;
            } else {
                toastr['warning'](lang.msgCurrentlyRecording, lang.failure);
            }
        }
    }

    function operateFormatter(value, row, index) {
        return ` <img class="device-info download" src="/app/image/download.png"></img> <img class="device-info remove" src="/app/image/delete.png"></img>`;
    }

    function updatedAtFormatter(value, row, index) {
        return `${new Date(row.updated_at).toLocaleString()}`;
    }

    function durationFormatter(value, row, index) {
        return `${row.duration * 60}s`;
    }

    function statusFormatter(value, row, index) {
        return row.status ? `<span class="text-success"><i class="fa fa-circle"></i> ${lang.success}</span>` : `<span class="text-danger"><i class="fa fa-circle"></i> ${lang.recording}</span>`;
    }

    recording_table.bootstrapTable({
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
        queryParams: function(params) {
            return params;
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'mobile_number',
            title: lang.phoneNumber,
            align: 'center',
            valign: 'middle',
        }, {
            field: 'duration',
            title: lang.recordingTime,
            align: 'center',
            valign: 'middle',
            formatter: durationFormatter,
        }, {
            field: 'file_name',
            title: lang.recordingFile,
            align: 'center',
            valign: 'middle',
        }, {
            field: 'updated_at',
            title: lang.updateTime,
            align: 'center',
            valign: 'middle',
            cellStyle: { css: { 'white-space': 'nowrap' } },
            formatter: updatedAtFormatter,
        }, {
            field: 'status',
            title: lang.situation,
            align: 'center',
            valign: 'middle',
            formatter: statusFormatter,
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

    recording_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function() {
            remove.prop('disabled', !recording_table.bootstrapTable('getSelections').length)
            edit.prop('disabled', !(recording_table.bootstrapTable('getSelections').length == 1));
            selections = getIdSelections();
        });

    function updateTable() {
        recording_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });
    }

    remove.click(function() {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function(result) {
                if (result) {
                    var ids = getIdSelections();
                    for (var i = 0; i < ids.length; i++) {
                        $.ajax({
                            type: 'delete',
                            url: `${base_url}/${ids[i]}`,
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

    });

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

    $('#add_btn').click(function() {
        $('#add_modal').modal("show");
    })

    $('#action_btn').click(function() {
        if ($('#mobile_id').val() == "") {
            alert(lang.msgChooseDevice);
            return;
        }
        bootbox.confirm({
            message: lang.msgReallAdd,
            size: "small",
            callback: function(result) {
                if (result) {
                    var data = {
                        mobile_id: $('#mobile_id').val(),
                        duration: $('#duration').val()
                    }
                    $.ajax({
                        type: 'post',
                        url: `/api/recording`,
                        data: data,
                        dataType: 'json',
                        success: function(data) {
                            if (data.msg) {
                                toastr['warning'](lang.msgCurrentlyRecording, lang.failure);
                            } else {
                                toastr['success'](lang.msgSuccessOperation, "");
                            }
                            $('#add_modal').modal("hide");
                            updateTable();
                        },
                        error: function(data) {
                            updateTable();
                        }
                    });
                }
            }
        })
    })

    socket.on("record_updated", function(data) {
        updateTable();
        var id = data.id;
        var file_name = data.file_name;
        var app_id = data.app_id;
        if (app_id == user_app_id) {
            //window.location.href = `/api/mobiles/${id}/${file_name}/record_file`;
        }
    })

})