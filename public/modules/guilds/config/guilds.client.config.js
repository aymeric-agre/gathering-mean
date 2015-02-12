'use strict';

// Configuring the Articles module
angular.module('guilds').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Guilds', 'guilds', 'dropdown', '/guilds(/create)?');
		Menus.addSubMenuItem('topbar', 'guilds', 'List Guilds', 'guilds');
		Menus.addSubMenuItem('topbar', 'guilds', 'New Guild', 'guilds/create');
	}
]);