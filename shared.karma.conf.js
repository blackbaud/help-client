module.exports = function (config) {
  'use strict';

  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    files: ['src/**/*.ts'],
    preprocessors: { '**/*.ts': 'karma-typescript' },
    reporters: ['mocha', 'coverage', 'karma-typescript'],
    singleRun: true
  });
};
