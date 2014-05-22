/* jshint node: true */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/**\n' +
            ' * <%= pkg.name %>: v<%= pkg.version %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' */\n',
    // Task configuration.

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      jsbench: {
        src: 'index.js'
      },
      Gruntfile: {
        src: 'Gruntfile.js'
      },
      testjs: {
        src: 'test/*.js'
      }
    }

  });


  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task.
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('test', ['jshint']);
};