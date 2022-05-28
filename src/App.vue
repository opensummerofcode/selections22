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
                    <p class="has-text-primary has-text-weight-medium">
                        #osoc selections
                    </p>
                </div>
            </template>
            <template #start>
                <b-navbar-item href="#" class="is-tab" active>
                    Suggest students
                </b-navbar-item>
                <b-navbar-item href="#" class="is-tab">Student pipeline</b-navbar-item>
            </template>
            <template #end>
                <b-switch
                    :value="showProjects"
                    type="is-primary"
                    @input="SET_SHOW_PROJECTS"
                >
                    Show projects
                </b-switch>
                <b-navbar-item class="is-tab" href="#">Manage users</b-navbar-item>
                <b-button class="mr-3 ml-2">Log out</b-button>
            </template>
        </b-navbar>
        <div class="main" :class="{ 'two-sections': showProjects && selectedStudent }">
            <students-list />
            <student-viewer v-if="selectedStudent" />
            <projects-list v-if="showProjects" />
        </div>
    </div>
</template>

<script>
import ProjectsList from './components/ProjectsList.vue'
import StudentsList from './components/StudentsList.vue'
import StudentViewer from './components/StudentViewer.vue'
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'App',
    components: { StudentsList, StudentViewer, ProjectsList },
    computed: {
        ...mapGetters(['showProjects', 'selectedStudent']),
    },
    methods: {
        ...mapMutations(['SET_SHOW_PROJECTS']),
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
    width: 50px;
}

.navbar-end {
    align-items: center;
}

.main {
    display: grid;
    grid-template-columns: 420px 1fr;
    grid-template-rows: 1fr;
    height: calc(100vh - 72px);

    &.two-sections {
        grid-template-columns: 420px 1fr 1fr;
    }
}
</style>
