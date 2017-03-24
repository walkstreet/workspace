//载入数据流管理
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
//定义module
const moduleA = {
    state: {
        count: 1
    },
    mutations: {
        increment: state => state.count++,
        decrement: state => state.count--
    }
}
const store = new Vuex.Store({
    modules:{
        a: moduleA
    }
});
module.exports = store;