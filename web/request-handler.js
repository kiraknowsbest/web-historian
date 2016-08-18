var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpUtils = require('./http-helpers');
var url = require('url');
// require more modules/folders here!
exports.handleRequest = function (req, res) {
  var givenUrl = req.url.slice(1);
  if (req.method === 'GET') {
    if ( req.url === '/' ) { // url is undefined, i.e. accessing main page, return index.html
      res.writeHead(200, httpUtils.headers);
      httpUtils.serveAssets( res, archive.paths.siteAssets, 'index.html', function (data) {
        res.write(data);
        res.end();
      });
    } else { // needs to return true if archived, i.e. requesting site
      archive.isUrlArchived( givenUrl, function (data) { 
        if (data) {
          res.writeHead(200, httpUtils.headers);
          httpUtils.serveAssets( res, archive.paths.archivedSites, givenUrl, function (data) {
            res.write(data);
            res.end();
          });
        } else { // not archived, i.e. 404
          res.writeHead( 404, httpUtils.headers );
          res.end();
        }
      });
    } 
  } else if ( req.method === 'POST' ) {
    res.writeHead(302, httpUtils.headers);
    var data = [];
    req.on('data', function (chunk) {
      data.push( chunk );
    });

    req.on('end', function () {
      var site = (url.parse(data.concat().toString()).pathname.slice(4));
      archive.isUrlInList(site, function (check) {
        if (check) {
        //todo (redirect to archive file)
          archive.isUrlArchived(site, function (check) {
            if (check) {
              httpUtils.serveAssets( res, archive.paths.archivedSites, site, function (data) {
                res.write(data);
                res.end();
              });
            } else {
              httpUtils.serveAssets( res, archive.paths.siteAssets, 'loading.html', function (data) {
                res.write(data);
                res.end();
              });
            }
          });
          
          
        } else {
          archive.addUrlToList(site, function (err) { 
            err && (console.log(err));
          });
          httpUtils.serveAssets( res, archive.paths.siteAssets, 'loading.html', function (data) {
            res.write(data);
            res.end();
          });
        }
      });
    });
  }
};
