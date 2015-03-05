'use strict';

//Setting up route
angular.module('avatars').config(['$stateProvider',
	function($stateProvider) {
		// Avatars state routing
		$stateProvider.
		state('listAvatars', {
			url: '/avatars',
			templateUrl: 'modules/avatars/views/list-avatars.client.view.html'
		}).
		state('createAvatar', {
			url: '/avatars/create',
			templateUrl: 'modules/avatars/views/create-avatar.client.view.html'
		}).
		state('viewAvatar', {
			url: '/avatars/:avatarId',
			templateUrl: 'modules/avatars/views/view-avatar.client.view.html'
		}).
		state('editAvatar', {
			url: '/avatars/:avatarId/edit',
			templateUrl: 'modules/avatars/views/edit-avatar.client.view.html'
		});
	}
]);