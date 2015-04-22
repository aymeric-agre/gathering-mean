'use strict';

angular.module('messages').controller('CreateMessageController', ['$scope', 'Messages', '$state', 'allUsers', 'message','Authentication',
	function($scope, Messages, $state, allUsers, message, Authentication) {

        $scope.users = allUsers;
        $scope.messageForm = new Messages();

        //Fill the new message if answer
        if(message !== '{}' && message !== '') {        //Si ce n'est pas vide
            var oldMessage = JSON.parse(message);    //params is a string, we need an object
            console.log(oldMessage);
            $scope.messageForm.userRecipient = [];
            $scope.messageForm.userRecipient[0] = oldMessage.userSender;
            for (var i = 1; i < (oldMessage.userRecipient.length + 1); i++) {
                if(oldMessage.userRecipient[i - 1]._id !== Authentication.user._id) {
                    $scope.messageForm.userRecipient.push(oldMessage.userRecipient[i - 1]);
                }
            }
            $scope.messageForm.content = oldMessage.content;
            $scope.messageForm.subject = 'RE : ' + oldMessage.subject;
        }

        // Create new Message
        $scope.create = function() {

            //Transform userRecipient into _id
            for(var i=0;i<$scope.messageForm.userRecipient.length; i++){
                $scope.messageForm.userRecipient[i] = $scope.messageForm.userRecipient[i]._id;
            }

            // Redirect after save
            $scope.messageForm.$save(function(response) {
                $state.go('messages.listMessages', {}, {reload : true});
                // Clear form fields
                $scope.userSender = '';
                $scope.userRecipient = [];
                $scope.subject = '';
                $scope.content = '';

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
	}
]);
