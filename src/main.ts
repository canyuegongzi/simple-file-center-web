import Vue from 'vue';
import App from './App.vue';
import "./public-path";
import store from './store';
import {getRouter, route} from './router';
import ElementUI from 'element-ui';
import Router from 'vue-router';
console.log(window)
import '../src/utils/feth';
import session, { escapeCheckSession$ } from './session';
import 'element-ui/lib/theme-chalk/index.css';
import { global } from './utils/mixin';
import Treeselect from '@riophae/vue-treeselect'
import {ENV} from "@/env";
// @ts-ignore
window.FILEENV = ENV
Vue.use(ElementUI);
Vue.component('treeselect', Treeselect );
Vue.use(Router);
Vue.mixin(global);
Vue.mixin(session);
Vue.config.productionTip = false;
let router: any = null;
let instance: any = null;
function render(params?: any) {
  router = new Router({
    // @ts-ignore
    base: window.__POWERED_BY_QIANKUN__ ? "/fileSystem" : "/",
    mode: "history",
    routes: route,
  });
  instance = new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
}
// @ts-ignore
if (!window.__POWERED_BY_QIANKUN__) {
  escapeCheckSession$().then((router: any) => {
    instance = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  });
}
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  instance.$destroy();
  instance = null;
  router = null;
}
