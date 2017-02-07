/*global allPostsApi, allPostsMvcViewModel */

var allPostsApi = allPostsApi || {};
var allPostsMvcViewModel = allPostsMvcViewModel || null;

allPostsApi.client = (function (allPostsApiEndpoint) {

	var
    getAllPosts = function getAllPosts(slug, category, tag, cur, archive, searchTerm) {
        var endpoint = allPostsApiEndpoint + "/GetAllPosts/" + slug + '?category=' + category + '&tag=' + tag + '&cur=' + cur + '&archive=' + archive + '&searchTerm=' + searchTerm;
    	return $.ajax({
    	    url: endpoint,
    	    type: "GET",
    	    dataType: 'json',
    		async: true
    	});
    },

    invoke = function invoke(url) {
    	return $.ajax({
    		url: url,
    		type: "GET",
    		dataType: 'json',
    		async: true
    	});
    };

	return {
	    getAllPosts: getAllPosts,
	    invoke: invoke
	};

}(allPostsMvcViewModel.AllPostsApiEndpoint));
