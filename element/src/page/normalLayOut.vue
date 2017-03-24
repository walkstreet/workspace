<template>
<div class="container">
    <div class="content">
        <div class="sidebar">
            <div class="logo">
                <img src="https://admin2.click-v.com/img/login_logo.png" alt="logo">
            </div>
            <el-menu theme="dark" :default-active="activePath" class="el-menu-vertical-demo" @select="onClickMenu">
                <el-submenu v-for="menu in menus" :index="menu.index">
                    <template slot="title"><i :class="menu.className"></i>{{menu.name}}</template>
                    <el-menu-item :index="submenu.index" v-for="submenu in menu.subMenu">{{submenu.name}}</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="wrapper">
            <el-row class="top-nav">
                <el-col :span="12" class="top-nav-title text-left">
                    <span>新管理运营平台</span>
                </el-col>
                <el-col :span="12" class="top-nav-info text-right">
                    <span>系统管理员</span>
                    <i>|</i>
                    <span class="login-out" @click="loginOut">退出</span>
                </el-col>
            </el-row>
            <div class="router-view">
                <transition :name="transitionName">
                    <router-view class="child-view"></router-view>
                </transition>
            </div>
        </div>
    </div>
    <div class="footer">
        Copyright 上海点胜网络科技有限公司 &copy; 2011-2016
    </div>
</div>
</template>
<style lang="scss" scoped>
//布局样式
.container{
    width:100%;
    height: 100%;
    background-color: #fff;
}
.content {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 40px;
    min-width: 1200px;
}
//侧边导航
.sidebar {
    width: 200px;
    float: left;
    border-right: 1px solid #ccc;
    background-color: #1f2d3d;
    position: relative;
    z-index: 2;
    height: 100%;
    .logo{
        margin: 20px;
        img{
            display: block;
            margin: 0 auto;
        }
    }
}
//右边主要内容
.wrapper {
    margin-left: 200px;
    overflow-x: hidden;
    position: relative;
    z-index: 1;
    background-color: #f0f0f0;
    height: 100%;
    .top-nav{
        height: 50px;
        width: 100%;
        font-size: 14px;
        line-height: 48px;
        .top-nav-title{
            text-indent: 10px;
        }
        .top-nav-info{
            padding-right: 10px;
            i{
                font-size: 12px;
                font-weight: bold;
                font-style: normal;
                margin: 0 10px;
            }
            .login-out{
                cursor: pointer;
                color: deepskyblue;
            }
        }
        *{
            vertical-align: middle;
        }
    }
    .router-view{
        position: absolute;
        top:50px;
        bottom: 0;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
}

.sidebar a {
    display: block;
    text-align: center;
    text-decoration: none;
    line-height: 30px;
    border-bottom: 1px solid #ccc;
}
.footer{
    position: absolute;
    bottom:0;
    height: 40px;
    text-align: center;
    width: 100%;
    min-width: 1200px;
    line-height: 2.8;
    font-size: 14px;
    background-color: #ffffff;
}
</style>
<script>
    import axios from "axios";
    import axiosConfig from "../axios.config";
    module.exports = {
        data(){
            return {
                transitionName: "slide-left",
                activePath: "",
                menus: [
                    {
                        "index": "/system",
                        "name": "系统管理",
                        "className": "el-icon-setting",
                        "subMenu":[
                            {
                                "index": "/system/roleControl",
                                "name": "角色管理"
                            },
                            {
                                "index":"/system/adminControl",
                                "name": "操作员管理"
                            }
                        ]
                    }
                ]
            }
        },
        mounted: function(){
            this.activePath = this.$route.fullPath;
        },
        methods: {
            //导航点击跳转
            onClickMenu: function(path){
                this.$router.push(path);
            },
            //退出登录
            loginOut: function(){
                var root = this;
                //执行axiosconfig里的函数，并绑定作用域
                var axConfig = axiosConfig.bind(this)();
                //先执行退出
                axios.post("login/logout",{},axConfig)
                    .then(function(res){
                        //统一方法处理有问题返回undefined
                        if(!res.data) return;
                        //跳转至登录页
                        root.$router.push("/login");
                        //删除登录状态的cookie
                        root.$cookie.delete('loginStatus');
                    })
                    .catch(function(err){
                        root.$message.error(DSCONST.APIERRORMSG);
                    })
            }
        },
        watch: {
            "$route" (to, from) {
                //如果是欢迎页就取消左侧菜单选中
                if(to.path=="/default/index"){
                    this.activePath = "";
                }else{
                    this.activePath = to.path;
                }
                //判断path层级数量，过度动画左右滑动判断
                const toDepth = to
                    .path
                    .split("/")
                    .length
                const fromDepth = from
                    .path
                    .split("/")
                    .length
                this.transitionName = toDepth < fromDepth
                    ? "slide-right"
                    : "slide-left"
            }
        }
    }
</script>