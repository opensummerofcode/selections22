import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'
import MainApp from './components/MainApp'
import Members from './components/Members'

const beforeEnter = async (to, from, next) => {
    if (to.name.startsWith('sign') && store.state.user) {
        next({ name: 'home' })
    } else if (!to.name.startsWith('sign') && !store.state.user) {
        next({ name: 'signin' })
    } else if (to.name === 'users' && !store.state.user.roles.includes('ROLE_ADMIN')) {
        next({ name: 'home' })
    } else {
        next()
    }
}

const routes = [
    { path: '/signin', name: 'signin', component: SignIn, beforeEnter: beforeEnter },
    { path: '/signup', name: 'signup', component: SignUp, beforeEnter: beforeEnter },
    { path: '/', name: 'home', component: MainApp, beforeEnter: beforeEnter },
    { path: '/users', name: 'users', component: Members, beforeEnter: beforeEnter },
]

const router = new Router({
    mode: 'history',
    base: '/',
    routes,
})

export default router
