'use strict';

(function() {
	// Avatars Controller Spec
	describe('Avatars Controller Tests', function() {
		// Initialize global variables
		var AvatarsController,
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

			// Initialize the Avatars controller.
			AvatarsController = $controller('AvatarsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Avatar object fetched from XHR', inject(function(Avatars) {
			// Create sample Avatar using the Avatars service
			var sampleAvatar = new Avatars({
				name: 'New Avatar'
			});

			// Create a sample Avatars array that includes the new Avatar
			var sampleAvatars = [sampleAvatar];

			// Set GET response
			$httpBackend.expectGET('avatars').respond(sampleAvatars);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.avatars).toEqualData(sampleAvatars);
		}));

		it('$scope.findOne() should create an array with one Avatar object fetched from XHR using a avatarId URL parameter', inject(function(Avatars) {
			// Define a sample Avatar object
			var sampleAvatar = new Avatars({
				name: 'New Avatar'
			});

			// Set the URL parameter
			$stateParams.avatarId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/avatars\/([0-9a-fA-F]{24})$/).respond(sampleAvatar);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.avatar).toEqualData(sampleAvatar);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Avatars) {
			// Create a sample Avatar object
			var sampleAvatarPostData = new Avatars({
				name: 'New Avatar'
			});

			// Create a sample Avatar response
			var sampleAvatarResponse = new Avatars({
				_id: '525cf20451979dea2c000001',
				name: 'New Avatar'
			});

			// Fixture mock form input values
			scope.name = 'New Avatar';

			// Set POST response
			$httpBackend.expectPOST('avatars', sampleAvatarPostData).respond(sampleAvatarResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Avatar was created
			expect($location.path()).toBe('/avatars/' + sampleAvatarResponse._id);
		}));

		it('$scope.update() should update a valid Avatar', inject(function(Avatars) {
			// Define a sample Avatar put data
			var sampleAvatarPutData = new Avatars({
				_id: '525cf20451979dea2c000001',
				name: 'New Avatar'
			});

			// Mock Avatar in scope
			scope.avatar = sampleAvatarPutData;

			// Set PUT response
			$httpBackend.expectPUT(/avatars\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/avatars/' + sampleAvatarPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid avatarId and remove the Avatar from the scope', inject(function(Avatars) {
			// Create new Avatar object
			var sampleAvatar = new Avatars({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Avatars array and include the Avatar
			scope.avatars = [sampleAvatar];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/avatars\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleAvatar);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.avatars.length).toBe(0);
		}));
	});
}());