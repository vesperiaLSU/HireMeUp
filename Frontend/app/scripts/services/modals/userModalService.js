(function() {
    "use strict";

    angular.module("common.service").service("userModalService", ["$uibModal", "$auth", "userService", "$state", "alertService", "userStorage",
        function($uibModal, $auth, userService, $state, alertService, userStorage) {
            this.open = function(type, scope) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/userModal.html',
                    controller: 'userModalCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'custom-modal',
                    openedClass: 'always-scroll',
                    resolve: {
                        user: {
                            email: scope.email,
                            name: scope.displayName,
                            avatar_url: scope.avatar_url
                        }
                    }
                });

                modalInstance.result.then(function(update) {
                        var user = userStorage.getUser();
                        if ($auth.isAuthenticated()) {
                            userService.update({
                                id: user._id
                            }, update).$promise.then(function(user) {
                                userStorage.setUser(user);
                                scope.displayName = user.displayName;
                                scope.avatar_url = user.avatar_url;
                                $("#avatar").attr("src", user.avatar_url);
                                alertService("success", "You succesfully edited your profile!", '', "job-alert");
                            }).catch(function(error) {
                                alertService('warning', 'Opps!', 'Error editing your profile: ', error.message, 'job-alert');
                            });
                        }
                        else {
                            $state.go("login");
                            alertService("warning", "Opps! ", "To delete a job, you need to sign in first", "main-alert");
                        }
                    },
                    function() {
                        console.log('Modal dismissed at: ' + new Date());
                    });
            };
        }
    ]);
})();