/**
 * 路由配置页|常量的配置
 * Modified by qing.yan@click-v.com
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $urlRouterProvider.otherwise("/login");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
    //登录页面
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            data: { pageTitle: '登录' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        serie: true,
                        name: 'angular-ladda',
                        files: ['js/plugins/ladda/spin.min.js', 'js/plugins/ladda/ladda.min.js', 'css/plugins/ladda/ladda-themeless.min.css', 'js/plugins/ladda/angular-ladda.min.js']
                    }, {
                        name: 'cgNotify',
                        files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
                    }, {
                        insertBefore: '#loadBefore',
                        name: 'toaster',
                        files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                    }, {
                        name: 'DsAdmin',
                        insertBefore: '#ng_load_plugins_before',
                        files: [
                            'js/controller/login.js'
                        ]
                    }]);
                }
            }
        })
        //进入主界面
        .state('interact', {
            abstract: true,
            url: "/interact",
            templateUrl: "views/common/content.html",
        })
        //视频管理页
        .state('interact.comment', {
            url: "/comment",
            templateUrl: "views/comment.html",
            data: { access: [0], pageTitle: '评论审核' },
            resolve: {
                loadPlugin: function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                            files: ['js/plugins/moment/moment.min.js']
                        }, {
                            name: 'cgNotify',
                            files: ['css/plugins/angular-notify/angular-notify.min.css', 'js/plugins/angular-notify/angular-notify.min.js']
                        }, {
                            files: ['js/plugins/sweetalert/sweetalert.min.js', 'css/plugins/sweetalert/sweetalert.css']
                        }, {
                            name: 'oitozero.ngSweetAlert',
                            files: ['js/plugins/sweetalert/angular-sweetalert.min.js']
                        }, {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        }, {
                            serie: true,
                            name: 'angular-ladda',
                            files: ['js/plugins/ladda/spin.min.js', 'js/plugins/ladda/ladda.min.js', 'css/plugins/ladda/ladda-themeless.min.css', 'js/plugins/ladda/angular-ladda.min.js']
                        },
                        //必须要引用这个文件才可以使用checkbox样式
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        }, {
                            name: 'ui.select',
                            files: ['js/plugins/ui-select/select.min.js', 'css/plugins/ui-select/select.min.css']
                        }, {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }, {
                            name: 'DsAdmin',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                'js/controller/comment.js'
                            ]
                        }
                    ]);
                }
            }
        })
}
DsAdmin
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });

/**
 * 常量的配置
 */
/***常量***/
var protocol = 'http';
var httpsProtocol = 'https';

/***资源域名配置***/
var picHost = 'http://ocg52umra.bkt.clouddn.com/';
var pic1Host = 'https://pic1.click-v.com/';
var resourcesBaseUrl = picHost;

/***
    API Service 域名配置
    var localIP = '172.16.13.33:8080'; //  本机IP
    var localhost = 'localhost:8080'; // 本机
    var uatprod = 'uatprod.click-v.com'; // UAT 环境
    var qaprod = 'qaprod.click-v.com'; //  QA 环境
    var prepro = 'prepro.click-v.com'; //  PREPRO 环境
    var pro = 'pro.click-v.com'; // PRO 环境
***/
//var apiUrl = '172.168.10.8:11280';
var apiUrl = 'qa2admin2.click-v.com';

var apiBaseurl = protocol + '://' + apiUrl + '/ds-admin/';

// 微下载地址
var weiDownloadUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.iraid.ds2&ckey=CK1320778500466';
window.DSCONST = {
    APIBASEURL: apiBaseurl,
    REBURL: resourcesBaseUrl,
    WXDU: weiDownloadUrl,
};
