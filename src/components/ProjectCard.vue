<template>
    <b-collapse
        v-model="isOpen"
        class="card project-card"
        animation="none"
        :class="{ 'mx-5 mb-6': selectedStudent }"
    >
        <template #trigger>
            <div class="pb-4" @drop="onDrop($event)" @dragover.prevent>
                <div
                    class="columns p-2 pb-0 mx-0 project-header"
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
                <div v-if="!isOpen" class="px-4 mb-2">
                    <b-taglist>
                        <b-tag v-for="student in students" :key="student.id">
                            {{ student.firstname }} {{ student.lastname }}
                        </b-tag>
                    </b-taglist>
                </div>
            </div>
        </template>
        <div class="p-4" @drop="onDrop($event)" @dragover.prevent>
            <student-card
                v-for="(student, i) in students"
                :key="`${student.id}_card`"
                in-project
                :student="student"
                @removeStudent="removeStudent(i)"
            />
            <p v-if="!students.length" class="is-size-6 has-text-centered">
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
                                v-model="modal.radio"
                                native-value="full-stack developer"
                                size="is-small"
                                class="mb-2 has-text-weight-bold is-size-6"
                            >
                                1x full-stack developer
                            </b-radio>
                            <b-radio
                                v-model="modal.radio"
                                native-value="communication"
                                size="is-small"
                                class="mb-2 has-text-weight-bold is-size-6"
                            >
                                2x communication
                            </b-radio>
                            <b-radio
                                v-model="modal.radio"
                                native-value="data scientist"
                                size="is-small"
                                class="mb-2 has-text-weight-bold is-size-6"
                            >
                                1x data scientist
                            </b-radio>
                            <b-radio
                                v-model="modal.radio"
                                native-value="designers"
                                size="is-small"
                                class="mb-2 has-text-weight-bold is-size-6"
                            >
                                2x designer
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
                        :disabled="!modal.radio || !modal.reason"
                        @click="draftStudent"
                    />
                    <b-button label="Cancel" @click="closeModal" />
                    <span>You can still remove them from the team later.</span>
                </footer>
            </div>
        </b-modal>
    </b-collapse>
</template>
<script>
import StudentCard from './StudentCard.vue'
import { mapGetters } from 'vuex'

export default {
    name: 'ProjectCard',
    components: { StudentCard },
    data() {
        return {
            isOpen: false,
            students: [],
            isModalOpen: false,
            draggedStudent: null,
            modal: {
                radio: null,
                reason: null,
            },
        }
    },
    computed: {
        ...mapGetters(['selectedStudent', 'allStudents']),
    },
    mounted() {
        if (!this.selectedStudent) {
            this.isOpen = true
        }
    },
    // watch: {
    //     draggedStudent(val) {
    //         if (val) this.isModalOpen = true
    //     }
    // },
    methods: {
        onDrop(event) {
            const studentId = event.dataTransfer.getData('student')
            if (this.students.find((student) => student.id === studentId) == undefined) {
                this.draggedStudent = this.allStudents.find(
                    (student) => student.id === studentId
                )
                if (!this.isOpen) this.isOpen = true
                this.isModalOpen = true
            }
        },
        removeStudent(index) {
            this.students.splice(index, 1)
        },
        draftStudent() {
            this.students.push(this.draggedStudent)
            this.closeModal()
        },
        closeModal() {
            this.isModalOpen = false
            this.draggedStudent = null
            this.modal = {
                radio: null,
                reason: null,
            }
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
