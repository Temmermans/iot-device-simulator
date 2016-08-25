module.exports = function(grunt){
// load plugins
  [
    'grunt-contrib-less',
    'grunt-mocha-test',
    'grunt-contrib-uglify',
    'grunt-contrib-cssmin',
    'grunt-hashres'
  ].forEach(function(task){
    grunt.loadNpmTasks(task);
  });

// configure plugins
  grunt.initConfig({
    // Configure a mochaTest task
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          captureFile: 'results.txt', // Optionally capture the reporter output to a file
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['test/**/*.js']
      }
    },
    less: {
      development: {
        files: {
          'public/styles/css/styles.css': 'public/styles/less/styles.less',
        }
      }
    },
    uglify: {
      all: {
        files: {
          'public/js/bundle.min.js': ['public/js/**/*.js']
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/styles/css/bundle.css': ['public/styles/css/**/*.css',
          '!public/styles/css/bundle*.css']
        }
      },
      minify: {
        src: 'public/styles/css/bundle.css',
        dest: 'public/css/bundle.min.css',
      }
    },
    hashres: {
      options: {
        fileNameFormat: '${name}.${hash}.${ext}'
      },
      all: {
        src: [
          'public/js/bundle.min.js',
          'public/css/bundle.min.css',
        ],
        dest: [
          'views/layouts/layout.pug',
        ]
      },
    }
  });

// register tasks
  grunt.registerTask('test', ['mochaTest']);
  grunt.registerTask('bunminify', ['uglify', 'less', 'cssmin', 'hashres']);
};
