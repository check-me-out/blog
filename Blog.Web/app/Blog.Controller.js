(function init() {
    "use strict";

    utils.ShowProcessing('Waking up GoDaddy\'s DB Server ^_^');

    var blogVm = new allPostsMvcViewModel.BlogViewModel(allPostsMvcViewModel.ApiClient, allPostsMvcViewModel.RootUrl);
    $.when(blogVm.LoadPosts())
        .done(function() {
            ko.applyBindings(blogVm, document.getElementById("all-posts-section"));
            utils.HideProcessing();
        });

}());