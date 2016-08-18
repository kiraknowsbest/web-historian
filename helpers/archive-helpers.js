var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    data = data.split('\n');
    callback( data );
  });
  //goes into sites.txt and returns an array of sites!
};

exports.isUrlInList = function(url, callback) {
  //call readlist and check the array to see if url is in the array
  exports.readListOfUrls(function(array) {
    callback( array.indexOf(url) !== -1);
  });
};

exports.addUrlToList = function(url, callback) {
  //add the url to the page
  fs.appendFile(exports.paths.list, url + '\n', function () {
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  fs.exists(exports.paths.archivedSites + '/' + url, function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(arrayOfUrls) {
  arrayOfUrls.forEach(function(url) {
    var copy = fs.createWriteStream(exports.paths.archivedSites + '/' + url);
    request('http://' + url).pipe(copy);
  });

};
