allPostsMvcViewModel.BlogViewModel = function (apiClient, rootUrl) {
    "use strict";

    var self = this;

    // observable arrays are update binding elements upon array changes
    self.Posts = window.ko.observableArray([]);
    self.TotalNumberOfPosts = window.ko.observable(-1);
    self.NumberOfPostsInCurrentPage = window.ko.observable(-1);

    self.UrlSlug = window.ko.observable('');
    self.Category = window.ko.observable('');
    self.Tag = window.ko.observable('');
    self.Archive = window.ko.observable('');
    self.SearchTerm = window.ko.observable('');
    self.CurrPage = window.ko.observable('');
    self.PrevPageUrl = window.ko.observable('');
    self.NextPageUrl = window.ko.observable('');

    self.LoadPosts = function () {

        var cat = utils.getQsValue('category');
        cat = !cat ? '' : cat;
        var tag = utils.getQsValue('tag');
        tag = !tag ? '' : tag;
        var archive = utils.getQsValue('archive');
        archive = !archive ? '' : archive;
        var search = utils.getQsValue('searchTerm');
        search = !search ? '' : search;

        return apiClient.getAllPosts('', cat, tag, 0, archive, search).done(function (data) {

            self.ProcessResult(data);

        }).error(function (response) {
            window.console.log(response);
            utils.HideProcessing();
            window.alert('An error occured while retrieving posts. Please try again alater.', "Error");
        });
    };

    self.UpdatePosts = function (url) {
        utils.ShowProcessing('Showing relevant posts ...');

        apiClient.invoke(url).done(function (data) {

            self.ProcessResult(data);

            utils.HideProcessing();
        }).error(function () {
            utils.HideProcessing();
            window.alert('An error occured while retrieving posts. Please try again alater.', "Error");
        });
    };

    self.ProcessResult = function (data) {
        data.UrlSlug = !data.UrlSlug ? '' : data.UrlSlug;
        data.Category = !data.Category ? '' : data.Category;
        data.Tag = !data.Tag ? '' : data.Tag;
        data.Archive = !data.Archive ? '' : data.Archive;
        data.SearchTerm = !data.SearchTerm ? '' : data.SearchTerm;
        data.CurrPage = !data.CurrPage ? '' : data.CurrPage;

        if (data.Category) {
            $("#blog-menu-categories ul li").each(function () {
                var cat = $(this).find('a').first().html();
                if (cat && cat.toLowerCase() === data.Category.toLowerCase()) {
                    $(this).find('a').first().addClass('highlight');
                    $("#blog-menu-categories button").html('<span class="button-text">' + cat + '</span> <span class="caret-holder"> <span class="caret"></span> </span>');
                }
                else {
                    $(this).find('a').first().removeClass('highlight');
                }
            });
        }
        else {
            $("#blog-menu-categories ul li").each(function () {
                var cat = $(this).find('a').first().html();
                if (cat === 'All Categories') {
                    $(this).find('a').first().addClass('highlight');
                    $("#blog-menu-categories button").html('<span class="button-text">' + cat + '</span> <span class="caret-holder"> <span class="caret"></span> </span>');
                }
                else {
                    $(this).find('a').first().removeClass('highlight');
                }
            });
        }

        $("#blog-menu-tags .tag-link-contents a").each(function () {
            var tag = $(this).html();
            if (tag && tag.toLowerCase() === data.Tag.toLowerCase()) {
                $(this).addClass('selected');
            }
            else {
                $(this).removeClass('selected');
            }
        });

        if (data.SearchTerm) {
            $('input[name=\'searchTerm\']').val(data.SearchTerm);
            var times = '<div class="search-button input-group-addon close-search"><i class="fa fa-times"></i></div>';
            $(times).insertAfter('input[name=\'searchTerm\']');
            $(".close-search").click(function () {
                $('input[name=\'searchTerm\']').val('');
                $('form').submit();
            });
        }

        var postsArray = Enumerable.From(data.AllPosts)
            .Select(
                function (post) { // Element selector

                    var tagsArray = Enumerable.From(post.Tags)
                                .Select(function (tag) {
                                    tag = {
                                        Parent: self,
                                        Id: tag.Id,
                                        Name: tag.Name,
                                        UrlSlug: tag.UrlSlug,
                                        Description: tag.Description,
                                        Class: tag.Class,
                                        TagHref: rootUrl + 'Home/AllPosts/' + tag.UrlSlug + '?tag=' + tag.Name + '&category=' + data.Category,
                                        SelectTag: function () {
                                            var href = this.TagHref.replace('Home/AllPosts', 'api/GetAllPosts');
                                            self.UpdatePosts(href);
                                        },
                                        SelectedTagHref: rootUrl + 'Home/AllPosts?category=' + data.Category,
                                        DeselectTag: function () {
                                            var href = this.SelectedTagHref.replace('Home/AllPosts', 'api/GetAllPosts');
                                            self.UpdatePosts(href);
                                        }
                                    };

                                    return tag;
                                })
                                .OrderBy(function (tag) { return tag.Name; })
                                .ToArray();

                    var strPostedOn = post.PostedOn.toString().replace('T', ' ');
                    var formattedPostedOn = $.datepicker.formatDate('DD, MM dd, yy', $.datepicker.parseDate("yy-mm-dd", strPostedOn));

                    var formattedModifiedOn = '';
                    if (post.ModifiedOn != null) {
                        var strModifiedOn = post.ModifiedOn.toString().replace('T', ' ');
                        formattedModifiedOn = $.datepicker.formatDate('MM dd, yy', $.datepicker.parseDate("yy-mm-dd", strModifiedOn));
                    }

                    post = {
                        Parent: self,
                        Id: post.Id,
                        Title: post.Title,
                        ShortDescription: post.ShortDescription,
                        ShorterDescription: post.ShortDescription.substring(0, 150),
                        UrlSlug: post.UrlSlug,
                        Published: post.Published,
                        PostedOn: formattedPostedOn,
                        ModifiedOn: formattedModifiedOn,
                        Category: {
                            Id: post.Category.Id,
                            Name: post.Category.Name,
                            UrlSlug: post.Category.UrlSlug,
                            Description: post.Category.Description,
                        },
                        Tags: window.ko.observableArray(tagsArray),
                        PostHref: rootUrl + 'Blog/' + post.Id + '/' + post.UrlSlug + '?category=' + data.Category + '&tag=' + data.Tag + '&cur=' + data.CurrPage + '&searchTerm=' + data.SearchTerm,
                        CategoryHref: rootUrl + 'Home/AllPosts/' + post.Category.UrlSlug + '?category=' + post.Category.Name + '&tag=' + data.Tag,
                        SelectCategory: function () {
                            var href = this.CategoryHref.replace('Home/AllPosts', 'api/GetAllPosts');
                            self.UpdatePosts(href);
                        },
                        SelectedCategoryHref: rootUrl + 'Home/AllPosts?tag=' + data.Tag,
                        DeselectCategory: function () {
                            var href = this.SelectedCategoryHref.replace('Home/AllPosts', 'api/GetAllPosts');
                            self.UpdatePosts(href);
                        }
                    };

                    return post;
                })
            .ToArray();

        self.Posts(postsArray);

        self.TotalNumberOfPosts(data.TotalCount);
        self.NumberOfPostsInCurrentPage(postsArray.length);

        self.UrlSlug(data.UrlSlug);
        self.Category(data.Category);
        self.Tag(data.Tag);
        self.Archive(data.Archive);
        self.SearchTerm(data.SearchTerm);
        self.CurrPage(data.CurrPage);

        if (data.PrevPage || data.PrevPage === 0) {
            self.PrevPageUrl(rootUrl + 'Home/AllPosts/' + data.UrlSlug + '?category=' + data.Category + '&tag=' + data.Tag + '&cur=' + data.PrevPage + '&searchTerm=' + data.SearchTerm);
        }
        else {
            self.PrevPageUrl('');
        }

        if (data.NextPage) {
            self.NextPageUrl(rootUrl + 'Home/AllPosts/' + data.UrlSlug + '?category=' + data.Category + '&tag=' + data.Tag + '&cur=' + data.NextPage + '&searchTerm=' + data.SearchTerm);
        }
        else {
            self.NextPageUrl('');
        }

        window.scrollTo(0, 0);
    };

    self.GoToPrevPage = function () {
        var href = self.PrevPageUrl().replace('Home/AllPosts', 'api/GetAllPosts');
        self.UpdatePosts(href);
    };

    self.GoToNextPage = function () {
        var href = self.NextPageUrl().replace('Home/AllPosts', 'api/GetAllPosts');
        self.UpdatePosts(href);
    };
};
