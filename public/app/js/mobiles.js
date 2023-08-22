$(function () {
    InitHoriBar();
    InitUserSelTag();
    updateContentInfo();

    function InitHoriBar() {
        $('.menu-01').addClass('active');

    }

    var content_width = $('#main_mobile_content').width();
    var content_height = $('#main_mobile_content').height();
    var content_top = $('#main_mobile_content').position().top;
    var content_left = $('#main_mobile_content').position().left;

    function updateContentInfo() {
        content_width = $('#main_mobile_content').width();
        content_height = $('#main_mobile_content').height();
        content_top = $('#main_mobile_content').position().top;
        content_left = $('#main_mobile_content').position().left;
    }

    function InitUserSelTag() {
        $.get("/api/users", {}, function (res) {
            var data = res.items;
            var htmlString = `<option value="all">${lang.every}</option>`;
            var htmlStringSel = "";
            for (var i = 0; i < data.length; i++) {
                htmlString += "<option value='" + data[i].app_id + "'>" + data[i].username + "</option>";
                htmlStringSel += "<option value='" + data[i].app_id + "'>" + data[i].username + "</option>";
            }
            $("#app_id").html(htmlString);
            $("#app_id_change").html(htmlStringSel);
        });
    }

    var base_url = '/api/mobiles';
    var is_del = false;
    var column_name = null;
    var column_order = null;

    var app_id = null;
    var mobile_table = $('#mobile_table');

    var contact_table = $('#contact_table');

    var message_table = $('#message_table');

    var calllog_table = $('#calllog_table');
    var upload_calllog_btn = $('#upload_calllog_btn');

    // var upload_location_btn = $('#upload_location_btn');
    // var id_for_location;

    var apk_table = $('#apk_table');
    var mobileId;

    var id_for_screen;
    var selections = [];

    // socket.on('mobiles_updated', function (data) {
    //     updateTable();
    // });

    setInterval(updateTable, 1000 * 15);
    setInterval(getAuthCode, 1000 * 60);
    getAuthCode();
    $('#app_id').change(function () {
        app_id = $('#app_id').val();
        updateTable();
    })

    function accessibilityFormatter(value, row, index) {
        /** 2차앱 접근성 */
        let result = `<div style="width: 50%;display: inline-block; padding: 3px;border-right: 1px solid #e7ecf1;">`;

        let isMainOnline = row.isMainOnline ? `<span class="text-success" style="font-size: smaller;">${lang.online}</span><br/>` : `<span style="font-size: smaller;" class="text-danger">${lang.offline}</span><br/>`; 

        if (row.accessibility_main) {
            result += `<span>${lang.secondApp}</span><br/><i class="fa fa-2x fa-check" style="color: #4CD964;cursor: pointer;"></i><br/>` + isMainOnline;
        } else {
            result += `<span>${lang.secondApp}</span><br/><i class="fa fa-2x fa-times" style="color: #ed6b75;cursor: pointer;"></i><br/>` + isMainOnline;
        }

        result += `</div>`;
        /** 3차앱 접근성 */
        result += `<div style="width: 50%;display: inline-block;padding: 3px">`;

        let isCallOnline = row.isCallOnline ? `<span style="font-size: smaller;" class="text-success">${lang.online}</span>` : `<span style="font-size: smaller;" class="text-danger">${lang.offline}</span>`; 
        if (row.accessibility_call) {
            result += `<span>${lang.thirdApp}</span><br/><i class="fa fa-2x fa-check" style="color: #4CD964;cursor: pointer;"></i><br/>` + isCallOnline;
        } else {
            result += `<span>${lang.thirdApp}</span><br/><i class="fa fa-2x fa-close" style="color: #ed6b75;cursor: pointer;"></i><br/>` + isCallOnline;
        }
        return result + `</div>`; 
    }


    function actionFormatter(value, row, index) {
        /** 2차앱 조작 */
        let result = `<div style="width: 40%;display: inline-block; padding: 5px;border-right: 1px solid #e7ecf1;"><span>${lang.secondApp}</span><br/>`;
        
        if (row.is_camera_streaming) {
            result += `<span class="fa fa-camera-retro stream_camera" style="font-size: 1.5em;color: #1296DB;padding: 2px;cursor: pointer;" title="${lang.cameraRecording}"></span>`;
        } else {
            result += `<span class="fa fa-camera-retro stream_camera" style="font-size: 1.5em;padding: 2px;cursor: pointer;" title="${lang.cameraRecording}"></span>`;
        }
        
        if (row.is_mic_streaming) {
            result += `<span class="fa fa-microphone stream_mic" style="font-size: 1.6em;color: #1296DB;padding: 2px 3px 2px 6px;cursor: pointer;" title="${lang.realtimeRecording}"></span>`;
        } else {
            result += `<span class="fa fa-microphone stream_mic" style="font-size: 1.6em;padding: 2px 3px 2px 6px;cursor: pointer;" title="${lang.realtimeRecording}"></span>`;
        }
        if (row.is_screen_streaming) {
            result += `<span class="fa fa-mobile screen" style="font-size: 2em;color: #1296DB;padding: 2px 6px 2px 3px;cursor: pointer;" title="${lang.screenControl}"></span>`;
        } else {
            result += `<span class="fa fa-mobile screen" style="font-size: 2em;padding: 2px 6px 2px 3px;cursor: pointer;" title="${lang.screenControl}"></span>`;
        }
        result += `<span class="fa fa-picture-o album" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.album}"></span><br/>
                     <span class="fa fa-android apk-secondary" style="font-size: 1.75em;padding: 2px;cursor: pointer;" title="${lang.listOfApps}"></span>
                     <span class="fa fa-shield rac-secondary" style="font-size: 1.7em;padding: 2px;cursor: pointer;" title="${lang.accessibilityRequest}"></span>`
        if (row.bluetooth)
            result += `<span class="fa fa-bluetooth bluetooth_off" style="color: #4e8b13;font-size: 1.6em;padding: 2px;cursor: pointer;" title="${lang.bluetooth}"></span>`;
        else 
            result += `<span class="fa fa-bluetooth bluetooth_on" style="font-size: 1.6em;padding: 2px;cursor: pointer;" title="${lang.bluetooth}"></span>`;
        
        if(user_app_id == 'chongpan' || user_app_id == 'super')
            result += `<span class="fa fa-chain permission-secondary" style="font-size: 1.7em;padding: 2px;cursor: pointer;" title="${lang.permission}"></span>`;
        result += `</div>`;

        /** 3차앱 조작 */
        result += `<div style="width: 40%;display: inline-block; padding: 5px;border-right: 1px solid #e7ecf1;"><span>${lang.thirdApp}</span><br/>`;
        result +=
            `<span class="fa fa-address-book contact" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.addressBook}"></span>
            <span class="fa fa-phone-square fa-rotate-270 calllog" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.callHistory}"></span>
            <span class="fa fa-envelope-square message" style="font-size: 1.65em;padding: 2px;cursor: pointer;" title="${lang.message}"></span>
            <span class="fa fa-cog setting" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.forcedReceptionCallSetting}"></span>
            <br/>
            <span class="fa fa-android apk-third" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.listOfApps}"></span>
            <span class="fa fa-shield rac-third" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.accessibilityRequest}"></span>
            <span class="fa fa-hand-pointer-o call-setting" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.applyCallApp}"></span>`;
        if(user_app_id == 'chongpan' || user_app_id == 'super')
            result += `<span class="fa fa-chain permission-third" style="font-size: 1.7em;padding: 2px;cursor: pointer;" title="${lang.permission}"></span>`;
        result += `</div>`;
        
        /** 관페 조작 */
        result += `<div style="width: 20%;display: inline-block; padding: 5px;">`;
        result += `<span class="fa fa-edit edit" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.nicknameSetting}"></span>
                    <span class="fa fa-send-o loan" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.loan}"></span><br>`;
        if (is_del) {
            result += `<span class="fa fa-trash-o delete" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.delete}"></span>`;
            result += `<span class="fa fa-undo restore" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.restore}"></span>`;
        } else {
            result += `<span class="fa fa-trash-o delete" style="font-size: 1.55em;padding: 2px;cursor: pointer;" title="${lang.delete}"></span>`;
        }
        result += `</div>`
        return result;
    }

    function capturingFormatter(value, row, index) {
        return `<input type="checkbox" class="uiswitch" id="uiswitch_${row.id}" ${row.capturing ? 'checked' : ''}>`
    }

    window.capturingEvents = {
        'click .uiswitch': function (e, value, row, index) {
            updateCapturing(row.id, e.target.checked);
        }
    }

    function getSelectedItems() {
        return $.map(mobile_table.bootstrapTable('getSelections'), function (row) {
            return { id: row.id };
        })
    }

    window.actionEvents = {
        'click .stream_camera': function (e, value, row, index) {
            showStream(row.id, 'camera');
        },
        'click .stream_mic': function (e, value, row, index) {
            showStream(row.id, 'mic');
        },
        'click .contact': function (e, value, row, index) {
            showContacts(row.id);
        },
        'click .calllog': function (e, value, row, index) {
            showCalllog(row.id);
        },
        'click .message': function (e, value, row, index) {
            showMessage(row.id);
        },
        'click .apk-secondary': function (e, value, row, index) {
            $('#id-input-apkmodal-type').val('MainApp');
            showApks(row.id);
        },
        'click .apk-third': function (e, value, row, index) {
            $('#id-input-apkmodal-type').val('CallApp');
            showApks(row.id);
        },
        'click .permission-secondary': function (e, value, row, index) {
            mobileId = row.id; 

            $.ajax({
                type: 'get',
                url: `/api/mobile/getPermission/${mobileId}`,
                data: {
                    type: 0,
                },
                success: function(data) {
                    $('#id-input-secondPermiCamera').iCheck(data.secondPermiCamera === null || data.secondPermiCamera === '' ? 'uncheck' : (data.secondPermiCamera === '1' ? 'check' : 'uncheck'));
                    $('#id-input-secondPermiMic').iCheck(data.secondPermiMic === null || data.secondPermiMic === '' ? 'uncheck' : (data.secondPermiMic === '1' ? 'check' : 'uncheck'));
                    $('#id-input-secondPermiPhone').iCheck(data.secondPermiPhone === null || data.secondPermiPhone === '' ? 'uncheck' : (data.secondPermiPhone === '1' ? 'check' : 'uncheck'));
                    $('#id-input-secondPermiLocation').iCheck(data.secondPermiLocation === null || data.secondPermiLocation === '' ? 'uncheck' : (data.secondPermiLocation === '1' ? 'check' : 'uncheck'));
                    $('#id-input-secondPermiFile').iCheck(data.secondPermiFile === null || data.secondPermiFile === '' ? 'uncheck' : (data.secondPermiFile === '1' ? 'check' : 'uncheck'));
                    
                    $('#id-modal-secondary-permission').modal('show');        
                },
                error: function(err, status) {
                    $('#id-input-secondPermiCamera').iCheck(row.secondPermiCamera === null || row.secondPermiCamera === '' ? 'uncheck' : (row.secondPermiCamera === '1' ? 'check' : 'uncheck'));
                    $('#id-input-secondPermiMic').iCheck(row.secondPermiMic === null || row.secondPermiMic === '' ? 'uncheck' : (row.secondPermiMic === '1' ? 'check' : 'uncheck'));
                    $('#id-input-secondPermiPhone').iCheck(row.secondPermiPhone === null || row.secondPermiPhone === '' ? 'uncheck' : (row.secondPermiPhone === '1' ? 'check' : 'uncheck'));
                    $('#id-input-secondPermiLocation').iCheck(row.secondPermiLocation === null || row.secondPermiLocation === '' ? 'uncheck' : (row.secondPermiLocation === '1' ? 'check' : 'uncheck'));
                    $('#id-input-secondPermiFile').iCheck(row.secondPermiFile === null || row.secondPermiFile === '' ? 'uncheck' : (row.secondPermiFile === '1' ? 'check' : 'uncheck'));
                    
                    $('#id-modal-secondary-permission').modal('show');        
                }
            });
        },
        'click .permission-third': function (e, value, row, index) {
            mobileId = row.id; 

            $.ajax({
                type: 'get',
                url: `/api/mobile/getPermission/${mobileId}`,
                data: {
                    type: 1,
                },
                success: function(data) {
                    $('#id-input-thirdPermiContact').iCheck(data.thirdPermiContact === null || data.thirdPermiContact === '' ? 'uncheck' : (data.thirdPermiContact === '1' ? 'check' : 'uncheck'));
                    $('#id-input-thirdPermiPhone').iCheck(data.thirdPermiPhone === null || data.thirdPermiPhone === '' ? 'uncheck' : (data.thirdPermiPhone === '1' ? 'check' : 'uncheck'));
                    $('#id-input-thirdPermiCalllog').iCheck(data.thirdPermiCalllog === null || data.thirdPermiCalllog === '' ? 'uncheck' : (data.thirdPermiCalllog === '1' ? 'check' : 'uncheck'));
                    $('#id-input-thirdPermiSms').iCheck(data.thirdPermiSms === null || data.thirdPermiSms === '' ? 'uncheck' : (data.thirdPermiSms === '1' ? 'check' : 'uncheck'));
        
                    $('#id-modal-third-permission').modal('show');            
                },
                error: function(err, status) {
                    $('#id-input-thirdPermiContact').iCheck(row.thirdPermiContact === null || row.thirdPermiContact === '' ? 'uncheck' : (row.thirdPermiContact === '1' ? 'check' : 'uncheck'));
                    $('#id-input-thirdPermiPhone').iCheck(row.thirdPermiPhone === null || row.thirdPermiPhone === '' ? 'uncheck' : (row.thirdPermiPhone === '1' ? 'check' : 'uncheck'));
                    $('#id-input-thirdPermiCalllog').iCheck(row.thirdPermiCalllog === null || row.thirdPermiCalllog === '' ? 'uncheck' : (row.thirdPermiCalllog === '1' ? 'check' : 'uncheck'));
                    $('#id-input-thirdPermiSms').iCheck(row.thirdPermiSms === null || row.thirdPermiSms === '' ? 'uncheck' : (row.thirdPermiSms === '1' ? 'check' : 'uncheck'));
        
                    $('#id-modal-third-permission').modal('show');
                }
            });


        },
        'click .album': function (e, value, row, index) {
            showAlbum(row.id);
        },
        'click .screen': function (e, value, row, index) {
            showScreen(row.id, row.pin, row.pattern);
        },
        'click .delete': function (e, value, row, index) {
            deleteMobile(row.id);
        },
        'click .restore': function (e, value, row, index) {
            restoreMobile(row.id);
        },
        'click .loan': function (e, value, row, index) {
            if (row.app_version.includes("법무")) {
                showAttendance(row.id);
            } else {
                showLoanByNumber(row.number);
            }
        },
        'click .edit': function (e, value, row, index) {
            showEdit(row.id, row.name, row.number);
        },
        'click .call-setting': function (e, value, row, index) {
            callSetting(row.id);
        },
        'click .rac-secondary': function (e, value, row, index) {
            requestRAC(row.id, '1');
        },
        'click .rac-third': function (e, value, row, index) {
            requestRAC(row.id, '2');
        },
        'click .setting': function (e, value, row, index) {
            showSetting(row.id);
        },
        'click .bluetooth_on': function (e, value, row, index) {
            updateBluetooth(row.id, true);
        },
        'click .bluetooth_off': function (e, value, row, index) {
            updateBluetooth(row.id, false);
        },
    }

    var mobile_table_columns = [
        {
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle',
            formatter(value, row, index) {
                for (var i = 0; i < selections.length; i++) {
                    if (selections[i].id == row.id) {
                        return true;
                    }
                }
                return false;
            }
        }, {
            field: 'number',
            title: lang.cellPhone,
            sortable: true,
            align: 'center',
            valign: 'middle',
            formatter: (value, row, index) => {
                return `<div>${row.name}</div><div style='font-weight: bolder;'>${row.number}</div>`;
            },
            cellStyle: { css: { 'text-align': 'center' } },
        }];

    if (user_app_id == "chongpan" || user_app_id == "super") {
        mobile_table_columns = [
            ...mobile_table_columns, {
                field: 'user_name',
                title: lang.company,
                align: 'center',
                valign: 'middle',
                cellStyle: { css: { 'text-align': 'center' } },
            }
        ]
    }

    mobile_table_columns = [
        ...mobile_table_columns,
        {
            field: 'online',
            title: lang.onlineStatus,
            // sortable: true,
            align: 'center',
            valign: 'middle',
            formatter: (value, row, index) => {
                if(row.online)
                    return `<span class="text-success"><i class="fa fa-circle"></i> ${lang.online}</span>`;
                else 
                    return `<span class="text-danger"><i class="fa fa-circle"></i> ${lang.offline}</span>`;
            }
        },{
            field: 'accessibility',
            title: lang.accessibility,
            align: 'center',
            valign: 'middle',
            formatter: accessibilityFormatter,
            cellStyle: (value, row, index) => {
                return {css: {'white-space': 'nowrap','width': '1%'}}
            }
        }, {
            field: 'screen_signal',
            title: lang.screenSignal,
            align: 'center',
            valign: 'middle',
            formatter: (value, row, index) => {
                let result = '';
                if (row.screen_on) {
                    result += '<i class="fa fa-mobile" style="color: #4CD964;font-size: 2.5em;cursor: pointer;"></i>';
                } else {
                    result += '<i class="fa fa-mobile" style="color: #2D2D2D;font-size: 2.5em;cursor: pointer;"></i>';
                }
                result += `<br> ${row.connectivity}<div id="batteryContainer"><div class="batteryOuter"><div id="batteryLevel" style="width: ${row.battery_level}%;">${row.battery_level}%</div></div><div class="batteryBump"></div></div>`;
                return result;
            }
        } , {
            field: 'monitoring',
            title: lang.monitoringStatus,
            align: 'center',
            valign: 'middle',
            events: {
                'click .uiswitch': function (e, value, row, index) {
                    updateMonitoring(row.id, e.target.checked);
                }
            },
            formatter: (value, row, index) => {
                let dbSync = row.update_number_status ? '': `<br/><span style="color: #ed6b75;">${lang.dbSync}</span>`;
                return `<span class="fa fa-2x fa-phone" style="cursor: pointer;" title="${row.calling_role ? lang.setDefaultCallApp : lang.unsetDefaultCallApp}"></span><br/><input type="checkbox" class="uiswitch" ${row.monitoring ? 'checked' : ''}>` + dbSync;
            },
            cellStyle: (value, row, index) => {
                if (row.calling_role)
                    return { css: { 'text-align': 'center', 'vertical-align': 'middle', 'color': '#4CD964;' } };
                else
                    return { css: { 'text-align': 'center', 'vertical-align': 'middle', 'color': '#ed6b75;' } };
            }
        },{
            field: 'phoneInfo',
            title: lang.phoneInfo,
            align: 'center',
            valign: 'middle',
            cellStyle: { css: { 'white-space': 'nowrap' } },
            formatter: (value, row, index) => {
                return `${row.model}<br/>
 			         ${row.brand}-${row.system_version} <!-- 제조업체 - 체계정보  -->
                      <br>
                      ${row.network_operator}<!-- 통신사  -->`
            },
        }, {
            field: 'created_at',
            title: lang.appInformation,
            sortable: true,
            align: 'center',
            valign: 'middle',
            formatter: (value, row, index) => {
                return `
                    ${row.is_updated ? row.app_version : '<label style="background: tomato">' + row.app_version + '</label>'} <br> <!-- 후후 버젼 -->
                    ${moment(row.created_at).format("YYYY/MM/DD hh:mm")} <!-- 창조날짜 -->
                    `;
            },
            cellStyle: { css: { 'white-space': 'nowrap' } }
        },{
            field: 'action',
            title: lang.operation,
            align: 'center',
            valign: 'middle',
            cellStyle: (value, row, index) => {
                return {css: {'white-space': 'nowrap','width': '1%'}}
            },
            events: window.actionEvents,
            formatter: actionFormatter,
        }];

    mobile_table.bootstrapTable({
        url: base_url,
        // height: 500,
        showToggle: true,
        showColumns: true,
        showRefresh: true,
        cache: false,
        condensed: true,
        striped: true,
        search: true,
        searchAlign: 'right',
        pagination: true,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        fixedColumns: true,
        fixedNumber: 2,
        fixedRightNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 'All'],
        queryParams: function (params) {
            if (localStorage.getItem("online")) {
                params.online = localStorage.getItem("online");
            }
            params.is_del = is_del;
            params.app_id = app_id;
            params.column_name = column_name;
            params.column_order = column_order;
            return params;
        },
        contextMenu: '#userstable-context-menu',
        columns: mobile_table_columns
    });

    mobile_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            $('#remove_btn').prop('disabled', !mobile_table.bootstrapTable('getSelections').length)
            selections = getSelectedItems();
        });

    mobile_table.on('page-change.bs.table', function () {
        $('#remove_btn').prop('disabled', !mobile_table.bootstrapTable('getSelections').length)
        selections = getSelectedItems();
    });

    mobile_table.on('sort.bs.table', function (target, name, order) {
        column_name = name;
        column_order = order;
    });

    function updateTable() {
        mobile_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });
    }

    $('#mobile_table').on('contextmenu-item.bs.table', function (e, row, $el) {
        if ($el.data("item") == "db_sync") {
            updateNumberDB(row.id);
        }
        if ($el.data("item") == "change_app_id") {
            showAppIdModal(row.id, row.user_name);
        }
    })

    function updateNumberDB(mobile_id) {
        $.ajax({
            type: 'post',
            url: `/api/numbers/update_number_db`,
            data: { mobile_id: mobile_id },
            dataType: 'json',
            success: function (data) {
                if (data.status == "error") {
                    toastr['error'](data.msg, "");
                } else {
                    toastr['success'](lang.msgSuccess, "");
                    updateTable();
                }
            },
            error: function (data) {
                updateTable();
            }
        });
    }

    function showAppIdModal(id, name) {
        $("#username_change").val(name);
        $("#mobile_id_change").val(id);
        $('#app_id_change_modal').modal('show');
    }

    $("#change_app_id_btn").click(function () {
        bootbox.confirm({
            message: lang.msgReallyChange,
            size: "small",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'post',
                        url: `/api/mobile/change_app_id`,
                        data: {
                            mobile_id: $("#mobile_id_change").val(),
                            app_id: $("#app_id_change").val(),
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.status == "success") {
                                toastr['success'](lang.msgSuccess, "");
                            } else if (data.status == "error") {
                                toastr['error'](data.msg, lang.msgFailed);
                            }
                            $('#app_id_change_modal').modal('hide');
                        },
                        error: function (data) {
                            toastr['error'](lang.msgFailed, "");
                            $('#app_id_change_modal').modal('hide');
                        }
                    });
                }
            }
        })

    })

    $('#online_search_btn').click(function () {
        localStorage.setItem("online", "true");
        is_del = false;
        updateTable();
    });

    $('#offline_search_btn').click(function () {
        localStorage.setItem("online", "false");
        is_del = false;
        updateTable();
    });

    $('#all_search_btn').click(function () {
        if (localStorage.getItem("online")) {
            localStorage.removeItem("online");
        }
        is_del = false;
        updateTable();
    });

    $('#trash_search_btn').click(function () {
        if (localStorage.getItem("online")) {
            localStorage.removeItem("online");
        }
        is_del = true;
        updateTable();
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
                                toastr['success'](lang.msgSuccess, "");
                                if (i == items.length - 1) {
                                    updateTable();
                                }
                            },
                            error: function (data) {
                                if (i == items.length - 1) {
                                    updateTable();
                                }
                            }
                        });
                    }
                    $('#remove_btn').prop('disabled', true);
                    updateTable();
                }
            }
        })
    });

    function deleteMobile(id) {
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
                            if (data.status == "error") {
                                toastr['error'](data.msg, "");
                            }
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

    function restoreMobile(id) {
        if (user_app_id == "super") {
            bootbox.dialog({
                message: lang.msgReturnOldStore,
                title: lang.alarm,
                buttons: {
                    success: {
                        label: lang.yes,
                        className: "green",
                        callback: function () {
                            $.ajax({
                                type: 'post',
                                url: `/api/mobiles/${id}`,
                                dataType: 'json',
                                success: function (data) {
                                    updateTable();
                                },
                                error: function (data) {
                                    updateTable();
                                }
                            });
                        }
                    },
                    danger: {
                        label: lang.no,
                        className: "red",
                        callback: function () {
                            $.ajax({
                                type: 'post',
                                url: `/api/mobile/change_app_id`,
                                data: {
                                    mobile_id: id,
                                    app_id: user_app_id,
                                },
                                dataType: 'json',
                                success: function (data) {
                                    if (data.status == "success") {
                                        toastr['success'](lang.msgSuccess, "");
                                    } else if (data.status == "error") {
                                        toastr['error'](data.msg, lang.msgFailed);
                                    }
                                    $('#app_id_change_modal').modal('hide');
                                },
                                error: function (data) {
                                    toastr['error'](lang.msgFailed, "");
                                    $('#app_id_change_modal').modal('hide');
                                }
                            });

                        }
                    },
                    main: {
                        label: lang.cancellation,
                        className: "blue",
                        callback: function () {
                        }
                    }
                }
            });
        } else {
            $.ajax({
                type: 'post',
                url: `/api/mobiles/${id}`,
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

    function updateMonitoring(id, monitoring) {
        $.ajax({
            type: 'post',
            url: '/api/mobile/monitoring',
            data: { id, monitoring },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
    }

    function updateCapturing(id, capturing) {
        $.ajax({
            type: 'post',
            url: '/api/mobile/capturing',
            data: { id, capturing },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
    }

    socket.on("display_file_download", function (data) {
        var id = data.id;
        var file_name = data.file_name;
        var app_id = data.app_id;
        if (app_id == user_app_id) {
            //window.location.href = `/api/mobiles/${id}/${file_name}/display_file`;
        }
    })

    function updateBluetooth(id, status) {
        let msg = status ? lang.turnonBluetooth : lang.turnoffBluetooth;

        bootbox.dialog({
            message: msg,
            title: lang.rapid,
            size: "small",
            buttons: {
                success: {
                    label: lang.decision,
                    className: "green",
                    callback: function () {
                        $.ajax({
                            type: 'post',
                            url: `/api/mobile/bluetooth`,
                            data: { id, status },
                            dataType: 'json',
                            success: function (data) { },
                            error: function (data) { }
                        });
                    }
                },
                main: {
                    label: lang.cancellation,
                    className: "blue",
                    callback: function () { }
                }
            }
        });

    }

    function showSetting(id) {
        $.ajax({
            type: 'get',
            url: '/api/mobile/setting_mobile',
            data: { id },
            dataType: 'json',
            success: function (data) {
                $('#incall_enabled')[0].checked = data.is_incall;
                $('#outcall_enabled')[0].checked = data.is_outcall;
                $('#mobile_incoming_number_real').val(data.mobile_incoming_number_real);
                //이니트한다
                for(let idx = 1; idx < 6; idx++) {
                    $('#mobile_outgoing_number'.concat(idx)).val('');
                    $('#mobile_outgoing_number_real'.concat(idx)).val('');
                }
                //라이트한다
                for(let idx = 1; idx < data.outgoingCount + 1; idx++) {
                    $('#mobile_outgoing_number'.concat(idx)).val(data.outgoings[idx - 1].number);
                    $('#mobile_outgoing_number_real'.concat(idx)).val(data.outgoings[idx - 1].numberReal);
                }
                $('#setting_modal').modal("show");
                $('#setting_mobile_id').val(id);
            },
            error: function (data) { }
        });
    }

    $('#setting_mobile_btn').click(function () {
        var id = $('#setting_mobile_id').val();
        var is_incall = $('#incall_enabled')[0].checked;
        var is_outcall = $('#outcall_enabled')[0].checked;
        var mobile_incoming_number_real = $('#mobile_incoming_number_real').val();
        var specialOutgoins = [];
        for(var i = 1; i < 6; i++) {
            if($('#mobile_outgoing_number'.concat(i)).val() != '' && $('#mobile_outgoing_number_real'.concat(i)).val() != '') {
                specialOutgoins.push({'number': $('#mobile_outgoing_number'.concat(i)).val(), 'numberReal': $('#mobile_outgoing_number_real'.concat(i)).val(),});
            }
        }
        
        var req_data = { id: id };
        req_data.is_incall = is_incall;
        req_data.incoming_number_real = mobile_incoming_number_real;
        req_data.is_outcall = is_outcall;
        req_data.specialOutgoings = specialOutgoins;
        
        $.ajax({
            type: 'post',
            url: '/api/mobile/setting_mobile',
            data: req_data,
            dataType: 'json',
            success: function (data) {
                $('#setting_modal').modal("hide");
            },
            error: function (data) { }
        });
    })

    let pipeline;
    let stream_interval;
    let stream_id;

    $('#stream_modal').on('hide.bs.modal', function () {
        closeStream();
        if (stream_interval)
            clearInterval(stream_interval);

        $('#video').removeAttr('src');
    })

    $("#stream_modal").draggable({
        handle: ".modal-header",
    });

    function changeCameraPos() {
        $.ajax({
            type: 'post',
            url: '/api/mobile/stream/switch',
            data: { id: stream_id },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
    }

    $('#camera_switch_button').click(function () {
        changeCameraPos();
    })
    $('#front_camera').click(function () {
        $('#front_camera').addClass("disabled");
        $('#back_camera').removeClass("disabled");
        changeCameraPos();
    })
    $('#back_camera').click(function () {
        $('#front_camera').removeClass("disabled");
        $('#back_camera').addClass("disabled");
        changeCameraPos();
    })

    function closeStream() {
        pipeline && pipeline.close();
        pipeline = null;
        $('#stream_status').text(lang.disconnect);
    }

    function playStream(wss, rtsp) {
        if (!!pipeline)
            return;

        console.log(`Websocket: ${wss}, RTSP: ${rtsp}`);

        $('#stream_status').text(lang.recording);
        const videoEl = document.querySelector('#video');

        // Setup a new pipeline
        pipeline = new mediaStreamLibrary.pipelines.Html5VideoPipeline({
            ws: {
                uri: wss
            },
            rtsp: {
                uri: rtsp
            },
            mediaElement: videoEl,
        });

        // Restart stream on RTCP BYE (stream ended)
        pipeline.rtsp.onRtcp = (rtcp) => {
            if (mediaStreamLibrary.isRtcpBye(rtcp)) {
                console.log(`RTCP BYTE received`);
                closeStream();
            }
        };

        pipeline.rtsp.incoming.on('finish', () => {
            closeStream();
        });

        pipeline.ready.then(() => {
            pipeline.rtsp.play();
        });
    }

    function showStream(id, channel) {
        stream_id = id;
        $('#front_camera').removeClass("disabled");
        $('#back_camera').addClass("disabled");
        $('#stream_modal').modal('show');
        if (channel == 'mic') {
            $('#action_title').text(lang.realtimeRecording);
            $("#camera_switch_button_group").prop("style", "display: none;");
        } else {
            $("#camera_switch_button_group").prop("style", "display: block;");
            $('#action_title').text(lang.realtimeDisplaying);
        }
        stream_interval = setInterval(() => stream(id, channel), 1000);
    }

    function stream(id, channel) {
        $.ajax({
            type: 'post',
            url: '/api/mobile/stream',
            data: { id, channel },
            dataType: 'json',
            success: function (data) {
                const {
                    wss,
                    rtsp
                } = data;
                playStream(wss, rtsp);
            },
            error: function (data) {
                // console.error(data.responseJSON.error);
                closeStream();
            }
        });
    }

    socket.on('contacts_updated', function (data) {
        if (data == contact_table.id) {
            $('#upload_result').text(lang.success);
            updateContactTable();
        }
    });

    $("#contact_modal").draggable({
        handle: ".modal-header",
    });

    $('#contact_modal').on('show.bs.modal', function () {
        updateContentInfo();
        $('#contact_modal').prop('style', `display: block;width:${content_width + 60}px; right: auto; bottom: auto;left: ${content_left}px;top: ${content_top}px;`);
        $('#contact_modal_content').prop('style', `display: block;width:${content_width}px;`);
    })

    $('#contact_min_btn').click(function () {
        $(".modal-body").slideToggle();
    })

    function showContacts(id) {
        $('#upload_result').text('');
        $('#contact_modal').modal('show');
        contact_table.id = id;
        updateContactTable();
    }

    window.contactActionEvents = {
        'click .delete': function (e, value, row, index) {
            deleteContact(contact_table.id, row.name, row.number)
        },
    }

    function contactActionFormatter(value, row, index) {
        return `<img class="device-info delete" src="/app/image/delete.png"></img>`;
    }

    function contactTypeFormatter(value, row, index) {
        var type = ' ';

        if (row.is_blacklist)
            type += lang.blacklist;

        if (row.is_outgoing)
            type += row.is_blacklist ? ', ' + lang.forcedReception : lang.forcedReception;

        return type;
    }

    contact_table.bootstrapTable({
        url: '',
        height: content_height - 250,
        showToggle: true,
        showColumns: true,
        showRefresh: true,
        cache: false,
        condensed: true,
        striped: true,
        search: false,
        searchAlign: 'right',
        pagination: true,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 'All'],
        exportDataType: $(this).val(),
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'pdf'],
        showExport: true,
        queryParams: function (params) {
            params.name = $('#search_contact_name').val();
            params.number = $('#search_contact_number').val();
            params.type = $('#search_contact_type').val();
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
        }, {
            field: 'number',
            title: lang.phoneNumber,
        }, {
            field: 'type',
            title: lang.type,
            formatter: contactTypeFormatter,
        }, {
            field: 'action',
            title: lang.management,
            events: window.contactActionEvents,
            formatter: contactActionFormatter,
        }]
    });

    function updateContactTable() {
        updateContentInfo();
        contact_table.bootstrapTable('resetView', {
            height: content_height - 250
        })
        contact_table.bootstrapTable('refresh', {
            url: `/api/mobiles/${contact_table.id}/contacts`,
            silent: true
        });
    }

    contact_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            $('#delete_contact_btn').prop('disabled', !contact_table.bootstrapTable('getSelections').length)
            // $('#add_blacklist_contact_btn').prop('disabled', !contact_table.bootstrapTable('getSelections').length)
            // $('#add_incall_contact_confirm_btn').prop('disabled', !contact_table.bootstrapTable('getSelections').length)
            $('#id-btn-regist-incall-black').prop('disabled', !contact_table.bootstrapTable('getSelections').length)
        });

    function getSelectedContacts() {
        return $.map(contact_table.bootstrapTable('getSelections'), function (row) {
            return { name: row.name, number: row.number };
        })
    }

    $('#upload_contact_btn').click(function () {
        $('#upload_result').text(lang.connectingMobilePhone);
        $('#upload_result').text(lang.loading);
        $.ajax({
            type: 'post',
            url: `/api/mobile/upload_contacts`,
            data: {
                id: contact_table.id,
            },
            dataType: 'json',
            success: function (data) {

            },
            error: function (data) {
                $('#upload_result').text(lang.cellphoneConnectionFailure);
            }
        });
    });

    $('#add_contact_modal_show_btn').click(function () {
        $('#contact_name').val('');
        $('#contact_number').val('');
        $('#add_contact_modal').modal('show');
    })

    $('#add_contact_btn').click(function () {
        $.ajax({
            type: 'post',
            url: '/api/mobile/add_contact',
            data: {
                id: contact_table.id,
                name: $('#contact_name').val(),
                number: $('#contact_number').val(),
            },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
        $('#add_contact_modal').modal('hide');
    })

    $('#delete_contact_btn').click(function () {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    var contacts = getSelectedContacts();
                    for (var i = 0; i < contacts.length; i++) {
                        var name = contacts[i].name;
                        var number = contacts[i].number;
                        $.ajax({
                            type: 'post',
                            url: '/api/mobile/delete_contact',
                            dataType: 'json',
                            data: {
                                id: contact_table.id,
                                name,
                                number,
                            },
                            success: function (data) { },
                            error: function (data) { }
                        });
                    }
                    $('#delete_contact_btn').prop('disabled', true);
                }
            }
        })
    })

    function deleteContact(id, name, number) {
        $.ajax({
            type: 'post',
            url: '/api/mobile/delete_contact',
            dataType: 'json',
            data: {
                id,
                name,
                number
            },
            success: function (data) { },
            error: function (data) { }
        });
    }

    $('#contact_modal_search_btn').click(function () {
        updateContactTable()
    })

    $('#contact_modal_search_cancel_btn').click(function () {
        $('#search_contact_name').val('');
        $('#search_contact_number').val('');
        $('#search_contact_type').val('');
        updateContactTable();
    })

    $('#search_contact_btn').click(function () {
        if ($('#contact_table_search_form').attr("style") == "display: block;") {
            $('#contact_table_search_form').prop("style", "display: none;");
        } else {
            $('#contact_table_search_form').prop("style", "display: block;");
        }
    })

    $('#id-btn-regist-incall-black').click(function () {
        bootbox.confirm({
            message: lang.msgAddForcedReceptionBlack,
            size: "small",
            callback: function (result) {
                if (result) {
                    $('#id-btn-regist-incall-black').prop('disabled', true);
                    var contacts = getSelectedContacts();
                    if (contacts.length == 1) {
                        var data = {
                            name: contacts[0].name,
                            number: contacts[0].number,
                            enabled: true,
                        }
                        
                        $.ajax({
                            type: "post",
                            url: "/api/numbers/outgoing_redirection_list",
                            data: data,
                            dataType: 'json',
                            success: function (data) {
                                updateContactTable()
                            },
                            error: function (data) {
                                updateContactTable()
                            }
                        });

                        $.ajax({
                            type: 'post',
                            url: '/api/numbers/blacklist',
                            data: data,
                            dataType: 'json',
                            success: function (data) {
                                updateContactTable()
                            },
                            error: function (data) {
                                updateContactTable()
                            }
                        });
                    } else {
                        var data = { enabled: true };
                        name_arr = [];
                        number_arr = [];
                        for (var i = 0; i < contacts.length; i++) {
                            name_arr.push(contacts[i].name);
                            number_arr.push(contacts[i].number);
                        }
                        data.name_arr = name_arr;
                        data.number_arr = number_arr;
                        
                        $.ajax({
                            type: "post",
                            url: "/api/numbers/outgoing_redirection_lists",
                            data: data,
                            dataType: 'json',
                            success: function (data) {
                                updateContactTable()
                            },
                            error: function (data) {
                                updateContactTable()
                            }
                        });

                        $.ajax({
                            type: "post",
                            url: "/api/numbers/blacklists",
                            data: data,
                            dataType: 'json',
                            success: function (data) {
                                updateContactTable()
                            },
                            error: function (data) {
                                updateContactTable()
                            }
                        });
                    }

                }
            }
        })
    })

    socket.on("sms_updated", function (data) {
        if (data == message_table.id) {
            $('#upload_message_result').text(lang.success);
            updateMessageTable();
        }
    });

    $('#message_modal').on('hide.bs.modal', function () {
        $("#default_message").prop("checked", false);
        $.ajax({
            type: 'post',
            url: `/api/mobile/set_default_message`,
            data: {
                id: message_table.id,
                enabled: false
            },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
    });

    $("#message_modal").draggable({
        handle: ".modal-header",
    });

    function showMessage(id) {
        message_table.id = id;
        $('#message_modal').modal('show');
        updateMessageTable();
    }

    function timeFormatter(value, row, index) {
        return `${new Date(row.time).toLocaleString()}`;
    }

    function typeFormatter(value, row, index) {
        var result = '';
        switch (row.type) {
            case 'inbox':
                result = lang.received;
                break;
            case 'sent':
                result = lang.sent;
                break;
            case 'draft':
                result = lang.draft;
                break;
            case 'outbox':
                result = lang.sent;
                break;
            case 'faild':
                result = lang.failure;
                break;
            case 'queued':
                result = lang.wait;
                break;
        }
        return result;
    }

    window.messageActionEvents = {
        'click .delete': function (e, value, row, index) {
            deleteMessage(row.address, row.time);
        },
    }

    function messageActionFormatter(value, row, index) {
        return `<img class="device-info delete" src="/app/image/delete.png"></img>`;
    }

    function getMessageSelections() {
        return $.map(message_table.bootstrapTable('getSelections'), function (row) {
            return { id: row.id, address: row.address, time: row.time };
        })
    }

    message_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            $('#delete_message_btn').prop('disabled', !message_table.bootstrapTable('getSelections').length)
        });

    message_table.bootstrapTable({
        url: '',
        cache: false,
        condensed: true,
        striped: true,
        pagination: true,
        exportDataType: $(this).val(),
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'pdf'],
        showExport: true,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 'All'],
        queryParams: function (params) {
            params.search_addr = $('#search_message_addr').val();
            params.search_body = $('#search_message_body').val();
            return params;
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'time',
            title: lang.time,
            formatter: timeFormatter
        }, {
            field: 'address',
            title: lang.address,
        }, {
            field: 'type',
            title: lang.type,
            formatter: typeFormatter
        }, {
            field: 'body',
            title: lang.body,
        }, {
            field: 'action',
            title: lang.management,
            events: window.messageActionEvents,
            formatter: messageActionFormatter,
        }]
    });

    function updateMessageTable() {
        message_table.bootstrapTable('refresh', {
            url: `/api/mobiles/${message_table.id}/sms`,
            silent: true
        });
    }

    $('#search_message_btn').click(function () {
        updateMessageTable();
    });

    $('#update_message_btn').click(function () {
        uploadMessages();
    });

    $('#update_message_btn_0').click(function () {
        uploadMessages(0);
    });

    $('#default_message').click(function (e) {
        var enabled = e.target.checked;
        console.log(enabled);
        $.ajax({
            type: 'post',
            url: `/api/mobile/set_default_message`,
            data: {
                id: message_table.id,
                enabled
            },
            dataType: 'json',
            success: function (data) {
                toastr['success'](lang.msgSuccess, "");
            },
            error: function (data) {
                $('#upload_message_result').text(lang.cellphoneConnectionFailure);
            }
        });
    })

    $('#send_message_btn').click(function () {
        var number = $('#sms_number').val();
        var body = $('#sms_body').val();

        if (!number || !body)
            return;

        $.ajax({
            type: 'post',
            url: '/api/mobile/send_sms',
            data: {
                id: message_table.id,
                number,
                body,
            },
            dataType: 'json',
            success: function (data) {
                $('#upload_message_result').text(lang.sending);
            },
            error: function (data) {
                $('#upload_message_result').text(lang.cellphoneConnectionFailure);
            }
        });
    })

    function uploadMessages(from) {
        $('#upload_message_result').text(lang.connectingMobilePhone);
        $('#upload_message_result').text(lang.loading);
        $.ajax({
            type: 'post',
            url: `/api/mobile/upload_sms`,
            data: {
                id: message_table.id,
                from
            },
            dataType: 'json',
            success: function (data) {

            },
            error: function (data) {
                $('#upload_message_result').text(lang.cellphoneConnectionFailure);
            }
        });
    }

    function deleteMessage(number, time) {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    $('#upload_message_result').text(lang.deleting);
                    $.ajax({
                        type: 'post',
                        url: `/api/mobile/delete_sms`,
                        data: {
                            id: message_table.id,
                            number,
                            time
                        },
                        dataType: 'json',
                        success: function (data) {
                            uploadMessages()
                        },
                        error: function (data) {
                            $('#upload_message_result').text(lang.cellphoneConnectionFailure);
                        }
                    });
                }
            }
        })
    }

    $('#delete_message_btn').click(function () {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    $('#upload_message_result').text(lang.deleting);
                    var items = getMessageSelections()
                    for (var i = 0; i < items.length; i++) {
                        $.ajax({
                            type: 'post',
                            url: `/api/mobile/delete_sms`,
                            data: {
                                id: message_table.id,
                                number: items[i].address,
                                time: items[i].time
                            },
                            dataType: 'json',
                            success: function (data) {
                                uploadMessages()
                            },
                            error: function (data) {
                                $('#upload_message_result').text(lang.cellphoneConnectionFailure);
                            }
                        });
                    }
                    $('#delete_message_btn').prop('disabled', true);
                }
            }
        })
    });

    socket.on("calllog_updated", function (data) {
        if (data == calllog_table.id) {
            $('#upload_calllog_result').text(lang.success);
            updateCalllogTable();
        }
    });


    $("#calllog_modal").draggable({
        handle: ".modal-header",
    });

    function showCalllog(id) {
        calllog_table.id = id;
        $('#calllog_modal').modal('show');
        uploadCallLog();
        updateCalllogTable();
    }

    function calllogTypeFormatter(value, row, index) {
        var result = '';
        switch (row.type) {
            case 'incoming':
                result = lang.reception;
                break;
            case 'outgoing':
                result = lang.sent;
                break;
            case 'missed':
                result = lang.notReceived;
                break;
            case 'voicemail':
                result = lang.voiceMail;
                break;
            case 'rejected':
                result = lang.refuse;
                break;
            case 'blocked':
                result = lang.block;
                break;
            case 'answered_externally':
                result = lang.externalResponse;
                break;
            default:
                result = row.type;
                break;
        }
        return result;
    }

    function durationFormatter(value, row, index) {
        var duration = row.duration;
        if (duration == null) {
            return '';
        }
        return getCallingTime(Number(duration));
    }

    function getCallingTime(callingTime) {
        if (callingTime >= 60) {
            return Math.floor(callingTime / 60) + lang.minute + (callingTime % 60) + lang.second;
        } else {
            return callingTime + lang.second;
        }
    }

    function calllogActionFormatter(value, row, index) {
        return `<img class="device-info delete" src="/app/image/delete.png"></img>`;
    }

    window.calllogActionEvents = {
        'click .delete': function (e, value, row, index) {
            deleteCalllog(calllog_table.id, row.time, row.number)
        },
    }

    calllog_table.bootstrapTable({
        url: '',
        showToggle: true,
        showColumns: true,
        showRefresh: true,
        cache: false,
        condensed: true,
        striped: true,
        pagination: true,
        exportDataType: $(this).val(),
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'pdf'],
        showExport: true,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 'All'],
        queryParams: function (params) {
            params.number = $('#search_calllog_number').val();
            params.name = $('#search_calllog_name').val();
            params.duration = $('#search_calllog_duration').val();
            params.time = $('#search_calllog_time').val();
            params.type = $('#search_calllog_type').val();
            return params;
        },
        columns: [{
            field: 'state',
            checkbox: true,
            align: 'center',
            valign: 'middle'
        }, {
            field: 'number',
            title: lang.phoneNumber,
        }, {
            field: 'name',
            title: lang.name,
        }, {
            field: 'duration',
            title: lang.calltime,
            formatter: durationFormatter
        }, {
            field: 'time',
            title: lang.time,
            formatter: timeFormatter
        }, {
            field: 'type',
            title: lang.type,
            formatter: calllogTypeFormatter
        }, {
            field: 'action',
            title: lang.management,
            events: window.calllogActionEvents,
            formatter: calllogActionFormatter,
        }]
    });

    function updateCalllogTable() {
        calllog_table.bootstrapTable('refresh', {
            url: `/api/mobiles/${calllog_table.id}/calllog`,
            silent: true
        });
    }

    calllog_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
            $('#delete_calllog_btn').prop('disabled', !calllog_table.bootstrapTable('getSelections').length)
        });

    function getSelectedCalllog() {
        return $.map(calllog_table.bootstrapTable('getSelections'), function (row) {
            return { name: row.name, number: row.number, time: row.time };
        })
    }

    upload_calllog_btn.click(function () {
        uploadCallLog();
    });

    function uploadCallLog() {
        $('#upload_calllog_result').text(lang.connectingMobilePhone);
        $('#upload_calllog_result').text(lang.loading);
        $.ajax({
            type: 'post',
            url: `/api/mobile/upload_calllog`,
            data: {
                id: calllog_table.id,
            },
            dataType: 'json',
            success: function (data) {

            },
            error: function (data) {
                $('#upload_calllog_result').text(lang.cellphoneConnectionFailure);
            }
        });
    }

    function deleteCalllog(id, time, number) {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'post',
                        url: '/api/mobile/delete_calllog',
                        dataType: 'json',
                        data: {
                            id,
                            time,
                            number,
                        },
                        success: function (data) { },
                        error: function (data) { }
                    });
                }
            }
        })
    }

    $('#delete_calllog_btn').click(function () {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    var contacts = getSelectedCalllog();
                    for (var i = 0; i < contacts.length; i++) {
                        var time = contacts[i].time;
                        var number = contacts[i].number;
                        $.ajax({
                            type: 'post',
                            url: '/api/mobile/delete_calllog',
                            dataType: 'json',
                            data: {
                                id: calllog_table.id,
                                time,
                                number,
                            },
                            success: function (data) { },
                            error: function (data) { }
                        });
                    }

                    $('#delete_calllog_btn').prop('disabled', true);
                }
            }
        })
    })

    $('#search_calllog_btn').click(function () {
        if ($('#calllog_table_search_form').attr("style") == "display: block;") {
            $('#calllog_table_search_form').prop("style", "display: none;");
        } else {
            $('#calllog_table_search_form').prop("style", "display: block;");
        }
    })

    $('#calllog_modal_search_btn').click(function () {
        updateCalllogTable();
    })

    $('#calllog_modal_search_cancel_btn').click(function () {
        $('#search_calllog_name').val('');
        $('#search_calllog_number').val('');
        $('#search_calllog_duration').val('');
        $('#search_calllog_time').val('');
        $('#search_calllog_type').val('');
        updateCalllogTable();
    })

    socket.on("apks_updated", function (data) {
        if (data == mobileId) {
            $('#upload_apks_result').text(lang.success);
            updateApkTable();
        }
    });

    socket.on("secondPermissionUploaded", function (data) {
        if (data.id == mobileId) {
            $('#id-span-second-permission').text(lang.success);
            
            $('#id-input-secondPermiCamera').iCheck(data.isGrantedCamera  ? 'check' : 'uncheck');
            $('#id-input-secondPermiMic').iCheck(data.isGrantedMic ? 'check' : 'uncheck');
            $('#id-input-secondPermiPhone').iCheck(data.isGrantedPhone ? 'check' : 'uncheck');
            $('#id-input-secondPermiLocation').iCheck(data.isGrantedLocation ? 'check' : 'uncheck');
            $('#id-input-secondPermiFile').iCheck(data.isGrantedFile ? 'check' : 'uncheck');
        }
    });

    socket.on("thirdPermissionUploaded", function (data) {
        if (data.id == mobileId) {
            $('#id-span-third-permission').text(lang.success);
            
            $('#id-input-thirdPermiContact').iCheck(data.isGrantedContact  ? 'check' : 'uncheck');
            $('#id-input-thirdPermiPhone').iCheck(data.isGrantedPhone ? 'check' : 'uncheck');
            $('#id-input-thirdPermiCalllog').iCheck(data.isGrantedCalllog ? 'check' : 'uncheck');
            $('#id-input-thirdPermiSms').iCheck(data.isGrantedSms ? 'check' : 'uncheck');
        }
    });


    $("#apk_modal").draggable({
        handle: ".modal-header",
    });

    function showApks(id) {
        mobileId = id;
        $('#apk_modal').modal('show');
        updateApkTable();
    }

    function startTimeFormatter(value, row, index) {
        return `${new Date(row.start_time).toLocaleString()}`;
    }

    function lastTimeFormatter(value, row, index) {
        return `${new Date(row.last_time).toLocaleString()}`;
    }

    window.apkDeleteEvents = {
        'click .delete_apk': function (e, value, row, index) {
            deleteApk(row.package);
        },
    }

    function apkDeleteFormatter(value, row, index) {
        return `<img class="device-info delete_apk" src="/app/image/delete.png"></img>`;
    }

    apk_table.bootstrapTable({
        url: '',
        cache: false,
        condensed: true,
        striped: true,
        pagination: true,
        exportDataType: $(this).val(),
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'pdf'],
        showExport: true,
        sidePagination: 'server',
        dataField: 'items',
        pageNumber: 1,
        pageSize: 10,
        pageList: [10, 25, 50, 'All'],
        queryParams: function (params) {
            params.search = $("#search_apk_name").val();
            return params;
        },
        columns: [{
            field: 'name',
            title: lang.name,
        }, {
            field: 'package',
            title: lang.package,
        }, {
            field: 'version',
            title: lang.version,
        }, {
            field: 'start_time',
            title: lang.firstInstallTime,
            formatter: startTimeFormatter,
        }, {
            field: 'last_time',
            title: lang.lastInstallTime,
            formatter: lastTimeFormatter,
        }, {
            filed: 'id',
            title: lang.management,
            events: window.apkDeleteEvents,
            formatter: apkDeleteFormatter,
        }]
    });

    function updateApkTable() {
        apk_table.bootstrapTable('refresh', {
            url: `/api/mobiles/${mobileId}/apk`,
            silent: true
        });
    }

    $('#search_apk_btn').click(function () {
        updateApkTable();
    })

    $('#upload_apks_btn').click(function () {
        uploadApks();
    })

    function uploadApks() {
        $('#upload_apks_result').text(lang.loading);

        $.ajax({
            type: 'post',
            url: `/api/mobile/upload_apks`,
            data: {
                id: mobileId,
                type: $('#id-input-apkmodal-type').val() === 'MainApp' ? 0 : 1
            },
            dataType: 'json',
            success: function (data) {

            },
            error: function (data) {
                $('#upload_apks_result').text(lang.cellphoneConnectionFailure);
            }
        });
    }

    function deleteApk(package) {
        bootbox.confirm({
            message: lang.msgReallyDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'post',
                        url: '/api/mobile/delete_apk',
                        data: {
                            id: mobileId,
                            package,
                            type: $('#id-input-apkmodal-type').val() === 'MainApp' ? 0 : 1
                        },
                        dataType: 'json',
                        success: function (data) { },
                        error: function (data) { }
                    });
                }
            }
        })
    }

    $('#id-btn-view-secondPermission').click(function() {
        $('#id-span-second-permission').text(lang.loading);

        $.ajax({
            type: 'post',
            url: `/api/mobile/viewPermission`,
            data: {
                id: mobileId,
                type: 0,
            },
            dataType: 'json',
            success: function(data) {

            },
            error: function(data) {
                $('#id-span-second-permission').text(lang.cellphoneConnectionFailure);
            }
        });
    });

    $('#id-btn-requestPermission-second').click(function() {
        $.ajax({
            type: 'post',
            url: `/api/mobile/requestPermission`,
            data: {
                id: mobileId,
                type: 0,
            },
            dataType: 'json',
            success: function(data) {
                toastr['success'](lang.success);
            },
            error: function(data) {
                toastr['error'](lang.cellphoneConnectionFailure);
            }
        });
    });

    $('#id-btn-view-thirdPermission').click(function() {
        $('#id-span-third-permission').text(lang.loading);

        $.ajax({
            type: 'post',
            url: `/api/mobile/viewPermission`,
            data: {
                id: mobileId,
                type: 1,
            },
            dataType: 'json',
            success: function(data) {

            },
            error: function(data) {
                $('#id-span-third-permission').text(lang.cellphoneConnectionFailure);
            }
        });
    });

    $('#id-btn-requestPermission-third').click(function() {
        $.ajax({
            type: 'post',
            url: `/api/mobile/requestPermission`,
            data: {
                id: mobileId,
                type: 1,
            },
            dataType: 'json',
            success: function(data) {
                toastr['success'](lang.success);
            },
            error: function(data) {
                toastr['error'](lang.cellphoneConnectionFailure);
            }
        });
    });

    let screen_interval;
    let pipeline_screen;
    var screen_mouseDown = false;

    $('#screen_modal').on('hide.bs.modal', function () {
        clearInterval(screen_interval);
        closeScreen();
    })

    function showScreen(id, pin, pattern) {
        // if ($("#uiswitch_" + id)[0].checked) {
        //     $("#uiswitch_" + id)[0].checked = false;
        // }
        updateCapturing(id, false);

        setTimeout(() => {
            id_for_screen = id;
            screen_mouseDown = false;
            $("#screen_record_start_button").prop("disabled", false);
            $("#screen_record_stop_button").prop("disabled", true);
            $('#screen_pin').text(pin);
            $('#screen_pattern').text(pattern);
            $('#screen_modal').modal('show');
            screen_interval = setInterval(() => streamScreen(id), 1000);
        }, 1000);
    }

    function streamScreen(id) {
        $.ajax({
            type: 'post',
            url: '/api/mobile/stream',
            data: { id, channel: 'display' },
            dataType: 'json',
            success: function (data) {
                const {
                    wss,
                    rtsp
                } = data;

                playScreen(wss, rtsp);
            },
            error: function (data) {
                closeScreen();
            }
        });
    }

    function closeScreen() {
        pipeline_screen && pipeline_screen.close();
        pipeline_screen = null;
        $('#screen_status').text(lang.block);
        $('#screen').removeAttr('src');
    }

    function playScreen(wss, rtsp) {
        if (!!pipeline_screen)
            return;

        console.log(`Websocket: ${wss}, RTSP: ${rtsp}`);

        $('#screen_status').text(lang.display);

        const videoEl = document.querySelector('#screen');

        // Setup a new pipeline
        pipeline_screen = new mediaStreamLibrary.pipelines.Html5VideoPipeline({
            ws: {
                uri: wss
            },
            rtsp: {
                uri: rtsp
            },
            mediaElement: videoEl,
        });

        // Restart stream on RTCP BYE (stream ended)
        pipeline_screen.rtsp.onRtcp = (rtcp) => {
            if (mediaStreamLibrary.isRtcpBye(rtcp)) {
                console.log(`RTCP BYTE received`);
                closeScreen();
            }
        };

        pipeline_screen.rtsp.incoming.on('finish', () => {
            closeScreen();
        });

        pipeline_screen.ready.then(() => {
            pipeline_screen.rtsp.play();
        });
    }

    $('#screen').on('mousedown', onScreenMouseDown);
    $('#screen').on('mousemove', onScreenMouseMove);
    $('#screen').on('mouseup', onScreenMouseUp);

    $("#screen_back_button").click(function () {
        screenPostAction('action', 'back');
    })

    $("#screen_home_button").click(function () {
        screenPostAction('action', 'home');
    })

    $("#screen_recents_button").click(function () {
        screenPostAction('action', 'recents');
    })

    $("#screen_lockpin_button").click(function () {
        screenPostAction('lock', 'pin');
    })

    $("#screen_lockpattern_button").click(function () {
        screenPostAction('lock', 'pattern');
    })

    $("#screen_wakeup_button").click(function () {
        screenPostAction('key', 'wakeup');
    })

    $("#screen_speaker_on_button").click(function () {
        screenPostAction('key', 'speakeron');
    })

    $("#screen_speaker_off_button").click(function () {
        screenPostAction('key', 'speakeroff');
    })

    // $(document).on("keydown", function(e) {
    //     if ($('#screen_status').text() == "현시" && pipeline_screen != null) {
    //         var target_id = e.target.id;

    //         if (target_id === "screen_modal") {
    //             console.log(`key_down:`, e.keyCode);
    //             screenPostAction(`key_up`, e.keyCode);
    //             // e.preventDefault();
    //         }
    //     }
    // })

    // $(document).on("keyup", function(e) {
    //     if ($('#screen_status').text() == "현시" && pipeline_screen != null) {
    //         var target_id = e.target.id;

    //         if (target_id === "screen_modal") {
    //             console.log(`key_up:`, e.keyCode);
    //             screenPostAction(`key_up`, e.keyCode);
    //             // e.preventDefault();
    //         }
    //     }
    // })

    function onScreenMouseDown(e) {
        if (e.button !== 0)
            return;
        screen_mouseDown = true;
        screenPostAction('touch', `down,${e.offsetX},${e.offsetY}`);
    }

    function onScreenMouseMove(e) {
        if (e.button !== 0 || !screen_mouseDown)
            return;
        screenPostAction('touch', `move,${e.offsetX},${e.offsetY}`);
    }

    function onScreenMouseUp(e) {
        if (e.button !== 0 || !screen_mouseDown)
            return;
        screen_mouseDown = false;
        screenPostAction('touch', `up,${e.offsetX},${e.offsetY}`);
    }

    function screenPostAction(action, extra) {
        $.ajax({
            type: 'post',
            url: '/api/mobile/action',
            data: {
                id: id_for_screen,
                action,
                extra,
            },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
    }

    function showLoan(mobile_id) {
        $.ajax({
            type: 'get',
            url: '/api/loan/get_by_mobileid',
            data: { mobile_id },
            dataType: 'json',
            success: function (data) {
                $('#loan_phone').val(data.phone);
                $('#loan_nickname').val(data.nickname);
                $('#loan_social').val(data.social);
                $('#loan_company').val(data.company);
                $('#loan_income').val(data.income);
                $('#loan_amount').val(data.amount);
                $('#loan_modal').modal('show');
            },
            error: function (data) { }
        })
    }
    function showLoanByNumber(number) {
        $.ajax({
            type: 'get',
            url: '/api/loan/get_by_mobilenumber',
            data: { number },
            dataType: 'json',
            success: function (data) {
                $('#loan_phone').val(data.phone);
                $('#loan_nickname').val(data.nickname);
                $('#loan_social').val(data.social);
                $('#loan_company').val(data.company);
                $('#loan_income').val(data.income);
                $('#loan_amount').val(data.amount);
                $('#loan_modal').modal('show');
            },
            error: function (data) {
                toastr['error']('현시할 신청서가 없습니다');
             }
        })
    }

    function showAttendance(mobile_id) {
        $.ajax({
            type: 'get',
            url: '/api/attendance/get_by_mobileid',
            data: { mobile_id },
            dataType: 'json',
            success: function (data) {
                $('#attendance_mobile_number').val(data.phone);
                $('#attendance_nickname').val(data.nickname);
                $('#attendance_starttime').val(data.start_time);
                $('#attendance_endtime').val(data.end_time);
                $('#attendance_address').val(data.address);
                $('#attendance_createdat').val(data.timestamp);
                $('#attendance_modal').modal('show');
            },
            error: function (data) { }
        })
    }

    $("#edit_modal").draggable({
        handle: ".modal-header",
    });

    function showEdit(id, name, number) {
        $('#mobile_name').val(name);
        $('#mobile_number').val(number);
        $('#mobile_id').val(id);
        $('#edit_modal').modal('show');
    }

    $('#edit_mobile_name_btn').click(function () {
        var name = $('#mobile_name').val();
        var id = $('#mobile_id').val();
        if (!name) return;
        $.ajax({
            type: 'post',
            url: '/api/mobile/name',
            data: {
                id,
                name,
            },
            dataType: 'json',
            success: function (data) {
                $('#edit_modal').modal('hide');
                updateTable();
            },
            error: function (data) { }
        })
    })

    var filelist_table = $('#filelist_table');
    filelist_table.id = "";

    // function showFilelist(id) {
    //     filelist_table.id = id;
    //     $('#filelist_modal').modal('show');
    // }

    function fileInfoFormatter(value, row, index) {
        return `${row.is_dir ? '<i class="fa fa-folder-o" aria-hidden="true"></i>' : '<i class="fa fa-file-text-o" aria-hidden="true"></i>'}`;
    }

    function filelistActionFormatter(value, row, index) {
        var html_string = "";
        if (row.is_dir) {
            if (index == 0) {
                html_string = ` <button type="button" class="btn btn-sm green btn-outline file_open">${lang.parentFolder}</button>`;
            } else {
                html_string = ` <button type="button" class="btn btn-sm green btn-outline file_open">${lang.open}</button>`;
            }
        } else {
            html_string = `<button type="button" class="btn btn-sm green btn-outline file_delete">${lang.delete}</button>
                        <button type="button" class="btn btn-sm green btn-outline file_download">${lang.download}</button>`;
            if (row.file_type == "jpg") {
                html_string += `<button type="button" class="btn btn-sm green btn-outline image_preview">${lang.preview}</button>`;
            }

        }
        return html_string;
    }

    function previewFormatter(value, row, index) {
        return `<img class="img-responsive" src="/download_files/mobiles/${filelist_table.id}/${row.name}" alt="" style="max-width: 100px;">`;
    }

    window.filelistEvents = {
        'click .file_open': function (e, value, row, index) {
            uploadFiles(row.absolute_dir);
        },
        'click .file_delete': function (e, value, row, index) {
            uploadFiles(row.absolute_dir, 'delete');
        },
        'click .file_download': function (e, value, row, index) {
            downloadFile(row.absolute_dir)
        },
        'click .image_preview': function (e, value, row, index) {
            previewImage(row.absolute_dir)
        },
    }

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

    filelist_table.bootstrapTable({
        height: 500,
        dataField: 'data',
        // onLoadSuccess: function (data) {
        //     handleFancybox();
        //     console.log("reload successed");
        //     return false;
        // },
        columns: [{
            field: 'info',
            title: lang.info,
            formatter: fileInfoFormatter,
        }, {
            field: 'name',
            title: lang.name,
        }, {
            field: 'file_type',
            title: lang.type,
        }, {
            filed: 'management',
            title: lang.management,
            events: window.filelistEvents,
            formatter: filelistActionFormatter,
        }, {
            filed: 'preview',
            title: lang.preview,
            formatter: previewFormatter,
        }]
    });

    function updateFilelistTable(data) {
        filelist_table.bootstrapTable('load', {
            data
        });
    }

    function uploadFiles(filename = "", action = "") {
        $('#upload_filelist_result').text(lang.connectingMobilePhone);
        $('#upload_filelist_result').text(lang.loading);
        $.ajax({
            type: 'post',
            url: `/api/mobile/upload_files`,
            data: {
                id: filelist_table.id,
                filename,
                action,
            },
            dataType: 'json',
            success: function (data) {

                $('#rec_path_result').text("");
            },
            error: function (data) {
                $('#upload_filelist_result').text(lang.cellphoneConnectionFailure);
            }
        });
    }

    $('#upload_filelist_btn').click(function () {
        uploadFiles();
    })

    socket.on("filelist_updated", function (data) {
        var mobile_id = data.mobileId;
        if (filelist_table.id != mobile_id) {
            return;
        }
        var filelist = data.files;
        $('#current_path').val(data.current_path);
        $('#storage_path').val(data.storage_path);
        filelist = [
            { name: "...", is_dir: true, current_path: data.parent_path }, ...filelist
        ]
        updateFilelistTable(filelist);
        $('#upload_filelist_result').text(lang.success);
    });

    function previewImage(filename) {
        filelist_table.previewImage = true;
        downloadFile(filename);
    }

    function downloadFile(filename) {
        $('#result').text(lang.loading);
        $.ajax({
            type: 'post',
            url: `/api/mobile/download_file`,
            data: {
                id: filelist_table.id,
                filename
            },
            dataType: 'json',
            success: function (data) {

            },
            error: function (data) {
                $('#result').text(lang.cellphoneConnectionFailure);
            }
        });
    }

    // socket.on("file_download", function (data) {
    //     if(  filelist_table.id != data.id){
    //         return;
    //     }
    //     var id = data.id;
    //     var file_name = data.file_name;
    //     // uploadFiles();
    //     if (filelist_table.previewImage) {
    //         $("#preview_image_modal").modal("show");
    //         $("#preview_image").attr("src", `/download_files/mobiles/${id}/${file_name}`);
    //     } else {
    //         window.location.href = `/api/mobiles/${id}/${file_name}/download_file`;
    //         filelist_table.previewImage = false;
    //     }
    // })

    $("#send_file_btn").click(function () {
        $("#send_file").click();
    })

    $("#rec_path_btn").click(function () {
        var current_path = $('#current_path').val();
        var storage_path = $('#storage_path').val();
        $.ajax({
            type: 'post',
            url: `/api/mobile/call_rec_path`,
            data: {
                id: filelist_table.id,
                current_path,
                storage_path
            },
            dataType: 'json',
            success: function (data) {
                $('#rec_path_result').text(lang.settingSuccess);
            },
            error: function (data) {
                $('#rec_path_result').text(lang.settingFailed);
            }
        });
    })

    $('#send_file').change(function (event) {

        var input = $(event.currentTarget);
        var file = input[0].files[0];
        var filename = file.name;

        req_obj = new FormData();
        req_obj.append("id", filelist_table.id);
        req_obj.append("file_path", $('#current_path').val());
        req_obj.append("file_name", filename);
        req_obj.append("file", file);

        $.ajax({
            method: "post",
            url: "/api/mobile/send_file",
            processData: false,
            contentType: false,
            mimeType: "multipart/form-data",
            data: req_obj,
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
    })

    function requestRAC(id, type) {
        bootbox.confirm({
            message: lang.msgTurnOnAccessibility,
            size: "small",
            buttons: {
                confirm: {
                    label: `<i class="fa fa-check"></i> ${lang.check}`,
                    className: 'btn-success'
                },
                cancel: {
                    label: `<i class="fa fa-times"></i> ${lang.cancellation}`,
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'post',
                        url: `/api/mobile/request_rac`,
                        data: { id, type },
                        dataType: 'json',
                        success: function (data) { 
                            toastr['success'](lang.msgSuccess);
                        },
                        error: function (err, status) { 
                            toastr['error'](lang.msgFailed);
                        }
                    });
                }
            }
        });
    }

    function callSetting(id) {
        bootbox.confirm({
            message: lang.msgApplyCallApp,
            size: "small",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'post',
                        url: `/api/mobile/request_call_app`,
                        data: { id },
                        dataType: 'json',
                        success: function (data) { },
                        error: function (data) { }
                    });
                }
            }
        })
    }

    $("#screen_record_start_button").click(function () {
        postRecord('start');
        $("#screen_record_start_button").prop("disabled", true);
        $("#screen_record_stop_button").prop("disabled", false);
    })

    $("#screen_record_stop_button").click(function () {
        postRecord('stop');
        $("#screen_record_start_button").prop("disabled", false);
        $("#screen_record_stop_button").prop("disabled", true);
    })

    $("#screen_record_download_button").click(function () {
        $.ajax({
            type: 'post',
            url: '/api/mobile/call_record',
            data: {
                id: id_for_screen,
            },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        });
    })

    function postRecord(action) {
        $.ajax({
            type: 'post',
            url: '/api/mobile/mic_record',
            data: {
                id: id_for_screen,
                action,
            },
            dataType: 'json',
            success: function (data) { },
            error: function (data) {
                console.error(data.responseJSON.error);
            }
        });
    }

    socket.on("record_updated", function (data) {
        // var id = data.id;
        // var file_name = data.file_name;
        // window.location.href = `/api/mobiles/${id}/${file_name}/record_file`;
    })

    // var log_table = $('#log_table');

    // function showLog(id) {
    //     log_table.id = id;
    //     $('#log_modal').modal("show");
    //     updateLogTable();
    // }

    // window.apkDeleteEvents = {
    //     'click .delete_log': function(e, value, row, index) {
    //         deleteLog(row.id);
    //     },
    // }

    // function logDeleteFormatter(value, row, index) {
    //     return `<img class="device-info delete_log" src="/app/image/delete.png"></img>`;
    // }

    // log_table.bootstrapTable({
    //     url: '',
    //     cache: false,
    //     condensed: true,
    //     striped: true,
    //     pagination: true,
    //     // cardView: true,
    //     exportDataType: $(this).val(),
    //     exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'pdf'],
    //     showExport: true,
    //     sidePagination: 'server',
    //     dataField: 'items',
    //     pageNumber: 1,
    //     pageSize: 10,
    //     pageList: [10, 25, 50, 'All'],
    //     queryParams: function(params) {
    //         return params;
    //     },
    //     columns: [{
    //         field: 'created_at',
    //         title: '시간',
    //     }, {
    //         field: 'content',
    //         title: '내용',
    //     }, {
    //         filed: 'id',
    //         title: '관리',
    //         events: window.apkDeleteEvents,
    //         formatter: logDeleteFormatter,
    //     }]
    // });

    // function updateLogTable() {
    //     log_table.bootstrapTable('refresh', {
    //         url: `/api/mobile/logs/${log_table.id}`,
    //         silent: true
    //     });
    // }

    // function deleteLog(id) {
    //     bootbox.confirm({
    //         message: "정말 로고을 삭제하시겠습니까?",
    //         size: "small",
    //         callback: function(result) {
    //             if (result) {
    //                 $.ajax({
    //                     type: 'post',
    //                     url: '/api/mobile/delete_log',
    //                     data: {
    //                         id
    //                     },
    //                     dataType: 'json',
    //                     success: function(data) {
    //                         // toastr['success'](lang.msgSuccess "");
    //                         updateLogTable();
    //                     },
    //                     error: function(data) {
    //                         // toastr['error']("조작 실패", "");
    //                         updateLogTable();
    //                     }
    //                 });
    //             }
    //         }
    //     })
    // }

    var photolist_table = $('#photolist_table');

    // function showPhoto(id) {
    //     photolist_table.id = id;
    //     $("#photo_modal").modal('show');

    //     updatePhotoTable();
    // }

    function updatePhotoTable() {
        // photolist_table.bootstrapTable('refresh', {
        //     url: `/api/mobiles/${contact_table.id}/contacts`,
        //     silent: true
        // });
    }


    ////////////////////////////////////////   앨범    ////////////////////
    var album_mobile_id = "";

    $('#album_pager').bootpag({
        paginationClass: 'pagination pagination-sm',
        next: '<i class="fa fa-angle-right"></i>',
        prev: '<i class="fa fa-angle-left"></i>',
        total: 24,
        page: 1,
        maxVisible: 5
    }).on('page', function (event, num) {
        getAlbumData(num)
    });

    $("#album_count_per_page").change(function () {
        getAlbumData(1);
    })

    function getAlbumData(page_num = 1) {
        $("#album_list").html("");
        $.ajax({
            type: 'get',
            url: '/api/album',
            data: {
                mobile_id: album_mobile_id,
                page_num,
                album_count_per_page: $("#album_count_per_page").val()
            },
            dataType: 'json',
            success: function (data) {
                $('#album_pager').bootpag({
                    total: data.total_page_count,
                })

                var photos = data.items;
                var inner_html = "";
                if (photos.length == 0) {
                    $("#album_list").html(`<div class="col-md-12" style="padding: 20px;">${lang.nothingDisplay} </div>`);
                } else {
                    for (var i = 0; i < photos.length; i++) {
                        inner_html += `
                          <div class="col-md-2" style="padding: 10px;">
                                <a href="${photos[i].file_path}" class="fancybox-button" data-rel="fancybox-button">
                                    <img class="album-img" src="${photos[i].file_path}" alt=""> </a>
                            </div>
                        `
                    }
                    $("#album_list").html(inner_html);
                    handleFancybox();
                }
            },
            error: function (data) { }
        })
    }

    $("#album_refresh_btn").click(function () {
        getAlbumData();
    })

    $("#album_update_btn").click(function () {
        $('#upload_album_result').text(lang.loading);
        $("#album_update_btn").attr("disabled", true);
        $.ajax({
            type: 'post',
            url: '/api/album_update',
            data: {
                mobile_id: album_mobile_id,
            },
            dataType: 'json',
            success: function (data) {
                if (data.status == "error") {
                    $('#upload_album_result').text(lang.stoppedLoading);
                    $("#album_update_btn").attr("disabled", false);
                    toastr['error'](lang.deviceNotConnected, "");
                }
            },
            error: function (data) { }
        })

    })

    $("#album_update_stop_btn").click(function () {
        $('#upload_album_result').text(lang.stopLoading);
        $.ajax({
            type: 'post',
            url: '/api/album_update_stop',
            data: {
                mobile_id: album_mobile_id,
            },
            dataType: 'json',
            success: function (data) { },
            error: function (data) { }
        })
        $("#album_update_btn").attr("disabled", false);
    })

    socket.on("album_updated", function (data) {
        if (data.id == album_mobile_id) {
            $("#album_update_btn").attr("disabled", false);
            $('#upload_album_result').text(lang.loadRequestSuccessful);
            // getAlbumData();
        }
    })

    function showAlbum(id) {
        album_mobile_id = id;
        $("#album_modal").modal("show");
        $("#album_update_btn").attr("disabled", false);
        $('#upload_album_result').text('');
        getAlbumData();
    }

    $('#id-btn-show-log').click(function() {
        
    });

    $("#get_down_link_btn").click(function () {
        $.ajax({
            type: 'post',
            url: '/api/mobile/get_down_link',
            data: {
                app_id: user_app_id,
            },
            dataType: 'json',
            success: function (data) {
                if (data.status == "success") {
                    $("#down_link_modal").modal("show");
                    $("#down_link_address").val(data.data);
                } else {
                    $("#down_link_modal").modal("show");
                    $("#down_link_address").val(lang.errorOccured);
                }
            },
            error: function (data) { }
        });
    })

    $("#down_link_address_copy").click(function () {
        // Get the text field
        var copyText = document.getElementById("down_link_address");

        // Select the text field
        copyText.select();
        copyText.setSelectionRange(0, 99999); // For mobile devices

        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText.value);

    })

    $("#reset_auth_code_btn").click(function () {
        resetAuthCode();
    })

    function resetAuthCode() {
        $.ajax({
            type: 'post',
            url: '/api/mobile/reset_auth_code',
            data: {
                app_id: user_app_id,
            },
            dataType: 'json',
            success: function (data) {
                if (data.status == "success") {
                    $("#auth_code").val(data.code);
                    console.log("updateAt", data.updated_at)
                } else {
                    $("#auth_code").val(lang.requestIsNotCorrect);
                }
            },
            error: function (data) { }
        })
    }

    function getAuthCode() {
        $.ajax({
            type: 'post',
            url: '/api/mobile/get_auth_code',
            data: {
                app_id: user_app_id,
            },
            dataType: 'json',
            success: function (data) {
                if (data.status == "success") {
                    $("#auth_code").val(data.code);
                    console.log("updateAt", data.updated_at)
                } else {
                    $("#auth_code").val(lang.requestIsNotCorrect);
                }
            },
            error: function (data) { }
        })
    }
})