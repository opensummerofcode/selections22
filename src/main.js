import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'
import './main.scss'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(Buefy)

import store from './store'
Vue.prototype.$store = store
window.store = store

new Vue({
    render: (h) => h(App),
}).$mount('#app')
