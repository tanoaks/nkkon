angular.module('mainCtrl', [])
.controller('mainController', function($rootScope, $location, Auth) {
	var vm = this;

	// Get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// Check to see if a user is logged in on every request
	/*$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		
		// Get user information to route change
		Auth.getUser()
		.success(function(data) {
			vm.user = data._doc;
		});
	});
*/
	// Function to handle login form
	vm.doLogin = function() {
		vm.processing = true;

		// Clear the error
		vm.error = '';

		// Call the Auth.login() function
	
			vm.processing = false;
			// If a user successfully logs in, redirect to users page
			if (vm.loginData.username=='admin'&&vm.loginData.password=='admin') {
				$location.path('/users');
			} else {
				vm.error = 'error';
			}			
		
	};

	// Function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		// eser all user info
		vm.user = {};
		$location.path('/login');
	};
});