var archive = require('../helpers/archive-helpers');

archive.readListOfUrls( function (array) {

  array.forEach( function (element) {
    archive.isUrlArchived( element, function (bool) {
    
      if (!bool) {
        archive.downloadUrls([element]);
      }

    });
  });
});