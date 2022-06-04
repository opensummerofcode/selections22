import axios from 'axios'
import store from './store'
import cookies from './utils/cookies'

// create axios instance with base Url
const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
})

// interceptors for request and response
// still need to find out if toast can be fired from here

instance.interceptors.request.use(
    function(config) {
        const isApiCall = config.url.startsWith('api/') || config.url.startsWith('/api/')

        if (isApiCall) {
            if (!cookies.get('json_web_token')) {
                const refresh_token = cookies.get('refresh_token')
                return instance.post('/refresh_token', { refresh_token }).then((res) => {
                    const exp = new Date()
                    exp.setHours(exp.getHours() + 1)

                    cookies.set('json_web_token', res.data.token, exp)
                    cookies.set('refresh_token', res.data.refresh_token)

                    config.headers['Authorization'] = `Bearer ${res.data.token}`

                    return config
                })
            } else {
                config.headers['Authorization'] = `Bearer ${cookies.get(
                    'json_web_token'
                )}`
            }
        }
        // Do something before request is sent

        return config
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    function(response) {
        // Any status code that lie within the range of 2xx cause this function to trigger

        // Do something with response data
        return response
    },
    function(error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        /*if (error.response.status !== 404) {
            // can update message key in store and use it in toast
            Toast.open({
                duration: 5000,
                message: `Something's not good, also I'm on <b>bottom</b>`,
                position: 'is-bottom-right',
                type: 'is-danger'
            })
            //store.commit('API_MESSAGE', error.response.data)
        }
        // Do something with response error*/
        return Promise.reject(error)
    }
)

export default instance
