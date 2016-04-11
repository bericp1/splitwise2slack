module.exports = exports = (function() {

  var path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser');

  return function(app, config, db) {
    var protect = require('./middleware/protect')(config.secret),
      routers = {
        oauth: require('./routers/oauth')(config, db),
        api: require('./routers/api')(config, db)
      };

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());

    app.use('/', express.static(path.join(__dirname, 'public')));
    app.use('/oauth', routers.oauth);
    app.use('/api', routers.api);

    return app;
  };
})();