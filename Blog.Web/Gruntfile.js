module.exports = function (grunt) {
    "use strict";

    grunt.registerTask('default', ['jshint', 'build']);
    grunt.registerTask('build', ['clean', 'pack-css', 'pack-js']);
    grunt.registerTask('pack-css', ['less', 'cssmin']);
    grunt.registerTask('pack-js', ['uglify']);

    var bundleconfig = grunt.file.readJSON('bundleconfig.json');
    var getBundle = function (name) {
        return bundleconfig.filter(function (bundle) {
            return bundle.outputFileName === name;
        })[0];
    };
    var siteCssBundle = getBundle("Content/css/site.min.css");
    var siteJsBundle = getBundle("Content/js/site.min.js");
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

        clean: [siteCssBundle.inputFiles[0], siteCssBundle.outputFileName, siteJsBundle.outputFileName, vendorJsBundle.outputFileName],

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
            files: ["*.js", "Content/js/*.js", "!Content/js/site.min.js", "!Content/packages/**/*.js"]
        }
    };

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig(gruntConfig);
};