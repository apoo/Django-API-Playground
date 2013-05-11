/*
*   restForm
*
*   fatiherikli at gmail dot com
*   http://fatiherikli.com
*
* */
!(function ($) {

    var GET = "GET",
        POST = "POST",
        PUT = "PUT",
        DELETE = "DELETE";

    $.fn.restForm = function (_options) {
        var options = $.extend({
            "presubmit": function () {},
            "submit": function () {},
            "complete": function () {}
        }, _options);

        var build_request_headers = function (method, url, data,auth_header_data,content_type) {
            var result = [];
            result.push(method + " " + url); // method and url.
            result.push("Content-Type: " + content_type +"; charset=utf-8"); // content type
            result.push("Authorization: apikey " + auth_header_data.email + ":" + auth_header_data.access_token); // Authorizaion header
            if (!$.isEmptyObject(data)) {
                result.push(""); // blank line
                result.push(JSON.stringify(data)); // body
            }
            return result;
        };

        this.each(function () {
            $(this).submit(function () {
                var form = $(this);

                auth_header = form.find($(".auth-header-paramaters"));


                // firing presubmit event
                options.presubmit.call(this, form);

                var data = form.form2json();
                var method = form.attr("method");
                var url = form.attr("action");
                var content_type = 'application/json';

                // firing submit event
                options.submit.call(this, form, build_request_headers(method, url, data,auth_header_data,
                                                                content_type));

                var ajax_parameters = {
                    url: url,
                    type: method,
                    data: JSON.stringify(data),
                    contentType: content_type,
                    beforeSend: function(xhr,settings){
                        xhr.setRequestHeader("Authorization"," apikey " + auth_header_data.email + ":" + auth_header_data.access_token); // Authorizaion header
                    },
                    dataType: 'json',
                    processData: false
                };

                if (method === GET) {
                    ajax_parameters.processData = true;
                    ajax_parameters.data = data;
                }

                // calling api resource
                $.ajax(ajax_parameters).complete(options.complete.bind(this, form));

                return false;

            });
        });
    };

})(window.jQuery);
