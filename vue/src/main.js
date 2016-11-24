import Vue from 'vue';
//载入路由
import VueRouter from 'vue-router';
//载入请求插件
import VueResource from 'vue-resource';
//使用路由的第一步
Vue.use(VueRouter);
//vue的请求插件vue-resource
Vue.use(VueResource);
//载入全局样式
require("!style!css!sass!./index.scss");
//默认首页
const de = {template:'<div>缺省页</div>'};
//懒加载
const Components = r => require.ensure([], () => r(require('./page/Components')), '/group');
const Main = r => require.ensure([], () => r(require('./page/Main')), '/group');
//定义路由跳转
const routes = [
  { path: '/', component: de },
  { path: '/foo/:id', component: Components },
  { path: '/bar', component: Main }
];
//路由实例化
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
});
//定义模板
const template = `
<div class="container">
  <div class="sidebar">
    <router-link to="/foo/2">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </div>
  <div class="wrapper">
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</div>
`;
//定义主界面，带入路由和模板
const app = new Vue({
  router,
  template,
  created: function(){

  },
  data () {
    return {
      transitionName: 'slide-left'
    }
  },
  // dynamically set transition based on route change
  watch: {
    '$route' (to, from) {
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    }
  },
}).$mount('#app');
