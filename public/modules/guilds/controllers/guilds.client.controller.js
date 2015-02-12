'use strict';

// Guilds controller
angular.module('guilds').controller('GuildsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Guilds',
	function($scope, $stateParams, $location, Authentication, Guilds) {
		$scope.authentication = Authentication;

		// Create new Guild
		$scope.create = function() {
			// Create new Guild object
			var guild = new Guilds ({
				name: this.name
			});

			// Redirect after save
			guild.$save(function(response) {
				$location.path('guilds/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Guild
		$scope.remove = function(guild) {
			if ( guild ) { 
				guild.$remove();

				for (var i in $scope.guilds) {
					if ($scope.guilds [i] === guild) {
						$scope.guilds.splice(i, 1);
					}
				}
			} else {
				$scope.guild.$remove(function() {
					$location.path('guilds');
				});
			}
		};

		// Update existing Guild
		$scope.update = function() {
			var guild = $scope.guild;

			guild.$update(function() {
				$location.path('guilds/' + guild._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Guilds
		$scope.find = function() {
			$scope.guilds = Guilds.query();
		};

		// Find existing Guild
		$scope.findOne = function() {
			$scope.guild = Guilds.get({ 
				guildId: $stateParams.guildId
			});
		};
	}
]);