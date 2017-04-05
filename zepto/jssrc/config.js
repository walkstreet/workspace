var protocol = 'http';
var httpsProtocol = 'https';
var teachVideoUrl = '_twXt7UXPeehsNgPPviXD0OiSzg=/lusFOA3gBhR3NNvzfx2o2IdIr3iN';
var teachImg = 'images/bannerimg.png';
var dsLogoImg = 'images/dslogo.jpg';
var defaultShareImg = 'YbobvshwlJmemWzc8HaaRw8HIT8=/FkAQHbECZgHNJSCzY08qC4cZfXNQ';

// 资源域名配置
var picHost = '';
var resourcesBaseUrl = protocol + '://' + picHost + '/';

// API 域名配置
var apiUrl = ''; // QA 环境
var apiBaseurl = protocol + '://' + apiUrl + '/ds_platform/';

// 微下载地址
var weiDownloadUrl = '';
var wxCheck = '';

// 小微封接口域名配置
var xwfBaseurl = '';

// 浏览器WeID配置
var WeIDEnv = ''; // [env]weid.xwf-id.com    dev 测试环境, prm 准生产环境, prd 生产环境
var WeIDBaseUrl = httpsProtocol + '://' + WeIDEnv;

//页面监控时间统计
var DevLog = ''; // 测试环境uatlog.click-v.com, 正式环境log2.click-v.com
var DevLogUrl = protocol + '://' + DevLog + '/';

// logourl
var logoUrl = '';

window.CONST = {
    WXDU: weiDownloadUrl,
    APIURL: apiBaseurl,
    RESBASEURL: resourcesBaseUrl,
    TEACHURL: resourcesBaseUrl + teachVideoUrl,
    DEIMG: resourcesBaseUrl + defaultShareImg,
    TEACHIMG: teachImg,
    DSLOGOIMG: dsLogoImg,
    DEFNAME: '如何用点视如何用点视如何用点视如何用点视如何用点视？',
    DEFDES: ' 请观看点视教程视频  请观看点视教程视频  请观看点视教程视频  请观看点视教程视频 请观看点视教程视频',
    WXCHECK: wxCheck
};