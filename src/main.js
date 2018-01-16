// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// import router from './router'

Vue.config.productionTip = false

import style from '../static/font-awesome-4.7.0/css/font-awesome.min.css';

// export const bus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
  // components: {
  //   'app': App
  // }
  // router,
  // template: '<App/>',
  // components: { App }
})
