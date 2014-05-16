/**
 * Created by jasper on 5/4/14.
 */
module.exports = function(grunt) {
    var config = {
        app: "./public/app",
        dist: "dist"
    };
    require("load-grunt-tasks")(grunt);
    grunt.initConfig({
        qcrm: config,
        loopback_angular: {
            services: {
                options: {
                    input: './app.js',
                    output: './public/app/scripts/qcrm/lb-services.js'
                }
            }
        },
        docular: {
            groups: [
                {
                    groupTitle: 'LoopBack',
                    groupId: 'loopback',
                    sections: [
                        {
                            id: 'lbServices',
                            title: 'LoopBack Services',
                            scripts: [ './public/app/scripts/qcrm/lb-services.js' ]
                        }
                    ]
                },
                {
                    groupTitle: 'QCRM',
                    groupId: 'qcrm',
                    sections: [
                        {
                            id: 'directives',
                            title: 'QCRM APP directives',
                            scripts: [ './public/app/scripts/qcrm/directives.js']
                        },
                        {
                            id: 'controllers',
                            title: 'QCRM APP controllers',
                            docs: [ './public/app/scripts/qcrm/controller/']
                        }
                    ]
                }
            ]
        },
        watch: {
            coffee: {
                files: ["<%= qcrm.app %>/scripts/**/*.coffee"],
                tasks: ["coffee:dist"]
            },
            compass: {
                files: ["<%= qcrm.app %>/styles/**/*.{scss,sass}"],
                tasks: ["compass:server"]
            }

        },

        compass: {
            options: {
                sassDir: "<%= qcrm.app %>/styles",
                cssDir: "<%= qcrm.app %>/css",
                generatedImagesDir: "<%= qcrm.app %>/css/ui/images/",
                imagesDir: "<%= qcrm.app %>/styles/ui/images/",
                javascriptsDir: "<%= qcrm.app %>/scripts",
                fontsDir: "<%= qcrm.app %>/fonts",
                importPath: "<%= qcrm.app %>/libs",
                httpImagesPath: "<%= qcrm.app %>/styles/ui/images/",
                httpGeneratedImagesPath: "<%= qcrm.app %>/css/ui/images/",
                httpFontsPath: "fonts",
                relativeAssets: true
            },
            dist: {
                options: {
                    debugInfo: false,
                    noLineComments: true
                }
            },
            server: {
                options: {
                    debugInfo: true
                }
            },
            forvalidation: {
                options: {
                    debugInfo: false,
                    noLineComments: false
                }
            }
        },
        coffee: {
            compile: {
                expand: true,
                cwd: '<%= qcrm.app %>/scripts',
                src: ['**/*.coffee'],
                dest: '<%= qcrm.app %>/scripts',
                ext: '.js'
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        dest: "<%= qcrm.app %>/css/bootstrap/",
                        src: ["<%= qcrm.app %>/styles/bootstrap/*"]
                    }
                ]

            }
        }

    });
    // Load the plugin that provides the "loopback-angular" and "grunt-docular" tasks.
    grunt.loadNpmTasks('grunt-loopback-angular');
    grunt.loadNpmTasks('grunt-docular');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask("build", function(){
        grunt.task.run("coffee:compile");
        grunt.task.run("compass:dist");
        grunt.task.run("copy:dist");
    });
    // Default task(s).
    grunt.registerTask('default', ['loopback_angular', 'docular']);


};
