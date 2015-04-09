'use strict';

//Setting up route
angular.module('messages').config(['$stateProvider', 'uiSelectConfig',
	function($stateProvider, uiSelectConfig) {

        uiSelectConfig.theme = 'bootstrap';
        uiSelectConfig.resetSearchInput = true;


		// Messages state routing
		$stateProvider.
            state('createMessage', {
                url: '/message/create/:messageObject',
                controller : 'CreateMessageController',
                templateUrl: 'modules/messages/views/create-message.client.view.html',
                resolve : {
                        allUsers : function(allUsersLoader){return allUsersLoader();},
                        message : ['Messages', '$stateParams', '$q',function(Messages, $stateParams, $q) {{return $stateParams.messageObject;}}]
                }
            }).

            state('messages', {
                abstract : true,
                template : '<ui-view/>',
                url : '/messages/:userId',
                controller : 'MessagesController',
                resolve : {allMessages : function(allMessagesLoader) {return allMessagesLoader();} }
            }).
            state('messages.listMessages', {
                url: '/list',
                templateUrl: 'modules/messages/views/list-messages.client.view.html'
            }).
            state('messages.viewMessage', {
                url: '/:messageId',
                templateUrl: 'modules/messages/views/view-message.client.view.html'
            });
	}
]);
