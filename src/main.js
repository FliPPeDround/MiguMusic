import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/iconfont/iconfont.css'
import Contextmenu from 'vue-contextmenujs'

Vue.use(ElementUI)
Vue.use(Contextmenu)
Vue.config.productionTip = false
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
