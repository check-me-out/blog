/* exported utils */
var utils = (function () { // jshint ignore: line
    "use strict";

    /* Get QueryString parameter. */
    function getQsValue(name, url) {
        if (!url) {
            url = window.location.href;
        }
        url = url.toLowerCase(); // This is just to avoid case sensitiveness  
        name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return '';
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function invoke(url, data, method, asynchronous, onSuccess, onError) {
        if (url === undefined || url === '') {
            return null;
        }

        if (data === undefined) {
            data = '';
        }

        if (method === undefined) {
            method = 'GET';
        }

        if (asynchronous === undefined) {
            asynchronous = false;
        }

        if (onSuccess === undefined) {
            onSuccess = function () { };
        }

        if (onError === undefined) {
            onError = function () { };
        }

        return $.ajax({
            url: url,
            type: method,
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            async: asynchronous,
            cache: false,
            success: onSuccess,
            error: onError
        });
    }

    function showProcessing(message) {
        if (message) {
            $("#work-in-progress .message").html(message);
        }

        $("#work-in-progress").show();
    }

    function hideProcessing() {
        $("#work-in-progress .message").html('');
        $("#work-in-progress").hide();
    }

    return {
        getQsValue: getQsValue,
        invoke: invoke,
        showProcessing: showProcessing,
        hideProcessing: hideProcessing
    };
}());