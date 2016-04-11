module.exports = exports = function(config, db) {

  var express = require('express'),
    OAuth = require('oauth'),

    protect = require('../middleware/protect')(config.secret),
    utils = require('../utils');

  var getOAuthClient = (function() {
    var client = false;

    return function(config) {
      return client ? client : (client = new OAuth.OAuth(
        config.urls.request,
        config.urls.token,
        config.key,
        config.secret,
        config.version,
        config.urls.callback,
        config.signatureMethod
      ));
    };
  })();

  var constructErrorResponse = utils.constructErrorResponse;

  var router = express.Router({mergeParams: true});

  router.get('/redirect', protect);

  router.get('/redirect', function(req, res) {
    if(!req.query.name)
      return res.status(400).send(
        constructErrorResponse('missing_name', 'Name is required for link.')
      );

    var client = getOAuthClient(config.splitwise_oauth);
    client.getOAuthRequestToken(function(err, token, secret, parsedQueryString) {
      if(err)
        return res.status(500).send(
          constructErrorResponse('oauth_client_error', 'Can\'t request request token from OAuth Provider.', err)
        );
      else {
        if(!db)
          return res.status(500).send(
            constructErrorResponse('database_unavailable', 'Database connection is unavailable.')
          );
        else {
          db.collection('oauth_tokens').insertOne({
            name: req.query.name,
            token: token,
            secret: secret
          }, function(err, result) {
            if(err) {
              return res.status(500).send(
                constructErrorResponse('database_error_cant_insert_token', 'Could not store token+secret pair.', err)
              );
            } else {
              return res.redirect(config.splitwise_oauth.urls.authorize +
                '?oauth_token=' + token +
                '&oauth_callback=' + encodeURIComponent(config.splitwise_oauth.urls.callback));
            }
          });
        }
      }
    });
  });

  router.get('/callback', function(req, res) {
    if(!req.query.oauth_token)
      return res.status(400).send(
        constructErrorResponse('oauth_missing_token', 'oauth_token is required.')
      );

    if(!req.query.oauth_verifier)
      return res.status(400).send(
        constructErrorResponse('oauth_missing_verifier', 'oauth_verifier is required.')
      );

    if(!db)
      return res.status(500).send(
        constructErrorResponse('database_unavailable', 'Database connection is unavailable.')
      );

    var oauth_tokens = db.collection('oauth_tokens');

    oauth_tokens.find({token: req.query.oauth_token}).limit(1).toArray(function(err, docs) {
      if(err)
        return res.status(500).send(
          constructErrorResponse('database_error_cant_find_token', 'Could not find token+secret pair.', err)
        );
      else if(docs.length === 0)
        return res.status(400).send(
          constructErrorResponse('oauth_invalid_token', 'oauth_token is invalid.')
        );
      else {
        var pair = docs[0];
        oauth_tokens.deleteOne({_id:pair._id}, function(err, results) {
          if(err)
            return res.status(500).send(
              constructErrorResponse('database_error_cant_delete_token', 'Could not delete token+secret pair.', err)
            );
          else {
            var oauth = getOAuthClient(config.splitwise_oauth);

            oauth.getOAuthAccessToken(pair.token, pair.secret, req.query.oauth_verifier,
              function(err, access_token, access_token_secret, results) {
                if(err)
                  return res.status(500).send(
                    constructErrorResponse('oauth_client_error', 'Can\'t request access token from OAuth Provider.', err)
                  );
                else {
                  oauth.get('https://secure.splitwise.com/api/v3.0/get_current_user', access_token, access_token_secret,
                    function(err, data, response) {
                      if(err)
                        return res.status(500).send(
                          constructErrorResponse('oauth_client_error', 'Can\'t request user data from OAuth Provider.', err)
                        );
                      else {
                        try {
                          data = JSON.parse(data);
                          db.collection('links').insertOne({
                            name: pair.name,
                            splitwise_account: data.user,
                            splitwise_token: access_token,
                            splitwise_secret: access_token_secret,
                            splitwise_verifier: req.query.oauth_verifier,
                            slack_webhook_uri: '',
                            slack_channel: '',
                            slack_username: '',
                            slack_icon_url: '',
                            slack_icon_emoji: ''
                          }, function(err, results) {
                            if(err)
                              return res.status(500).send(
                                constructErrorResponse('database_err_cant_insert_link', 'Can\'t insert link document.', err)
                              );
                            else {
                              return res.redirect('/');
                            }
                          });
                        } catch(exc) {
                          return res.status(500).send(
                            constructErrorResponse('oauth_client_error', 'Can\'t parse user data response form OAuth provider.', exc)
                          );
                        }
                      }
                    });
                }
              }
            );
          }
        });
      }
    });
  });

  return router;
  
};