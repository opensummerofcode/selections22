import Vue from 'vue'
import Router from 'vue-router'
import store from './store'

Vue.use(Router)

import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'
import MainApp from './components/MainApp'
import Members from './components/Members'
import Pipeline from './components/Pipeline'
import cookies from './utils/cookies'
import axios from 'axios'

const beforeEnter = async (to, from, next) => {
    const isLoggedIn = cookies.get('jwt')

    if (isLoggedIn) {
        store.dispatch('fetchUser').then((res) => {
            if (to.name.startsWith('sign')) {
                next({ name: 'home' })
            } else if (
                (to.name === 'users' || to.name === 'pipeline') &&
                !store.state.user.roles.includes('ROLE_ADMIN')
            ) {
                next({ name: 'home' })
            } else {
                next()
            }
        })
    } else {
        if (!to.name.startsWith('sign') && !isLoggedIn) {
            next({ name: 'signin' })
        } else {
            next()
        }
    }
}

const routes = [
    { path: '/signin', name: 'signin', component: SignIn, beforeEnter: beforeEnter },
    { path: '/signup', name: 'signup', component: SignUp, beforeEnter: beforeEnter },
    { path: '/', name: 'home', component: MainApp, beforeEnter: beforeEnter },
    { path: '/users', name: 'users', component: Members, beforeEnter: beforeEnter },
    {
        path: '/pipeline',
        name: 'pipeline',
        component: Pipeline,
        beforeEnter: beforeEnter,
    },
]

const router = new Router({
    mode: 'history',
    base: '/',
    routes,
})

export default router
