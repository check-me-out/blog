﻿function AddArchives(data) {
    var archives = '';

    var currentArchive = getQsValue('archive');
    if (currentArchive == null || currentArchive === '') {
        currentArchive = '';
    }

    if (currentArchive === '') {
        archives += '<li><a class="highlight" href="/Blog/AllPosts">All Posts</a></li> ';

        $("#blog-menu-archives button")
            .html('<span class="button-text">Archive</span> <span class="caret-holder"> <span class="caret"></span> </span>');
    } else {
        archives += '<li><a href="/Blog/AllPosts">All Posts</a></li> ';
    }

    for (var i = 0; i < data.length; i++) {
        var href = '/Blog/AllPosts?archive=' + data[i].Period;

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
}

function AddCategories(data) {
    var categories = '';

    var currentCategory = getQsValue('category');
    if (currentCategory == null || currentCategory === '') {
        currentCategory = '';
    }

    var currentTag = getQsValue('tag');
    var currentTagWithoutCategory = '';
    if (currentTag) {
        currentTagWithoutCategory = '?tag=' + currentTag;
        currentTag = '&tag=' + currentTag;
    }
    else {
        currentTag = '';
    }

    if (currentCategory === '') {
        categories += '<li><a class="highlight" href="/Blog/AllPosts' + currentTagWithoutCategory + '">All Categories</a></li> ';

        $("#blog-menu-categories button").html('<span class="button-text">All Categories</span> <span class="caret-holder"> <span class="caret"></span> </span>');
    }
    else {
        categories += '<li><a href="/Blog/AllPosts' + currentTagWithoutCategory + '">All Categories</a></li> ';
    }

    for (var i = 0; i < data.length; i++) {
        var href = '/Blog/AllPosts/' + data[i].UrlSlug + '?category=' + data[i].Name + currentTag;

        if (currentCategory.toLowerCase() === data[i].Name.toLowerCase()) {
            categories += '<li> <a class="highlight" href="' + href + '">' + data[i].Name + '</a></li>';

            $("#blog-menu-categories button").html('<span class="button-text">' + data[i].Name + '</span> <span class="caret-holder"> <span class="caret"></span> </span>');
        }
        else {
            categories += '<li> <a href="' + href + '">' + data[i].Name + '</a></li>';
        }
    }

    $("#blog-menu-categories ul").html(categories);
}

function AddTags(data) {
    var tags = '';

    var currentTag = getQsValue('tag');
    if (currentTag == null || currentTag === '') {
        currentTag = '';
    }

    var currentCategory = getQsValue('category');
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
            tags += '<a href="/Blog/AllPosts' + currentCategoryWithoutTag + '" class="tag-link selected' + sizeClass + '">' + data[i].Name + '</a>';
        }
        else {
            var href = '/Blog/AllPosts/' + data[i].UrlSlug + '?tag=' + data[i].Name + currentCategory;
            tags += '<a href="' + href + '" class="tag-link' + sizeClass + '">' + data[i].Name + '</a>';
        }
    }

    $("#blog-menu-tags .tag-link-contents").html(tags);
}

function ProcessAddedComment(data) {
    $("#comments-partial-view").html('');
    $("#comments-partial-view").html(data);

    //HideProcessing();

    window.toaster.success('Thank you for your comment on the post.', 'Success');

    $("#new-comment-form").on("submit", function (event) {
        if ($("#new-comment-form").valid()) {
            AddNewComment();
        }

        event.preventDefault();
    });
}

function OnErrorAddedComment(data) {
    $(".submit-error").addClass('field-validation-error');
    $(".submit-error").html('<span>' + data.responseJSON + '</span>');
    //HideProcessing();
}

function CheckCommentValidation(data) {
    if (data) {
        $("#new-comment-content-custom-error").addClass('field-validation-error');
        $("#new-comment-content-custom-error").html('<span>' + data + '</span>');

        //HideProcessing();

        return null;
    }

    var model = $("#new-comment-form").serialize();

    return $.ajax({
        url: '/Blog/AddComment',
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
}

function AddNewComment() { // jshint ignore:line
    //ShowProcessing('Adding your comment ...');

    $("#new-comment-content-custom-error").removeClass('field-validation-error');
    $("#new-comment-content-custom-error").html('');

    $("#new-comment-name-custom-error").removeClass('field-validation-error');
    $("#new-comment-name-custom-error").html('');

    var content = $("#new-comment-content").val();
    if (content) {
        return $.ajax({
            url: '/Blog/PerformCommentModeration',
            type: 'GET',
            data: { "comment": content },
            async: true,
            cache: false,
            success: CheckCommentValidation
        });
    } else {
        return null;
    }
}

function Invoke(url, data, method, asynchronous, onSuccess, onError) {
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

(function init() {

    Invoke('/api/GetArchives', '', 'GET', true, AddArchives);

    Invoke('/api/GetCategories', '', 'GET', true, AddCategories);

    Invoke('/api/GetTags', '', 'GET', true, AddTags);

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
}());