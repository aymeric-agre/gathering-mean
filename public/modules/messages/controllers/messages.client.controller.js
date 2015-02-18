'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Messages',
	function($scope, $stateParams, $location, Authentication, Messages) {
		$scope.authentication = Authentication;


        //  Contenu du message
        $scope.messageContent = new Messages();
        $scope.showMessage = function(message){$scope.messageContent = message;};

		//  Répondre
        $scope.answer = function(sender){
            $location.path('messages/create');

        };

        $scope.answerAll = function(sender){
            $location.path('messages/create');

        };


		// Create new Message
        $scope.messageForm = new Messages();
		$scope.create = function() {

			// Redirect after save
            $scope.messageForm.$save(function(response) {
				$location.path('messages/' + response._id);

				// Clear form fields
                $scope.userSender = '';
                $scope.userRecipient = [];
                $scope.subject = '';
                $scope.content = '';

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Message
		$scope.remove = function(message) {
			if ( message ) { 
				message.$remove();
                console.log(message);

				for (var i in $scope.messages) {
					if ($scope.messages [i] === message) {
						$scope.messages.splice(i, 1);
					}
				}
			} else {
				$scope.message.$remove(function() {
					$location.path('messages');
				});
			}
		};

		// Find a list of Messages
		$scope.find = function() {
			$scope.messages = Messages.query();
		};

		// Find existing Message
		$scope.findOne = function() {
			$scope.message = Messages.get({ 
				messageId: $stateParams.messageId
			});
		};
	}
]);
