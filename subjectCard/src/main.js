import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入rem.js文件
import "./modules/rem"

//引入main.scss样式文件
import "./stylesheets/main.scss"

// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()
// Vue.use(vConsole)

// 引入axios
import axios from "axios"
Vue.prototype.$axios = axios;

// 引入request
import { iniHeader, post, get, patch, put, deletes } from '@/utils/request'
Vue.prototype.$iniHeader = iniHeader
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$patch = patch
Vue.prototype.$put = put
Vue.prototype.$delete = deletes

//引入vant插件
import { Tabbar, TabbarItem, DropdownMenu, DropdownItem, Button, Toast, Empty, Popup, Circle, Area, NavBar, Form, Field, Dialog } from "vant"
import { Overlay } from 'vant';

Vue.use(Overlay);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Button);
Vue.use(Toast);
Vue.use(Empty);
Vue.use(Popup);
Vue.use(Circle);
Vue.use(Area);
Vue.use(NavBar);
Vue.use(Form);
Vue.use(Field);
Vue.use(Dialog);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')