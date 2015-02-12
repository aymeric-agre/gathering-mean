'use strict';

// Configuring the Articles module
angular.module('patterns').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Patterns', 'patterns', 'dropdown', '/patterns(/create)?');
		Menus.addSubMenuItem('topbar', 'patterns', 'List Patterns', 'patterns');
		Menus.addSubMenuItem('topbar', 'patterns', 'New Pattern', 'patterns/create');
	}
]);