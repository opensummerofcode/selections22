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
                                <h1 class="title is-4">Sign up, coach!</h1>
                            </div>
                            <div class="column left has-text-right">
                                <p>
                                    – or
                                    <router-link :to="{ name: 'signin' }">
                                        sign in
                                    </router-link>
                                </p>
                            </div>
                        </div>
                        <form
                            v-if="!confirmed && !error"
                            class="signup-form pb-5 mb-5"
                            @submit="signUp"
                        >
                            <div class="columns mb-0">
                                <b-field label="First Name" class="column is-half">
                                    <b-input v-model="firstname" type="text" />
                                </b-field>
                                <b-field label="Last Name" class="column is-half">
                                    <b-input v-model="lastname" type="text" />
                                </b-field>
                            </div>
                            <b-field label="Email" class="mb-5">
                                <b-input v-model="email" type="email" />
                            </b-field>
                            <b-field
                                label="Password"
                                message="Use a password with at least 6 characters."
                            >
                                <b-input v-model="password" type="password" />
                            </b-field>
                            <b-button
                                type="is-primary"
                                class="is-block is-fullwidth"
                                :disabled="submitDisabled"
                                native-type="submit"
                            >
                                Sign up
                            </b-button>
                        </form>
                        <div v-if="confirmed" class="pb-5 signup-form mb-5">
                            <div>
                                <p>
                                    You're signed up! We'll let you know when you're ready
                                    to
                                    <router-link :to="{ name: 'signin' }">
                                        sign in
                                    </router-link>
                                    !
                                </p>
                            </div>
                        </div>
                        <div v-if="error" class="pb-5 signup-form mb-5">
                            <div>
                                <p>
                                    Uh oh! Something went wrong. Please contact us so we
                                    can fix the issue!
                                </p>
                            </div>
                        </div>
                        <p class="is-italic mb-5">
                            Let us know you've signed up via mail or on Discord and we'll
                            give you the correct rights.
                        </p>
                        <p>
                            We only use your personal information to grant you access
                            rights.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
    name: 'SignUp',
    data() {
        return {
            firstname: null,
            lastname: null,
            email: null,
            password: null,
            isSubmitting: false,
            confirmed: false,
            error: false,
        }
    },
    computed: {
        submitDisabled() {
            return (
                !this.email ||
                !this.password ||
                !this.firstname ||
                !this.lastname ||
                this.isSubmitting
            )
        },
    },
    methods: {
        ...mapMutations(['SET_USER']),
        signUp(event) {
            event.preventDefault()
            this.isSubmitting = true
            const body = {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password,
            }
            this.$axios
                .post('register', body)
                .then((res) => {
                    this.confirmed = true
                })
                .catch((err) => {
                    this.error = true
                })
        },
    },
}
</script>
<style lang="scss">
.signup-form {
    border-bottom: 2px solid whitesmoke;
}
</style>
