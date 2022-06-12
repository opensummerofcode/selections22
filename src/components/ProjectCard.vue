<template>
    <div class="card project-card" :class="{ 'mx-5 mb-6': selectedStudent }">
        <div class="pb-4" @drop="onDrop($event)" @dragover.prevent>
            <div class="columns p-2 pb-0 mx-0 project-header has-shadow" role="button">
                <div class="column is-half">
                    <h2
                        href="#"
                        class="is-size-3 has-text-weight-semibold is-flex is-align-items-center is-justify-content-flex-start mb-0"
                    >
                        {{ project.title }}
                    </h2>
                    <h4 class="is-size-5 has-text-weight-semibold">
                        {{ project.client }}
                    </h4>
                    <h4 class="is-size-5">
                        {{ project.applicants.length }}/{{ project.capacity }} students
                    </h4>
                    <p class="is-size-6 mt-5" v-html="replaceURLs(project.description)" />
                    <b-taglist class="mt-5">
                        <b-tag v-if="project.headCoach">
                            {{ project.headCoach.firstname }}
                        </b-tag>
                        <b-tag v-for="coach in project.users" :key="coach['@id']">
                            {{ coach.firstname }}
                        </b-tag>
                    </b-taglist>
                </div>
                <div
                    class="column is-half has-text-right is-flex is-flex-direction-column is-align-items-flex-end"
                >
                    <b-tag
                        v-for="(position, i) in project.positions"
                        :key="`project_${project['@id']}_position_${i}`"
                        class="mb-1 has-text-weight-bold"
                    >
                        {{ position.amount }}x {{ position.title }}
                    </b-tag>
                </div>
            </div>
        </div>
        <div class="p-4" @drop="onDrop($event)" @dragover.prevent>
            <student-card
                v-for="student in displayApplicants"
                :key="`project_${project['@id']}_${student.id}_card`"
                in-project
                :student="student"
                @removeStudent="removeStudent(student['@id'])"
            />
            <p v-if="!project.applicants.length" class="is-size-6 has-text-centered">
                No students yet, drag one from the list on the left to draft them
            </p>
        </div>
        <b-modal
            v-if="draggedStudent"
            v-model="isModalOpen"
            width="640px"
            :on-cancel="closeModal"
        >
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        Draft {{ draggedStudent.firstname }} for Project
                    </p>
                    <button type="button" class="delete" @click="closeModal" />
                </header>
                <section class="modal-card-body">
                    <b-field
                        :label="
                            `Which role are you drafting ${draggedStudent.firstname} for?`
                        "
                        custom-class="has-text-weight-bold mb-4"
                    >
                        <div class="is-flex is-flex-direction-column">
                            <b-radio
                                v-for="(position, i) in project.positions"
                                :key="`project_${project['@id']}_position_${i}_in_modal`"
                                v-model="modal.radio"
                                size="is-small"
                                class="mb-2 has-text-weight-bold is-size-6"
                                :native-value="position.title"
                            >
                                {{ position.amount }}x {{ position.title }}
                            </b-radio>
                        </div>
                    </b-field>
                    <b-field
                        label="Why is this student a good fit for your team?"
                        custom-class="has-text-weight-bold mb-4"
                    >
                        <b-input
                            v-model="modal.reason"
                            type="textarea"
                            placeholder="Provide a reason"
                        />
                    </b-field>
                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Draft to project"
                        type="is-success"
                        @click="draftStudent"
                    />
                    <b-button label="Cancel" @click="closeModal" />
                    <span>You can still remove them from the team later.</span>
                </footer>
            </div>
        </b-modal>
    </div>
</template>
<script>
import StudentCard from './StudentCard.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import tools from '../utils/tools'

export default {
    name: 'ProjectCard',
    components: { StudentCard },
    props: {
        project: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            isModalOpen: false,
            draggedStudent: null,
            modal: {
                radio: null,
                reason: null,
            },
            displayApplicants: [],
        }
    },
    computed: {
        ...mapGetters(['selectedStudent', 'allStudents']),
    },
    watch: {
        allStudents() {
            this.parseApplicants()
        },
    },
    mounted() {
        this.parseApplicants()
    },
    methods: {
        ...mapActions(['fetchStudents']),
        ...mapMutations(['UPDATE_PROJECT']),
        parseApplicants() {
            this.displayApplicants = []
            this.project.applicants.forEach((applicant, i) => {
                let student = {
                    ...this.allStudents.find((student) => {
                        return student['@id'] === applicant.applicant
                    }),
                }
                Object.assign(student, applicant)
                this.displayApplicants.push(student)
            })
        },
        onDrop(event) {
            const studentId = event.dataTransfer.getData('student')
            if (
                this.project.applicants.find((student) => student['@id'] === studentId) ==
                undefined
            ) {
                this.draggedStudent = this.allStudents.find(
                    (student) => student.id === studentId
                )
                this.isModalOpen = true
            }
        },
        removeStudent(id) {
            this.$axios.get(this.project['@id']).then((pr) => {
                let applicants = pr.data.applicants.map((app) => {
                    let returnApp = {}
                    returnApp.applicant = app.applicant
                    if (app.reason) returnApp.reason = app.reason
                    if (app.position) returnApp.position = app.position

                    return returnApp
                })

                let index = applicants.findIndex(
                    (applicant) => applicant.applicant === id
                )

                applicants.splice(index, 1)

                const body = { applicants }

                this.$axios.put(this.project['@id'], body).then((res) => {
                    this.UPDATE_PROJECT(res.data)
                    this.fetchStudents()
                })
            })
        },
        draftStudent() {
            this.$axios.get(this.project['@id']).then((pr) => {
                const applicant = { applicant: this.draggedStudent['@id'] }

                if (this.modal.radio) applicant.position = this.modal.radio
                if (this.modal.reason) applicant.reason = this.modal.reason

                let previousApplicants = pr.data.applicants.map((app) => {
                    let returnApp = {}
                    returnApp.applicant = app.applicant
                    if (app.reason) returnApp.reason = app.reason
                    if (app.position) returnApp.position = app.position

                    return returnApp
                })

                const body = {
                    applicants: [...previousApplicants, applicant],
                }

                this.$axios.put(this.project['@id'], body).then((res) => {
                    this.UPDATE_PROJECT(res.data)
                    this.fetchStudents()
                    this.parseApplicants()
                    this.closeModal()
                })
            })
        },
        closeModal() {
            this.isModalOpen = false
            this.draggedStudent = null
            this.modal = {
                radio: null,
                reason: null,
            }
        },
        replaceURLs(string) {
            return tools.replaceURLs(string)
        },
    },
}
</script>
<style lang="scss" scoped>
.project-card {
    height: fit-content;
}

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
