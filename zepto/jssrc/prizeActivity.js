/*-------------------------------------------------------------------------------------------------
 项目：APP-C
 标题：兑换demo
 作者：chiye.zhou@click-v.com
 版本：3.0
 依赖：zepto
 未尽事宜：无
 -------------------------------------------------------------------------------------------------*/
// 模块名及路径定义
require.config({
    urlArgs: "rev=" + (new Date()).getTime(),
    paths: {
        zepto: '../lib/zepto.min',
        sui: '../lib/sui/js/sm.min',
        global: '../js/global.min',
        template: '../lib/template',
        cookie: '../lib/zepto.cookie.min',
        config: './config',
        weixin: 'http://res.wx.qq.com/open/js/jweixin-1.0.0'
    }
});

// 加载,业务逻辑开始
require(['zepto', 'template', 'weixin', 'global', 'sui', 'cookie', 'config'], function($, template, wx) {
    // 本页面的业务逻辑
    function PrizeActivity() {
        //继承global类
        global.call(this);

        // 查询个人中奖结果接口
        this.searchUserPrizeUrl = apiBaseurl + 'prizeActivity/searchUserPrize';

        //// 奖品兑换-实物兑奖接口
        //this.exchangeRealPrizeUrl = apiBaseurl + 'prizeActivity/exchangeRealPrize';
        //
        //// 奖品兑换-金点兑奖接口
        //this.exchangeCoinPrizeUrl = apiBaseurl + 'prizeActivity/exchangeCoinPrize';

        // 奖品兑换接口
         this.exchangePrizeUrl = apiBaseurl + 'prizeActivity/exchangePrize';

        // activityId testUserId
        this.activityId = this.getUrlValueOnePara('activityId');
        // this.userId = "1258849";

        // 初始化
        this.pageInit();
    }
    PrizeActivity.prototype = {
        // 初始化
        pageInit: function() {
            // 通过app的js注入拿useId
            this.userInfo();
            // this.searchUserPrize();
        },

        // 通过app的js注入拿useId
        userInfo: function() {
            var root = this;
            var count = 0;
            setTimeout(function() {
                try {
                    var json_global = {
                        type: 0
                    };
                    //要求注入
                    window.globalbyCallback = function(msg) {
                        //拿用户登录信息
                        var json = {
                            type: 0
                        };
                        window.loginCallback = function(msg) {
                            var data = $.parseJSON(msg);
                            root.userId = data.userId ? parseInt(data.userId) : "";

                            if (!root.userId && count === 0) {
                                DsJsBridge_login.toLogin(JSON.stringify({type: 1}));
                            }
                            count++;
                            
                            // 查询个人中奖结果
                            if (root.userId) {
                                root.searchUserPrize();
                            }
                        };
                        DsJsBridge_login.toLogin(JSON.stringify(json));
                    };
                    DsJsBridge.globalby(JSON.stringify(json_global));
                } catch (e) {
                    console.log(e);
                }
            }, 0)
        },

        // 查询个人中奖结果
        searchUserPrize: function () {
            var root = this;
            var req = {
                activityId: root.activityId,
                userId: root.userId
            };
            root.normalAjaxRequest(root.searchUserPrizeUrl, req, function (res) {
                // console.log(res.data);
                switch (res.data.isPrize) {
                    case 0:
                        $('.prize-name').text(res.data.prizeName).show();
                        $('.prize-result').text('未兑奖');
                        $('.exchange').show();
                        break;
                    case 1:
                        $('.prize-name').text(res.data.prizeName).show();
                        $('.exchange').hide();
                        $('.prize-result').text('已兑奖');
                        break;
                    default:
                        $('.prize-name').hide();
                        $('.exchange').hide();
                        $('.prize-result').text('未中奖');
                        break;
                }

                // 奖品类型(1:金点 2:实物)
                root.prizeType = res.data.prizeType;
                if (res.data.prizeType === 2) {
                    $('.real').show();
                }
            });

            // 点击兑奖
            $('.get-prize').off('click').on('click', function () {
                root.getPrize();
                $('.get-prize').off('click');
            });
        },

        // 领取奖品
        getPrize: function () {
            var root = this;
            if (root.prizeType === 2) {
                var req = {
                        "activityId": root.activityId,
                        "userId": root.userId,
                         "prizeType": 2,
                        "recipientName": $('#recipient-name').val() ? $('#recipient-name').val() : '',
                        "recipientAddress": $('#recipient-address').val() ? $('#recipient-address').val() : '',
                        "recipientPhone": $('#recipient-phone').val() ? $('#recipient-phone').val() : ''
                    };
                root.normalAjaxRequest(root.exchangePrizeUrl, req, function (res) {
                    // console.log(res);
                    $.alert('兑奖成功');

                    // 重新查询中奖结果
                    root.searchUserPrize();
                }, function (res) {
                    $.toast(res.message);
                    $('.get-prize').off('click').on('click', function () {
                        root.getPrize();
                        $('.get-prize').off('click');
                    });
                })
            }
            if (root.prizeType === 1) {
                req = {
                        "activityId": root.activityId,
                        "userId": root.userId,
                         "prizeType": 1
                    };
                root.normalAjaxRequest(root.exchangePrizeUrl, req, function (res) {
                    // console.log(res);
                    $.alert('金点领取成功');

                    // 重新查询中奖结果
                    root.searchUserPrize();
                })
            }
             if (root.prizeType === 3) {
                 req = {
                         "activityId": root.activityId,
                         "userId": root.userId,
                         "prizeType": 3
                     };
                 root.normalAjaxRequest(root.exchangePrizeUrl, req, function (res) {
                     // console.log(res);
                     $.alert('商品领取成功');

                     // 重新查询中奖结果
                     root.searchUserPrize();
                 })
             }
        }
    };

    // 实例化
    new PrizeActivity();
});
