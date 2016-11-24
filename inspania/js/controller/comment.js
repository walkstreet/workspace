DsAdmin.controller('comment', function($rootScope, $scope, $http, $cookies, $state, $timeout, $filter, DSHttpService, commonjs, SweetAlert, toaster) {
        //待审核评论列表
        var listUrl = DSCONST.APIBASEURL + 'videoComment/queryUnAuditList';
        //通过拒绝接口
        var auditUrl = DSCONST.APIBASEURL + 'videoComment/auditComment';
        //面包屑设置层级
        $scope.breadCrumb = '评论审核';
        $scope.bread = [
            { 'title': '首页' },
            { 'title': '互动管理' }
        ];
        //默认让日期清空
        var timeout = $timeout(function() {
            angular.element("#startDate").val("");
            angular.element("#endDate").val("");
        }, 0);
        //timeout之后载入初始第一页
        timeout.then(function() {
            listRequest(1);
        });
        //用户检索变量声明
        $scope.person = {};
        $scope.people = [];
        //视频检索变量声明
        $scope.answer = {};
        $scope.answer.video = [];
        //radio，默认选中“显示”
        $scope.display = "0";
        //默认发表内容为空
        $scope.content = "";
        //发表类型默认为全部
        $scope.commentType = "";
        //显示table-loading，默认是true
        $scope.tableLoading = true;
        //点击查询按钮事件
        $scope.searchTable = function() {
            //按钮等待
            $scope.loading = true;
            //按照搜索条件筛选列表
            listRequest(1);
        };
        //点击重置按钮事件
        $scope.reset = function() {
            //用户清空
            $scope.person.selected = null;
            //视频清空
            $scope.answer.video = null;
            //显示隐藏还原
            $scope.display = "0";
            //发表内容清空
           	$scope.content = "";
           	//发表类型清空
           	$scope.commentType = "";
           	//默认让日期清空
	        angular.element("#startDate").val("");
	        angular.element("#endDate").val("");
           	//再刷新一次列表
           	listRequest(1);
        };
        //通过或者删除
        $scope.lotsControl = function(str, arr) {
            //如果页面还没加载就返回
            if (!$scope.template) return;
            //按钮等待
            $scope.lotsLoading = true;
            //创建请求参数
            var data = {};
            data.commentsStatus = str;
            if (arr) {
                data.commentsList = arr;
                //马上操作
                actionAll(str, data);
            } else {
                //创建批量id
                var newArr = [];
                //把打钩的行里的commentId添加到新数组里
                for (var i = 0; i < $scope.template.length; i++) {
                    if ($scope.template[i].checkbox) {
                        newArr.push($scope.template[i].commentsId);
                    }
                }
                //如果数组为空提示
                if (newArr.length == 0 || !newArr) {
                    //按钮等待
                    $scope.lotsLoading = false;
                    commonjs.toaster('error','至少选择一项');
                    return;
                } else {
                    data.commentsList = newArr;
                    SweetAlert.swal({
                            title: "此操作不可逆",
                            text: "是否确认",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        },
                        function(isConfirm) {
                            if (isConfirm) {
                                actionAll(str, data);
                            } else {
                                //按钮等待关闭
                                $scope.lotsLoading = false;
                            }
                        });
                }
            }
        };
        //批量操作通用
        var actionAll = function(str, data) {
            var promise = DSHttpService.httpPost(auditUrl, data);
            promise.then(function(data) {
                //按钮等待关闭
                $scope.lotsLoading = false;
                //提示成功
                var msg = str == "ACCESS" ? "操作成功，已通过选择的评论回复" : "操作成功，已拒绝选择的评论回复";
                commonjs.toaster('success',msg);
                //重新刷新列表
                listRequest($scope.page.currentPage);
            }, function(data) {
            	//按钮等待关闭
                $scope.lotsLoading = false;
                //提示失败
                var msg = str == "ACCESS" ? "操作失败，无法通过选择的评论回复，请重新尝试" : "操作失败，无法拒绝选择的评论回复，请重新尝试";
                commonjs.toaster('error',msg);
            })
        };
        //全选按钮和单个checkbox点击方法
        $scope.$watch('allCheck', function(newVal, oldVal) {
            if (newVal != oldVal) {
                for (var i = 0; i < $scope.template.length; i++) {
                    $scope.template[i].checkbox = $scope.allCheck;
                }
            }
        });
        //请求列表通用方法
        var listRequest = function(pageNum) {
            //全选按钮清空
            $scope.allCheck = false;
            //清空$scope.template
            $scope.template = [];
            //创建请求参数对象
            var data = {};
            //页码
            data.pageNum = pageNum;
            //步长
            data.pageSize = 20;
            //判断开始日期不能大于结束日期
            var start = new Date(angular.element("#startDate").val()).getTime();
            var end = new Date(angular.element("#endDate").val()).getTime();
            if(start && end){
            	if(start>end){
            		commonjs.notify('开始日期不能大于结束日期','alert-danger');
            		$scope.loading = false;
            		return;
            	}
            }
            //开始时间
            if (angular.element("#startDate").val()) data.startTime = angular.element("#startDate").val() + ' 00:00:00';
            //结束时间
            if (angular.element("#endDate").val()) data.endTime = angular.element("#endDate").val() + ' 23:59:59';
            //发表类型
            data.commentType = $scope.commentType;
            //评论内容
            if ($scope.content) data.content = $scope.content;
            //用户id
            if ($scope.person.selected) data.userIds = [$scope.person.selected.userId];
            //视频查询类别，显示或者隐藏,如果有视频列表，就提供视频和视频查询类别参数
            if ($scope.answer.video && $scope.answer.video.length > 0) {
                data.videoType = parseInt($scope.display);
                data.videoIds = new Array();
                for (var i = 0; i < $scope.answer.video.length; i++) {
                    data.videoIds.push($scope.answer.video[i].videoId);
                }
            }
            //显示table-loading
            $scope.tableLoading = false;
            //开始请求
            var promise = DSHttpService.httpPost(listUrl, data);
            promise.then(function(data) {
                //按钮等待关闭
                $scope.loading = false;
                //隐藏table-loading
                $scope.tableLoading = true;
                //分页器带入
                $scope.page = {
                    totalItems: data.data.count,
                    currentPage: pageNum,
                    maxSize: 6,
                    perPage: 20,
                    totalPage: Math.ceil(data.data.count / 20),
                    pageChange: function() {
                        listRequest(this.currentPage);
                    }
                };
                //数组里每个对象增加一个checkbox的false状态用于批量选择
                var result = data.data.list;
                for (var i = 0; i < result.length; i++) {
                    result[i].checkbox = false;
                }
                //带入模板
                $scope.template = result;
            }, function(data) {
            	//按钮等待关闭
                $scope.loading = false;
                commonjs.requestError();
            })
        };
    })
    //查询用户输入监听
    .directive('userSelect', function($rootScope, DSHttpService, commonjs) {
        return {
            require: 'uiSelect',
            link: function(scope, element, attrs, $select) {
                scope.$watch('$select.search', function(newVal, oldVal) {
                    //先清空列表
                    scope.$parent.people = [];
                    //用户查询接口地址
                    var userSearchUrl = DSCONST.APIBASEURL + 'user/matchUser';
                    //如果是空就不请求接口了
                    if (newVal == "") return;
                    //不为空的话就请求接口查询用户匹配列表
                    if (newVal != oldVal) {
                        //如果想用主controller里的$scope，可以使用scope.$parent
                        var json = {
                            keyword: newVal
                        };
                        var promise = DSHttpService.httpPost(userSearchUrl, json);
                        promise.then(function(data) {
                            //用户
                            scope.$parent.person = {};
                            scope.$parent.people = data.data;
                        })
                    }
                });
            }
        };
    })
    //查询视频输入监听
    .directive('videoSelect', function($rootScope, DSHttpService, commonjs) {
        return {
            require: 'uiSelect',
            link: function(scope, element, attrs, $select) {
                scope.$watch('$select.search', function(newVal, oldVal) {
                    //先清空列表
                    scope.availableVideo = [];
                    //视频查询接口地址
                    var videoSearchUrl = DSCONST.APIBASEURL + 'video/matchVideo';
                    //如果是空就不请求接口了
                    if (newVal == "") return;
                    //不为空的话就请求接口查询用户匹配列表
                    if (newVal != oldVal) {
                        //如果想用主controller里的$scope，可以使用scope.$parent
                        var json = {
                            keyword: newVal
                        };
                        var promise = DSHttpService.httpPost(videoSearchUrl, json);
                        promise.then(function(data) {
                            //判断如果返回的里面含有已选择的，过滤掉
                            var all = scope.answer.video;
                            var request = data.data;
                            if (!all) all = [];
                            for (var i = 0; i < all.length; i++) {
                                for (var j = 0; j < request.length; j++) {
                                    if (all[i].videoId == request[j].videoId) {
                                        request.splice(j, 1);
                                    }
                                }
                            }
                            //赋值给视频下拉模板列表
                            scope.availableVideo = request;
                        })
                    }
                })
            }
        };
    })
    //自定义视频发表类型filter
    .filter('contentSort', function() {
        return function(val) {
            if (val == "1") {
                return val = "评论"
            }
            if (val == "2") {
                return val = "回复";
            }
        }
    })
