(function init() {
    "use strict";

    //ShowProcessing('Loading posts ...');

    var allPostsVM = new AllPostsViewModel();
    $.when(allPostsVM.LoadPosts())
        .done(function() {
            setTimeout(function() { ko.applyBindings(allPostsVM, document.getElementById("all-posts-section")); }, 500);
            setTimeout(function() { /*HideProcessing();*/ }, 1000);
        });

}());