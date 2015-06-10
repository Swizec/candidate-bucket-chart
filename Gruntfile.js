
module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        less: {
            development: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {
                    "scripts/style.css": "src/style.less"
                }
            }
        },

        watch: {
            styles: {
                files: ['src/*.less'],
                tasks: ['less'],
                options: {
                    nospawn: true
                }
            },

        }
    });

    grunt.registerTask('default', ['less', 'browserify:dev', 'watch']);
    grunt.registerTask('package', ['less', 'browserify:production']);
};
