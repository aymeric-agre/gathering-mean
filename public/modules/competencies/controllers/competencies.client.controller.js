'use strict';

// Competencies controller
angular.module('competencies').controller('CompetenciesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Competencies',
	function($scope, $stateParams, $location, Authentication, Competencies) {
		$scope.authentication = Authentication;

		// Create new Competency
		$scope.create = function() {
			// Create new Competency object
			var competency = new Competencies ({
				name: this.name
			});

			// Redirect after save
			competency.$save(function(response) {
				$location.path('competencies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Competency
		$scope.remove = function(competency) {
			if ( competency ) { 
				competency.$remove();

				for (var i in $scope.competencies) {
					if ($scope.competencies [i] === competency) {
						$scope.competencies.splice(i, 1);
					}
				}
			} else {
				$scope.competency.$remove(function() {
					$location.path('competencies');
				});
			}
		};

		// Find a list of Competencies
		$scope.find = function() {
			$scope.competencies = Competencies.query();
		};

		// Find existing Competency
		$scope.findOne = function() {
			$scope.competency = Competencies.get({ 
				competencyId: $stateParams.competencyId
			});
		};
	}
]);
