module.exports = exports = function(config, db) {

  var express = require('express'),

    utils = require('../utils'),
    protect = require('../middleware/protect')(config.secret);

  var router = express.Router({mergeParams: true});

  router.use('/', protect);

  router.get('/links', function(req, res) {
    db.collection('links').find({}).toArray(function(err, docs) {
      if(err)
        return res.status(500).send(
          utils.constructErrorResponse('database_error_cant_find_links', 'Could not find links.', err)
        );
      else {
        return res.send(docs.map(function(doc) {delete doc.secret; delete doc.verifier; return doc;}));
      }
    });
  });

  router.get('/link_redirect', function(req, res) {
    res.send({url: '/oauth/redirect'});
  });

  return router;

};