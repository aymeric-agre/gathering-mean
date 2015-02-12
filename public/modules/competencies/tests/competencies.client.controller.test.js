'use strict';

(function() {
	// Competencies Controller Spec
	describe('Competencies Controller Tests', function() {
		// Initialize global variables
		var CompetenciesController,
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

			// Initialize the Competencies controller.
			CompetenciesController = $controller('CompetenciesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Competency object fetched from XHR', inject(function(Competencies) {
			// Create sample Competency using the Competencies service
			var sampleCompetency = new Competencies({
				name: 'New Competency'
			});

			// Create a sample Competencies array that includes the new Competency
			var sampleCompetencies = [sampleCompetency];

			// Set GET response
			$httpBackend.expectGET('competencies').respond(sampleCompetencies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.competencies).toEqualData(sampleCompetencies);
		}));

		it('$scope.findOne() should create an array with one Competency object fetched from XHR using a competencyId URL parameter', inject(function(Competencies) {
			// Define a sample Competency object
			var sampleCompetency = new Competencies({
				name: 'New Competency'
			});

			// Set the URL parameter
			$stateParams.competencyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/competencies\/([0-9a-fA-F]{24})$/).respond(sampleCompetency);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.competency).toEqualData(sampleCompetency);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Competencies) {
			// Create a sample Competency object
			var sampleCompetencyPostData = new Competencies({
				name: 'New Competency'
			});

			// Create a sample Competency response
			var sampleCompetencyResponse = new Competencies({
				_id: '525cf20451979dea2c000001',
				name: 'New Competency'
			});

			// Fixture mock form input values
			scope.name = 'New Competency';

			// Set POST response
			$httpBackend.expectPOST('competencies', sampleCompetencyPostData).respond(sampleCompetencyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Competency was created
			expect($location.path()).toBe('/competencies/' + sampleCompetencyResponse._id);
		}));

		it('$scope.update() should update a valid Competency', inject(function(Competencies) {
			// Define a sample Competency put data
			var sampleCompetencyPutData = new Competencies({
				_id: '525cf20451979dea2c000001',
				name: 'New Competency'
			});

			// Mock Competency in scope
			scope.competency = sampleCompetencyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/competencies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/competencies/' + sampleCompetencyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid competencyId and remove the Competency from the scope', inject(function(Competencies) {
			// Create new Competency object
			var sampleCompetency = new Competencies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Competencies array and include the Competency
			scope.competencies = [sampleCompetency];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/competencies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCompetency);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.competencies.length).toBe(0);
		}));
	});
}());