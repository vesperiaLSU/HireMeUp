/*global angular*/
(function() {
  'use strict';

  var app = angular.module('jobFinder.app', [
    "ui.router",
    "ngAnimate",
    "satellizer",
    "common.service",
    "ui.bootstrap"
  ]);

  app.config(["$urlRouterProvider", "$stateProvider", "$authProvider",
    function($urlRouterProvider, $stateProvider, $authProvider) {

      $urlRouterProvider.otherwise("/");

      $stateProvider
        .state("register", {
          url: "/register",
          templateUrl: "/app/views/register.html",
          controller: "RegisterCtrl"
        })
        .state("main", {
          url: "/",
          templateUrl: "/app/views/main.html",
          controller: "MainCtrl"
        })
        .state("logout", {
          url: "/logout",
          controller: "LogoutCtrl"
        })
        .state("jobs", {
          url: "/jobs",
          templateUrl: "/app/views/jobs.html",
          controller: "JobsCtrl",
          resolve: {
            jobService: "jobService",
            jobs: function(jobService) {
              return jobService.title.query({}).$promise;
            }
          }
        })
        .state("login", {
          url: "/login",
          templateUrl: "/app/views/login.html",
          controller: "LoginCtrl"
        })
        .state("userProfile", {
          url: "/userProfile",
          templateUrl: "/app/views/userProfile.html",
          controller: "ProfileCtrl",
          controllerAs: "vm",
          resolve: {
            userStorage: "userStorage",
            jobService: "jobService",
            jobsViewed: function(userStorage, jobService) {
              var user = userStorage.getUser();
              return jobService.jobId.query({
                jobList: JSON.stringify(user.jobsViewed)
              }).$promise;
            },
            jobsMarked: function(userStorage, jobService) {
              var user = userStorage.getUser();
              return jobService.jobId.query({
                jobList: JSON.stringify(user.jobsMarked)
              }).$promise;
            },
            jobsApplied: function(userStorage, jobService) {
              var user = userStorage.getUser();
              return jobService.jobId.query({
                jobList: JSON.stringify(user.jobsApplied)
              }).$promise;
            },
            jobsPosted: function(userStorage, jobService) {
              var user = userStorage.getUser();
              return jobService.jobId.query({
                jobList: JSON.stringify(user.jobsPosted)
              }).$promise;
            }
          }
        })
        .state("userProfile.jobsViewed", {
          url: "/jobsViewed",
          templateUrl: "/app/views/userProfileJobsViewed.html"
        })
        .state("userProfile.jobsMarked", {
          url: "/jobsMarked",
          templateUrl: "/app/views/userProfileJobsMarked.html"
        })
        .state("userProfile.jobsApplied", {
          url: "/jobsApplied",
          templateUrl: "/app/views/userProfileJobsApplied.html"
        });

      $authProvider.google({
        clientId: "339049144467-oukcl6dsgubkqmb5toc2khe73h0r5vml.apps.googleusercontent.com",
        url: "api/auth/google"
      });

      $authProvider.facebook({
        clientId: "955330687857756",
        url: "api/auth/facebook"
      });

      $authProvider.loginUrl = "/api/login";
      $authProvider.signupUrl = "/api/register";
    }
  ]);
}());

(function() {
    "use strict";

    angular.module("jobFinder.app").controller("confirmModalCtrl", ["$scope", "$uibModalInstance", "config",
        function($scope, $uibModalInstance, config) {
            $scope.modalTitle = config.modalTitle,
                $scope.title = config.title;
            $scope.company = config.company;

            $scope.yes = function() {
                $uibModalInstance.close({
                    id: config.id
                });
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);
}());
(function() {
  "use strict";

  angular.module("jobFinder.app").controller("HeaderCtrl", ["$scope", "$auth",
    function($scope, $auth) {
      $scope.isAuthenticated = $auth.isAuthenticated;
    }
  ]);
}());
(function() {
    "use strict";

    angular.module("jobFinder.app").controller("JobModalCtrl", ["$scope", "$uibModalInstance", "config",
        function($scope, $uibModalInstance, config) {
            $scope.modalTitle = config.modalTitle;
            $scope.buttonType = config.buttonType;
            $scope.isEditable = config.isEditable;
            $scope.hasApplied = config.hasApplied;
            $scope.title = config.title;
            $scope.company = config.company;
            $scope.description = config.description;

            $scope.submit = function() {
                $uibModalInstance.close({
                    _id: config.id,
                    title: $scope.title,
                    company: $scope.company,
                    description: $scope.description,
                    type: $scope.buttonType,
                    views: config.views,
                    applicants: config.applicants,
                    candidates: config.candidates
                });
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);
}());
(function() {
  "use strict";

  angular.module("jobFinder.app").controller("JobsCtrl", ["$scope", "jobService", "userService", "alertService", "$rootScope", "dataTransfer",
    "$state", "$uibModal", "jobModalService", "applyForJobService", "userStorage", "jobs", "paginateJobsService", "_",
    function($scope, jobService, userService, alertService, $rootScope, dataTransfer,
      $state, $uibModal, jobModalService, applyForJobService, userStorage, jobs, paginateJobsService, _) {
      $rootScope.bodyStyle = "";
      $scope.jobToSearch = dataTransfer.getJob();
      var resultFound;
      
      $scope.$watch("jobToSearch", function(newValue, oldValue) {
        if (newValue === oldValue) return;
        search();
      });

      if (jobs.length === 0) {
        alertService("warning", "Opps! ", "No job found", "job-alert");
      }
      else {
        resultFound = paginateJobsService.paginateJobs($scope, jobs);
      }

      var user = userStorage.getUser();
      changeJobStatus();

      $scope.pageChanged = function() {
        if (resultFound && resultFound.length > 10) {
          begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
          end = begin + $scope.itemsPerPage;
          $scope.jobs = resultFound.slice(begin, end);
        }
        else {
          var begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
          var end = begin + $scope.itemsPerPage;
          $scope.jobs = $scope.allJobs.slice(begin, end);
        }
      };

      $scope.viewJob = function(job) {
        $scope.id = job._id;
        $scope.title = job.title;
        $scope.company = job.company;
        $scope.description = job.description;
        $scope.views = job.views;
        $scope.applicants = job.applicants;
        $scope.candidates = job.candidates;

        job.views++;
        jobService.jobId.update({
          id: $scope.id
        }, job).$promise.then(function(data) {
          //do nothing
        }).catch(function(error) {
          job.views -= 1;
          alertService('warning', 'Opps! ', 'Error increasing the job view for : ' + $scope.title, 'job-alert');
        });

        var user = userStorage.getUser();
        if (user && user.jobsViewed.indexOf($scope.id) === -1) {
          user.jobsViewed.push($scope.id);
          userService.update({
            id: user._id
          }, user).$promise.then(function(user) {
            userStorage.setUser(user);
          }).catch(function(error) {
            alertService('warning', 'Opps! ', 'Error adding: ' + $scope.title + " to jobs viewed", 'job-alert');
          });
        }
      };

      $scope.openModal = function(type) {
        var user = userStorage.getUser();
        if (type === 'VIEW' && user) {
          $scope.hasApplied = user && $scope.candidates.indexOf(user._id) !== -1;
        }
        jobModalService.open(type, $scope);
      };

      $scope.markJob = function(job) {
        var user = userStorage.getUser();
        if (user) {
          var index = user.jobsMarked.indexOf(job._id);
          if (index === -1) {
            user.jobsMarked.push(job._id);
            userService.update({
              id: user._id
            }, user).$promise.then(function(user) {
              userStorage.setUser(user);
              alertService("success", "You succesfully bookmarked: ", job.title, "job-alert");
            }).catch(function(error) {
              alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to bookmarked", 'job-alert');
            });
          }
          else {
            user.jobsMarked.splice(index, 1);
            userService.update({
              id: user._id
            }, user).$promise.then(function(user) {
              userStorage.setUser(user);
              alertService("success", "You succesfully un-bookmarked: ", job.title, "job-alert");
            }).catch(function(error) {
              alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to bookmarked", 'job-alert');
            });
          }
        }
        else {
          $state.go("login");
          alertService("warning", "Opps! ", "To bookmark a job, you need to sign in first", "main-alert");
        }
      };

      $scope.applyJob = function(job) {
        applyForJobService.apply(job);
      };

      $scope.refresh = function() {
        jobService.title.query({}).$promise.then(function(jobs) {
          if (jobs.length === 0) {
            alertService("warning", "Opps! ", "No job found", "job-alert");
          }
          else {
            $scope.jobToSearch = "";
            paginateJobsService.paginateJobs($scope, jobs);
            changeJobStatus();
          }

        }).catch(function(err) {
          alertService("warning", "Unable to get jobs: " + err, "job-alert");
        });
      };

      $scope.searchJob = search;

      function search() {
        jobService.title.query({
          title: $scope.jobToSearch
        }).$promise.then(
          function(data) {
            resultFound = paginateJobsService.paginateJobs($scope, data);
            changeJobStatus();
          },
          function(error) {
            alertService("warning", "Unable to get jobs: ", error.data.message, "job-alert");
          });
      }

      function changeJobStatus() {
        if (user) {
          $.each($scope.jobs, function(index, job) {
            if (_.contains(user.jobsMarked, job._id)) {
              job.marked = true;
            }
            else {
              job.marked = false;
            }

            if (_.contains(user.jobsApplied, job._id)) {
              job.applied = true;
            }
            else {
              job.applied = false;
            }
          });
        }
        else {
          $.each($scope.jobs, function(index, job) {
            job.marked = false;
            job.applied = false;
          });
        }
      }
    }
  ]);
}());
(function() {
    "use strict";

    angular.module("jobFinder.app")
        .controller("LoginCtrl", ["$rootScope", "$scope", "alertService", "$state", "$auth", "userStorage",
            function($rootScope, $scope, alertService, $state, $auth, userStorage) {
                $rootScope.bodyStyle = "mainPage";

                $scope.login = function() {
                    $auth.login({
                            email: $scope.email,
                            password: $scope.password
                        })
                        .then(function(res) {
                            $state.go("main");
                            userStorage.setUser(res.data.user);
                            var message = "Thanks for coming back!";
                            var username = res.data.user.displayName ? res.data.user.displayName : res.data.user.email;
                            if (!res.data.user.active) {
                                message = "Just a reminder, please active your account soon :)";
                            }

                            alertService("success", "Welcome ", username + "! " + message, "main-alert");
                        })
                        .catch(handleError);
                };

                $scope.authenticate = function(provider) {
                    $auth.authenticate(provider).then(function(res) {
                        $state.go("main");
                        userStorage.setUser(res.data.user);
                        var message = "Thanks for coming back!";
                        if (!res.data.user.active) {
                            message = "Just a reminder, please active your account soon :)";
                        }
                        alertService("success", "Welcome ", res.data.user.displayName + "! " + message, "main-alert");
                    }, handleError);
                };

                function handleError(err) {
                    alertService("warning", "Something went wrong :( ", err.data.message, "main-alert");
                }
            }
        ]);
}());
(function() {
  "use strict";

  angular.module("jobFinder.app").controller("LogoutCtrl", ["$auth", "$state", "userStorage",
    function($auth, $state, userStorage) {
      $auth.logout();
      userStorage.removeUser();
      $state.go("main");
    }
  ]);
}());

(function() {
    "use strict";

    angular.module("jobFinder.app").controller("MainCtrl", ["$rootScope", "$scope", "$state", "dataTransfer",
        function($rootScope, $scope, $state, dataTransfer) {
            $rootScope.bodyStyle = "mainPage";
            $scope.keyPressed = function(event) {
                if (event.charCode === 13)
                    $scope.searchJob();
            };

            $scope.searchJob = function() {
                dataTransfer.addJob($scope.jobToSearch);
                $state.go("jobs");
            };
        }
    ]);
}());
(function() {
    "use strict";

    angular.module("jobFinder.app").controller("ProfileCtrl", ["$scope", "$rootScope", "dataTransfer", "jobService", "alertService", "userService", "jobModalService",
        "confirmModalService", "userModalService", "$state", "userStorage", "jobsViewed", "jobsMarked", "jobsApplied", "jobsPosted", "paginateJobsService",
        userProfileController
    ]);

    function userProfileController($scope, $rootScope, dataTransfer, jobService, alertService, userService, jobModalService, confirmModalService,
        userModalService, $state, userStorage, jobsViewed, jobsMarked, jobsApplied, jobsPosted, paginateJobsService) {
        var vm = this;
        var user = userStorage.getUser();
        var emailName = user.email.substring(0, user.email.indexOf('@'));
        $rootScope.bodyStyle = "";
        vm.email = user.email;
        vm.displayName = user.displayName ? user.displayName : emailName;
        vm.status = user.active ? "activated" : "unactivated";
        vm.avatar_url = user.avatar_url;
        vm.jobPostedPerPage = 10;
        vm.currentPageJobPosted = 1;
        vm.currentPage = 1;
        vm.itemsPerPage = 11;
        vm.numOfPosted = jobsPosted.length;
        vm.jobsViewed = jobsViewed;
        vm.jobsApplied = jobsApplied;
        vm.jobsMarked = jobsMarked;
        vm.jobsPosted = jobsPosted;

        paginateJobsService.paginatePosted(vm, jobsPosted);

        var currentState = $state.current.url.substring(1);
        switch (currentState) {
            case 'jobsViewed':
                paginateJobsService.paginateViewed(vm, jobsViewed);
                break;
            case 'jobsMarked':
                paginateJobsService.paginateMarked(vm, jobsMarked);
                break;
            case 'jobsApplied':
                paginateJobsService.paginateApplied(vm, jobsApplied);
                break;
            default:
                paginateJobsService.paginateViewed(vm, jobsViewed);
        }

        vm.pageChanged = function() {
            var begin, end;
            switch (currentState) {
                case 'jobsViewed':
                    {
                        if (jobsViewed.length > 11) {
                            begin = (vm.currentPage - 1) * vm.itemsPerPage;
                            end = begin + vm.itemsPerPage;
                            vm.jobsViewed = jobsViewed.slice(begin, end);
                        }
                    }
                    break;
                case 'jobsMarked':
                    {
                        if (jobsMarked.length > 11) {
                            begin = (vm.currentPage - 1) * vm.itemsPerPage;
                            end = begin + vm.itemsPerPage;
                            vm.jobsMarked = jobsMarked.slice(begin, end);
                        }
                    }
                    break;
                case 'jobsApplied':
                    {
                        if (jobsApplied.length > 11) {
                            begin = (vm.currentPage - 1) * vm.itemsPerPage;
                            end = begin + vm.itemsPerPage;
                            vm.jobsApplied = jobsApplied.slice(begin, end);
                        }
                    }
                    break;
            }

        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            var nextState = toState.url.substring(1);
            switch (nextState) {
                case 'jobsViewed':
                    vm.numOfJob = jobsViewed.length;
                    paginateJobsService.paginateViewed(vm, jobsViewed);
                    break;
                case 'jobsMarked':
                    vm.numOfJob = jobsMarked.length;
                    paginateJobsService.paginateMarked(vm, jobsMarked);
                    break;
                case 'jobsApplied':
                    vm.numOfJob = jobsApplied.length;
                    paginateJobsService.paginateApplied(vm, jobsApplied);
                    break;
            }
        });

        vm.jobPostedPageChanged = function() {
            if (jobsPosted.length > 11) {
                var begin = (vm.currentPageJobPosted - 1) * vm.jobPostedPerPage;
                var end = begin + vm.jobPostedPerPage;
                vm.jobsPosted = jobsPosted.slice(begin, end);
            }
        };

        vm.viewJob = function(job) {
            vm.id = job._id;
            vm.title = job.title;
            vm.company = job.company;
            vm.description = job.description;
            vm.views = job.views;
            vm.applicants = job.applicants;
            vm.candidates = job.candidates;

            job.views++;
            jobService.jobId.update({
                id: vm.id
            }, job).$promise.then(function(data) {
                console.log("success");
            }).catch(function(error) {
                job.views -= 1;
                alertService('warning', 'Opps! ', 'Error increasing the job view for : ' + vm.title, 'job-alert');
            });

            var user = userStorage.getUser();
            if (user && user.jobsViewed.indexOf(vm.id) === -1) {
                user.jobsViewed.push(vm.id);
                userService.update({
                    id: user._id
                }, user).$promise.then(function(user) {
                    userStorage.setUser(user);
                }).catch(function(error) {
                    alertService('warning', 'Opps! ', 'Error adding: ' + vm.title + " to jobs viewed", 'job-alert');
                });
            }
        };

        vm.clearJobMarked = function() {
            var user = userStorage.getUser();
            if (user && user.jobsMarked.length > 0) {
                user.jobsMarked.splice(0, user.jobsMarked.length);
                userService.update({
                    id: user._id
                }, user).$promise.then(function(user) {
                    vm.jobsMarked.splice(0, vm.jobsMarked.length);
                    vm.numOfJob = 0;
                    jobsMarked.splice(0, jobsMarked.length);
                    userStorage.setUser(user);
                }).catch(function(error) {
                    alertService('warning', 'Opps! ', 'Error clearing all jobs marked: ' + error.message, 'job-alert');
                });
            }
        };

        vm.clearJobViewed = function() {
            var user = userStorage.getUser();
            if (user && user.jobsViewed.length > 0) {
                user.jobsViewed.splice(0, user.jobsViewed.length);
                userService.update({
                    id: user._id
                }, user).$promise.then(function(user) {
                    vm.jobsViewed.splice(0, vm.jobsViewed.length);
                    vm.numOfJob = 0;
                    jobsViewed.splice(0, jobsViewed.length);
                    userStorage.setUser(user);
                }).catch(function(error) {
                    alertService('warning', 'Opps! ', 'Error clearing all jobs viewed: ' + error.message, 'job-alert');
                });
            }
        };

        vm.deleteJob = function(job) {
            vm.id = job._id;
            vm.title = job.title;
            vm.company = job.company;
        };

        vm.editJob = function(job) {
            vm.id = job._id;
            vm.title = job.title;
            vm.company = job.company;
            vm.description = job.description;
        };

        vm.openModal = function(type) {
            var user = userStorage.getUser();
            if (user) {
                switch (type) {
                    case 'VIEW':
                        {
                            vm.hasApplied = user && vm.candidates.indexOf(user._id) !== -1;
                            jobModalService.open(type, vm);
                        }
                        break;
                    case 'POST':
                        jobModalService.open(type, vm);
                        break;
                    case 'EDIT':
                        jobModalService.open(type, vm);
                        break;
                    case 'CONFIRM':
                        confirmModalService.open(type, vm);
                        break;
                    case 'USER':
                        userModalService.open(type, vm);
                        break;
                }
            }
        };

        vm.keyPressed = function(event) {
            if (event.charCode === 13)
                vm.searchJob();
        };

        vm.searchJob = function search() {
            dataTransfer.addJob(vm.jobToSearch);
            $state.go("jobs");
        };
    }
}());

(function() {
    "use strict";

    angular.module("jobFinder.app")
        .controller("RegisterCtrl", ["$rootScope", "$scope", "alertService", "$auth", "$state", "userStorage",
            function($rootScope, $scope, alertService, $auth, $state, userStorage) {
                $rootScope.bodyStyle = "mainPage";
                $scope.submitRegistration = function() {
                    $auth.signup({
                            email: $scope.email,
                            password: $scope.password
                        })
                        .then(function(res) {
                            $state.go("main");
                            $auth.setToken(res.data.token);
                            userStorage.setUser(res.data.user);
                            alertService('success', 'Account Created! ', "Welcome, " + res.data.user.email + " Just a reminder, please active your account soon :)", "main-alert");
                        })
                        .catch(function(err) {
                            alertService('warning', 'Opps! ', 'Could not register: ' + err.data.message, "main-alert");
                        });
                };

                $scope.authenticate = function(provider) {
                    $auth.authenticate(provider).then(function(res) {
                        $state.go("main");
                        userStorage.setUser(res.data.user);
                        var message = "Thanks for coming back!";
                        if (!res.data.user.active) {
                            message = "Just a reminder, please active your account soon :)";
                        }
                        alertService("success", "Welcome ", res.data.user.displayName + "! " + message, "main-alert");
                    }, handleError);
                };

                function handleError(err) {
                    alertService("warning", "Something went wrong :( ", err.data.message, "main-alert");
                }
            }
        ]);
}());
(function() {
    "use strict";

    angular.module("jobFinder.app").controller("userModalCtrl", ["$scope", "$uibModalInstance", "user",
        function($scope, $uibModalInstance, user) {
            $scope.modalTitle = "User Profile";
            $scope.email = user.email;
            $scope.username = user.name;
            $scope.avatar_url = user.avatar_url;
            $scope.buttonType = "UPDATE"

            $scope.update = function() {
                $uibModalInstance.close({
                    email: $scope.email,
                    displayName: $scope.username,
                    avatar_url: $scope.avatar_url
                });
            };

            $scope.cancel = function() {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);
}());
(function() {
    angular.module("jobFinder.app").directive('akModal', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(attrs.akModal, function(value) {
                    if (value) element.modal('show');
                    else element.modal('hide');
                });
            }
        };
    });
}());
(function () {
  "use strict";

  angular.module("jobFinder.app")
    .directive("validateEquals", function () {
      return {
        require: "ngModel",
        link: function (scope, element, attrs, ngModelCtrl) {
          function validateEquals(value) {
            var valid = (value === scope.$eval(attrs.validateEquals));
            ngModelCtrl.$setValidity("equal", valid);
            return valid ? value : undefined;
          }

          ngModelCtrl.$parsers.push(validateEquals);
          ngModelCtrl.$formatters.push(validateEquals);

          scope.$watch(attrs.validateEquals, function () {
            ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue);
          });
        }
      };
    });
}());


(function(){
    "use strict";
    angular.module("common.service", ["ngResource"]);
}());
(function() {
    'use strict';
    angular.module("common.service").service("applyForJobService", ["userStorage", "userService", "alertService", "$state", "jobService",
        function(userStorage, userService, alertService, $state, jobService) {
            this.apply = function(job) {
                var user = userStorage.getUser();
                if (user) {
                    if (job.candidates.indexOf(user._id) === -1) {
                        job.candidates.push(user._id);
                        jobService.jobId.update({
                            id: job._id
                        }, job).$promise.then(function(data) {
                            console.log("success");
                        }, function(error) {
                            alertService("warning", "Opps! ", "Applying for job " + job.title + " failed!", "job-alert");
                        });
                    }
                    else {
                        alertService('warning', 'Opps! ', 'You already have applied for: ' + job.title, 'job-alert');
                        return;
                    }

                    if (user.jobsApplied.indexOf(job._id) === -1) {
                        user.jobsApplied.push(job._id);
                        userService.update({
                            id: user._id
                        }, user).$promise.then(function(user) {
                            userStorage.setUser(user);
                            alertService("success", "You succesfully applied for: ", job.title, "job-alert");
                        }).catch(function(error) {
                            alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to jobs applied", 'job-alert');
                        });
                        increaseJobApplicant(job);
                    }
                    else {
                        alertService('warning', 'Opps! ', 'You already have applied for: ' + job.title, 'job-alert');
                        return;
                    }
                }
                else {
                    $state.go("login");
                    alertService("warning", "Opps! ", "To apply for a job, you need to sign in first", "main-alert");
                }
            };

            function increaseJobApplicant(job) {
                job.applicants++;
                jobService.jobId.update({
                    id: job._id
                }, job).$promise.then(function(data) {
                    console.log("success");
                }, function(error) {
                    alertService("warning", "Opps! ", "Applying for job " + job.title + " failed!", "job-alert");
                });
            }
        }
    ]);
}());
(function() {
    'use strict';
    angular.module("common.service").service("deleteJobService", ["userStorage", "alertService", "$state", "jobService", "userService", "paginateJobsService",
        function(userStorage, alertService, $state, jobService, userService, paginateJobsService) {
            this.delete = function(job, scope) {
                var user = userStorage.getUser();
                var indexToDelete;
                if (user) {
                    jobService.jobId.delete({
                        id: job.id
                    }).$promise.then(function(deleted) {
                        scope.jobsViewed = $.grep(scope.jobsViewed, function(item) {
                            return item._id != deleted._id;
                        });
                        scope.jobsMarked = $.grep(scope.jobsMarked, function(item) {
                            return item._id != deleted._id;
                        });
                        scope.jobsPosted = $.grep(scope.jobsPosted, function(item) {
                            return item._id != deleted._id;
                        });
                        scope.jobsApplied = $.grep(scope.jobsApplied, function(item) {
                            return item._id != deleted._id;
                        });

                        if (user.jobsViewed.indexOf(deleted._id) !== -1) {
                            indexToDelete = user.jobsViewed.indexOf(deleted._id);
                            user.jobsViewed.splice(indexToDelete, 1);
                        }

                        if (user.jobsMarked.indexOf(deleted._id) !== -1) {
                            indexToDelete = user.jobsMarked.indexOf(deleted._id);
                            user.jobsMarked.splice(indexToDelete, 1);
                        }

                        if (user.jobsPosted.indexOf(deleted._id) !== -1) {
                            indexToDelete = user.jobsPosted.indexOf(deleted._id);
                            user.jobsPosted.splice(indexToDelete, 1);
                        }

                        if (user.jobsApplied.indexOf(deleted._id) !== -1) {
                            indexToDelete = user.jobsApplied.indexOf(deleted._id);
                            user.jobsApplied.splice(indexToDelete, 1);
                        }

                        userService.update({
                            id: user._id
                        }, user).$promise.then(function(user) {
                            userStorage.setUser(user);
                            alertService("success", "You successfully deleted the job: ", deleted.title, "job-alert");
                        }).catch(function(error) {
                            alertService('warning', 'Opps! ', 'Error adding: ' + job.title + " to bookmarked", 'job-alert');
                        });
                    }).catch(function(error) {
                        alertService("warning", "Opps! ", "Failed to delete job: " + job.title, "job-alert");
                    });
                }
                else {
                    $state.go("login");
                    alertService("warning", "Opps! ", "To edit a job, you need to sign in first", "main-alert");
                }
            };
        }
    ]);
}());
(function() {
    'use strict';
    angular.module("common.service").service("editJobService", ["userStorage", "alertService", "$state", "jobService",
        function(userStorage, alertService, $state, jobService) {
            this.edit = function(job, scope) {
                var user = userStorage.getUser();
                if (user) {
                    jobService.jobId.update({
                        id: job._id
                    }, job).$promise.then(function(data) {
                        $.each(scope.jobsViewed, function(index, item) {
                            if (item._id === data._id) {
                                item.title = data.title;
                                item.company = data.company;
                                item.description = data.description;
                            }
                        });
                        $.each(scope.jobsMarked, function(index, item) {
                            if (item._id === data._id) {
                                item.title = data.title;
                                item.company = data.company;
                                item.description = data.description;
                            }
                        });
                        $.each(scope.jobsApplied, function(index, item) {
                            if (item._id === data._id) {
                                item.title = data.title;
                                item.company = data.company;
                                item.description = data.description;
                            }
                        });
                        $.each(scope.jobsPosted, function(index, item) {
                            if (item._id === data._id) {
                                item.title = data.title;
                                item.company = data.company;
                                item.description = data.description;
                            }
                        });
                        alertService("success", "You successfully updated the job: ", data.title, "main-alert");
                    }).catch(function(error) {
                        alertService("warning", "Opps! ", "Failed to edit job: " + job.title, "main-alert");
                    });
                }
                else {
                    $state.go("login");
                    alertService("warning", "Opps! ", "To edit a job, you need to sign in first", "main-alert");
                }
            };
        }
    ]);
}());
(function() {
    'use strict';
    angular.module("common.service").service("postJobService", ["userStorage", "userService", "alertService", "$state", "jobService", "paginateJobsService",
        function(userStorage, userService, alertService, $state, jobService, paginateJobsService) {
            this.post = function(job, scope) {
                var user = userStorage.getUser();
                if (user) {
                    jobService.title.save(job).$promise.then(function(data) {
                        if ($state.current.url === "/jobs") {
                            scope.jobs = scope.allJobs;
                            scope.jobs.push(data);
                            paginateJobsService.paginateJobs(scope, scope.jobs);
                        }
                        else {
                            $state.go("jobs");
                        }
                        
                        user.jobsPosted.push(data._id);
                        userService.update({
                            id: user._id
                        }, user).$promise.then(function(user) {
                            userStorage.setUser(user);
                            alertService("success", "You succesfully post job: ", job.title, "job-alert");
                        }).catch(function(error) {
                            alertService('warning', 'Opps!', 'Error updating user with: ' + job.title + " to jobs posted", 'job-alert');
                        });
                    }, function(error) {
                        alertService("warning", "Error: ", "Job saving failed", "job-alert");
                    });
                }
                else {
                    $state.go("login");
                    alertService("warning", "Opps! ", "To apply for a job, you need to sign in first", "main-alert");
                }
            };
        }
    ]);
}());
(function() {
  "use strict";

  angular.module("common.service")
    .service("alertService", ["$rootScope", "$timeout",
      function alert($rootScope, $timeout) {
        var alertTimeout;
        return function(type, title, message, style, timeout) {
          $rootScope.alert = {
            hasBeenShown: true,
            show: true,
            type: type,
            style: style,
            message: message,
            title: title
          };
          $timeout.cancel(alertTimeout);
          alertTimeout = $timeout(function() {
            $rootScope.alert.show = false;
          }, timeout || 4000);
        };
      }
    ]);
}());

(function() {
    "use strict";
    angular.module("common.service").factory("dataTransfer",
        function() {
            var jobTitle;
            var addJob = function(title) {
                jobTitle = title;
            }
            var getJob = function() {
                return jobTitle;
            }
            var clearJob = function() {
                jobTitle = "";
            }

            return {
                addJob: addJob,
                getJob: getJob,
                clearJob: clearJob
            };
        });
}());

(function() {
    'use strict';

    angular.module('common.service').service('paginateJobsService',
        function(dataTransfer) {
            this.paginateJobs = function(scope, jobs) {
                scope.allJobs = jobs;
                scope.numOfJob = jobs.length;
                scope.currentPage = 1;
                scope.itemsPerPage = 12;
                var begin, end, resultFound;
                if (scope.jobToSearch) {
                    dataTransfer.clearJob();
                    resultFound = $.grep(scope.allJobs, function(item) {
                        return item.title.toLowerCase().indexOf(scope.jobToSearch.toLowerCase()) !== -1;
                    });
                    scope.numOfJob = resultFound.length;
                    if (resultFound.length > 10) {
                        begin = (scope.currentPage - 1) * scope.itemsPerPage;
                        end = begin + scope.itemsPerPage;
                        scope.jobs = resultFound.slice(begin, end);
                    }
                    else {
                        scope.jobs = resultFound;
                    }
                }
                else {
                    scope.jobs = scope.allJobs;
                    if (scope.jobs.length > 10) {
                        begin = (scope.currentPage - 1) * scope.itemsPerPage;
                        end = begin + scope.itemsPerPage;
                        scope.jobs = scope.allJobs.slice(begin, end);
                    }
                }

                return resultFound;
            };

            this.paginateViewed = function(vm, jobsViewed) {
                vm.jobsViewed = jobsViewed;
                vm.numOfJob = jobsViewed.length;
                if (vm.numOfJob > 11) {
                    var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                    var end = begin + vm.itemsPerPage;
                    vm.jobsViewed = jobsViewed.slice(begin, end);
                }
            };

            this.paginateMarked = function(vm, jobsMarked) {
                vm.jobsMarked = jobsMarked;
                vm.numOfJob = jobsMarked.length;
                if (vm.numOfJob > 11) {
                    var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                    var end = begin + vm.itemsPerPage;
                    vm.jobsMarked = jobsMarked.slice(begin, end);
                }
            };

            this.paginateApplied = function(vm, jobsApplied) {
                vm.jobsApplied = jobsApplied;
                vm.numOfJob = jobsApplied.length;
                if (vm.numOfJob > 11) {
                    var begin = (vm.currentPage - 1) * vm.itemsPerPage;
                    var end = begin + vm.itemsPerPage;
                    vm.jobsApplied = jobsApplied.slice(begin, end);
                }
            };

            this.paginatePosted = function(vm, jobsPosted) {
                vm.numOfJobPosted = jobsPosted.length;
                vm.jobsPosted = jobsPosted;
                if (vm.numOfJobPosted > 10) {
                    var begin = (vm.currentPageJobPosted - 1) * vm.jobPostedPerPage;
                    var end = begin + vm.jobPostedPerPage;
                    vm.jobsPosted = jobsPosted.slice(begin, end);
                }
            };
        });
}());

(function() {
    'use strict';

    angular.module('common.service').factory('_', ['$window', function($window) {
        return $window._;
    }]);
}());

(function() {
    'use strict';

    angular.module('common.service').factory('userStorage', ["$window",
        function($window) {
            var storage = $window.localStorage;
            var cachedUser;
            var userToken = "currentUser";
            var userStorage = {
                setUser: function(user) {
                    cachedUser = user;
                    storage.setItem(userToken, JSON.stringify(user));
                },
                getUser: function() {
                    if (!cachedUser) {
                        cachedUser = JSON.parse(storage.getItem(userToken));
                    }

                    return cachedUser;
                },
                removeUser: function() {
                    cachedUser = null;
                    storage.removeItem(userToken);
                }
            };
            return userStorage;
        }
    ]);
}());

(function() {
    "use strict";

    angular.module("common.service").service("confirmModalService", ["$uibModal", "$auth", "alertService", "$state", "deleteJobService",
        function($uibModal, $auth, alertService, $state, deleteJobService) {
            this.open = function(type, scope) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/confirmModal.html',
                    controller: 'confirmModalCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'custom-modal',
                    openedClass: 'always-scroll',
                    resolve: {
                        config: {
                            id: scope.id,
                            title: scope.title,
                            company: scope.company,
                            modalTitle: "Confirmation"
                        }
                    }
                });

                modalInstance.result.then(function(job) {
                        if ($auth.isAuthenticated()) {
                            deleteJobService.delete(job, scope);
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
}());
(function() {
    "use strict";

    angular.module("common.service").service("jobModalService", ["$uibModal", "$auth", "jobService", "alertService", "$state", "applyForJobService", "postJobService", "deleteJobService", "editJobService",
        function($uibModal, $auth, jobService, alertService, $state, applyForJobService, postJobService, deleteJobService, editJobService) {
            this.open = function(type, scope) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: '/app/views/jobModal.html',
                    controller: 'JobModalCtrl',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    windowClass: 'custom-modal',
                    openedClass: 'always-scroll',
                    resolve: {
                        config: function() {
                            return renderModalConfig(type, scope);
                        }
                    }
                });

                modalInstance.result.then(function(job) {
                        switch (job.type) {
                            case 'SUBMIT':
                                {
                                    if ($auth.isAuthenticated()) {
                                        postJobService.post(job, scope);
                                    }
                                    else {
                                        $state.go("login");
                                        alertService("warning", "Opps! ", "To post a job, you need to sign in first", "main-alert");
                                    }
                                }
                                break;
                            case 'APPLY':
                                {
                                    if ($auth.isAuthenticated()) {
                                        applyForJobService.apply(job);
                                    }
                                    else {
                                        $state.go("login");
                                        alertService("warning", "Opps! ", "To apply for a job, you need to sign in first", "main-alert");
                                    }
                                }
                                break;
                            case 'SAVE':
                                {
                                    if ($auth.isAuthenticated()) {
                                        editJobService.edit(job, scope);
                                    }
                                    else {
                                        $state.go("login");
                                        alertService("warning", "Opps! ", "To edit a job, you need to sign in first", "main-alert");
                                    }
                                }
                                break;
                        }
                    },
                    function() {
                        console.log('Modal dismissed at: ' + new Date());
                    });
            };

            function renderModalConfig(type, scope) {
                switch (type) {
                    case 'POST':
                        return {
                            modalTitle: 'Post a Job',
                            isEditable: true,
                            buttonType: 'SUBMIT'
                        };
                    case 'VIEW':
                        return {
                            id: scope.id,
                            title: scope.title,
                            company: scope.company,
                            description: scope.description,
                            views: scope.views,
                            applicants: scope.applicants,
                            modalTitle: "View Job",
                            isEditable: false,
                            hasApplied: scope.hasApplied,
                            buttonType: scope.hasApplied ? "APPLIED" : "APPLY",
                            candidates: scope.candidates
                        };
                    case 'EDIT':
                        return {
                            id: scope.id,
                            title: scope.title,
                            company: scope.company,
                            description: scope.description,
                            modalTitle: "Edit Job",
                            isEditable: true,
                            buttonType: "SAVE"
                        };
                }
            }
        }
    ]);
}());
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
}());
(function() {
    "use strict";

    angular.module("common.service").factory("jobService", ["$resource",
        function($resource) {
            return {
                title: $resource("/api/jobs/:title", {}, {}),
                jobId: $resource("/api/jobById/:id", {}, {
                    update: {
                        method: "PUT"
                    }
                })
            };
        }
    ]);
}());

(function() {
    "use strict";

    angular.module("common.service").factory("userService", ["$resource",
        function($resource) {
            return $resource("/api/users/:id", null, {
                "update": {
                    method: "PUT"
                }
            });
        }
    ]);
}());