$(function() {
    InitHoriBar();

    function InitHoriBar() {
        $('.menu-09').addClass('active');
    }

    var ars_table = $("#ars_table");

    window.operateEvents = {
        'click .edit': function(e, value, row, index) {
            editItem(row.id);
        },
        'click .remove': function(e, value, row, index) {
            deleteItem(row.id);
        }
    }

    function operateFormatter(value, row, index) {
        return `
            <audio controls style="height: 20px;">
                <source src="/ars/${row.file_name}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <img class="device-info edit" src="/app/image/edit_item.png" style="vertical-align: sub;"></img>
            <img class="device-info remove" src="/app/image/delete.png" style="vertical-align: sub;"></img>`;
    }

    ars_table.bootstrapTable({
        url: '/api/ars',
        cache: false,
        condensed: true,
        striped: true,
        search: false,
        sidePagination: 'server',
        dataField: 'items',
        columns: [{
            field: 'ars_number',
            title: 'ARS넘버',
            align: 'center',
            valign: 'middle'
        }, {
            field: 'bank_type',
            title: '음성파일',
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
        ars_table.bootstrapTable('refresh', {
            url: '/api/ars',
            silent: true
        });
    }

    $('#add_btn').click(function() {
        $("#id").val('');
        $('#ars_number').val('');
        $("#action_btn").text("확인");
        $("#action_title").html("추가");
        $('#add_modal').modal('show');
        InitAudioSelTag();
    });

    function InitAudioSelTag(audio_id = '') {
        $("#audio_id").html('');
        $.get("/api/audio", {}, function(res) {
            var data = res.items;
            var htmlString = ``;
            for (var i = 0; i < data.length; i++) {

                htmlString += `
                        <option value='${data[i].id}'>
                            ${data[i].bank_type}
                        </option>`;
            }
            $("#audio_id").html(htmlString);
            $("#audio_id").val(audio_id);
            if (audio_id != "") {
                changeAudioFile(audio_id);
            }

        });
    }

    $('#action_btn').click(function() {
        if ($('#ars_number').val() == "") {
            alert("번호를 입력해주세요");
            return;
        }
        if ($('#audio_id').val() == "" || $('#audio_id').val() == null) {
            alert("음성을 입력해주세요");
            return;
        }
        var data = {
            ars_number: $('#ars_number').val(),
            audio_id: $('#audio_id').val(),
        }
        var type, url;
        var id = $("#id").val();
        if (!id) {
            type = 'post';
            url = "/api/ars";
            saveArs(type, url, data);
        } else {
            type = 'put';
            url = `/api/ars/${id}`;
            saveArs(type, url, data);
        }
        addIncallList($('#ars_number').val());
    });

    $('#audio_id').change(function() {
        changeAudioFile($('#audio_id').val());
    })

    function changeAudioFile(id) {
        $.ajax({
            type: 'get',
            url: `/api/audio/${id}`,
            dataType: 'json',
            success: function(data) {
                document.getElementById("audio_source").src = `/ars/${data.file_name}`;
                document.getElementById("user_audio").load();
            },
            error: function(data) {
            }
        });
    }

    function addIncallList(ars_number) {
        var data = {
            name: "Ars",
            number: ars_number,
            enabled: true,
        }
        $.ajax({
            type: "post",
            url: "/api/numbers/outgoing_redirection_list",
            data: data,
            dataType: 'json',
            success: function(data) {
                toastr['success']("강수 설정 성공", "");
            },
            error: function(data) {
            }
        });
    }

    function saveArs(type, url, data) {
        $.ajax({
            type: type,
            url: url,
            data: data,
            dataType: 'json',
            success: function(data) {
                updateTable();
                $('#add_modal').modal('hide');
                toastr['success']("성공적인 조작", "");
            },
            error: function(data) {
                updateTable();
            }
        });
    }

    function editItem(id) {
        $.ajax({
            type: 'get',
            url: `/api/ars/${id}`,
            dataType: 'json',
            success: function(data) {
                $("#id").val(data.id);
                $('#ars_number').val(data.ars_number);
                InitAudioSelTag(data.audio_id);
                $("#action_btn").text("저장");
                $("#action_title").html("수정");
                $('#add_modal').modal('show');
            },
            error: function(data) {
                updateTable();
            }
        });
    }

    function deleteItem(id) {
        bootbox.confirm({
            message: "정말 삭제하겠습니까?",
            size: "small",
            callback: function(result) {
                if (result) {
                    $.ajax({
                        type: 'delete',
                        url: `/api/ars/${id}`,
                        dataType: 'json',
                        success: function(data) {
                            updateTable();
                            toastr['success']("성공적인 조작", "");
                        },
                        error: function(data) {
                            updateTable();
                        }
                    });
                }
            }
        })
    }

    $('#upload_ars_btn').click(function() {
        bootbox.confirm({
            message: "정말 갱신하겠습니까?",
            size: "small",
            callback: function(result) {
                if (result) {
                    $.ajax({
                        type: 'post',
                        url: '/api/ars_upload',
                        dataType: 'json',
                        success: function(data) {
                            toastr['success']("성공적인 조작", "");

                        },
                        error: function(data) {
                        }
                    });
                }
            }
        })
    })
})