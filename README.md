# Splitwise2Slack

A basic express web server to connect [Splitwise](https://splitwise.com/) to [Slack](http://slack.com)

## Building

    $ git clone https://github.com/bericp1/splitwise2slack.git
    $ cd splitwise2slack
    $ npm install

## Configuring

Splitwise2Slack is configured via a [dotenv](https://github.com/motdotla/dotenv). 

### Basic Setup

 1. Go [here](https://secure.splitwise.com/oauth_clients) and create a Splitwise OAuth Consumer
    * Your callback URL must point to the `/oauth/callback` route on your server, e.g. `http://localhost:3000/oauth/callback`
 2. Copy the `.env.example` file in the root of the project to `.env` (still in the root of the project)
 3. Edit .env to have the appropriate values (see all possible configurable environment variables below)

### All Environment Variables

#### `PORT`

**(default: `3000`) (required)**

The `PORT` to run on. Heroku sets this automatically.

#### `SECRET`

**(default: random)**

This is the "password" used to protect the admin interface. If not set, it will be randomly generated with
each server boot.

#### `MONGODB_URI`

**(default: none) (required)**

This is the connection URI of the mongodb to connect to. This will be overridden by `MONGOLAB_URI` if present
for Heroku Mongolab support.

#### `SPLITWISE_OAUTH_VERSION`

**(default: `1.0`)**

The OAuth version to use with Splitwise. Shouldn't need to be changed.

#### `SPLITWISE_OAUTH_KEY` 

**(default: none) (required)**

Your Splitwise OAuth consumer key. Create a Splitwise OAuth consumer [here](https://secure.splitwise.com/oauth_clients).

#### `SPLITWISE_OAUTH_SECRET` 

**(default: none) (required)**

Your Splitwise OAuth consumer secret. Create a Splitwise OAuth consumer [here](https://secure.splitwise.com/oauth_clients).

#### `SPLITWISE_OAUTH_REQUEST_URL` 

**(default: `https://secure.splitwise.com/api/v3.0/get_request_token`) (required)**

The OAuth endpoint for requesting request tokens. Shouldn't need to be changed.

#### `SPLITWISE_OAUTH_TOKEN_URL` 

**(default: `https://secure.splitwise.com/api/v3.0/get_access_token`) (required)**

The OAuth endpoint for requesting access tokens. Shouldn't need to be changed.

#### `SPLITWISE_OAUTH_AUTHORIZE_URL` 

**(default: `https://secure.splitwise.com/authorize`) (required)**

The OAuth endpoint which the user is redirected to to authorize Splitwise2Slack on their Splitwise account.
Shouldn't need to be changed.

#### `SPLITWISE_OAUTH_CALLBACK_URL` 

**(default: `http://localhost:3000/oauth/callback`) (required)**

This is the authorization callback URL you gave to Splitwise when
[creating your OAuth consumer](https://secure.splitwise.com/oauth_clients).

It must point to your server and specifically the route `/oauth/callback`.

#### `SPLITWISE_OAUTH_SIGNATURE_METHOD`

**(default: `HMAC-SHA1`) (required)**

The signature method to use when signing Splitwise OAuth requests. Shouldn't need to be changed.

## Running

### Locally

    $ npm start

### On Heroku

Splitwise2Slack is out-of-the box ready to run on Heroku, only requiring configuration:

    $ heroku apps:create yourAppNameHere
    $ heroku addons:create mongolab
    $ git push heroku master

Your `.env` file is not committed to the git repoistory, however. To configure your environment variables for the heroku
deployment, use the heroku toolbelt `config:set NAME=VALUE` command or use the heroku web interface. For example, using
the toolbelt:

    $ heroku config:set SECRET=abc123
    $ heroku config:set SPLITWISE_OAUTH_CALLBACK_URL=
    $ heroku config:set SLACK_CHANNEL=splitwise
    ...

## Usage

### The Front-end

The front-end administrative panel available at `/` when the server is running is used to manage the links.

### Links

Within the application, a "link" is simply the connection of a splitwise account to a slack account. Currently,
these links use OAuth 1.0 on the Splitwise side and a basic incoming webhook on the slack side (configured via
env variables). In the future, the slack side of the link will use the slack OAuth 2.0 flow.

## To-Do

 - [ ] Make functional with action buttons to pull unsynced bills
 - [ ] Delete an existing link
 - [ ] Action buttons to test link
 - [ ] Zapier integration
 - [ ] Use slack OAuth 2.0