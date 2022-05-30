<template>
    <div
        :class="
            `card student-card ${isProjectPhaseEnabled && 'draggable'} mb-2 p-4 is-${
                student.suggestion_status
            } ${isSelected && !inProject && 'has-background-link-light'}`
        "
        :draggable="isProjectPhaseEnabled && !inProject"
        @dragstart="startDrag($event)"
        @click="clickFn"
    >
        <div
            class="is-flex is-justify-content-space-between mb-2 is-align-items-flex-start"
        >
            <h2
                class="has-text-weight-bold"
                :class="{
                    'is-size-6': inProject,
                    'is-size-5': !inProject,
                }"
            >
                {{ student.firstname }} {{ student.lastname }}
                <b-tag v-if="inProject" class="has-text-weight-normal">
                    Data Scientist
                </b-tag>
            </h2>
            <b-button v-if="inProject" @click="$emit('removeStudent')">
                <b-icon icon="close" />
            </b-button>
            <b-taglist v-else class="is-flex-shrink-0">
                <b-tag type="is-info">{{ yesCount }}</b-tag>
                <b-tag type="is-warning">{{ maybeCount }}</b-tag>
                <b-tag type="is-dark">{{ noCount }}</b-tag>
            </b-taglist>
        </div>
        <div class="columns">
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
            <div class="column is-flex is-flex-direction-column is-align-items-flex-end">
                <b-tag v-if="student.applicantDetails.isAlumni" class="mb-1">
                    osoc Alumnus
                </b-tag>
                <b-tag v-if="student.applicantDetails.canWorkAsStudentCoach" class="mb-1">
                    Student coach
                </b-tag>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    name: 'StudentCard',
    props: {
        inProject: {
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
    computed: {
        ...mapGetters(['selectedStudent', 'isProjectPhaseEnabled']),
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
            return this.selectedStudent?.id === this.student.id
        },
    },
    methods: {
        startDrag(event) {
            event.dataTransfer.setData('student', this.student.id)
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
}
</style>
