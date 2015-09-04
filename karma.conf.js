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
      'mocha'
    ],

    browsers: [
      'PhantomJS'
    ],

    preprocessors: {
      'src/**/*.js': ['babel'],
      'spec/**/*.js': ['babel']
    },

    reportSlowerThan: 1000
  });
};
