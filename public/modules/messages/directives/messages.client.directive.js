'use strict';

angular.module('messages').directive('myDirective', [
	function() {
		return {
			template: '',
			restrict: 'A',
			link: function postLink(scope, element, attrs) {

				element.text('this is the messages directive');
			}
		};
	}
]);
