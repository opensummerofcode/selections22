<template>
    <div class="p-1 pb-4 projects-list" :class="{ 'is-full': true }">
        <div class="is-flex is-justify-content-space-between mx-5 mt-4 mb-0">
            <h1 class="has-text-weight-semibold is-size-3">
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
                        :label="`Conflicts (${conflictStudents.length})`"
                        :disabled="!conflictStudents.length"
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
        <div v-else-if="conflictsToggle === 'conflicts'" class="mx-5">
            <h2 class="subtitle">Resolving conflicts</h2>
            <div class="content is-small">
                <p>The student may be a better fit for a specific team, if they:</p>
                <ul>
                    <li>are an alum and the team doesn't have any yet</li>
                    <li>are an alum on a team with a half-time coach</li>
                    <li>are an alum and provide skills the coach does not have</li>
                    <li>have pre-existing history with the project in question</li>
                    <li>
                        enrich the team's diversity in language, culture, background,
                        experience and skills
                    </li>
                    <li>
                        have a skillset that is tough to find in other applicants, and
                        matches exceptionally well with the project
                    </li>
                </ul>
            </div>
            <div
                class="projects-grid"
                :class="{ 'is-fullscreen px-4': !selectedStudent }"
            >
                <student-card
                    v-for="student in conflictStudents"
                    :key="student['@id'] + '_conflicts'"
                    :student="student"
                    in-conflict
                />
            </div>
        </div>
    </div>
</template>
<script>
import ProjectCard from './ProjectCard.vue'
import StudentCard from './StudentCard.vue'
import { mapGetters, mapMutations } from 'vuex'
import tools from '../utils/tools'

export default {
    name: 'ProjectsList',
    components: {
        ProjectCard,
        StudentCard,
    },
    data() {
        return {
            conflictsToggle: 'projects',
        }
    },
    computed: {
        ...mapGetters(['selectedStudent', 'conflictStudents']),
    },
    methods: {
        ...mapMutations(['SET_SELECTED_STUDENT']),
        capitalizeFirstLetter: tools.capitalizeFirstLetter,
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
