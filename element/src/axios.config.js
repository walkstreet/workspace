//该函数是axios的配置函数
//返回一个函数，需调用执行
module.exports = function(){
    var root = this;
    return {
        //请求的接口，在请求的时候，如axios.get(url,config);这里的url会覆盖掉config中的url
        url: '',
        // 请求方法同上
        method: 'POST', // default
        // 基础url前缀
        baseURL: DSCONST.APIBASEURL,
        transformResponse: [function (res) {
            //权限拦截,return掉
            if (res.code == 20132) {
                root.$message.error('权限不足');
                return;
            }
            if (res.code == 20131) {
                root.$message.error('登录超时');
                root.$router.push('/login');
                return;
            }
            //接口连通，但是参数有误
            if (res.code != 10000) {
                root.$message.error(res.message);
                return;
            }
            // 这里提前处理返回的数据
            return res;
        }],
        // 请求头信息
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        //设置超时时间
        timeout: 4000,
        //返回数据类型
        responseType: 'json', // default
    }
}
