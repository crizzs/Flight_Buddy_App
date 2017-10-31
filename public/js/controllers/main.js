angular.module('omController', [])

	// inject the Todo service factory into our controller
	.controller('mainController', ['$scope','$http','sms','flight','$window','$location','Upload', function($scope, $http,sms,flight,$window,$location,Upload) {
		$scope.formData = {};
		$scope.flightManualData = {};
		$scope.myflights = {};
		$scope.loading = true;

		/*****************API********************/

		//Verify users by sending sms
		$scope.verifyPhone = function () {
			if ($scope.formData.text != undefined) {
				$scope.loading = true;
				var status = sms.verify($scope.formData)
					.success(function(data) {
						
						$scope.loading = false;
						$scope.formData = {}; 
						
						if(data == "true"){
							$window.alert("An SMS had been sent to you!");
						}else{
							$window.alert("Please Try Again!");
						}
					}).error(function(){
						//handle error
						$window.alert("You have encountered an error! Please try again");
					});
				
			}else{
				$window.alert("Please place in your phone number for verification purposes!");
			}
		};

		//Authenticate OTP and Phone Number (Universal checks across all pages)
		$scope.authenticate = function(){
			$scope.phone = $window.phone;
			$scope.otp = $window.otp;
			//Authenticate OTP is correct for a particular phone number
			sms.authenticate($scope.phone,$scope.otp)
					.success(function(data) {
						
						$scope.loading = false;
						
						if(data== ""){
							//Go back to index page
							$window.location.href = '/index.html';
						}else{
							$scope.user = data;
						}
						
						
					}).error(function(){
						//handle error
						$window.alert("You have encountered an error! Please try again");
						//Go back to index page
						$window.location.href = '/index.html';
					});

		};

		//Add Flight Manually
		$scope.addFlightManually = function(){
			$scope.phone = $window.phone;
			$scope.otp = $window.otp;

			if ($scope.flightManualData.flightNo != undefined) {
				$scope.loading = true;
				flight.manualAddFlight($scope.flightManualData.flightNo,phone)
					.success(function(data) {
							
							$scope.loading = false;
							
							if(data== false){
								$window.alert("Your flight is not being added! Please try again!");
							}else{
								$window.location.href = '/myflights.html?phone='+$scope.phone+'&otp='+$scope.otp;
							}
							
						}).error(function(){
							//handle error
							$window.alert("You have encountered an error! Please try again");
							
						});
			}

		}

		//Retrieve all Flight Information of user
		$scope.retrieveAllFlights = function(){
			$scope.phone = $window.phone;
			$scope.loading = true;

			flight.getAll($scope.phone)
				.success(function(data) {
								
								$scope.loading = false;
								
								if(data != "null"){
									$scope.myflights = data;
									
								}
								
							}).error(function(err){
								
								//handle error
								$window.alert("You have encountered an error! Please try again");
								
							});

		}

		// upload image and start OCR
	    $scope.upload = function (file) {
	    	//If file existed, execute the code
	    	$scope.phone = $window.phone;

	        if(file != ""){
		        Upload.base64DataUrl(file, true).then(function(base64) {
		        	
				    flight.ocrAddFlight({base64str:base64,phone:$scope.phone})
				    .success(function(data) {
							
							if(data == false){
								$window.alert("The image scan is not successful. Please try again!");
							}		
							//This return is generated from OCR.
							$window.alert("The image scanned is "+ data);
							$window.location.href = '/myflights.html?phone='+$scope.phone+'&otp='+$scope.otp;		
								
						});	
				})
		    }    
	    };


        /*****************Navigation********************/
		//A series of functions to navigation within the prototype
		$scope.goToHome = function(){
			$window.location.href = '/';
		};
		//Navi to Main Page
		$scope.goToMain = function(){
			$scope.phone = $window.phone;
			$scope.otp = $window.otp;
			$window.location.href = '/main.html?phone='+$scope.phone+'&otp='+$scope.otp;
		};

		//Navi to Coupons Page
		$scope.goToCoupon = function(){
			$scope.phone = $window.phone;
			$scope.otp = $window.otp;
			$window.location.href = '/coupons.html?phone='+$scope.phone+'&otp='+$scope.otp;
		};

		//Navi to Pre-flight Check-In Page
		$scope.goToPreCheckin = function(){
			$scope.phone = $window.phone;
			$scope.otp = $window.otp;
			$window.location.href = '/checkin.html?phone='+$scope.phone+'&otp='+$scope.otp;
		};

		//Navi to My Flights
		$scope.goToMyFlights = function(){
			$scope.phone = $window.phone;
			$scope.otp = $window.otp;
			$window.location.href = '/myflights.html?phone='+$scope.phone+'&otp='+$scope.otp;
		};

		//Navi to manual add flight
		$scope.goManualAddFlight = function(){
			$scope.phone = $window.phone;
			$scope.otp = $window.otp;
			$window.location.href = '/addflightmanual.html?phone='+$scope.phone+'&otp='+$scope.otp;
		};

		//Navi to add flight using Tesseract OCR
		$scope.ocrAddFlight = function(){
			$scope.phone = $window.phone;
			$scope.otp = $window.otp;
			$window.location.href = '/addflightocr.html?phone='+$scope.phone+'&otp='+$scope.otp;
		};

		
	}]);