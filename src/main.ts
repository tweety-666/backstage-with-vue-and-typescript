// Vue
import Vue from 'vue';
import App from './App.vue';
import router from './router';
// Vuex
import store from './store/store';
// ui plugins
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// axios with interceptors
import axios from './utils/http';

Vue.use(ElementUI);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
