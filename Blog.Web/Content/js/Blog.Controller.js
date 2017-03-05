(function init() {
    "use strict";

    utils.showProcessing('Loading Posts ...');

    var blogVm = new allPostsMvcViewModel.BlogViewModel(allPostsMvcViewModel.ApiClient, allPostsMvcViewModel.RootUrl);
    $.when(blogVm.LoadPosts())
        .done(function() {
            ko.applyBindings(blogVm, document.getElementById("all-posts-section"));
            utils.hideProcessing();
        });
}());