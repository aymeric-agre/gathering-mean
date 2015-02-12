'use strict';

(function() {
	// Missions Controller Spec
	describe('Missions Controller Tests', function() {
		// Initialize global variables
		var MissionsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Missions controller.
			MissionsController = $controller('MissionsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Mission object fetched from XHR', inject(function(Missions) {
			// Create sample Mission using the Missions service
			var sampleMission = new Missions({
				name: 'New Mission'
			});

			// Create a sample Missions array that includes the new Mission
			var sampleMissions = [sampleMission];

			// Set GET response
			$httpBackend.expectGET('missions').respond(sampleMissions);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.missions).toEqualData(sampleMissions);
		}));

		it('$scope.findOne() should create an array with one Mission object fetched from XHR using a missionId URL parameter', inject(function(Missions) {
			// Define a sample Mission object
			var sampleMission = new Missions({
				name: 'New Mission'
			});

			// Set the URL parameter
			$stateParams.missionId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/missions\/([0-9a-fA-F]{24})$/).respond(sampleMission);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.mission).toEqualData(sampleMission);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Missions) {
			// Create a sample Mission object
			var sampleMissionPostData = new Missions({
				name: 'New Mission'
			});

			// Create a sample Mission response
			var sampleMissionResponse = new Missions({
				_id: '525cf20451979dea2c000001',
				name: 'New Mission'
			});

			// Fixture mock form input values
			scope.name = 'New Mission';

			// Set POST response
			$httpBackend.expectPOST('missions', sampleMissionPostData).respond(sampleMissionResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Mission was created
			expect($location.path()).toBe('/missions/' + sampleMissionResponse._id);
		}));

		it('$scope.update() should update a valid Mission', inject(function(Missions) {
			// Define a sample Mission put data
			var sampleMissionPutData = new Missions({
				_id: '525cf20451979dea2c000001',
				name: 'New Mission'
			});

			// Mock Mission in scope
			scope.mission = sampleMissionPutData;

			// Set PUT response
			$httpBackend.expectPUT(/missions\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/missions/' + sampleMissionPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid missionId and remove the Mission from the scope', inject(function(Missions) {
			// Create new Mission object
			var sampleMission = new Missions({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Missions array and include the Mission
			scope.missions = [sampleMission];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/missions\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMission);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.missions.length).toBe(0);
		}));
	});
}());