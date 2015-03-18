'use strict';

angular.module('missions').directive('showAuthenticate', ['Authentication',
	function(Authentication) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
                //element.hide();
                console.log(scope.mission);
                var members = scope.mission.members;
                for (var i=0; i<members.length; i++){
                    if(members(i).user._id === Authentication.user._id){
                        if(members(i).roles.indexOf('admin') > -1){
                            console.log(members(i).roles.indexOf('admin'));
                            element.show();
                        }
                        break;
                    }
                }
			}
		};
	}
]);
