module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['server.js','server-assets/*.js','server-assets/**/*.js','public/**/*.js']
    },
    watch: {
      js: {
        files: ['<%= jshint.all %>', 'Gruntfile.js'],
        tasks: ['jshint'],
        options: { livereload: true }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['watch']);
};