'use strict';

angular.module('barliftApp')
    .config(function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider, USER_ROLES, $locationProvider) {
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/login");
        Stripe.setPublishableKey('pk_test_ilf0PC8WC51SBXQMp8zQFjXi');

        $ocLazyLoadProvider.config({
            // Set to true if you want to see what and when is dynamically loaded
            debug: false
        });

        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .state('register', {
                url: "/register",
                templateUrl: 'views/register.html',
                controller: 'LoginCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('reset', {
                url: "/reset",
                templateUrl: 'views/reset.html',
                controller: 'LoginCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            // dashabord
            .state('dash', {
                abstract: true,
                controller: 'AdminCtrl',
                templateUrl: "views/dash/common/content.html",
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('dash.main', {
                url: "/dashboard",
                controller: 'DashboardCtrl',
                templateUrl: 'views/dash/dash.main.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                },
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'google apis',
                            files: ['https://apis.google.com/js/client.js']
                        }]);
                    }
                }
            })
            // feedback
            .state('feedback', {
                url: "/feedback/:dealId",
                templateUrl: 'views/emailfeedback.html',
                controller: 'EmailFeedbackCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            // deals
            .state('deals', {
                abstract: true,
                url: "/deals",
                templateUrl: 'views/dash/common/content.html',
                controller: 'DealsviewCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('deals.list', {
                url: "/list",
                templateUrl: 'views/dash/deals.list.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                },
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/datePicker.js']
                        }]);
                    }
                }
            })
            .state('deals.builder', {
                url: "/builder/:selectedDeal?dup",
                templateUrl: 'views/dash/deals.builder.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                },
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/datePicker.js']
                        }]);
                    }
                }
            })
            .state('deals.analytics', {
                url: "/analytics/:selectedDeal",
                templateUrl: 'views/dash/deals.analytics.html',
                controller: 'AnalyticsCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                },
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            name: 'mixpanel',
                            files: ['js/plugins/md5/jquery.md5.min.js']
                        }]);
                    }
                }
            })
            // promo
            .state('promo', {
                abstract: true,
                url: "/promo",
                templateUrl: 'views/dash/common/content.html',
                controller: 'PromoteviewCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('promo.push', {
                url: "/push",
                templateUrl: 'views/dash/promo.push.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            // profile
            .state('profile', {
                abstract: true,
                url: "/profile",
                templateUrl: 'views/dash/common/content.html',
                controller: 'ProfileviewCtrl',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('profile.venues', {
                url: "/venues",
                templateUrl: 'views/dash/profile.venues.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('profile.invoice', {
                url: "/invoice",
                templateUrl: 'views/dash/profile.invoice.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('profile.account', {
                url: "/account",
                templateUrl: 'views/dash/profile.account.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('profile.payment', {
                url: "/payment",
                templateUrl: 'views/dash/profile.payment.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                },
                resolve: {
                    loadPlugin: function($ocLazyLoad) {
                        return $ocLazyLoad.load([{
                            files: ['css/plugins/steps/jquery.steps.css']
                        }]);
                    }
                }
            })
            .state('profile.payment.one_sub', {
                url: "/step_one",
                templateUrl: 'views/dash/payments_wizard/one_sub.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('profile.payment.two_card', {
                url: "/step_two",
                templateUrl: 'views/dash/payments_wizard/two_card.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            .state('profile.payment.three_review', {
                url: "/step_three",
                templateUrl: 'views/dash/payments_wizard/three_review.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin, USER_ROLES.bar]
                }
            })
            //Admin
            .state('admin', {
                abstract: true,
                controller: 'AdminviewCtrl',
                url: "/admin",
                templateUrl: 'views/dash/common/content.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            })
            .state('admin.performance', {
                url: "/performance",
                templateUrl: 'views/dash/admin.performance.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                },
                resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ngGrid',
                            files: ['js/plugins/nggrid/ng-grid-2.0.3.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            files: ['css/plugins/nggrid/ng-grid.css']
                        }
                    ]);
                    }
                }
            })
            .state('admin.pricing', {
                url: "/pricing",
                templateUrl: 'views/dash//admin.pricing.html',
                data: {
                    authorizedRoles: [USER_ROLES.admin]
                }
            });

        $httpProvider.interceptors.push([
            '$injector',
            function($injector) {
                return $injector.get('AuthInterceptor');
            }
        ]);

    });
