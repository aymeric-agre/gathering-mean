'use strict';

//Guilds service used to communicate Guilds REST endpoints
angular.module('guilds').factory('Guilds', ['$resource',
	function($resource) {
		return $resource('guilds/:guildId', { guildId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);