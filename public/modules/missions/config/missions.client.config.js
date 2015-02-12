'use strict';

// Configuring the Articles module
angular.module('missions').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Missions', 'missions', 'dropdown', '/missions(/create)?');
		Menus.addSubMenuItem('topbar', 'missions', 'List Missions', 'missions');
		Menus.addSubMenuItem('topbar', 'missions', 'New Mission', 'missions/create');
	}
]);