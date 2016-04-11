// Load dotenv
require('dotenv').config({silent: true});

// Dependencies
var express = require('express'),
  randomString = require("randomstring"),
  oauth = require('oauth'),
  mongodb = require('mongodb');

// Environment config
var config = {
  port: process.env.PORT || 3000,

  secret: process.env.SECRET || randomString.generate(),

  splitwise_oauth: {
    version: process.env.SPLITWISE_OAUTH_VERSION || '',
    key: process.env.SPLITWISE_OAUTH_KEY || '',
    secret: process.env.SPLITWISE_OAUTH_SECRET || '',
    urls: {
      request: process.env.SPLITWISE_OAUTH_REQUEST_URL || '',
      token: process.env.SPLITWISE_OAUTH_TOKEN_URL || '',
      authorize: process.env.SPLITWISE_OAUTH_AUTHORIZE_URL || '',
      callback: process.env.SPLITWISE_OAUTH_CALLBACK_URL || ''
    },
    signatureMethod: process.env.SPLITWISE_OAUTH_SIGNATURE_METHOD
  },

  mongodb: {
    uri: process.env.MONGOLAB_URI || (process.env.MONGODB_URI || '')
  }
};

var appSetup = require('./app'),
  app = express();

// Connect to database and configure app
mongodb.MongoClient.connect(config.mongodb.uri, function(err, db) {
  if(err) {
    console.error('ERROR CONNECTING TO MONGODB (at %s): ', config.mongodb.uri, err);
    app = appSetup(app, config, false);
  } else {
    console.log('Successfully connected to mongodb:', db.databaseName);
    app = appSetup(app, config, db);
  }
});

// Listen
app.listen(config.port, function() {
  console.log('Config:', config);
  console.log('Secret is "%s"', config.secret);
  console.log('Listening on port %s...', config.port);
});