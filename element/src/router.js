/*
  新增页面需在此添加路径
 */
const DefaultPage = require("./page/Default"); //登录后默认的欢迎页

//懒加载
const Login = r => require.ensure([], () => r(require("./page/login")), "/group"); //登录页
const NormalLayOut = r => require.ensure([], () => r(require("./page/normalLayOut")), "/group"); //默认通用layout
const roleContrl = r => require.ensure([], () => r(require("./page/roleCtrl")), "/group"); //实例1
const adminControl = r => require.ensure([], () => r(require("./page/adminCtrl")), "/group"); //实例2

//定义路由跳转
const routes = [
    {
        path: "/",
        redirect: "/default/index"  //默认重定向到欢迎页
    }, {
        path: "/login",
        component: Login  //登录页
    }, {
        path: "/default",
        component: NormalLayOut,  //默认欢迎页，有二级嵌套路由
        children: [
            {
            path: "/default/index",
            component: DefaultPage  //欢迎页
            }
        ]
    }, {
      path: "/system",
      component: NormalLayOut,  //系统管理，有二级嵌套路由
      children: [
          {
              path: "/system/roleControl",
              component: roleContrl  //角色管理
          },
          {
              path: "/system/adminControl",
              component: adminControl  //管理员管理
          }
        ]
    }
];

/*
  路由具体配置
 */

import Vue from "vue";
//载入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.css";
//使用elementUI
Vue.use(ElementUI);

//载入路由
import VueRouter from "vue-router";

//定义layout
import template from "./layout.js";

//载入vuex的state
import store from "./store/store.js";

//使用路由的第一步
Vue.use(VueRouter);

//路由实例化
const router = new VueRouter({
    routes // （缩写）相当于 routes: routes
});

//定义主界面，带入路由和模板
const app = new Vue({
    router,
    store,
    template,
    mounted: function(){
        
    }
}).$mount("#app");