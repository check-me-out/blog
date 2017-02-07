(function () {
    "use strict";

    $(".dropdown.hover").hover(function () {
        $(this).find(".dropdown-menu").first().attr("style", "display: block");
    }, function () {
        $(this).find(".dropdown-menu").first().attr("style", "display: none");
    });

    var bannerHeight = $(".page-banner-section").height() + 12;
    $(".body-and-footer").attr("style", "min-height: calc(100% - " + bannerHeight + "px)");
})();