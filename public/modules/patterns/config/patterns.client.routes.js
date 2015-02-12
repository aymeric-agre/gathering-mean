'use strict';

//Setting up route
angular.module('patterns').config(['$stateProvider',
	function($stateProvider) {
		// Patterns state routing
		$stateProvider.
		state('listPatterns', {
			url: '/patterns',
			templateUrl: 'modules/patterns/views/list-patterns.client.view.html'
		}).
		state('createPattern', {
			url: '/patterns/create',
			templateUrl: 'modules/patterns/views/create-pattern.client.view.html'
		}).
		state('viewPattern', {
			url: '/patterns/:patternId',
			templateUrl: 'modules/patterns/views/view-pattern.client.view.html'
		}).
		state('editPattern', {
			url: '/patterns/:patternId/edit',
			templateUrl: 'modules/patterns/views/edit-pattern.client.view.html'
		});
	}
]);