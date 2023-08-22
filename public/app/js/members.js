$(function () {
    var baseUrl = '/api/members';

    loadMembers();

    function loadMembers() {
        $.ajax({
            type: 'get',
            url: `${baseUrl}`,
            dataType: 'json',
            success: function(res) {
                showMembers(res);
            },
            error: function(data) {
                toastr['warning'](lang.msgFailedLoadingMembers, '');
            }
        });
    }

    function showMembers(res) {
        const maezhangs = res.maezhangs;
        const members = res.members;

        let data = [];
        $.each(maezhangs, function(idx, value) {
            data.push({
                 "id" : value.name, "parent" : "#", "text" : value.name.replace('maezhang', lang.maezhang), 
            });
        });

        $.each(members, function(idx, value) {
            data.push({
                 "id" : value.id, "parent" : value.appId, "text" : `<label>${lang.name}: ${value.username}&emsp;</label>
                    <label>${lang.id}: ${value.loginid}&emsp;</label>
                    <label>${lang.offDuty}: ${value.passwordStr}&emsp;</label>
                    <label>${lang.address}: ${value.address}&emsp;</label>
                    <img class="device-info copy" src="/app/image/dialer.png"></img>
                    <img class="device-info edit" src="/app/image/edit_item.png"></img>
                    <img class="device-info remove" src="/app/image/delete.png"></img>`
            });
        });
        
        $('#id-tree-members').jstree({
            'core' : {
                'themes' : {
                    "variant" : "large"
                }
            },
            "types" : {
                "default" : {
                    "icon" : "glyphicon glyphicon-user"
                },
            },
            "plugins" : [ "wholerow", "types" ]
        });
        
        $('#id-tree-members').jstree(true).settings.core.data = data;
        $('#id-tree-members').jstree(true).refresh(true);
    }

    $("#id-tree-members").on("click", "li > a > img.copy", function(e) {
        var id = $(this).closest("li").attr("id");
        $.ajax({
            type: 'get',
            url: `${baseUrl}/${id}`,
            dataType: 'json',
            success: function (data) {
                const copyText = lang.name.concat(': ').concat(data.username).concat('\t')
                            .concat(lang.id).concat(': ').concat(data.loginid).concat('\t')
                            .concat(lang.offDuty).concat(': ').concat(data.password).concat('\t')
                            .concat(lang.address).concat(': ').concat(data.address)

                navigator.clipboard.writeText(copyText);

                toastr['info'](lang.msgSuccessCopyMemberInfo, '');
            },
            error: function (data) {
                toastr['error'](lang.msgFailedCopyMemberInfo, '');
            }
        });
    });

    $("#id-tree-members").on("click", "li > a > img.edit", function(e) {
        var id = $(this).closest("li").attr("id");
        $.ajax({
            type: 'get',
            url: `${baseUrl}/${id}`,
            dataType: 'json',
            success: function (data) {
                $("#id").val(data.id);
                $('#username').val(data.username);
                $('#loginid').val(data.loginid);
                $('#password').val(data.password);
                InitAppIdSelTag(data.app_id);
                $('#id-input-permittedip').val(data.address);
                $("#action_btn").text(lang.save);
                $("#action_title").html(lang.correction);
                $('#add_modal').modal('show');
            },
            error: function (data) {
                loadMembers();
            }
        });
    });

    $("#id-tree-members").on("click", "li > a > img.remove", function(e) {
        var id = $(this).closest("li").attr("id");
        bootbox.confirm({
            message: lang.msgDelete,
            size: "small",
            callback: function (result) {
                if (result) {
                    $.ajax({
                        type: 'delete',
                        url: `${baseUrl}/${id}`,
                        dataType: 'json',
                        success: function (data) {
                            loadMembers();
                            toastr['success'](lang.msgSuccess, "");
                        },
                        error: function (data) {
                            loadMembers();
                        }
                    });
                }
            }
        })
    });

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

    $('#add_btn').click(function () {
        $("#id").val('');
        $('#username').val('');
        $('#loginid').val('');
        $('#password').val('');
        $('#id-input-permittedip').val('');
        $("#action_btn").text(lang.check);
        $("#action_title").html(lang.addition);
        $('#add_modal').modal('show');
        InitAppIdSelTag();
    });

    $('#action_btn').click(function () {
        if($('#username').val().trim() == "" || $('#loginid').val().trim() == "" || $('#password').val().trim() == ""
           || $('#id-input-permittedip').val() == "" 
           || $('#app_id').val() == null || $('#app_id').val().trim() == "chongpan") {
            toastr['warning'](lang.msgValidateAll, '');
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
            url = baseUrl;
            saveMember(type, url, data);
        } else {
            type = 'put';
            url = `${baseUrl}/${id}`;
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
                if (data.status == 'error') {
                    toastr['error'](data.msg, "");
                } else {
                    loadMembers();
                    toastr['success'](lang.msgSuccess, "");
                }
                $('#add_modal').modal('hide');
            },
            error: function (data) {
                if(data.responseJSON.msg == 'loginid already exist') 
                    toastr['error'](lang.msgAlreadyExistMember);
                loadMembers();
            }
        });
    }
})