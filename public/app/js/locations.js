$(function () {
    InitHoriBar();
    InitMobilelist()

    function InitHoriBar() {
        $('.menu-06').addClass('active');
    }

    function InitMobilelist() {
        $("#mobile_id").html('');
        $.get("/api/mobiles", { online: true }, function (res) {
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

    var base_url = "/api/location";

    var location_table = $('#location_table');
    var remove = $('#remove_btn');

    window.operateEvents = {
        'click .remove': function (e, value, row, index) {
            deleteItem(row.id);
        }
    }

    function operateFormatter(value, row, index) {
        return ` <img class="device-info remove" src="/app/image/delete.png"></img>`;
    }

    function mobileNameFormatter(value, row, index) {
        return `<div>${row.mobile_name}</div><div>${row.mobile_number}</div>`;
    }

    function locationFormatter(value, row, index) {
        return `${row.latitude},${row.longitude}`;
    }

    function updatedAtFormatter(value, row, index) {
        return `${new Date(row.updated_at).toLocaleString()}`;
    }

    location_table.bootstrapTable({
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
            formatter: mobileNameFormatter
        }, {
            field: 'location',
            title: lang.location,
            align: 'center',
            valign: 'middle',
            formatter: locationFormatter
        }, {
            field: 'updated_at',
            title: lang.updateTime,
            align: 'center',
            valign: 'middle',
            formatter: updatedAtFormatter
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

    function updateTable() {
        location_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });
    }

    function getIdSelections() {
        return $.map(location_table.bootstrapTable('getSelections'), function (row) {
            return row.id
        })
    }

    location_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            remove.prop('disabled', !location_table.bootstrapTable('getSelections').length)
            selections = getIdSelections();
        });

    location_table.on('click-row.bs.table td', function (e, row, $element) {
        initMap(row.latitude, row.longitude);
    })

    function initMap(lat, lng) {
        var mapOptions = {
            center: new naver.maps.LatLng(lat, lng),
            zoom: 10
        };

        var map = new naver.maps.Map('map', mapOptions);

        var marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(lat, lng),
            map: map,
            icon: {
                url: '/app/image/mark.png',
                size: new naver.maps.Size(25, 30),
                scaledSize: new naver.maps.Size(25, 30),
                origin: new naver.maps.Point(0, 0),
                anchor: new naver.maps.Point(12, 34)
            }
        });
    }

    $('#add_btn').click(function () {
        $('#add_modal').modal("show");
    })

    $('#action_btn').click(function () {
        if ($('#mobile_id').val() == "") {
            alert(lang.msgChooseDevice);
            return;
        }
        bootbox.confirm({
            message: lang.msgReallAdd,
            size: "small",
            callback: function (result) {
                if (result) {
                    var mobile_id = $('#mobile_id').val();
                    fetchLocationData(mobile_id);
                    $('#add_modal').modal("hide");
                }
            }
        })
    })

    function fetchLocationData(id) {
        startLoading();
        $.ajax({
            type: 'post',
            url: `/api/mobile/upload_location`,
            data: { id },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
    }

    socket.on("location_updated", function () {
        endLoading();
        updateTable();
        toastr['success'](lang.msgSuccessOperation, "");
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
        });
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