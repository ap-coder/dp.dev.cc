import Vue from 'vue';
import App from './App.vue';
import router from './router/index';
import store from '../src/store/store';
import VueI18n from 'vue-i18n';
import locales from './assets/i18n';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import jQuery from 'jquery';
import 'bootstrap';
window.$ = window.jQuery = jQuery;
import './assets/css/font/Abel-Regular.ttf';
import './assets/css/font/WorkSans-Bold.otf';
import './assets/css/font/WorkSans-Regular.otf';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import SimpleVueValidation from 'simple-vue-validator';

import { VueReCaptcha } from 'vue-recaptcha-v3';
Vue.use(VueReCaptcha, { siteKey: '6LcnauEUAAAAAFFJyvXI3fWpBGplKEiyu6ywWRDu' });

Vue.use(SimpleVueValidation);
Vue.use(Vuetify);
Vue.use(VueI18n);

Vue.config.lang = localStorage.inn_lang || 'tw';
Object.keys(locales).forEach((lang) => {
  Vue.locale(lang, locales[lang]);
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
