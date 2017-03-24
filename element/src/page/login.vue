<template>
    <div class="login animated fadeInDown">
        <div class="login-box">
            <el-row>
                <el-col :span="12">
                    <p>
                        <img src="https://admin2.click-v.com/img/login_logo.png" class="logo">
                    </p>
                    <h1>点视运营管理系统</h1>
                </el-col>
                <el-col :span="12" class="login-form">
                    <el-form ref="form" :model="form">
                        <el-input type="text" v-model="form.username" placeholder="用户名"></el-input>
                        <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
                        <el-button type="primary" :loading="form.loading" v-on:click="onSubmit">登录</el-button>
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <div class="login-footer">
            <el-row>
                <el-col :span="12">
                    Copyright 上海点胜网络科技有限公司
                </el-col>
                <el-col :span="12" class="text-right">
                    &copy; 2011-2016
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .login{
        max-width:800px;
        margin: 0 auto;
        padding: 100px 0;
        .login-box{
            border-bottom: 1px solid #ccc;
            padding-bottom: 20px;
            margin-bottom: 20px;
            & p{
                margin: 0;
            }
            .logo{
                display: block;
                margin:0 auto;
            }
            h1{
                text-align: center;
                font-size: 22px;
            }
            .login-form{
                background-color: #fff;
                padding: 26px;
                .el-input{
                    margin-bottom: 20px;
                }
                .el-button{
                    width: 100%;
                }
            }
        }
        .login-footer{
            font-size: 12px;
            .text-right{
                text-align: right;
            }
        }
    }
</style>
<script>
    //md5加密插件，md5();
    import md5 from "md5";
    //载入axios及配置文件
    import axios from 'axios';
    import axiosConfig from '../axios.config';
    module.exports = {
        data(){
            return {
                form:{
                    username: "xukai",
                    password: "xk123456",
                    loading: false
                }
            }
        },
        created: function () {
            
        },
        mounted: function(){
            
        },
        methods: {
            onSubmit: function(){
                var root = this;
                this.form.loading = true;
                //执行axiosconfig里的函数，并绑定作用域
                var axConfig = axiosConfig.bind(this)();
                //先执行退出
                axios.post("login/logout",{},axConfig)
                    .then(function(res){
                        //统一方法处理有问题返回undefined
                        if(!res.data) return;
                        //再执行登录
                        axios.post("login/login",{
                            username: root.form.username,
                            password: md5(root.form.password)
                        },axConfig)
                            .then(function(res){
                                root.form.loading = false;
                                //统一方法处理有问题返回undefined
                                if(!res.data) return;
                                //cookie记录登录状态并跳转至欢迎页，登录成功后6小时删除
                                root.$cookie.set("loginStatus", "0", { expires: "6h" });
                                root.$router.push("/default/index");
                            })
                            .catch(function(err){
                                root.form.loading = false;
                                root.$message.error(DSCONST.APIERRORMSG);
                            })
                    })
                    .catch(function(err){
                        root.form.loading = false;
                        root.$message.error(DSCONST.APIERRORMSG);
                    })
            }
        }
    }
</script>