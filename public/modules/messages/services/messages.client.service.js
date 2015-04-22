'use strict';

//Messages service used to communicate Messages REST endpoints
angular.module('messages').factory('Messages', ['$resource','Authentication',
    function($resource, Authentication) {

        return $resource('messages/:userId/:messageId', {userId : Authentication.user._id, messageId: '@_id'});
    }
]);

angular.module('messages').factory('allMessagesLoader', ['Messages', '$q', 'Authentication',
    function(Messages, $q, Authentication) {
        var currentUser = Authentication.user;
        return function(){
            var delay = $q.defer();
            Messages.query({userId : currentUser._id}, function(allMessages){
                delay.resolve(allMessages);
            }, function(){
                delay.reject('Pas de messages trouvés');
            });
            return delay.promise;
        };
    }
]);
