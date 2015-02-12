'use strict';

(function() {
	// Guilds Controller Spec
	describe('Guilds Controller Tests', function() {
		// Initialize global variables
		var GuildsController,
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

			// Initialize the Guilds controller.
			GuildsController = $controller('GuildsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Guild object fetched from XHR', inject(function(Guilds) {
			// Create sample Guild using the Guilds service
			var sampleGuild = new Guilds({
				name: 'New Guild'
			});

			// Create a sample Guilds array that includes the new Guild
			var sampleGuilds = [sampleGuild];

			// Set GET response
			$httpBackend.expectGET('guilds').respond(sampleGuilds);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.guilds).toEqualData(sampleGuilds);
		}));

		it('$scope.findOne() should create an array with one Guild object fetched from XHR using a guildId URL parameter', inject(function(Guilds) {
			// Define a sample Guild object
			var sampleGuild = new Guilds({
				name: 'New Guild'
			});

			// Set the URL parameter
			$stateParams.guildId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/guilds\/([0-9a-fA-F]{24})$/).respond(sampleGuild);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.guild).toEqualData(sampleGuild);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Guilds) {
			// Create a sample Guild object
			var sampleGuildPostData = new Guilds({
				name: 'New Guild'
			});

			// Create a sample Guild response
			var sampleGuildResponse = new Guilds({
				_id: '525cf20451979dea2c000001',
				name: 'New Guild'
			});

			// Fixture mock form input values
			scope.name = 'New Guild';

			// Set POST response
			$httpBackend.expectPOST('guilds', sampleGuildPostData).respond(sampleGuildResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Guild was created
			expect($location.path()).toBe('/guilds/' + sampleGuildResponse._id);
		}));

		it('$scope.update() should update a valid Guild', inject(function(Guilds) {
			// Define a sample Guild put data
			var sampleGuildPutData = new Guilds({
				_id: '525cf20451979dea2c000001',
				name: 'New Guild'
			});

			// Mock Guild in scope
			scope.guild = sampleGuildPutData;

			// Set PUT response
			$httpBackend.expectPUT(/guilds\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/guilds/' + sampleGuildPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid guildId and remove the Guild from the scope', inject(function(Guilds) {
			// Create new Guild object
			var sampleGuild = new Guilds({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Guilds array and include the Guild
			scope.guilds = [sampleGuild];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/guilds\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGuild);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.guilds.length).toBe(0);
		}));
	});
}());