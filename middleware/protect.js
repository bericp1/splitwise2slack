var utils = require('../utils');

module.exports = exports = function(secret) {
  return function(req, res, next) {
    var attempt = '';

    if(req.get('Authorization'))
      attempt = req.get('Authorization').replace(/^Basic /, '');
    else if(req.query && req.query.secret)
      attempt = req.query.secret;
    else if(req.body && req.body.secret)
      attempt = req.body.secret;
    else if(req.params && req.params.secret)
      attempt = req.params.secret;

    if(attempt === secret)
      next();
    else
      res.status(403).send(utils.constructErrorResponse('forbidden', 'Invalid secret.'));
  };
};