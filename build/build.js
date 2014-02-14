#!/usr/bin/env node

var fs = require('fs'),
  compressor = require('node-minify');

new compressor.minify({
  type: 'gcc',
  fileIn: '../src/progress.js',
  fileOut: '../minified/progress.min.js',
  callback: function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("JS minified successfully.");
    }
  }
});

new compressor.minify({
  type: 'yui-css',
  fileIn: '../src/progressjs.css',
  fileOut: '../minified/progressjs.min.css',
  callback: function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Main CSS minified successfully.");
    }
  }
});