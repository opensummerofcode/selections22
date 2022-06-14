<template>
    <div
        :class="
            `card student-card ${isDraggable && 'draggable'} mb-2 p-4 is-${
                student.suggestion_status
            } ${isSelected &&
                isDraggable &&
                'has-background-link-light'} ${!isDraggable &&
                'no-border p-5'} ${isDeleting && 'is-deleting'}`
        "
        :draggable="isDraggable"
        @dragstart="startDrag($event)"
        @click="clickFn"
    >
        <div :class="{ columns: inConflict }">
            <div
                class="is-flex is-justify-content-space-between mb-2 is-align-items-flex-start"
                :class="{ 'column is-half': inConflict }"
            >
                <h1
                    v-if="inConflict || inProject"
                    class="has-text-weight-semibold student-name"
                    :class="{
                        'is-size-6': inProject,
                        'is-size-3': !inProject,
                    }"
                >
                    <a @click="showStudent">{{ callname }} {{ student.lastname }}</a>
                    <b-tag
                        v-if="inProject && student.position"
                        class="has-text-weight-normal"
                    >
                        {{ student.position }}
                    </b-tag>
                </h1>
                <h2 v-else class="is-size-5 has-text-weight-bold">
                    {{ callname }} {{ student.lastname }}
                </h2>
                <h3 v-if="inConflict" class="is-size-5 mb-5">
                    {{ paperworkName || '' }}
                    {{ paperworkName && student.pronouns ? ' – ' : '' }}
                    {{
                        student.pronouns
                            ? 'prefers to be referred ' + student.pronouns
                            : ''
                    }}
                </h3>
                <b-button v-if="inProject" @click="removeStudentEmitter">
                    <b-icon icon="close" :disabled="isDeleting" />
                </b-button>
                <b-taglist v-else-if="!inConflict" class="is-flex-shrink-0">
                    <b-tag type="is-info">{{ yesCount }}</b-tag>
                    <b-tag type="is-warning">{{ maybeCount }}</b-tag>
                    <b-tag type="is-dark">{{ noCount }}</b-tag>
                </b-taglist>
                <div v-if="inConflict">
                    <b-tag v-if="student.applicantDetails.isAlumni" class="mb-1">
                        osoc Alumnus
                    </b-tag>
                    <b-tag
                        v-if="student.applicantDetails.canWorkAsStudentCoach"
                        class="mb-1"
                    >
                        Student coach
                    </b-tag>
                </div>
            </div>
            <div v-if="!inConflict && !inProject" class="columns">
                <div
                    class="column is-flex is-flex-direction-column is-align-items-flex-start"
                >
                    <b-taglist>
                        <b-tag
                            v-for="role in student.applicantDetails.applyingForRoles"
                            :key="`${student.id}_${role}`"
                            class="mb-1"
                            icon="briefcase"
                        >
                            {{ role }}
                        </b-tag>
                    </b-taglist>
                    <b-taglist>
                        <b-tag
                            v-for="field in student.applicantDetails.fieldOfStudy"
                            :key="`${student.id}_${field}`"
                            class="mb-1"
                            icon="school"
                        >
                            {{ field }}
                        </b-tag>
                    </b-taglist>
                </div>
                <div
                    class="column is-flex is-flex-direction-column is-align-items-flex-end"
                >
                    <b-tag v-if="student.applicantDetails.isAlumni" class="mb-1">
                        osoc Alumnus
                    </b-tag>
                    <b-tag
                        v-if="student.applicantDetails.canWorkAsStudentCoach"
                        class="mb-1"
                    >
                        Student coach
                    </b-tag>
                </div>
            </div>
            <h5 v-if="inProject">
                By {{ student.drafter.firstname
                }}{{ student.reason ? `: ${student.reason}` : '' }}
            </h5>
        </div>
        <b-tag v-if="isDraggable" type="is-info" class="mt-2">
            {{ dateFormat(student.createdAt) }}
        </b-tag>
        <div v-if="inConflict" class="mt-4">
            <div
                v-for="(drafting, i) in student.projects"
                :key="`student_${student['@id']}_conflict_project_${drafting.project}`"
                class="student-conflict is-flex is-flex-direction-row is-justify-content-space-between"
                :class="{ 'mt-5': i }"
            >
                <div>
                    <h5>
                        <span class="has-text-weight-bold">
                            For
                            <a href="#">{{ drafting.project_details.title }}</a>
                        </span>
                        as a
                        <b-tag class="has-text-weight-normal">
                            {{ drafting.position }}
                        </b-tag>
                    </h5>
                    <h5>
                        By {{ drafting.drafter.firstname
                        }}{{ drafting.reason ? `: ${drafting.reason}` : '' }}
                    </h5>
                </div>
                <b-button class="is-flex-grow-0" @click="removeDraft(drafting)">
                    <b-icon icon="close" />
                </b-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import tools from '../utils/tools'

export default {
    name: 'StudentCard',
    props: {
        inProject: {
            type: Boolean,
            default: false,
        },
        inConflict: {
            type: Boolean,
            default: false,
        },
        student: {
            type: Object,
            required: true,
        },
        clickFn: {
            type: Function,
            default: () => {},
        },
    },
    data() {
        return {
            isDeleting: false,
        }
    },
    computed: {
        ...mapGetters([
            'selectedStudent',
            'isProjectPhaseEnabled',
            'showProjects',
            'getProjects',
        ]),
        isDraggable() {
            return this.isProjectPhaseEnabled && !this.inProject && !this.inConflict
        },
        yesCount() {
            const yesses = this.student.suggestions.filter(
                (sugg) => sugg.status.toUpperCase() == 'YES'
            )
            return yesses.length
        },
        maybeCount() {
            const maybes = this.student.suggestions.filter(
                (sugg) => sugg.status.toUpperCase() == 'MAYBE'
            )
            return maybes.length
        },
        noCount() {
            const nos = this.student.suggestions.filter(
                (sugg) => sugg.status.toUpperCase() == 'NO'
            )
            return nos.length
        },
        isSelected() {
            return (
                this.selectedStudent &&
                this.selectedStudent['@id'] === this.student['@id']
            )
        },
        callname() {
            return !this.student.callname || tools.isEmptyStr(this.student.callname)
                ? this.student.firstname
                : this.student.callname
        },
        paperworkName() {
            return !tools.isEmptyStr(this.student.callname)
                ? this.student.firstname + ' (on paper)'
                : null
        },
    },
    mounted() {
        if (!this.inConflict) return

        this.student.projects.forEach((project) => {
            project.project_name = this.getProjects.find(
                (p) => p['@id'] == project.project
            ).title
        })
    },
    methods: {
        ...mapMutations(['SET_SHOW_PROJECTS', 'SET_SELECTED_STUDENT', 'UPDATE_PROJECT']),
        ...mapActions(['fetchStudents']),
        startDrag(event) {
            if (!this.showProjects) {
                this.SET_SHOW_PROJECTS(true)
            }
            event.dataTransfer.setData('student', this.student.id)
        },
        dateFormat(date) {
            const utc = new Date(date)
            return `${utc.getDate()}/${utc.getMonth() + 1}/${utc.getFullYear()}`
        },
        showStudent() {
            this.SET_SELECTED_STUDENT(this.student?.applicant || this.student['@id'])
        },
        removeStudentEmitter() {
            this.isDeleting = true
            this.$emit('removeStudent')
        },
        removeDraft(draft) {
            console.log(draft)
            this.$axios.delete(draft['@id']).then((_) => {
                this.$axios.get(draft.project).then((res) => {
                    this.UPDATE_PROJECT(res.data)
                    this.fetchStudents()
                })
            })
            return
        },
    },
}
</script>
<style lang="scss" scoped>
.student-card {
    border-bottom: 5px solid whitesmoke;

    cursor: pointer;

    &.draggable {
        cursor: move;
        cursor: grab;
    }

    &:hover {
        background: whitesmoke;
    }

    &.no-border {
        border-bottom: 0px;
        cursor: initial;

        &:hover {
            background: initial;
        }
    }

    &.is-deleting {
        opacity: 0.4;
    }
}
</style>
