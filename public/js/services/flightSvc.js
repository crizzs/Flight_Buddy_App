angular.module('flightService', [])

	// super simple service
	// each function returns a promise object 
	.factory('flight', ['$http',function($http) {
		return {
			getAll : function(phone) {
				return $http.post('/flight/getAll',{phone:phone});
			},
			manualAddFlight : function(flightNo,phone) {
				return $http.post('/flight/addmanual',{ flightNo: flightNo, phone: phone });
			},
			ocrAddFlight : function(base64){
				return $http.post('/flight/addocr',base64);
			}
		}
	}]);