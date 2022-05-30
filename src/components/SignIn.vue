<template>
    <div class="container">
        <div class="columns is-multiline mt-6">
            <div class="column is-8 is-offset-2">
                <div class="columns">
                    <div class="column left">
                        <h1 class="title is-1">Open summer of code selections</h1>
                        <h2 class="subtitle colored is-4">
                            Assemble the right teams to create innovative projects.
                        </h2>
                    </div>
                    <div class="column right">
                        <div class="columns">
                            <div class="column left">
                                <h1 class="title is-4">Sign in, coach!</h1>
                            </div>
                            <div class="column left has-text-right">
                                <p>
                                    – or
                                    <router-link :to="{ name: 'signup' }">
                                        sign up
                                    </router-link>
                                </p>
                            </div>
                        </div>
                        <form @submit="signIn">
                            <b-field label="Email">
                                <b-input v-model="email" type="email" />
                            </b-field>
                            <b-field label="Password">
                                <b-input v-model="password" type="password" />
                            </b-field>
                            <b-button
                                type="is-primary"
                                class="is-block is-fullwidth"
                                :disabled="submitDisabled"
                                native-type="submit"
                            >
                                Sign in
                            </b-button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
import cookies from '../utils/cookies'

export default {
    name: 'SignIn',
    data() {
        return {
            email: null,
            password: null,
        }
    },
    computed: {
        submitDisabled() {
            return !this.email || !this.password
        },
    },
    methods: {
        ...mapMutations(['SET_USER']),
        signIn(event) {
            event.preventDefault()
            const body = {
                email: this.email,
                password: this.password,
            }
            this.$axios.post('login', body).then((res) => {
                const exp = new Date()
                exp.setHours(exp.getHours() + 1)

                cookies.set('jwt', res.data.token, exp)
                cookies.set('refresh_token', res.data.refresh_token)

                this.$axios.get('api/me').then((user_res) => {
                    this.SET_USER(user_res.data)
                    this.$router.push({ name: 'home' })
                })
            })
        },
    },
}
</script>
