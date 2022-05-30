<template>
    <div id="app">
        <b-navbar shadow>
            <template #brand>
                <img
                    src="./assets/logo-osoc-color.svg"
                    alt="osoc"
                    class="navbar-logo ml-5"
                />
                <div class="page-title mx-4">
                    <p class="has-text-weight-normal">
                        #osoc selections
                    </p>
                </div>
            </template>
            <template v-if="getUser" #start>
                <b-navbar-item
                    :to="{ name: 'home' }"
                    class="is-tab"
                    tag="router-link"
                    :active="$route.name == 'home'"
                >
                    Suggest students
                </b-navbar-item>
                <b-navbar-item v-if="isPipelineEnabled" href="#" class="is-tab">
                    Student pipeline
                </b-navbar-item>
            </template>
            <template v-if="getUser" #end>
                <b-switch
                    v-if="isProjectPhaseEnabled"
                    :value="showProjects"
                    type="is-primary"
                    @input="SET_SHOW_PROJECTS"
                >
                    Show projects
                </b-switch>
                <b-navbar-item
                    v-if="getUser.roles.includes('ROLE_ADMIN')"
                    class="is-tab"
                    tag="router-link"
                    :to="{ name: 'users' }"
                    :active="$route.name == 'users'"
                >
                    Manage users
                </b-navbar-item>
                <b-button class="mr-3 ml-2" @click="logOut">Log out</b-button>
            </template>
        </b-navbar>
        <router-view />
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import cookies from './utils/cookies'

export default {
    name: 'App',
    computed: {
        ...mapGetters([
            'showProjects',
            'selectedStudent',
            'getUser',
            'isProjectPhaseEnabled',
        ]),
        isPipelineEnabled() {
            return process.env.VUE_APP_PIPELINE_ENABLED.toUpperCase() === 'TRUE'
        },
    },
    mounted() {
        if (cookies.get('jwt')) {
            this.$axios.get('api/me').then((user_res) => {
                this.SET_USER(user_res.data)

                if (this.$route.name != 'home') {
                    this.$router.push({ name: 'home' })
                }
            })
        }
    },
    methods: {
        ...mapMutations(['SET_SHOW_PROJECTS', 'SET_USER']),
        ...mapActions(['logOut']),
    },
}
</script>

<style lang="scss">
.page-title {
    height: 100%;
    display: flex;
    align-items: center;
}

.navbar-item {
    padding: 1.4rem 0.8rem;
    height: 72px;

    &.is-tab {
        padding-bottom: initial !important;
        padding-top: initial !important;
        border-top: 3px solid transparent;
        border-bottom: 3px solid transparent;
    }
}

.navbar-logo {
    width: 38px;
}

.navbar-end {
    align-items: center;
}
</style>
