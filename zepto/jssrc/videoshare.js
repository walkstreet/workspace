/*-------------------------------------------------------------------------------------------------
 项目：APP-C
 标题：视频分享页
 作者：chiye.zhou@click-v.com
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
                $.showPreloader('玩命加载中');
                // 本页面的业务逻辑
                function share() {
                    //继承global类
                    global.call(this);

                    // 视频详情页 热门推荐视频/猜你喜欢视频接口
                    this.getVideosUrl = apiBaseurl + 'video/getRecommendVideosForWeb';

                    // 视频详情接口 
                    this.videoDetailsUrl = apiBaseurl + 'video/getVideoDetails';

                    // 小微封BrowserId接入接口 
                    this.searchBrowserIDUrl = xwfBaseurl + '/ds-activity/xwf/searchBrowserID';

                    //获取微信签名
                    this.wxUrl = wxCheck + 'ds_wechat/wechat/getShareSign';

                    //页面监控事件统计
                    this.logUrl = DevLogUrl + 'log/web';

                    //root.browserId
                    this.browserId = "";

                    // 初始化
                    this.pageInit();
                }
                share.prototype = {
                    // 初始化
                    pageInit: function() {
                        // 模板引擎的过滤器
                        this.helper();

                        // xdomainInit slaves setting
                        this.xdomainInit();

                        // xwf
                        this.xwf();

                        // 获取视频详情
                        this.getVideoDetails();

                        // 获取推荐视频
                        this.getVideos();

                        // app下载
                        this.download();

                        // 安卓全屏播放
                        // this.playVideo();
                    },

                    // 获取视频详情
                    getVideoDetails: function() {
                        var root = this;

                        // 从链接获取参数
                        root.videoId = root.getUrlValueOnePara('videoId');
                        if (!root.videoId) return;
                        var req = {
                            videoId: root.videoId
                        }
                        root.normalAjaxRequest(root.videoDetailsUrl, req, function(res) {
                            // console.log(res.data);

                            // 加载视频
                            $('#top_video')
                                .attr({
                                    poster: res.data.videoCoverUrl
                                })
                                .append('<source src="' + res.data.videoUrl + '" type="video/mp4" playsinline webkit-playsinline>');

                            // 视频详情
                            $('.video-title').text(res.data.videoTitle);
                            $('title').text('【点视】' + res.data.videoTitle);
                            $('.video-catgory').text(res.data.classifyName);
                            $('.video-time').text(res.data.videoDuration);
                            $('.video-desc').text(res.data.videoDescription);

                            // 加载brand
                            var brand = res.data.brand
                            $('.brand-logo').css({
                                background: 'url("' + brand.brandIconUrl + '")',
                                backgroundSize: '100%'
                            });
                            $('.brand-name').text(brand.brandName);
                            $('.brand-profile').text(brand.brandDescription);

                            // 显示
                            $('.brand').show();
                            $('.video-info').show();

                            // 隐藏加载提示
                            $('.load').hide();

                            //配置微信分享信息
                            root.wxConfig();

                            // fix ios 10.0.1 video play
                            root.fixVideo(res.data.videoCoverUrl);

                            //监听播放开始事件统计
                            var videoDom = document.getElementById('top_video');
                            videoDom.addEventListener('play', function() {
                                root.videoSaveLog('vp');
                                $('.playIcon').hide();
                            });
                        })
                    },

                    // xdomainInit slaves setting
                    xdomainInit: function() {
                        var json = {};
                        json[WeIDBaseUrl] = '/proxy';
                        xdomain.slaves(json);
                    },

                    // xwf
                    xwf: function() {
                        var root = this;
                        var sessionId = root.getUuid();
                        xwf_browser.uploadBrowserInfo('www.click-v.com', sessionId, 'videoshare', function(result) {
                            if (result.success) {
                                // console.log('上传成功!');
                                var req = {
                                    sessionId: sessionId
                                };
                                root.normalAjaxRequest(root.searchBrowserIDUrl, req, function(res) {
                                    //browserId;
                                    root.browserId = res.data.browserID;
                                    //打开页面拿到xwf的browserId后增加一次统计
                                    root.videoSaveLog("open");
                                }, function (res) {
                                    console.log(res.message);
                                });
                            } else {
                                console.log('上传失败!' + result.message);
                            }
                        });
                    },

                    // 获取推荐视频
                    getVideos: function() {
                        var root = this;
                        var videoId = this.getUrlValueOnePara("videoId");
                        if (!videoId) return;
                        var req = {
                            videoId: videoId
                        }
                        root.normalAjaxRequest(root.getVideosUrl, req, function(res) {
                            // console.log(res.data);

                            // 热门视频
                            if (res.data.hotVideos.length) {
                                var html = template('tpl-hot-video', res.data);
                                $('.hot-video-area').html(html);
                                $('.hot-video').show();
                            }

                            // 猜你喜欢视频
                            if (res.data.likeVideos.length) {
                                var html2 = template('tpl-recommend-video', res.data);
                                $('.video-area').html(html2);
                                $('.recommend-video').show();
                            }

                            var swiper = new Swiper('.swiper-container', {
                                slidesPerView: 'auto'
                            });

                            // 关闭加载提示,显示二维码
                            $.hidePreloader();
                            $('#videoshare').show();
                        })
                    },

                    // app下载
                    download: function() {
                        var root = this;
                        var width = $(document.body).width();

                        // 宽屏时下载样式调整
                        // if (width > 320 && width <= 420) {
                        //     $('.dianshi').css({
                        //         width: '65%'
                        //     });
                        //     $('.download').css({
                        //         width: '30%'
                        //     });
                        // } else if (width > 420) {
                        //     $('.dianshi').css({
                        //         width: '12rem'
                        //     });
                        //     $('.download').css({
                        //         width: '7rem'
                        //     });
                        // }
                        // $('.dianshi').show();
                        // $('.download img').show();

                        var loadNow = function() {
                            window.location.href = weiDownloadUrl;
                        };
                        var saveDwLog = function() {
                            root.videoSaveLog("dl");
                            loadNow();
                        };

                        $(".main").on('click', '.hot-video-list', loadNow);
                        $(".main").on('click', '.recommend-video-list', loadNow);
                        $(".download").on('click', saveDwLog);
                    },

                    //微信分享自定义内容
                    wxInit: function(config) {
                        var root = this;
                        var currentUrl = location.href;

                        var jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone', 'checkJsApi'];

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
                                title: '【点视】' + $('.video-info .video-title').text(), // 分享标题
                                link: currentUrl, // 分享链接
                                desc: $('.video-desc').text(),
                                imgUrl: logoUrl ? logoUrl : 'http://www.click-v.com/logo/new200x200.png', // 分享图标
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
                            // QZone
                            wx.onMenuShareQZone(wxConfig);
                        });

                        wx.error(function(res) {
                            console.log('error: ' + res);
                        });
                    },

                    wxConfig: function() {
                        var root = this;
                        var currentUrl = location.href;
                        var data = {
                            currentUrl: currentUrl
                        };
                        this.normalAjaxRequest(this.wxUrl, data, function(data) {
                            root.wxInit(data);
                        }, function(data) {
                            $.toast("微信连接失败");
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

                    //模板引擎的过滤器
                    helper: function() {
                        var root = this;
                        //点赞数和播放数，满三位加个点,超过9999要加万
                        template.helper('dote', function(data) {
                            return root.addCommas(data);
                        });
                    },

                    // 安卓全屏
                    playVideo: function() {
                        var root = this;
                        var flag = $.compareVersion('4.4.2', $.device.osVersion);
                        if (flag === 1 || flag === 0) {
                            var video = document.getElementById('top_video');
                            $('#top_video').unbind().bind('click', function() { //控制视频全屏与退出全屏
                                video.play();

                                //For Webkit
                                if ($('#top_video')[0].webkitEnterFullscreen) {
                                    $('#top_video')[0].webkitEnterFullscreen();
                                }

                                //For Firefox
                                if ($('#top_video')[0].mozRequestFullScreen) {
                                    $('#top_video')[0].mozRequestFullScreen();
                                    $('#top_video')[0].controls = false;
                                }
                                return false;
                            });
                        }
                    },

                    // fixVideo
                    fixVideo: function(url) {
                        var root = this;
                        var video = document.getElementById('top_video');

                        // ios10.0.1 微信中视频无法播放的问题
                        if ($.device.ios && $.device.isWeixin) {
                            // $(video).css('width', '1px').css('height', '1px');
                            // $('.fix-play').css('display', 'block').css('background','url("' + url + '")').css('backgroundSize', '100% 100%');
                            // $('#videoshare').on('click', '.fix-play', function () {
                            //     video.play();
                            //     $(video).css('width', '100%').css('height', '100%');
                            //     $('.fix-play').css('display', 'none');
                            // })
                            $(video).on('click', function() {
                                    video.play();
                                    $('.hint').hide();
                                })
                                // $('.bar-nav').append('<p class="hint" style="color:white;position: absolute;top: 0.1rem;font-size: 0.5rem;padding: 0.5rem;">提示：点击按钮无法播放视频时，请点视频其他区域播放。</p>');
                        }
                        if ($.device.ios) {
                            $('header').append('<img class="playIcon" src="../img/playIcon.png" />');
                            $('.playIcon').on('touchstart', function() {
                                video.play();
                                $('#top_video').get(0).play();
                                $(this).hide();
                            })
                        }
                    },

                    //页面监控事件统一
                    videoSaveLog: function(action) {
                        var bid = this.browserId;
                        var og = 'vsv3';
                        var ac = action;
                        var videoId = this.getUrlValueOnePara("videoId");
                        this.normalAjaxLogRequest(this.logUrl + '?bid=' + bid + '&og=' + og + '&ac=' + ac + '&p1=' + videoId);
                    }
                };

                // 实例化
                new share();
            });
        });
    });
});
