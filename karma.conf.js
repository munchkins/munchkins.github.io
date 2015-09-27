module.exports = function(config) {
  config.set({
    logLevel: 'INFO',
    singleRun: true,
    basePath: './',

    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/lodash/lodash.js',
      'src/js/app.js',
      'src/js/controllers/*.js',
      'src/js/filters/*.js',
      'src/js/services/*.js',
      'spec/**/*.js'
    ],

    plugins: [
      'karma-babel-preprocessor',
      'karma-coverage',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-phantomjs-launcher',
      'karma-chai-plugins'
    ],

    frameworks: [
      'mocha',
      'chai',
      'chai-as-promised',
      'sinon-chai',
      'chai-things'
    ],

    reporters: [
      'coverage',
      'mocha'
    ],

    browsers: [
      'PhantomJS'
    ],

    preprocessors: {
      'src/**/*.js': ['babel', 'coverage'],
      'spec/**/*.js': ['babel']
    },

    babelPreprocessor: {
      options: {
        sourceMap: 'inline',
        retainLines: true,
        stage: 1
      },
      sourceFileName: function(file) {
        return file.originalPath;
      }
    },

    reportSlowerThan: 1000,

    coverageReporter: {
      type: 'lcovonly',
      dir: 'coverage/',
      subdir: '.',
      file: 'karma.lcov'
    }
  });
};
