DsAdmin.controller('login', function($rootScope, $scope, $http, $cookies, DSHttpService, $state, commonjs) {
    //表单提交事件
    $scope.onSubmit = function() {
        //按钮等待
        $scope.loading = true;
        //先退出操作
        var promise = DSHttpService.httpPost(DSCONST.APIBASEURL + 'login/logout', {});
        promise.then(function(data) {
            //登录流程开始
            var json = new Object();
            json.username = $scope.username;
            json.password = commonjs.md5($scope.pw);
            var promise = DSHttpService.httpPost(DSCONST.APIBASEURL + 'login/login', json);
            promise.then(function(data) {
                if (data.code == 10000) {
                    //commonjs.notify("登录成功","alert-success");
                    //跳转到首页
                    $state.go('interact.comment');
                    //把登录信息赋值给rootscope.userInfo
                    $rootScope.userInfo = data.data;
                } else {
                    //按钮等待关闭
                    $scope.loading = false;
                    //显示错误提示
                    $scope.error = true;
                    //显示用户名密码错误提示文字
                    $scope.errorText = data.data;
                }
            }, function(data) {
                commonjs.requestError();
                //按钮等待关闭
                $scope.loading = false;
            })
        }, function(data) {
            commonjs.requestError();
        });
    }
})
