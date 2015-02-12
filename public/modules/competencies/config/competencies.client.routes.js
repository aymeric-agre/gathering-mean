'use strict';

//Setting up route
angular.module('competencies').config(['$stateProvider',
	function($stateProvider) {
		// Competencies state routing
		$stateProvider.
		state('listCompetencies', {
			url: '/competencies',
			templateUrl: 'modules/competencies/views/list-competencies.client.view.html'
		}).
		state('createCompetency', {
			url: '/competencies/create',
			templateUrl: 'modules/competencies/views/create-competency.client.view.html'
		}).
		state('viewCompetency', {
			url: '/competencies/:competencyId',
			templateUrl: 'modules/competencies/views/view-competency.client.view.html'
		}).
		state('editCompetency', {
			url: '/competencies/:competencyId/edit',
			templateUrl: 'modules/competencies/views/edit-competency.client.view.html'
		});
	}
]);