import Vue from 'vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import '@mdi/font/css/materialdesignicons.css'
import './main.scss'
import App from './App.vue'
import router from './router'
import store from './store'
import Axios from './axios'

Vue.config.productionTip = false

Vue.use(Buefy)
Vue.prototype.$axios = Axios

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')
