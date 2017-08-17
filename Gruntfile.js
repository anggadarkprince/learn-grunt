module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: {
                src: ['build/**/*'],
                filter: 'isFile',
            },
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            },
            common: {
                src: ['src/js/layout.js', 'src/js/library.js']
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                compress: true,
                mangle: true,
                sourceMap: true
            },
            build: {
                src: 'src/js/**/*.js',
                dest: 'build/js/bundle.min.js'
            }
        },
        concat: {
            all: {
                src: ['src/js/layout.js', 'src/js/library.js', 'src/js/server.js'],
                dest: 'build/js/main.js',
            },
            foo: {
                files: {
                    'build/js/all.js': ['src/js/layout.js', 'src/js/library.js', 'src/js/server.js'],
                    'build/js/layout.js': ['src/js/layout.js', 'src/js/library.js'],
                },
            },
            bar: {
                files: [
                    {src: ['src/js/layout.js', 'src/js/library.js'], dest: 'build/js/lib.js', nonull: true},
                    {src: ['src/js/layout.js', 'src/js/server.js'], dest: 'build/js/server.js', filter: 'isFile'},
                ],
            },
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        },
    });

    // Load the plugin that provides the task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'jshint', 'uglify', 'concat', 'test']);

    // A very basic default task.
    grunt.registerTask('test', 'Log some stuff.', function () {
        grunt.log.write('Logging some stuff...').ok();
    });

};
