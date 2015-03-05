'use strict';

//Avatars service used to communicate Avatars REST endpoints
angular.module('avatars').factory('Avatars', ['$resource',
	function($resource) {
		return $resource('avatars/:avatarId', { avatarId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);