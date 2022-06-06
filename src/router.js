import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import cookies from './utils/cookies'

Vue.use(Router)

import SignIn from './components/SignIn.vue'
import SignUp from './components/SignUp.vue'
import MainApp from './components/MainApp'
import Members from './components/Members'
import Projects from './components/Projects'
import Pipeline from './components/Pipeline'

const beforeEnter = async (to, from, next) => {
    const isLoggedIn = cookies.get('json_web_token')

    if (isLoggedIn) {
        store.dispatch('fetchUser').then((res) => {
            if (to.name.startsWith('sign')) {
                next({ name: 'home' })
            } else if (
                (to.name === 'users' ||
                    to.name === 'pipeline' ||
                    to.name === 'projects') &&
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
    { path: '/signin', name: 'signin', component: SignIn, beforeEnter },
    { path: '/signup', name: 'signup', component: SignUp, beforeEnter },
    { path: '/reset-password', name: 'signin', component: SignIn, beforeEnter },
    { path: '/', name: 'home', component: MainApp, beforeEnter },
    { path: '/users', name: 'users', component: Members, beforeEnter },
    {
        path: '/projects',
        name: 'projects',
        component: Projects,
        beforeEnter,
    },
    {
        path: '/pipeline',
        name: 'pipeline',
        component: Pipeline,
        beforeEnter,
    },
]

const router = new Router({
    mode: 'history',
    base: '/',
    routes,
})

export default router
