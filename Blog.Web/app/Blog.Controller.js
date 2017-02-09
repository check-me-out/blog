(function init() {
    "use strict";

    //ShowProcessing('Loading posts ...');

    var blogVm = new BlogViewModel(allPostsMvcViewModel.apiClient, allPostsMvcViewModel.RootUrl);
    $.when(blogVm.LoadPosts())
        .done(function() {
            setTimeout(function () { ko.applyBindings(blogVm, document.getElementById("all-posts-section")); }, 500);
            setTimeout(function() { /*HideProcessing();*/ }, 1000);
        });

}());