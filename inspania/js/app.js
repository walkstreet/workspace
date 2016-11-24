/**
 * angular模块定义，DsAdmin
 * 
 */
var DsAdmin = angular.module('DsAdmin', [
    'ui.router', // Routing
    'oc.lazyLoad', // ocLazyLoad
    'ui.bootstrap', // Ui Bootstrap
    'pascalprecht.translate', // Angular Translate
    'ngIdle', // Idle timer
    'ngSanitize', // ngSanitize
    'ngCookies', // ngCookies
    'DsAdmin.services' //常用的工厂函数,包括ajax等
])
