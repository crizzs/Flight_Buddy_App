angular.module('smsService', [])

	// super simple service
	// each function returns a promise object 
	.factory('sms', ['$http',function($http) {
		return {
			verify : function(phone) {
				return $http.post('/sms/verify', phone);
			},
			authenticate : function(phone,otp) {
				return $http.post('/auth/user',{ phone: phone, otp: otp })
			}
		}
	}]);