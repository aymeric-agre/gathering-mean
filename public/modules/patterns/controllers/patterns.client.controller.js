'use strict';

// Patterns controller
angular.module('patterns').controller('PatternsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Patterns',
	function($scope, $stateParams, $location, Authentication, Patterns) {
		$scope.authentication = Authentication;

		// Create new Pattern
		$scope.create = function() {
			// Create new Pattern object
			var pattern = new Patterns ({
				name: this.name
			});

			// Redirect after save
			pattern.$save(function(response) {
				$location.path('patterns/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Pattern
		$scope.remove = function(pattern) {
			if ( pattern ) { 
				pattern.$remove();

				for (var i in $scope.patterns) {
					if ($scope.patterns [i] === pattern) {
						$scope.patterns.splice(i, 1);
					}
				}
			} else {
				$scope.pattern.$remove(function() {
					$location.path('patterns');
				});
			}
		};

		// Update existing Pattern
		$scope.update = function() {
			var pattern = $scope.pattern;

			pattern.$update(function() {
				$location.path('patterns/' + pattern._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Patterns
		$scope.find = function() {
			$scope.patterns = Patterns.query();
		};

		// Find existing Pattern
		$scope.findOne = function() {
			$scope.pattern = Patterns.get({ 
				patternId: $stateParams.patternId
			});
		};
	}
]);