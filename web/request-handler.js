var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpUtils = require('./http-helpers');
var url = require('url');
// require more modules/folders here!
exports.handleRequest = function (req, res) {
  console.log(req.method, 'this is the only thing that anything is hingin');
  if (req.method === 'GET') {
    res.writeHead(200, httpUtils.headers);
    httpUtils.serveAssets( res, archive.paths.siteAssets, 'index.html', function (data) {
      res.write(data);
      res.end();
    });
  } else if ( req.method === 'POST' ) {
    res.writeHead(302, httpUtils.headers);
    var data = [];
    req.on('data', function (chunk) {
      // console.log(chunk);
      data.push( chunk );
    });

    req.on('end', function () {
      //console.log('Buffer parsed is here ------------>', Buffer.concat( data ).toString());
      var site = (url.parse(data.concat().toString()).pathname.slice(4));
      exports.router['/' + site] = true;
      archive.addUrlToList(site, function () {
        console.log('sumfin');
      });
    });
    httpUtils.serveAssets( res, archive.paths.siteAssets, 'loading.html', function (data) {
      res.write(data);
      res.end();
    });
  }
};

exports.router = {
  '/': true
};
