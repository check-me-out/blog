(function init() {
    "use strict";

    var keywordList = [
        "class", "interface", "public", "private", "internal", "static", "readonly",
        "if", "foreach", "var", "new", "base", "return",
        "string", "int", "bool", "void", "null", "true", "false",
        "override", "virtual", "try", "catch", "finally", "using",
    ];

    var typeList = [
        "AuthorizeAttribute",
        "AttributeUsage",
        "AttributeTargets",
        "Controller",
        "Exception",
        "IEnumerable",
        "List",
        "ActionResult",
        "ActionFilterAttribute",
        "ActionExecutingContext"
    ];

    $(".blog-content pre")
        .each(function() {
            var value = $(this).html();
            value = value.replace(/<span class/g, 'lkhgr82tvnzligy');

            for (var i = 0; i < keywordList.length; i++) {
                value = value.replace(new RegExp("\\b" + keywordList[i] + "\\b", 'g'),
                    '<span class=\"keyword\">' + keywordList[i] + '</span>');
            }

            for (var j = 0; j < typeList.length; j++) {
                value = value.replace(new RegExp("\\b" + typeList[j] + "\\b", 'g'),
                    '<span class=\"type\">' + typeList[j] + '</span>');
            }

            var comments = value.split('//');
            if (comments.length > 1) {
                for (var k = 1; k < comments.length; k++) {
                    comments[k] = '<span class="comment">//' + comments[k];
                    var eoc = comments[k].indexOf('\n');
                    if (eoc > 0) {
                        comments[k] = comments[k].substring(0, eoc) +
                            '</span>' +
                            comments[k].substring(eoc, comments[k].length);
                    } else {
                        comments[k] = comments[k] + '</span>';
                    }
                }

                value = comments.join("");
            }

            value = value.replace(/lkhgr82tvnzligy/g, '<span class');
            $(this).html(value);
        });
}());