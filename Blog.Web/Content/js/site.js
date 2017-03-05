(function () {
    "use strict";

    $(".dropdown.hover").hover(function () {
        $(this).find(".dropdown-menu").first().attr("style", "display: block");
    }, function () {
        $(this).find(".dropdown-menu").first().attr("style", "display: none");
    });

    var bannerHeight = $(".page-banner-section").height() + 12;
    $(".body-and-footer").attr("style", "min-height: calc(100% - " + bannerHeight + "px)");

    var ping = function (page) {
        $.ajax({
            type: "GET",
            url: page,
            dataType: "html",
            success: function () {
                // do nothing
            },
            error: function (response) {
                window.console.log("Ping failed for " + page + ": " + response);
            }
        });
    };

    var keepAlive = function () {
        var now = new Date();
        var dayOfWeek = now.getDay();
        var timeOfDay = now.getHours();
        if (dayOfWeek < 1 || dayOfWeek > 5 || timeOfDay < 8 || timeOfDay > 18) {
            return; // Not business hours - Mon ~ Fri 8AM ~ 6PM
        }

        var webpages = [ "http://blog.shreevenkat.co.uk/Home/AllPosts/knockout-js?tag=KnockoutJs" ];

        for (var i = 0; i < webpages.length; i++) {
            ping(webpages[i]);
        }
    };

    window.setInterval(keepAlive, 2.5 * 60 * 1000);

})();