import Vue from 'vue';
import App from './App';
import '../../node_modules/milligram/dist/milligram.min.css';

global.browser = require('webextension-polyfill');
Vue.prototype.$browser = global.browser;

/* eslint-disable no-new */
new Vue({
  el: '#app',

  render: h => h(App),
});
