'use strict';

//Setting up route
angular.module('guilds').config(['$stateProvider',
	function($stateProvider) {
		// Guilds state routing
		$stateProvider.
		state('listGuilds', {
			url: '/guilds',
			templateUrl: 'modules/guilds/views/list-guilds.client.view.html'
		}).
		state('createGuild', {
			url: '/guilds/create',
			templateUrl: 'modules/guilds/views/create-guild.client.view.html'
		}).
		state('viewGuild', {
			url: '/guilds/:guildId',
			templateUrl: 'modules/guilds/views/view-guild.client.view.html'
		}).
		state('editGuild', {
			url: '/guilds/:guildId/edit',
			templateUrl: 'modules/guilds/views/edit-guild.client.view.html'
		});
	}
]);