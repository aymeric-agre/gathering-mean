'use strict';

(function() {
	// Patterns Controller Spec
	describe('Patterns Controller Tests', function() {
		// Initialize global variables
		var PatternsController,
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

			// Initialize the Patterns controller.
			PatternsController = $controller('PatternsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Pattern object fetched from XHR', inject(function(Patterns) {
			// Create sample Pattern using the Patterns service
			var samplePattern = new Patterns({
				name: 'New Pattern'
			});

			// Create a sample Patterns array that includes the new Pattern
			var samplePatterns = [samplePattern];

			// Set GET response
			$httpBackend.expectGET('patterns').respond(samplePatterns);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.patterns).toEqualData(samplePatterns);
		}));

		it('$scope.findOne() should create an array with one Pattern object fetched from XHR using a patternId URL parameter', inject(function(Patterns) {
			// Define a sample Pattern object
			var samplePattern = new Patterns({
				name: 'New Pattern'
			});

			// Set the URL parameter
			$stateParams.patternId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/patterns\/([0-9a-fA-F]{24})$/).respond(samplePattern);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.pattern).toEqualData(samplePattern);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Patterns) {
			// Create a sample Pattern object
			var samplePatternPostData = new Patterns({
				name: 'New Pattern'
			});

			// Create a sample Pattern response
			var samplePatternResponse = new Patterns({
				_id: '525cf20451979dea2c000001',
				name: 'New Pattern'
			});

			// Fixture mock form input values
			scope.name = 'New Pattern';

			// Set POST response
			$httpBackend.expectPOST('patterns', samplePatternPostData).respond(samplePatternResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Pattern was created
			expect($location.path()).toBe('/patterns/' + samplePatternResponse._id);
		}));

		it('$scope.update() should update a valid Pattern', inject(function(Patterns) {
			// Define a sample Pattern put data
			var samplePatternPutData = new Patterns({
				_id: '525cf20451979dea2c000001',
				name: 'New Pattern'
			});

			// Mock Pattern in scope
			scope.pattern = samplePatternPutData;

			// Set PUT response
			$httpBackend.expectPUT(/patterns\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/patterns/' + samplePatternPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid patternId and remove the Pattern from the scope', inject(function(Patterns) {
			// Create new Pattern object
			var samplePattern = new Patterns({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Patterns array and include the Pattern
			scope.patterns = [samplePattern];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/patterns\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(samplePattern);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.patterns.length).toBe(0);
		}));
	});
}());