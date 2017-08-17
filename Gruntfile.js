/*jshint esversion: 6 */
module.exports = function (grunt) {
    const mozjpeg = require('imagemin-mozjpeg');

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            all: {
                src: ['build/**/*']
            },
        },
        imagemin: {
            static: {
                options: {
                    optimizationLevel: 3,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [mozjpeg()] // Example plugin usage
                },
                files: {
                    'build/img/layout.jpg': 'src/images/layout/scene.jpg',
                    'build/img/banner.png': 'src/images/banner/Earth.png',
                }
            },
            dynamic: {
                options: {
                    optimizationLevel: 1,
                    use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/img/'
                }]
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
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
                src: [
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/bootstrap/dist/js/bootstrap.js',
                    'node_modules/select2/dist/js/select2.js',
                    'src/js/**/*.js'
                ],
                dest: 'build/js/bundle.min.js'
            }
        },
        concat: {
            options: {
                separator: ' '
            },
            dist: {
                src: ['src/**/*.js'],
                dest: 'build/js/<%= pkg.name %>.js'
            },
            all: {
                src: ['src/js/layout.js', 'src/js/library.js', 'src/js/server.js'],
                dest: 'build/js/bundle.js',
            }
        },
        sass: {
            dist: {
                options: {
                    sourcemap: 'auto',
                    style: 'compressed',
                    loadPath: 'node_modules/'
                },
                files: {
                    'build/css/main.css': 'src/sass/theme.scss',       // 'destination': 'source'
                    'build/css/style.css': 'src/sass/style.scss'
                }
            },
            all: {
                options: {
                    sourcemap: 'auto',
                    style: 'expanded', // nested, compact, compressed, expanded
                    // tell Sass to look in the Bootstrap stylesheets directory when compiling
                    loadPath: 'node_modules/'
                },
                files: [{
                    expand: true,
                    cwd: 'src/sass',
                    src: ['*.scss'],
                    dest: 'build/css',
                    ext: '.css'
                }]
            }
        },
        copy: {
            bootstrap: {
                expand: true,
                cwd: 'node_modules/bootstrap-sass/assets/fonts/bootstrap/',
                src: ['*'],
                dest: 'build/fonts/bootstrap/'
            }
        },
        watch: {
            files: ['<%= jshint.files %>', 'src/sass/**/*', 'src/images/**/*'],
            tasks: ['jshint', 'imagemin', 'sass'],
            sass: {
                files: 'sass/*.scss',
                tasks: ['sass:dist']
            }
        },
    });

    // Load the plugin that provides the task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // Default task(s).
    grunt.registerTask('default', ['clean', 'sass', 'copy', 'jshint', 'uglify', 'concat', 'imagemin', 'test']);

    grunt.registerTask('development', ['clean', 'sass:dist', 'copy', 'imagemin:static', 'jshint', 'concat:all', 'test', 'watch']);
    grunt.registerTask('production', ['clean', 'sass:all', 'copy', 'imagemin:dynamic', 'jshint', 'uglify']);

    // A very basic default task.
    grunt.registerTask('test', 'Log some stuff.', function () {
        grunt.log.write('Logging some stuff...').ok();
    });

};
