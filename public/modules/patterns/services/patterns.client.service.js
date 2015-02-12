'use strict';

//Patterns service used to communicate Patterns REST endpoints
angular.module('patterns').factory('Patterns', ['$resource',
	function($resource) {
		return $resource('patterns/:patternId', { patternId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);