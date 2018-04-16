// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import store from './store/index.js'
import "./public/css/reset.css"
// import {WrapperButton} from './components';
Vue.config.productionTip = false;
Vue.use(ElementUI);
// Vue.use(WrapperButton);

// /**
//  * 打开全局loading
//  * TODO: 移动到模块里
//  */
// Vue.prototype.showLoading = function () {
//   store.dispatch('SHOW_LOADING')
// };
// /**
//  * 关闭全局loading
//  */
// Vue.prototype.closeLoading = function () {
//   //延迟200毫秒关闭loading
//   setTimeout(() => {
//     store.dispatch('CLOSE_LOADING')
//   }, 200)
// };
router.beforeEach((to, from, next) => {
  localStorage.setItem('router',from.fullPath);
  let _menusData = JSON.parse(localStorage.getItem('_menusData'));
  next()
})
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  render: h => h(App),
});
