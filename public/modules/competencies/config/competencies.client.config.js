'use strict';

// Configuring the Articles module
angular.module('competencies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Competencies', 'competencies', 'dropdown', '/competencies(/create)?');
		Menus.addSubMenuItem('topbar', 'competencies', 'List Competencies', 'competencies');
		Menus.addSubMenuItem('topbar', 'competencies', 'New Competency', 'competencies/create');
	}
]);