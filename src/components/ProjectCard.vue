<template>
    <b-collapse
        v-model="isOpen"
        class="card"
        animation="none"
        :class="{ 'mx-5 mb-6': selectedStudent }"
    >
        <template #trigger>
            <div
                class="columns p-2 mx-0 project-header"
                :class="{ 'has-shadow': isOpen }"
                role="button"
                aria-controls="contentIdForA11y3"
                :aria-expanded="isOpen"
            >
                <div class="column is-half">
                    <a
                        href="#"
                        class="is-size-3 has-text-weight-semibold is-flex is-align-items-center is-justify-content-flex-start"
                    >
                        Project name
                        <b-icon icon="link" custom-class="mb-1 ml-2 link-icon" />
                    </a>
                    <h4 class="is-size-5">Partner</h4>
                    <b-taglist class="mt-5">
                        <b-tag>Coach#1</b-tag>
                        <b-tag>Coach#2</b-tag>
                    </b-taglist>
                </div>
                <div
                    class="column is-half has-text-right is-flex is-flex-direction-column is-align-items-flex-end"
                >
                    <b-tag class="mb-1 has-text-weight-bold">
                        1x full-stack developer
                    </b-tag>
                    <b-tag class="mb-1 has-text-weight-bold">2x communication</b-tag>
                    <b-tag class="mb-1 has-text-weight-bold">1x data-scientist</b-tag>
                    <b-tag class="mb-1 has-text-weight-bold">2x designer</b-tag>
                </div>
            </div>
        </template>
        <div class="p-4 mt-2">
            <student-card
                in-project
                :student="students[Math.floor(Math.random() * students.length)]"
            />
            <student-card
                in-project
                :student="students[Math.floor(Math.random() * students.length)]"
            />
            <student-card
                in-project
                :student="students[Math.floor(Math.random() * students.length)]"
            />
        </div>
    </b-collapse>
</template>
<script>
import StudentCard from './StudentCard.vue'
import students from '../assets/dummy_students.json'
import { mapGetters } from 'vuex'

export default {
    name: 'ProjectCard',
    components: { StudentCard },
    data() {
        return {
            isOpen: false,
            students,
        }
    },
    computed: {
        ...mapGetters(['selectedStudent']),
    },
    mounted() {
        if (!this.selectedStudent) {
            this.isOpen = true
        }
    },
}
</script>
<style lang="scss" scoped>
.project-header {
    &.has-shadow {
        box-shadow: 0 2px 0 0 whitesmoke;
    }
}
</style>
<style lang="scss">
.link-icon::before {
    font-weight: 600 !important;
}
</style>
