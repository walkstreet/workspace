/*-------------------------------------------------------------------------------------------------
 项目：APP-C
 标题：专题详情页
 作者：qing.yan@click-v.com
 版本：3.0
 依赖：zepto
 未尽事宜：无
 -------------------------------------------------------------------------------------------------*/
// 加载config以及require.config
require(['./config'], function() {
    require(['./require.config.min'], function() {
        require(['zepto'], function($) {
            // 加载,业务逻辑开始
            require(['template', 'weixin', 'xdomain', 'xwfBrowser', 'global', 'sui', 'slide', 'cookie'], function(template, wx, xdomain) {
                //本页面的业务逻辑
                function topic() {
                    //继承global类
                    global.call(this);
                    //默认下载app
                    this.downloadApp();
                    //计数器
                    this.count = 1;
                    //一页显示的个数
                    this.size = 10;
                    //判断是品牌列表还是栏目列表
                    this.status;
                    //是否到达最后一页了
                    this.end = false;
                    //滑动的时候在范围里请求了就暂停
                    this.pause = false;
                    //品牌详情接口
                    this.brandInfoUrl = apiBaseurl + 'brand/getBrandDetailOutSide';
                    //栏目详情接口
                    this.columnUrl = apiBaseurl + 'column/getColumnDetailOutSide';
                    //点赞
                    this.thumbUrl = apiBaseurl + 'video/outSideLike';
                    //获取微信签名
                    this.wxUrl = wxCheck + 'ds_wechat/wechat/getShareSign';
                    // 小微封BrowserId接入接口 
                    this.searchBrowserIDUrl = xwfBaseurl + '/ds-activity/xwf/searchBrowserID';
                    //root.browserId
                    this.browserId = "";
                    //所有业务逻辑的初始化
                    this.pageInit();
                };
                topic.prototype = {
                    //页面数据初始化
                    dataInit: function() {
                        //判断是否是品牌还是栏目
                        this.judgeBrandColumn();
                    },
                    wxConfig: function() {
                        var root = this;
                        var currentUrl = location.href;
                        var data = { currentUrl: currentUrl };
                        this.normalAjaxRequest(this.wxUrl, data, function(data) {
                            root.wxInit(data);
                        }, function(data) {
                            $.toast("微信连接失败");
                        });
                    },
                    //微信分享自定义内容
                    wxInit: function(config) {
                        var root = this;
                        var currentUrl = location.href;

                        var jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'checkJsApi'];

                        wx.config({
                            debug: false,
                            appId: config.appId,
                            timestamp: config.timestamp,
                            nonceStr: config.nonceStr,
                            signature: config.sign,
                            jsApiList: jsApiList
                        });

                        wx.ready(function() {

                            var wxConfig = {
                                title: document.title, // 分享标题
                                link: currentUrl, // 分享链接
                                desc: $('.desc').text() ? $('.desc').text() : "",
                                imgUrl: logoUrl, // 分享图标
                                success: function() {
                                    // console.log('分享成功');
                                },
                                cancel: function() {

                                }
                            };
                            // share to timeline
                            wx.onMenuShareTimeline(wxConfig);
                            // share to friends
                            wx.onMenuShareAppMessage(wxConfig);
                            // QQ
                            wx.onMenuShareQQ(wxConfig);
                        });

                        wx.error(function(res) {
                            console.log('error: ' + res);
                        });
                    },
                    //判断是否是品牌还是栏目
                    judgeBrandColumn: function() {
                        this.brand = this.getUrlValueOnePara("brandId");
                        if (this.brand) {
                            this.toBrand(this.brand);
                            this.status = "brand";
                            //隐藏专题banner
                            $(".banner").hide();
                        } else {
                            this.column = this.getUrlValueOnePara("columnId");
                            this.toColumn(this.column);
                            this.status = "column";
                            //隐藏自媒体banner
                            $(".banner-brand").hide();
                        }
                    },
                    //按照品牌来做数据展示
                    toBrand: function(code) {
                        var root = this;
                        if (root.end) return;
                        //请求的json
                        var data = {
                            brandId: parseInt(code),
                            pageSize: this.size,
                            pageNum: this.count
                        };
                        $.showPreloader("玩命加载中");
                        this.normalAjaxRequest(this.brandInfoUrl, data, function(data) {
                            $.hidePreloader();
                            if (data.data.list.length == 0) {
                                root.end = true;
                                $.toast("木有更多了");
                                return;
                            }
                            if (root.count == 1) {
                                //自媒体显示自媒体风格banner
                                var html = template('tpl_brand', data.data);
                                $('#banner_brand').append(html);
                                //描述
                                if (data.data.brandDescription) {
                                    $('.desc').html(data.data.brandDescription);
                                } else {
                                    $('.desc').hide();
                                }
                            }
                            //视频列表
                            var list = template('tpl_list', data.data);
                            $('#list').append(list);
                            //配置微信分享信息,默认只执行一次
                            if (root.count == 1 || root.count == "1") {
                                root.wxConfig();
                                root.changeDocTitle('【点视】' + data.data.brandName);
                            }
                            //滑到底部加载
                            root.slideBottomLoad();
                        }, function(data) {
                            $.hidePreloader();
                            $.toast(data.message);
                        });
                    },
                    //滑动加载
                    slideBottomLoad: function() {
                        var root = this;
                        $(".content").on('scroll', function(event) {
                            event.stopPropagation();
                            //屏幕高度
                            var windowHeight = $(this).height();
                            //滚动栏可滚动高度
                            var scrollHeight = $(this).scrollTop();
                            //文档高度
                            var docHeight = $(".main").height();
                            //判断相应事件
                            if (docHeight - windowHeight - scrollHeight <= 1) {
                                $(".content").off('scroll');
                                root.count++;
                                if (root.status == "brand")
                                    root.toBrand(root.brand);
                                else
                                    root.toColumn(root.column);
                            }
                        });
                    },
                    //按照栏目来做数据展示
                    toColumn: function(code) {
                        var root = this;
                        if (root.end) return;
                        //请求的json
                        var data = {
                            columnId: parseInt(code),
                            pageSize: this.size,
                            pageNum: this.count
                        };
                        $.showPreloader("玩命加载中");
                        this.normalAjaxRequest(this.columnUrl, data, function(data) {
                            $.hidePreloader();
                            if (data.data.list.length == 0) {
                                root.end = true;
                                $.toast('木有更多了');
                                return;
                            }
                            if (root.count == 1) {
                                //banner
                                var html = template('tpl_column', data.data);
                                $('#banner_column').append(html);
                                //描述
                                $('.desc').html(data.data.columnDescription);
                            }
                            //视频列表
                            var list = template('tpl_list', data.data);
                            $('#list').append(list);
                            //配置微信分享信息,默认只执行一次
                            if (root.count == 1 || root.count == "1") {
                                root.wxConfig();
                                root.changeDocTitle('【点视】' + data.data.columnName);
                            }
                            //滑到底部加载
                            root.slideBottomLoad();
                        }, function(data) {
                            $.hidePreloader();
                            $.toast(data.message);
                        });
                    },
                    //点击点赞
                    clickThumb: function() {
                        var root = this;
                        //数字和爱心都能点击
                        $(document).on('click', '.list .list-col .thumb span', function(event) {
                            var that = $(this);
                            var obj = $(this).parent('.thumb').find('.font-topic');
                            var num = $(this).parent('.thumb').find('span').eq(0).attr("data-num");
                            var objId = $(this).parent('.thumb').attr('data-id');
                            if (!obj.hasClass('icon-liked')) {
                                //如果没点过赞了
                                //请求
                                var data = {
                                    videoId: objId
                                };
                                root.normalAjaxRequest(root.thumbUrl, data, function(data) {
                                    //图标状态修改
                                    obj.removeClass('icon-unlike').addClass('icon-liked');
                                    //数字加1
                                    num = parseInt(num.replace(/,/g, ''));
                                    if (num <= 9999 && num >= 0) {
                                        num++;
                                        that.parent('.thumb').find('span').eq(0).text(root.addCommas(num));
                                    }
                                });
                            } else {
                                //如果点过了

                            }
                        });
                    },
                    //处理数字，每三位数字加个逗号
                    addCommas: function(data) {
                        //判断出单位
                        var num = parseInt(data),
                            unit;
                        if (num <= 9999 && num >= 0) {
                            unit = '';
                            nowNum = num;
                        } else {
                            unit = '万';
                            var nowNum = (num / 10000).toFixed(1);
                        }
                        //被除了10000后的数字，保留一位小数
                        nowNum += '';
                        x = nowNum.split('.');
                        x1 = x[0];
                        x2 = x[1];
                        var rgx = /(\d+)(\d{3})/;
                        while (rgx.test(x1)) {
                            x1 = x1.replace(rgx, '$1,$2');
                        }
                        if (x2) {
                            return x1 + '.' + (x2 ? x2.replace(/(\d{3})(?=[^$])/g, '$1,') : '') + unit;
                        } else {
                            return x1 + unit;
                        }
                    },
                    //点击播放视频,视频监听如果暂停的话
                    clickPlayVideo: function() {
                        var root = this;
                        $(document).on('click', '.list-col .play', function(event) {
                            var that = $(this);
                            //先暂停所有的视频
                            for (var i = 0; i < $('video').length; i++) {
                                //$('video').get(i).pause();
                            }
                            //大图的尺寸
                            var img = that.siblings('.cover').find('.cover-img');
                            img_width = img.width();
                            img_height = img.height();
                            //取当前的video的dom
                            var video = $(this).siblings('video');
                            //恢复到正常大小
                            video.width(img_width);
                            video.height(img_height);
                            //恢复播放control控制条
                            video.attr("controls", "controls");
                            //播放该视频
                            _video = video.get(0);
                            _video.play();
                        });
                        $(document).on('click', 'video', function(event) {
                            this.play();
                        });
                    },
                    //横屏竖屏后调整已经播放的视频宽度和高度
                    resizeVideo: function() {
                        $(window).resize(function() {
                            var video = $('video'),
                                img_width = $(".cover-img").eq(0).width(),
                                img_height = $(".cover-img").eq(0).height();
                            for (var i = 0; i < video.length; i++) {
                                if (video.eq(i).width() != 1) {
                                    video.eq(i).width(img_width);
                                    video.eq(i).height(img_height);
                                }
                            }
                        });
                    },
                    //模板引擎的过滤器
                    helper: function() {
                        var root = this;
                        //点赞数和播放数，满三位加个点,超过9999要加万
                        template.helper('dote', function(data) {
                            return root.addCommas(data);
                        });
                    },
                    // xdomainInit将browserId的请求地址做代理解决跨域
                    xdomainInit: function() {
                        var json = {};
                        json[WeIDBaseUrl] = '/proxy';
                        xdomain.slaves(json);
                    },
                    // 发送到小微封服务器browserId，并问点视后端拿
                    xwf: function() {
                        var root = this;
                        var sessionId = root.getUuid();
                        xwf_browser.uploadBrowserInfo('www.click-v.com', sessionId, 'topic', function(result) {
                            if (result.success) {
                                var req = {
                                    sessionId: sessionId
                                };
                                root.normalAjaxRequest(root.searchBrowserIDUrl, req, function(res) {
                                    //browserId;
                                    root.browserId = res.data.browserID;
                                    //取链接里的userId
                                    var userId = root.getUrlValueOnePara("userId") ? root.getUrlValueOnePara("userId") : "0";
                                    //如果是自媒体的话，按自媒体统计方式，或者按照专题显示方式
                                    if (root.status == "brand") {
                                        //打开页面拿到xwf的browserId后增加一次统计
                                        root.saveLog(root.browserId, 'msv3', "open", [root.brand]);
                                        //点击视频播放按钮，统计一次
                                        $(document).on('click', '.list .list-col .list-cover .play', function() {
                                            root.saveLog(root.browserId, 'msv3', "vp", [root.brand, $(this).attr('data-videoId'),userId]);
                                        });
                                        //点击下载app统计一次
                                        $(document).on('click', '.app', function() {
                                            root.saveLog(root.browserId, 'msv3', "dl", [root.brand]);
                                        });
                                    }else if(root.status == "column"){
                                        //打开页面拿到xwf的browserId后增加一次统计
                                        root.saveLog(root.browserId, 'bsv3', "open", [root.column]);
                                        //点击视频播放按钮，统计一次
                                        $(document).on('click', '.list .list-col .list-cover .play', function() {
                                            root.saveLog(root.browserId, 'bsv3', "vp", [root.column, $(this).attr('data-videoId'),userId]);
                                        });
                                        //点击下载app统计一次
                                        $(document).on('click', '.app', function() {
                                            root.saveLog(root.browserId, 'bsv3', "dl", [root.column]);
                                        });
                                    }
                                }, function (res) {
                                    console.log(res.message);
                                });
                            } else {
                                console.log('上传失败!' + result.message);
                            }
                        });
                    },
                    //所有业务逻辑的初始化
                    pageInit: function() {
                        this.dataInit();
                        this.clickThumb();
                        this.slideBottomLoad();
                        this.clickPlayVideo();
                        this.resizeVideo();
                        this.helper();
                        this.xdomainInit();
                        this.xwf();
                    }
                };
                $(function() {
                    //实例化
                    new topic();
                })
            });
        });
    });
});
