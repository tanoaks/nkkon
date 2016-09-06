angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
	$routeProvider
	//Home Page route
	.when('/', {
		templateUrl : 'app/views/pages/home.html'
	})

	// Login Page route
	.when('/login', {
		templateUrl : 'app/views/pages/login.html',
		controller : 'mainController',
		controllerAs : 'login'
	})

	// Show all users
	.when('/users', {
		templateUrl : 'app/views/pages/users/all.html',
		controller : 'userController',
		controllerAs : 'user'
	})

	// Form to create a new user
	// Same view as edit page
	.when('/users/create', {
		templateUrl : 'app/views/pages/users/single.html',
		controller : 'userCreateController',
		controllerAs : 'user'
	})

	// Page to edit a user
	.when('/users/:user_id', {
		templateUrl : 'app/views/pages/users/single.html',
		controller : 'userEditController',
		controllerAs : 'user'
	});

	// Get rid of the hash in the URL
	$locationProvider.html5Mode(true);
});