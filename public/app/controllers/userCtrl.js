
angular.module('userCtrl', ['ngDialog'])

// User controller for the main page
// Inject the User factory
.controller('userController', function(User,ngDialog,$scope) {
	var vm = this;
	vm.configArray=[];
	//vm.value=vm.availableOptions[0];
User.conf()
	.success(function(data) {
		

		vm.selectBox = data.availableOptions;
		vm.repeatSelect=vm.selectBox[0].Name;
	});
console.log(vm.selectBox);
vm.changeE=function(){
User.conf()
	.success(function(data) {
		
	console.log(data.shutterspeed);
if(vm.repeatSelect.Name=='shutterspeed')
		vm.optionBox = data.shutterspeed;
	
	if(vm.repeatSelect.Name=='F-Number')
		vm.optionBox = data.FNumber;
	if(vm.repeatSelect.Name=='iso')
		vm.optionBox = data.iso;


		
	});};
	
	
	vm.editVal=function(name)
	{console.log(name);
	
	
	var temp=name.slice(0,(name.search('[0-9]')));
	console.log(temp);
	var tempo;

	for(var i=0; i<vm.configArray.length;i++)
	{	var newVal=vm.configArray[i].Value;
		if(vm.configArray[i].Name==name)
		{console.log(vm.configArray[i].Value);
	

	console.log($scope);
	console.log(vm);
	var ndg=ngDialog.open({ template: 'templateId',
	
	 controller: ['$scope','User','$rootScope', function($scope,User,$rootScope) {
	 //console.log($rootScope);
	//console.log($scope);
	 console.log(vm);
	$scope.popupIn=function()
	 {
		 console.log(newVal.search('='));
		if(newVal.search('=')<0)
			ndg.close();
		newVal=	newVal.slice(0,newVal.search('='));
		newVal=newVal+'='+$scope.valueSelect2.Choice; 
		 console.log(newVal);
		  console.log(vm.configArray[i-1]);
		 console.log(i);
		 
	vm.configArray[i-1].Value=newVal;
		 ndg.close();
	 };
  
	  User.conf()
	.success(function(data) {
		
	if(temp=='shutterspeed')
		tempo= data.shutterspeed;
	
	if(temp=='F-Number')
		tempo= data.FNumber;
	if(temp=='iso')
		tempo = data.iso;
	

	    $scope.optionBox2= tempo;
	
		
	});
	  
    }]
	});
		}
	}
	
	};
	
	vm.delVal=function(name)
	{console.log(name);};

	
	
	var i=0;
	vm.AddR= function() {
		if(vm.valueSelect)
			console.log(vm.valueSelect);
vm.valueRequired=vm.valueSelect.Choice;
		var vlaueGet=vm.repeatSelect.Value+'='+vm.valueRequired;
		var getName=vm.repeatSelect.Name+i;
		var newElement={Name:getName , Value:  vlaueGet};

		vm.configArray[i]=newElement;
		console.log(vm.configArray);
		console.log(i);
		i++;
	};
	var capValue='Capture';
	
	vm.CapA= function() {
	capValue=capValue+i;
	var captureT={Name: capValue, Value:  '--capture-image-and-download'};
		vm.configArray[i]=captureT;
		i++;
		
	};
var waitValue='Wait';

	vm.WaitC=function() {
waitValue=waitValue+i;
var waitT={Name: waitValue, Value:  '--wait-event=5'};

		vm.configArray[i]=waitT;
		i++;
		
	};

	
	vm.SendR= function() {
		User.confSend(vm.configArray)
		.success(function(data) {
			vm.configArray=[];
			i=0;
			console.log('sent');
		});
	}
	
})

// Controller applied to user creation page
.controller('userCreateController', function(User) {
	var vm = this;

	// Variable to hide/show elements of the view differentiates between create or edit pages
	vm.type = 'create';

	// Function to create a user
	vm.saveUser = function() {
		vm.processing = true;

		// Clear the message
		vm.message = '';

		// Use the create function in the userService
		User.create(vm.userData)
		.success(function(data) {
			vm.processing = false;

			// Clear the form
			vm.userData = {};
			vm.message = data.message;
		});
	};
})

// Controller applied to user edit page
.controller('userEditController', function($routeParams, User) {
	var vm = this;

	// Variable to hide/show elements of the view differentiates between create or edit pages
	vm.type = 'edit';

	// Get the user data for the user you want to edit
	// $routeParams is the way we grab data from the URL
	User.get($routeParams.user_id)
	.success(function(data) {
		vm.userData = data;
	});

	// Function to save the user
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// Call the userService function to update
		User.update($routeParams.user_id, vm.userData)
		.success(function(data) {
			vm.processing = false;
			vm.userData = {};
			vm.message = data.message;
		});
	};
});



   