(function($, angular) {

  var app = angular.module('splitwise2slack', ['ui.bootstrap', 'ngCookies']);

  var api = function($http) {
    return function(endpoint, method, data, headers) {
      if(typeof method !== 'string')
        method = 'GET';
      return $http({
        method: method,
        url: '/api' + endpoint,
        data: typeof data === 'object' ? data : {},
        headers: typeof headers === 'object' ? headers : {}
      });
    }
  };

  api.$inject = ['$http'];
  app.factory('api', api);

  var MainController = function($q, $cookies, api) {
    this.$q = $q;
    this.api = function(endpoint, method, data, headers) {
      return api(endpoint, method, {}, $.extend({'Authorization': 'Basic ' + this.data.secret}, headers || {}))
        .then(function(response) {
          $cookies.put('secret', this.data.secret);
          return response;
        }.bind(this));
    }.bind(this);

    this.data = {
      links: [],
      secret: $cookies.get('secret') || '',
      new_link_name: ''
    };

    this.state = {
      loading: false,
      fetched: false,
      error: ''
    };
  };

  MainController.prototype.fetchLinks = function($event) {
    if($event) $event.preventDefault();

    this.state.loading = true;
    this.state.error = '';

    return this.api('/links')
      .then(function(response) {
        this.data.links = response.data;
      }.bind(this), function(response) {
        this.data.links = [];
        console.error(response.data, response);
        if(response.data.message) {
          this.state.error = response.data.message;
        }
      }.bind(this))
      .then(function() {
        this.state.loading = false;
        this.state.fetched = true;
      }.bind(this));
  };

  MainController.prototype.newLink = function($event) {
    if($event) $event.preventDefault();
    this.state.loading = true;
    this.state.error = '';

    if(!this.data.new_link_name) {
      this.state.error = 'A name is required to create a new link.';
      return this.$q.reject(this.state.error);
    }

    return this.api('/link_redirect')
      .then(function(response) {
        location.href = response.data.url + '?name=' + encodeURIComponent(this.data.new_link_name) + '&secret=' + encodeURIComponent(this.data.secret);
      }.bind(this), function(response) {
        console.error(response.data, response);
        if(response.data.message) {
          this.state.error = response.data.message;
        }
      }.bind(this))
      .then(function() {
        this.state.loading = false;
      }.bind(this));

  };

  MainController.$inject = ['$q', '$cookies', 'api'];
  app.controller('MainController', MainController);

})(jQuery, angular);