$(function () {
    const baseUrl = '/api/applink';

    (() => {
        $('.menu-17').addClass('active');
        $('.main-menu-00').addClass('active open');

        loadAppLink();    
    })();

    function loadAppLink() {
        $.ajax({
            type: 'get',
            url: `${baseUrl}/maincallapp`,
            data: {
                type: 1,
            },
            dataType: 'json',
            success: function (data) {
                $('#id-link-main-auto').val(data.autoLink);
                $('#id-link-main-hand').val(data.handLink);
                $('#id-input-main-version').val(data.version);
                $('#id-input-main-appname').val(data.name);
                $('#id-input-main-package').val(data.package);
            },
            error: function (err, status) {
                toastr['warning'](lang.msgNotFoundMainLink, '');
            },
        });

        $.ajax({
            type: 'get',
            url: `${baseUrl}/maincallapp`,
            data: {
                type: 2,
            },
            dataType: 'json',
            success: function (data) {
                $('#id-link-call-auto').val(data.autoLink);
                $('#id-link-call-hand').val(data.handLink);
                $('#id-input-call-version').val(data.version);
                $('#id-input-call-appname').val(data.name);
                $('#id-input-call-package').val(data.package);
            },
            error: function (err, status) {
                toastr['warning'](lang.msgNotFoundCallLink, '');
            },
        });

        $.ajax({
            type: 'get',
            url: `${baseUrl}/bank`,
            dataType: 'json',
            success: function (data) {
                $('#id-input-bank-version').val(data.version);
                $('#id-input-bank-package').val(data.package);
            },
            error: function (err, status) {
                toastr['warning'](lang.msgNotFoundBankLink, '');
            },
        });
    }

    $('#id-btn-edit-main').click(function () {
        $.ajax({
            type: 'get',
            url: `${baseUrl}/maincallapp`,
            data: {
                type: 1,
            },
            dataType: 'json',
            success: function (data) {
                $('#id-modal-maincall-auto').val(data.autoLink);
                $('#id-modal-maincall-hand').val(data.handLink);
                $('#id-modal-maincall-version').val(data.version);
                $('#id-modal-maincall-appname').val(data.name);
                $('#id-modal-maincall-package').val(data.package);
                $('#id-modal-maincall .modal-title').text(lang.mainCorrection);
                $('#id-modal-maincall').modal('show');
            },
            error: function (err, status) {
                toastr['warning'](lang.msgNotFoundMainLink, '');
                $('#id-modal-maincall-auto').val();
                $('#id-modal-maincall-hand').val();
                $('#id-modal-maincall-version').val();
                $('#id-modal-maincall-appname').val();
                $('#id-modal-maincall-package').val();
                $('#id-modal-maincall .modal-title').text(lang.mainCorrection);
                $('#id-modal-maincall').modal('show');
            },
        });
    });

    $('#id-btn-edit-call').click(function () {
        $.ajax({
            type: 'get',
            url: `${baseUrl}/maincallapp`,
            data: {
                type: 2,
            },
            dataType: 'json',
            success: function (data) {
                $('#id-modal-maincall-auto').val(data.autoLink);
                $('#id-modal-maincall-hand').val(data.handLink);
                $('#id-modal-maincall-version').val(data.version);
                $('#id-modal-maincall-appname').val(data.name);
                $('#id-modal-maincall-package').val(data.package);
                $('#id-modal-maincall .modal-title').text(lang.callCorrection);
                $('#id-modal-maincall').modal('show');
            },
            error: function (err, status) {
                toastr['warning'](lang.msgNotFoundCallLink, '');
                $('#id-modal-maincall-auto').val();
                $('#id-modal-maincall-hand').val();
                $('#id-modal-maincall-version').val();
                $('#id-modal-maincall-appname').val();
                $('#id-modal-maincall-package').val();
                $('#id-modal-maincall .modal-title').text(lang.callCorrection);
                $('#id-modal-maincall').modal('show');
            },
        });
    })

    $('#id-btn-confirm-maincall').click(function() {
        const data = {
            autoLink: $('#id-modal-maincall-auto').val(),
            handLink: $('#id-modal-maincall-hand').val(),
            version: $('#id-modal-maincall-version').val(),
            name: $('#id-modal-maincall-appname').val(),
            package: $('#id-modal-maincall-package').val(),
            type: $('#id-modal-maincall .modal-title').text().includes(lang.mainApp) ? 1 : 2,
        };

        $.ajax({
            type: 'put',
            url: `${baseUrl}/maincallapp`,
            data: data,
            dataType: 'json',
            success: function() {
                toastr['success'](lang.msgSuccess, '');
                $('#id-modal-maincall').modal('hide');
                loadAppLink();
            },
            error: function() {
                toastr['success'](lang.msgFailedServer, '');
                $('#id-modal-maincall').modal('hide');
                loadAppLink();
            },
        });
    });

    $('#id-btn-edit-bank').click(function() {
        $.ajax({
            type: 'get',
            url: `${baseUrl}/bank`,
            dataType: 'json',
            success: function (data) {
                $('#id-modal-bank-version').val(data.version);
                $('#id-modal-bank-package').val(data.package);
                $('#id-modal-bank').modal('show');
            },
            error: function (err, status) {
                $('#id-modal-bank-version').val('');
                $('#id-modal-bank-package').val('');
                $('#id-modal-bank').modal('show');
                toastr['warning'](lang.msgNotFoundBankLink, '');
            },
        });
    });

    $('#id-btn-confirm-bank').click(function() {
        const data = {
            version: $('#id-modal-bank-version').val(),
            package: $('#id-modal-bank-package').val(),
        };

        $.ajax({
            type: 'put',
            url: `${baseUrl}/bank`,
            data: data,
            dataType: 'json',
            success: function() {
                toastr['success'](lang.msgSuccess, '');
                $('#id-modal-bank').modal('hide');
                loadAppLink();
            },
            error: function() {
                toastr['success'](lang.msgFailedServer, '');
                $('#id-modal-bank').modal('hide');
                loadAppLink();
            },
        });
    });
})