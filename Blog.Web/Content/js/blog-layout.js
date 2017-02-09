(function init(baseUrl, apiBaseUrl) {
    "use strict";

    var AddArchives = function (data) {
        var archives = '';

        var currentArchive = utils.getQsValue('archive');
        if (currentArchive == null || currentArchive === '') {
            currentArchive = '';
        }

        if (currentArchive === '') {
            archives += '<li><a class="highlight" href="' + baseUrl + 'Home/AllPosts">All Posts</a></li> ';

            $("#blog-menu-archives button")
                .html('<span class="button-text">Archive</span> <span class="caret-holder"> <span class="caret"></span> </span>');
        } else {
            archives += '<li><a href="' + baseUrl + 'Home/AllPosts">All Posts</a></li> ';
        }

        for (var i = 0; i < data.length; i++) {
            var href = baseUrl + 'Home/AllPosts?archive=' + data[i].Period;

            if (currentArchive.toLowerCase() === data[i].Period.toLowerCase()) {
                archives += '<li> <a class="highlight" href="' +
                    href +
                    '">' +
                    data[i].Period +
                    ' (' +
                    data[i].Count +
                    ')' +
                    '</a></li>';

                $("#blog-menu-archives button")
                    .html('<span class="button-text">' +
                        data[i].Period +
                        ' (' +
                        data[i].Count +
                        ')' +
                        '</span> <span class="caret-holder"> <span class="caret"></span> </span>');
            } else {
                archives += '<li> <a href="' + href + '">' + data[i].Period + ' (' + data[i].Count + ')' + '</a></li>';
            }
        }

        $("#blog-menu-archives ul").html(archives);
    };

    var AddCategories = function (data) {
        var categories = '';

        var currentCategory = utils.getQsValue('category');
        if (currentCategory == null || currentCategory === '') {
            currentCategory = '';
        }

        var currentTag = utils.getQsValue('tag');
        var currentTagWithoutCategory = '';
        if (currentTag) {
            currentTagWithoutCategory = '?tag=' + currentTag;
            currentTag = '&tag=' + currentTag;
        }
        else {
            currentTag = '';
        }

        if (currentCategory === '') {
            categories += '<li><a class="highlight" href="' + baseUrl + 'Home/AllPosts' + currentTagWithoutCategory + '">All Categories</a></li> ';

            $("#blog-menu-categories button").html('<span class="button-text">All Categories</span> <span class="caret-holder"> <span class="caret"></span> </span>');
        }
        else {
            categories += '<li><a href="' + baseUrl + 'Home/AllPosts' + currentTagWithoutCategory + '">All Categories</a></li> ';
        }

        for (var i = 0; i < data.length; i++) {
            var href = baseUrl + 'Home/AllPosts/' + data[i].UrlSlug + '?category=' + data[i].Name + currentTag;

            if (currentCategory.toLowerCase() === data[i].Name.toLowerCase()) {
                categories += '<li> <a class="highlight" href="' + href + '">' + data[i].Name + '</a></li>';

                $("#blog-menu-categories button").html('<span class="button-text">' + data[i].Name + '</span> <span class="caret-holder"> <span class="caret"></span> </span>');
            }
            else {
                categories += '<li> <a href="' + href + '">' + data[i].Name + '</a></li>';
            }
        }

        $("#blog-menu-categories ul").html(categories);
    };

    var AddTags = function (data) {
        var tags = '';

        var currentTag = utils.getQsValue('tag');
        if (currentTag == null || currentTag === '') {
            currentTag = '';
        }

        var currentCategory = utils.getQsValue('category');
        var currentCategoryWithoutTag = '';
        if (currentCategory) {
            currentCategoryWithoutTag = '?category=' + currentCategory;
            currentCategory = '&category=' + currentCategory;
        }
        else {
            currentCategory = '';
        }

        for (var i = 0; i < data.length; i++) {
            var sizeClass = '';
            if (data[i].Class) {
                sizeClass = ' ' + data[i].Class;
            }

            if (currentTag.toLowerCase() === data[i].Name.toLowerCase()) {
                tags += '<a href="' + baseUrl + 'Home/AllPosts' + currentCategoryWithoutTag + '" class="tag-link selected' + sizeClass + '">' + data[i].Name + '</a>';
            }
            else {
                var href = baseUrl + 'Home/AllPosts/' + data[i].UrlSlug + '?tag=' + data[i].Name + currentCategory;
                tags += '<a href="' + href + '" class="tag-link' + sizeClass + '">' + data[i].Name + '</a>';
            }
        }

        $("#blog-menu-tags .tag-link-contents").html(tags);
    };

    var ProcessAddedComment = function (data) {
        $("#comments-partial-view").html('');
        $("#comments-partial-view").html(data);

        //HideProcessing();

        alert('Thank you for your comment on the post.', 'Success');

        $("#new-comment-form").on("submit", function (event) {
            if ($("#new-comment-form").valid()) {
                AddNewComment();
            }

            event.preventDefault();
        });
    };

    var OnErrorAddedComment = function (data) {
        $(".submit-error").addClass('field-validation-error');
        $(".submit-error").html('<span>' + data.responseJSON + '</span>');
        //HideProcessing();
    };

    var CheckCommentValidation = function (data) {
        if (data) {
            $("#new-comment-content-custom-error").addClass('field-validation-error');
            $("#new-comment-content-custom-error").html('<span>' + data + '</span>');

            //HideProcessing();

            return null;
        }

        var model = $("#new-comment-form").serialize();

        return $.ajax({
            url: baseUrl + 'Home/AddComment',
            type: 'POST',
            data: model,
            async: true,
            cache: false,
            success: function (result) {
                ProcessAddedComment(result);
            },
            error: function (response) {
                OnErrorAddedComment(response);
            }
        });
    };

    var AddNewComment = function () { // jshint ignore:line
        //ShowProcessing('Adding your comment ...');

        $("#new-comment-content-custom-error").removeClass('field-validation-error');
        $("#new-comment-content-custom-error").html('');

        $("#new-comment-name-custom-error").removeClass('field-validation-error');
        $("#new-comment-name-custom-error").html('');

        var content = $("#new-comment-content").val();
        if (content) {
            return $.ajax({
                url: baseUrl + 'Home/PerformCommentModeration',
                type: 'GET',
                data: { "comment": content },
                async: true,
                cache: false,
                success: CheckCommentValidation
            });
        } else {
            return null;
        }
    };

    utils.Invoke(apiBaseUrl + '/GetArchives', '', 'GET', true, AddArchives);

    utils.Invoke(apiBaseUrl + '/GetCategories', '', 'GET', true, AddCategories);

    utils.Invoke(apiBaseUrl + '/GetTags', '', 'GET', true, AddTags);

    try
    {
        $("#new-comment-form")[0].reset();
    }
    catch (e) {
        //
    }

    $("#new-comment-form").submit(function (event) {
        if ($("#new-comment-form").valid()) {
            AddNewComment();
        }

        event.preventDefault();
    });
}(allPostsMvcViewModel.RootUrl, allPostsMvcViewModel.AllPostsApiEndpoint));