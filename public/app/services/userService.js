angular.module('userService', [])
.factory('User', function($http) {

	// Create the object
	var userFactory = {};

	// Get a single user
	userFactory.get = function(id) {
		return $http.get('/api/users/' + id);
	};

	// Get all users
	userFactory.all = function() {
		return $http.get('/api/users/');
	};

	// Create a user
	userFactory.create = function(userData) {
		return $http.post('/api/users/', userData);
	};

	// Update a user
	userFactory.update = function(id, userData) {
		return $http.put('/api/users/' + id, userData);
	};

	// Delete a user
	userFactory.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};

	userFactory.conf = function() {
		return $http.get('/conf/');
	};
	
	userFactory.confSend = function(configArray) {
		return $http.post('/setConf/',configArray);
	};

	
	// Return our entire userFactory object
	return userFactory;
});
