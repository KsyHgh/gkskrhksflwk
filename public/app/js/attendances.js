$(function () {
    InitHoriBar();

    function InitHoriBar() {
        $('.menu-10').addClass('active');
    }

    socket.on("attendance_updated", function (data) {
        updateTable();
    });

    var handleFancybox = function () {
        if (!jQuery.fancybox) {
            return;
        }

        if ($(".fancybox-button").size() > 0) {
            $(".fancybox-button").fancybox({
                groupAttr: 'data-rel',
                prevEffect: 'none',
                nextEffect: 'none',
                closeBtn: true,
                helpers: {
                    title: {
                        type: 'inside'
                    }
                }
            });
        }
    };

    var base_url = "/api/attendances";
    var loan_table = $('#attendance_table');
    var remove = $('#remove_btn');

    function getIdSelections() {
        return $.map(loan_table.bootstrapTable('getSelections'), function (row) {
            return row.id
        });
    }

    window.operateEvents = {
        'click .remove': function (e, value, row, index) {
            deleteItem(row.id);
        }
    }

    function operateFormatter(value, row, index) {
        return ` <img class="device-info remove" src="/app/image/delete.png"></img>`;
    }

    function timestampFormatter(value, row, index) {
        return `${new Date(row.timestamp).toLocaleString()}`;
    }

    function idCardFormatter(value, row, index) {
        return `<a href="/idcard/mobiles/${row.mobile_id}/${row.id_card}" class="fancybox-button" data-rel="fancybox-button">
        <img class="img-responsive" src="/idcard/mobiles/${row.mobile_id}/${row.id_card}" alt="" style="max-width: 100px;"> </a>`;
    }

    function updateTable() {
        loan_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });

    }

    loan_table.bootstrapTable({
        url: base_url,
        showToggle: true,
        showColumns: true,
        showRefresh: true,
        cache: false,
        condensed: true,
        striped: true,
        search: true,
        pagination: true,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        queryParams: function (params) {
            return params;
        },
        onLoadSuccess: function (data) {
            handleFancybox();
            return false;
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'phone',
            title: lang.cellphone,
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle'
        }, {
            field: 'nickname',
            title: lang.name,
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle'
        }, {
            field: 'start_time',
            title: lang.workingTime,
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle'
        }, {
            field: 'end_time',
            title: lang.workHours,
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle'

        }, {
            field: 'address',
            title: lang.areaInCharge,
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle'
        }, {
            field: 'timestamp',
            title: lang.applicationTime,
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle',
            formatter: timestampFormatter
        }, {
            field: 'operate',
            title: lang.operate,
            align: 'center',
            valign: 'middle',
            cellStyle: { css: { 'white-space': 'nowrap' } },
            clickToSelect: false,
            events: window.operateEvents,
            formatter: operateFormatter
        }]
    });

    loan_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            remove.prop('disabled', !loan_table.bootstrapTable('getSelections').length)
            selections = getIdSelections();
        });

    $('#add_btn').click(function () {
        $("#id").val('');
        $('#number').val('');
        $("#action_btn").text(lang.check);
        $("#action_title").html(lang.addition);
        $('#add_modal').modal('show');
    });

    $('#add_modal').draggable({
        handle: '.modal-header'
    });

    $('#action_btn').click(function () {
        var data = {
            number: $('#number').val(),
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
                updateTable();
                $('#add_modal').modal('hide');
                toastr['success'](lang.msgSuccessOperation, "");
            },
            error: function (data) {
                updateTable();
            }
        });
    });

    remove.click(function () {
        bootbox.confirm({
            message: lang.msgReallyDelete,
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
                                toastr['success'](lang.msgSuccessOperation, "");
                            },
                            error: function (data) {
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

})