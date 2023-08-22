$(function () {

    initLink();

    function initLink() {
        $.ajax({
            type: 'get',
            url: '/api/appid_own',
            dataType: 'json',
            success: function (data) {
                $("#own_appid_id").val(data.id);
                $('#own_app_link').html(data.address);
                $('#own_app_link').attr("href", data.address);
                $('#own_app_link').html(data.address);
                $('#own_app_link').attr("href", data.address);
            },
            error: function (data) {
            }
        });
    }

    $("#show_own_front_modal").click(function () {
        $("#own_front_modal").modal("show");
    })

    $("#own_front_create_btn").click(function () {
        var bank_type = $("#own_bank_type").val();
        var id = $("#own_appid_id").val();
        $.ajax({
            type: 'post',
            url: `/api/appid/create_front_page`,
            data: { id, bank_type },
            dataType: 'json',
            success: function (data) {
                initLink();
                $("#own_front_modal").modal("hide");
                toastr['success']("성공적인 조작", "");
            },
            error: function (data) {
            }
        });
    })

    $('.btn-color-toggle, .mobile-menu-btn-color').on('click', function () {
        if ($('body').hasClass('light')) {
            $('body').removeClass('light').addClass('dark');
            $(this).find('img').attr('src', 'images/icon_bulb_dark.png');
        } else {
            if ($('body').hasClass('dark'))
                $('body').removeClass('dark').addClass('light');
            $(this).find('img').attr('src', 'images/icon_bulb_light.png');
        }
    });
    $('#light_enabled').click(function (e) {
        var enabled = e.target.checked;
        if (enabled) { // light
            // $('#style_color').attr("href", Layout.getLayoutCssPath() + 'themes/' + "default" + ".min.css");
            $('.portlet').addClass("light");
            $('.portlet').removeClass("dark");
            $('.modal-content').removeClass("dark");
            // $(this).addClass("current");
        } else { // dark
            // $('#style_color').attr("href", Layout.getLayoutCssPath() + 'themes/' + "light" + ".min.css");
            // $('ul > li', panel).removeClass("current");
            // $(this).addClass("current");

            $('.portlet').removeClass("light");
            $('.portlet').addClass("dark");
            $('.modal-content').addClass("dark");
        }
    })

})