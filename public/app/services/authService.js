angular.module('authService', [])

// Auth factory to login and get information
// Inject $http for communicating with the API
// Inject $q to return promise objects
// Inject AuthToken to manage tokens
.factory('Auth', function($http, $q, AuthToken) {
	// Vreate auth factory object
	var authFactory = {};

	// Handle Login
	authFactory.login = function(username, password) {
		// Return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
		.success(function(data) {
			AuthToken.setToken(data.token);
			return data;
		});
	};

	// Handle Logout
	authFactory.logout = function() {
		// Clear the token
		AuthToken.setToken();
	};

	// Check if a user is logged in. Checks if there is a local token?
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken()) {
			return true;
		} else {
			return false;
		}
	};

	// Get the user info
	authFactory.getUser = function () {
		if (AuthToken.getToken()) {
			return $http.get('/api/me');
		} else {
			return $q.reject({ message: 'User has no token.'});
		}
	};

	// Return auth factory object
	return authFactory;
})

// Factory for handling tokens
// Inject $window to store token client-side
.factory('AuthToken', function($window) {
	var authTokenFactory = {};

	// Get the token
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};

	// Set the token or clear the token. 
	// If a token is passed, set the token. 
	// If there is no token, clear it from local storage
	authTokenFactory.setToken = function(token) {
		if (token) {
			$window.localStorage.setItem('token', token);			
		} else {
			$window.localStorage.removeItem('token');
		}
	}

	return authTokenFactory;
})

// Application configuration to intergrate token into requests
.factory('AuthInterceptor', function($q, AuthToken) {
	var interceptorFactory = {};

	// Attach the token to every request
	interceptorFactory.request = function(config) {
		// Grab the token
		var token = AuthToken.getToken();

		// If thr token exists, add it to the header as x-access-token
		if (token) {
			config.headers['x-access-token'] = token;
		}
		return config;
	};

	// Redirect if a token doesn't authenticate
	interceptorFactory.responseError = function(response) {
		// If tour server return a 403 forbidden response
		if (response.status == 403) {
			AuthToken.setToken();
			$location.path('/login');
		}

		// Return the error from the server as a promise
		return $q.reject(response);
	};

	return interceptorFactory;
});