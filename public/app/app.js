angular.module('userApp', [
	'ngAnimate',
	'app.routes',
	'authService',
	'mainCtrl',
	'userCtrl',
	'userService'
])

// Application configuration to integrate token into requests
.config(function($httpProvider) {
	// Attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');
});