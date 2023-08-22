$(function() {
    InitHoriBar();
    InitAppIdSelTag();

    function InitHoriBar() {
        $('.menu-11').addClass('active');
        $('.main-menu-00').addClass('active open');
    }

    function InitAppIdSelTag(app_id = '') {
        $("#app_id").html('');
        if ($('#roles').val() == 'maezhang')
            $.get("/api/appid", {}, function(res) {
                var data = res.items;
                var htmlString = ``;
                for (var i = 0; i < data.length; i++) {
                    var disabled = false;
                    var color = 'aliceblue';
                    if (data[i].is_exist_avatar) disabled = true;
                    if (data[i].app_id == app_id) {
                        disabled = false;
                        color = 'bisque';
                    }
                    htmlString += `
                        <option value='${data[i].app_id}' ${data[i].is_exist_avatar ? 'style="background: ' + color + ';"' : ''} ${disabled ? 'disabled' : ''}>
                            ${data[i].app_id}
                        </option>`;
                }
                $("#app_id").html(htmlString);
                $("#app_id").val(app_id);
            });
    }

    $('#roles').change(function() {
        InitAppIdSelTag();
    })

    var handleFancybox = function() {
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

    var base_url = "/api/avatar";
    var avatar_table = $('#avatar_table');
    var add_btn = $('#add_btn');
    var req_obj = {};
    var req_type = "POST";

    function getIdSelections() {
        return $.map(avatar_table.bootstrapTable('getSelections'), function(row) {
            return row.id
        });
    }

    window.operateEvents = {
        'click .edit': function(e, value, row, index) {
            editItem(row);
        }
    }

    function operateFormatter(value, row, index) {
        return ` <img class="device-info edit" src="/app/image/edit_item.png"></img>`;
    }

    function timestampFormatter(value, row, index) {
        return `${new Date(row.timestamp).toLocaleString()}`;
    }

    function avatarFormatter(value, row, index) {
        return `<a href="/avatar/${row.avatar}" class="fancybox-button" data-rel="fancybox-button">
        <img class="img-responsive" src="/avatar/${row.avatar}" alt="" style="max-width: 100px;"> </a>`;
    }

    function updateTable() {
        avatar_table.bootstrapTable('refresh', {
            url: base_url,
            silent: true
        });
    }

    avatar_table.bootstrapTable({
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
        pageSize: 15,
        pageList: [15, 25, 50, 100],
        queryParams: function(params) {
            return params;
        },
        onLoadSuccess: function(data) {
            handleFancybox();
            return false;
        },
        columns: [{
            field: 'app_id',
            title: '업체',
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle'
        }, {
            field: 'id_card',
            title: '아바타',
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle',
            formatter: avatarFormatter
        }, {
            field: 'timestamp',
            title: '수정시간',
            cellStyle: { css: { 'white-space': 'nowrap' } },
            align: 'center',
            valign: 'middle',
            formatter: timestampFormatter
        }, {
            field: 'operate',
            title: '조작',
            align: 'center',
            valign: 'middle',
            cellStyle: { css: { 'white-space': 'nowrap' } },
            clickToSelect: false,
            events: window.operateEvents,
            formatter: operateFormatter
        }]
    });

    avatar_table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function() {
            remove.prop('disabled', !avatar_table.bootstrapTable('getSelections').length)
            selections = getIdSelections();
        });

    add_btn.click(function() {
        req_type = "POST";
        $("#preview_img").attr("src", "");
        $('#roles').val("");
        InitAppIdSelTag();
        $('#create_modal').modal("show");
    })

    $('#img_file_btn').click(function() {
        $("#avatar_img").click();
    })

    $('#avatar_img').change(function(event) {
        console.log($("#avatar_img")[0].files[0].name);
        if (!($("#avatar_img")[0].files[0].name.toLocaleLowerCase().includes(".png") || $("#avatar_img")[0].files[0].name.toLocaleLowerCase().includes(".jpg"))) {
            swal("이미지 파일를 선택하세요!");
        }
        var input = $(event.currentTarget);
        var file = input[0].files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            image_base64 = e.target.result;
            $("#preview_img").attr("src", image_base64);
        };
        reader.readAsDataURL(file);
    })

    $("#btn_apply").click(function() {
        if (Validation()) {
            SendRequest();
        }
    })

    function Validation() {
        if ($("#app_id").val() == "") {
            swal("앱 아이디를  선택하세요!");
            $("#app_id").focus();
            return false;
        }
        if ($("#avatar_img")[0].files.length == 0) {
            swal("이미지를 선택하세요!");
            return false;
        }

        if (!($("#avatar_img")[0].files[0].name.toLocaleLowerCase().includes(".png") || $("#avatar_img")[0].files[0].name.toLocaleLowerCase().includes(".jpg"))) {
            swal("이미지 파일를 선택하세요!");
            return;
        }

        req_obj = new FormData();

        req_obj.append("roles", $("#roles").val());
        if ($("#roles").val() === "chongpan") {
            req_obj.append("app_id", $("#roles").val());
        } else {
            req_obj.append("app_id", $("#app_id").val());
        }

        if ($("#avatar_img")[0].files.length > 0) {
            req_obj.append("file", $("#avatar_img")[0].files[0]);
        }
        return true;
    }

    function SendRequest() {
        $.ajax({
            type: req_type,
            url: "/api/avatar",
            processData: false,
            contentType: false,
            data: req_obj,
            cache: false,
            dataType: 'json',
            success: function(data) {
                toastr['success']("성공적인 조작", "");
                $("#create_modal").modal("hide");
                updateTable();
            },
            error: function(data) {
                toastr['error']("네트워크오류가 발생하였습니다.\n 로그를 확인해 주세요", "");
            }
        });
    }

    function editItem(data) {
        // req_type = "PUT";
        $("#create_modal").modal("show");
        $("#btn-apply").html("완 료");
        $('#type').html("수정");
        $("#avatar_id").val(data.id);

        $('#roles').val(data.roles);
        InitAppIdSelTag(data.app_id);
        $("#preview_img").attr("src", "/avatar/" + data.avatar);
    }

})