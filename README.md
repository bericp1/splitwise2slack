# Splitwise2Slack

A basic express web server to connect [Splitwise](https://splitwise.com/) to [Slack](http://slack.com)

## Building

    $ git clone https://github.com/bericp1/splitwise2slack.git
    $ cd splitwise2slack
    $ npm install

## Configuring

Splitwise2Slack is configured via a [dotenv](https://github.com/motdotla/dotenv). Copy the `.env.example` file in the root
of the project to `.env` and edit with appropriate values.

### `PORT` (default: `3000`) (required)

### `SECRET` (default: random)

### `MONGODB_URI` (default: none) (required)

### `SPLITWISE_OAUTH_VERSION` (default: `1.0`)

### `SPLITWISE_OAUTH_KEY` (default: none) (required)

### `SPLITWISE_OAUTH_SECRET` (default: none) (required)

### `SPLITWISE_OAUTH_REQUEST_URL` (default: `https://secure.splitwise.com/api/v3.0/get_request_token`) (required)

### `SPLITWISE_OAUTH_TOKEN_URL` (default: `https://secure.splitwise.com/api/v3.0/get_access_token`) (required)

### `SPLITWISE_OAUTH_AUTHORIZE_URL` (default: `https://secure.splitwise.com/authorize`) (required)

### `SPLITWISE_OAUTH_CALLBACK_URL` (default: none) (required)

### `SPLITWISE_OAUTH_SIGNATURE_METHOD` (default: `HMAC-SHA1`) (required)

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
    $ heroku config:set SLACK_WEBHOOK_URL=https://hooks.slack.com/services/AAA/BBB/CCC
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