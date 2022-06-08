<template>
    <div class="p-1 projects-list" :class="{ 'is-full': true }">
        <div class="is-flex is-justify-content-space-between mx-5 mt-4 mb-0">
            <h1 class="has-text-weight-bold is-size-4">
                Projects
            </h1>
            <div class="has-text-right">
                <b-tabs
                    v-model="conflictsToggle"
                    type="is-toggle-rounded"
                    size="is-small"
                >
                    <b-tab-item
                        class="has-background-primary"
                        value="projects"
                        label="Projects"
                    />
                    <b-tab-item
                        class="has-background-primary"
                        value="conflicts"
                        label="Conflicts (1)"
                    />
                </b-tabs>
            </div>
        </div>
        <div
            v-if="conflictsToggle === 'projects'"
            class="projects-grid"
            :class="{ 'is-fullscreen px-4': !selectedStudent }"
        >
            <project-card
                v-for="project in $store.state.projects"
                :key="project['@id']"
                :project="project"
            />
        </div>
    </div>
</template>
<script>
import ProjectCard from './ProjectCard.vue'
import { mapGetters } from 'vuex'

export default {
    name: 'ProjectsList',
    components: {
        ProjectCard,
    },
    data() {
        return {
            conflictsToggle: 'projects',
            project1: {
                students: [],
            },
        }
    },
    computed: {
        ...mapGetters(['selectedStudent']),
    },
}
</script>
<style lang="scss" scoped>
.projects-list {
    overflow: scroll;
}

.projects-grid {
    &.is-fullscreen {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
}
</style>
