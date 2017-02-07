module.exports = function (grunt) {
    "use strict";

    grunt.registerTask('default', ['jshint', 'build']);
    grunt.registerTask('build', ['clean', 'less', 'cssmin', 'uglify']);

    var bundleconfig = grunt.file.readJSON('bundleconfig.json');
    var getBundle = function (name) {
        return bundleconfig.filter(function (bundle) {
            return bundle.outputFileName === name;
        })[0];
    };
    var siteCssBundle = getBundle("Content/css/site.min.css");
    var siteJsBundle = getBundle("Content/js/site.min.js");
    var appBundle = getBundle("app/app-bundle.min.js");
    var vendorCssBundle = getBundle("Content/bundles/third-party-libs.min.css");
    var vendorJsBundle = getBundle("Content/bundles/third-party-libs.min.js");

    var toJSON = function (key, val) {
        var result = {};
        result[key] = val;
        return result;
    };

    var gruntConfig = {

        pkg: grunt.file.readJSON('package.json'),

        banner: '/**\n * <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
                '<%= pkg.homepage ? " * " + pkg.homepage : "" %>\n */\n',

        clean: [siteCssBundle.inputFiles[0], siteCssBundle.outputFileName, siteJsBundle.outputFileName, vendorCssBundle.outputFileName, vendorJsBundle.outputFileName],

        less: {
            siteLess: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    "Content/css/site.css": "Content/css/site.less"
                }
            }
        },

        cssmin: {
            siteCss: {
                options: {
                    shorthandCompacting: true
                },
                files: toJSON(siteCssBundle.outputFileName, siteCssBundle.inputFiles)
            },
            vendorCss: {
                options: {
                    shorthandCompacting: true
                },
                files: toJSON(vendorCssBundle.outputFileName, vendorCssBundle.inputFiles),
            }
        },

        uglify: {
            siteJsBundle: {
                options: {
                    banner: "<%= banner %>", compress: true
                },
                src: [siteJsBundle.inputFiles],
                dest: siteJsBundle.outputFileName
            },
            appBundle: {
                options: {
                    banner: "<%= banner %>", compress: true
                },
                src: [appBundle.inputFiles],
                dest: appBundle.outputFileName
            },
            vendorJsBundle: {
                options: {
                    compress: true
                },
                src: [vendorJsBundle.inputFiles],
                dest: vendorJsBundle.outputFileName
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            files: ["*.js", "app/**/*.js", "Content/js/*.js", "!app/app-bundle.min.js", "!Content/js/site.min.js", "!Content/packages/**/*.js"]
        }
    };

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig(gruntConfig);
};