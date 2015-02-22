'use strict';

//Setting up route
angular.module('messages').config(['$stateProvider',
	function($stateProvider) {
		// Messages state routing
		$stateProvider.
		state('listMessages', {
			url: '/messages/:userId',
			templateUrl: 'modules/messages/views/list-messages.client.view.html',
            controller : 'MessagesController',
            resolve : {allMessages : function(allMessagesLoader) {return allMessagesLoader();} }
		}).
		state('createMessage', {
			url: '/messages/create',
            controller : 'MessagesController',
			templateUrl: 'modules/messages/views/create-message.client.view.html'
		}).
		state('viewMessage', {
			url: '/messages/:userId/:messageId',
            controller : 'MessagesController',
			templateUrl: 'modules/messages/views/view-message.client.view.html'
		});
	}
]);
