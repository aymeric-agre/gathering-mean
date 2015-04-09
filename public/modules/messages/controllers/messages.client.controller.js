'use strict';

// Messages controller
angular.module('messages').controller('MessagesController', ['$scope', '$stateParams', 'Authentication', 'Messages', 'allMessages', '$state',
	function($scope, $stateParams, Authentication, Messages, allMessages, $state) {
		$scope.authentication = Authentication;
        $scope.messages = allMessages;

        //  Contenu du message
        $scope.messageContent = new Messages();
        $scope.showMessage = function(message){$scope.messageContent = message;};

		//  Répondre
        $scope.answer = function(){
            var messageToParams = JSON.stringify($scope.messageContent);    //Must stringify before put into params
            $state.go('createMessage', {messageObject : messageToParams});
        };

		// Remove existing Message
		$scope.remove = function(message) {
			if ( message ) { 
				message.$remove();

				for (var i in $scope.messages) {
					if ($scope.messages [i] === message) {
						$scope.messages.splice(i, 1);
					}
				}
			} else {
				$scope.message.$remove(function() {
					$state.go('messages.listMessages');
				});
			}
		};


		// Find existing Message
		/*$scope.findOne = function() {
			$scope.message = Messages.get({ 
				messageId: $stateParams.messageId
			});
		};*/
	}
]);
