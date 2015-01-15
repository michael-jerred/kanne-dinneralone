'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var pathConfig = {
        // where the source files are
        src: 'client',
        // where test source files are
        test: 'test',
        // where to build distribution version
        dist: 'dist/public',
        // where to put compiled files
        compiled: '.compiled',
        // where to put compiled tests
        compiledTest: '.compiledTest'
    };

    grunt.initConfig({

        path: pathConfig,

        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            scripts: {
                files: ['<%= path.src %>/**/*.ts'],
                tasks: ['newer:tsc:dev']
            },
            styles: {
                files: ['<%= path.src %>/**/*.{scss,sass}'],
                tasks: ['newer:sass']
            },
            testScripts: {
              files: ['<%= path.test %>/**/*.ts'],
              tasks: ['newer:tsc:test']
            },
            tests: {
                files: ['<%= path.compiledTest %>/**/*.js', '<%= path.compiled %>/**/*.js'],
                tasks: ['karma']
            },
            gruntfile: {
              files: ['Gruntfile.js'],
              options: {
                debounceDelay: 250
              }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= path.src %>/**/*.html',
                    '<%= path.compiled %>/**/*.css',
                    '<%= path.compiled %>/**/*.js',
                    '<%= path.src %>/**/images/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        clean: {
            dist: ['<%= path.compiled %>/**', '<%= path.dist %>/**', '!<%= path.dist %>/.git/**'],
            dev: '<%= path.compiled %>/**',
            test: ['<%= path.compiled %>/**', '<%= path.compiledTest %>/**'],

            'dev-js': ['<%= path.src %>/**/*.js{,.map}'],
            'test-js': ['<%= path.test %>/**/*.js{,.map}']
        },

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost', // Change this to '0.0.0.0' to access the server from outside.
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static(pathConfig.compiled),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(pathConfig.src)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static(pathConfig.compiled),
                            connect.static(pathConfig.test),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(pathConfig.src)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= path.dist %>'
                }
            }
        },

        // update typescript definitons
        tsd: {
            refresh: {
                options: {
                    command: 'refresh',
                    latest: true,
                    config: 'tsd.json',
                }
            }
        },

        // tasks to compile stuff
        tsc: {
            options: {
                target: 'es5',
                module: 'commonjs',
                sourcemap: true,
                comments: true,
                declaration: false,
                implicitAny: true
            },
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= path.src %>',
                    src: ['**/*.ts'],
                    dest: '<%= path.compiled %>',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: '<%= path.test %>',
                    src: ['**/*.ts'],
                    dest: '<%= path.compiledTest %>',
                    ext: '.js'
                }]
            }
        },

        sass: {
            all: {
                options: {
                    precision: 10,
                    loadPath: ['bower_components/bootstrap-sass-official/assets/stylesheets']
                },
                files: [{
                    expand: true,
                    cwd: '<%= path.src %>',
                    src: ['**/*.{scss,sass}'],
                    dest: '<%= path.compiled %>/',
                    ext: '.css'
                }]
            },
        },

        // tasks for producing distribution builds
        useminPrepare: {
            html: '<%= path.src %>/index.html',
            options: {
                dest: '<%= path.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= path.dist %>/**/*.html'],
            css: ['<%= path.dist %>/**/*.css'],
            options: {
                assetsDirs: ['<%= path.dist %>','<%= path.dist %>/**/images']
            }
        },

        // imagemin: {
        //     dist: {
        //         files: [{
        //             expand: true,
        //             cwd: '<%= path.src %>',
        //             src: '**/images/*.{png,jpg,jpeg,gif}',
        //             dest: '<%= path.dist %>'
        //         }]
        //     }
        // },

        autoprefixer: {
            options: {
                map: true
            },
            all: {
                expand: true,
                src: '<%= path.compiled %>/**/*.css',
                dest: '<%= path.compiled %>/'
            },
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= path.src %>',
                    src: '**/images/*.svg',
                    dest: '<%= path.dist %>'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= path.dist %>',
                    src: ['*.html', '**/*.html'],
                    dest: '<%= path.dist %>'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= path.dist %>/*.html']
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= path.dist %>/**/*.js',
                    '<%= path.dist %>/**/*.css',
                    '<%= path.dist %>/**/images/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= path.dist %>/**/fonts/*'
                ]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= path.src %>',
                        src: [
                            '*.{ico,png,txt}',
                            '{,**/}*.html',
                            '**/*.{webp}',
                            '**/*.{jpg,png,jpeg}',
                            'fonts/{,*/}*.*'
                        ],
                        dest: '<%= path.dist %>'
                    },
                    {
                        expand: true,
                        cwd: '<%= path.compiled %>/',
                        src: [
                            '**/*.js',
                            '**/*.js.map',
                            '**/*.css',
                            '**/*.css.map'],
                        dest: '<%= path.dist %>'
                    }
                ]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            dev: [],
            test: [],
            dist: [
            //    'imagemin',
                'svgmin'
            ]
        },

        // tasks for tests
        karma: {
            unit: {
                configFile: '<%= path.compiledTest %>/karma.conf.js',
                singleRun: true
            }
        }
    });

    // by default, build development version and create server
    // if 'dist' specified, build distribution version and create server
    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'dev',
            'connect:livereload',
            'watch'
        ]);
    });

    // build development version
    grunt.registerTask('dev', [
      'clean:dev',
      //'wiredep',
      'force:tsc:dev',
      'clean:dev-js',
      'sass'
    ]);

    // run tests
    grunt.registerTask('test', [
        'clean:test',
        'force:tsc:dev',
        'clean:dev-js',
        'force:tsc:test',
        'clean:test-js',
        'sass',
        'connect:test',
        'karma'
    ]);

    // build for release
    grunt.registerTask('build', [
        'clean:dist',
        'dev',
    //    'useminPrepare',
        'concurrent:dist',
    //    'concat',
    //    'ngAnnotate',
        'copy:dist',
    //    'cdnify',
        'autoprefixer',
    //    'cssmin',
    //    'uglify',
    //    'filerev',
    //    'usemin',
        'htmlmin'
    ]);
};
