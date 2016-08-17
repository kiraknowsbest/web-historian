var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpUtils = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, httpUtils.headers);
    httpUtils.serveAssets( res, 'index.html', function (data) {
      res.write(data);
      res.end();
    });
  } else if ( req.method === 'POST' && req.url === '/' ) {
    var data = [];
    req.on('data', function (chunk) {
      // console.log(chunk);
      data.push( chunk );
    });

    req.on('end', function () {
      //console.log('Buffer parsed is here ------------>', Buffer.concat( data ).toString());
      var site = url.parse(data.concat().toString()).pathname.slice(4);
      archive.readListOfUrls(site);
    });
    res.end(archive.paths.siteAssets);
  }
};
