/*-------------------------------------------------------------------------------------------------
 项目：APP-C
 标题：全局JS
 作者：qing.yan@click-v.com
 版本：3.0
 依赖：zepto
 未尽事宜：无
 -------------------------------------------------------------------------------------------------*/
function global() {
    //接口地址
    this.requestUrl = "";
    //页面监控事件统计
    this.logUrl = DevLogUrl + 'log/web';
    //获取页面所有参数名方法
    this.getUrlValue = function() {
        var vars = [],
            hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    };
    //获取一个指定参数的值
    this.getUrlValueOnePara = function(name) {
        var val = this.getUrlValue();
        return val[name];
    };
    //POST请求模板
    this.normalAjaxRequest = function(url, json, callbackfun, errorfun) {
        $.ajax({
            type: "POST",
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(json),
            success: function(data) {
                if (data.code != 10000) {
                    //判断如果result==1时如果有回调用回调，没有alert
                    if (!errorfun) {
                        $.toast(data.message);
                    } else {
                        errorfun(data)
                    }
                } else if (data.code == 10000) {
                    //回调函数
                    callbackfun(data);
                }
            },
            error: function(textstatus) {
                $.hidePreloader();
                $.toast("连接失败");
            }
        })
    };
    //GET请求模板
    this.normalAjaxLogRequest = function(url) {
        $.ajax({
            type: "GET",
            url: url,
            success: function(data) {

            },
            error: function(textstatus) {

            }
        })
    };
    //load初始化
    this.maskOpen = function(text) {
        var tips = text ? text : "载入中";
        //添加load图层
        $("body").append(
            '<div class="mask"><div class="mask-layer">' + tips + '</div><div class="load"></div></div>'
        );
        //滚动条锁住
        $("body").css('overflow', 'hidden');
    };
    //load关闭
    this.maskClose = function() {
        //移除load图层
        $(".mask").remove();
        //滚动条锁住
        $("body").removeAttr('style');
    };
    //验证手机号码
    this.phoneNumberVerify = function(number) {
        var phone = /^(((13[0-9]{1})|(14[0-9]{1})|(16[0-9]{1})|(17[0-9]{1})|(19[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!phone.test(number)) {
            return false;
        } else {
            return true;
        }
    };
    //验证密码中是否含有特殊字符，必须含有可使用这个方法判断
    this.passwordVerify = function(pw) {
        var exp = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&mdash;—|{}【】‘；：”“'。，、？]");
        return (exp.test(pw));
    };
    //将图片转换成base64字符串
    this.imgTransBase64 = function(img, callback) {
        if (img) {
            var oFReader = new FileReader();
            oFReader.readAsDataURL(img);
            oFReader.onload = function(oFREvent) {
                //oFREvent.target.result;
                callback(oFREvent);
            };
            oFReader = null;
        }
    };
    // 生成UUID
    this.getUuid = function() {
        var len = 32; //32长度
        var radix = 16; //16进制
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;
        if (len) {
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    };
    //页面监控事件统一
    this.saveLog = function(bid, og, action, arr) {
        var videoId = this.brandId;
        var requestStr = this.logUrl + '?bid=' + bid + '&og=' + og + '&ac=' + action;
        for (var i = 0; i < arr.length; i++) {
            requestStr = requestStr + '&p' + (i + 1) + '=' + arr[i];
        }
        this.normalAjaxLogRequest(requestStr);
    };
    //下载app通用方法
    this.downloadApp = function(className) {
        var dom = className ? className : ".app";
        $(document).on('click', dom, function() {
            window.location.href = window.CONST.WXDU;
        });
    };
    //修改文档title
    this.changeDocTitle = function(title) {
        var body = $('body');
        document.title = title;
        var iframe = $('<iframe src="/favicon.ico"></iframe>');
        iframe.on('load', function() {
            setTimeout(function() {
                iframe.off('load').remove();
            }, 0);
        }).appendTo(body);
    };
    //初始化
    this.init = function() {};
    this.init();
};
