module.exports = function (grunt) {

  'use strict';

  /**
   * Load required Grunt tasks.
   */
  require('load-grunt-tasks')(grunt, {
    pattern: ['grunt-contrib-*']
  });

  /**
   * Setup global config.
   */
  var globalConfig = {
    file: 'index.html',
    dest: '_build'
  };

  /**
   * Set up config.
   */
  grunt.initConfig({
    globalConfig: globalConfig,

    /**
     * Reads contents of package.json.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * Removes build directory.
     */
    clean: {
      release: ['<%= globalConfig.dest %>']
    },

    /**
     * Copies files from the dev environment into the build directory.
     * @todo Fix dev hack needed in order to have sass import normalize.css properly in build process.
     */
    copy: {
      dev: {
        files: [{
          src: 'bower_components/normalize-css/normalize.css',
          dest: 'sass/vendor/normalize.scss'
        }]
      },
      main: {
        files: [{
          src: ['data/us-states-output.json', 'data/data.json'],
          dest: '<%= globalConfig.dest %>/'
        }]
      }
     },

    /**
     * Runs lint tests.
     */
     jshint: {
       files: ['Gruntfile.js', 'js/**.js'],
       options: {
         asi: true,
         browser: true,
         curly: true,
         eqeqeq: true,
         forin: false,
         immed: false,
         newcap: true,
         noempty: true,
         strict: true,
         undef: true,
         sub: true,
         globals: {
           // AMD
           module:     true,
           require:    true,
           requirejs:  true,
           define:     true,

           // D3
           d3:         true,

           // Environments
           console:    true
         }
       }
     },

     /**
      * Minifies HTML.
      */
     htmlmin: {
       dist: {
         options: {
           removeComments: true,
           collapseWhitespace: true,
           removeEmptyAttributes: true,
           removeCommentsFromCDATA: true,
           removeRedundantAttributes: true,
           collapseBooleanAttributes: true
         },
         files: {
           '<%= globalConfig.dest %>/<%= globalConfig.file %>': '<%= globalConfig.file %>'
         }
       }
     },

     /**
      * Concats and minifies JS files.
      */
    requirejs: {
      compile: {
        options: {
          name: 'config',
          mainConfigFile: 'js/config.js',
          out: '<%= globalConfig.dest %>/js/app.min.<%= grunt.template.today("yymmddhhmmss") %>.js'
        }
      }
    },

    /**
     * Concats and minifies SASS files.
     */
    sass: {
       dev: {
         options: {
           style: 'expanded'
         },
         files: {
           'css/app.css': 'sass/main.scss'
         }
       },
       dist: {
         options: {
           style: 'compressed'
         },
         files: {
           '<%= globalConfig.dest %>/css/app.min.<%= grunt.template.today("yymmddhhmmss") %>.css': 'sass/main.scss'
         }
       }
     },

    /**
     * Watches select files for changes.
     */
    watch: {
     css: {
       files: 'sass/**/*.scss',
       tasks: ['sass:dev']
     },
     options: {
       debounceDelay: 250
     }
    }

  });

  /**
   * Creates a new directory.
   */
  grunt.registerTask('mkdir', grunt.file.mkdir);

  /**
   * Generates compiled css files for dev environments.
   */
  grunt.registerTask('default', [
    'copy:dev',
    'sass:dev',
    'watch'
  ]);

  /**
   * Maps dev task to default task.
   */
  grunt.registerTask('dev', [
    'default'
  ]);

  /**
   * Runs JSHint tests.
   */
  grunt.registerTask('test', [
    'jshint'
  ]);

  /**
   * Prepares the app for development by concatenating and minifying static files.
   */
  grunt.registerTask('build', [
    'jshint',
    'clean',
    'mkdir:' + globalConfig.dest,
    'htmlmin',
    'sass:dist',
    'requirejs',
    'copy',
    'updatepaths'
  ]);

  /**
   * Opens a template file and updates the CSS/JS file paths
   * to point to the minified and timestamped versions.
   */
  grunt.registerTask('updatepaths', 'Update file paths.', function() {
    var dir = globalConfig.dest,
        file = globalConfig.file,
        css, index, script, revised;

    // expand static files
    css = grunt.file.expand(dir + '/css/app.min*.css')[0].replace(dir + '/', '');
    script = grunt.file.expand(dir + '/js/app.min*.js')[0].replace(dir + '/', '');
    index = grunt.file.expand(dir + '/' + file)[0];

    // read template contents and update file paths
    revised = grunt.file.read(index).replace(/href\="css\/app\.css"/, 'href="' + css + '"').replace( /data-main\="js\/config" src\="bower_components\/requirejs\/require\.js"/, 'src="' + script + '"' );

    // save file
    grunt.file.write(index, revised);
  });

};
