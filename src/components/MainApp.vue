<template>
    <div class="main" :class="{ 'two-sections': showProjects && selectedStudent }">
        <students-list />
        <student-viewer v-if="selectedStudent" />
        <projects-list v-if="showProjects" />
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import ProjectsList from './ProjectsList.vue'
import StudentsList from './StudentsList.vue'
import StudentViewer from './StudentViewer.vue'
export default {
    name: 'MainApp',
    components: { StudentsList, StudentViewer, ProjectsList },
    computed: {
        ...mapGetters(['selectedStudent', 'showProjects']),
    },
    mounted() {
        this.fetchStudents()
    },
    methods: {
        ...mapActions(['fetchStudents']),
    },
}
</script>
<style lang="scss" scoped>
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
