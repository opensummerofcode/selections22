<template>
    <div class="students-list">
        <div class="students-search p-4">
            <h1
                class="has-text-grey-dark has-text-weight-light is-size-7 students-counter mb-3"
            >
                {{ filteredStudents.length }} of
                {{ $store.state.students.length }} students shown
            </h1>
            <b-field>
                <b-input
                    v-model="student_filters.search"
                    placeholder="Search a student by name"
                    type="search"
                    icon="magnify"
                ></b-input>
            </b-field>
            <div class="is-flex mb-2">
                <b-taginput
                    v-model="student_filters.roles"
                    autocomplete
                    open-on-focus
                    placeholder="Select roles"
                    :data="filteredRoles"
                    class="is-flex-grow-1 mr-3"
                    @typing="getFilteredRoles"
                />
                <b-button @click="clearRoles">Clear</b-button>
            </div>
            <div class="is-flex is-flex-direction-column my-4">
                <b-checkbox v-model="student_filters.alumni" class="mb-1">
                    Only alumni
                </b-checkbox>
                <b-checkbox v-model="student_filters.student_coach" class="mb-1">
                    Only student coach volunteers
                </b-checkbox>
                <!-- <b-checkbox v-model="student_filters.unmatched" class="mb-1">
                    Only unmatched students
                </b-checkbox> -->
                <b-checkbox v-model="student_filters.suggested" class="mb-1">
                    Show students I've suggested for
                </b-checkbox>
            </div>
            <b-field>
                <b-checkbox-button
                    v-model="student_filters.status"
                    native-value="yes"
                    type="is-info"
                    size="is-small"
                >
                    Yes ({{ allYesses }})
                </b-checkbox-button>
                <b-checkbox-button
                    v-model="student_filters.status"
                    native-value="maybe"
                    type="is-warning"
                    size="is-small"
                >
                    Maybe ({{ allMaybes }})
                </b-checkbox-button>
                <b-checkbox-button
                    v-model="student_filters.status"
                    native-value="no"
                    type="is-dark"
                    size="is-small"
                >
                    No ({{ allNos }})
                </b-checkbox-button>
                <b-checkbox-button
                    v-model="student_filters.status"
                    native-value="undecided"
                    type="is-primary"
                    size="is-small"
                >
                    Undecided ({{ allUndecided }})
                </b-checkbox-button>
            </b-field>
        </div>
        <div class="cards-container p-4">
            <student-card
                v-for="student in filteredStudents"
                :key="student.id"
                :student="student"
                :click-fn="() => showStudent(student)"
            />
        </div>
    </div>
</template>
<script>
import StudentCard from './StudentCard.vue'
import { mapGetters, mapMutations } from 'vuex'
import tools from '../utils/tools'

const roles = [
    'Front-end developer',
    'Back-end developer',
    'UI / UX designer',
    'Graphic designer',
    'Business',
    'Storyteller',
    'Marketer',
    'Copywriter',
    'Video editor',
    'Photographer',
    'Other',
]

export default {
    name: 'StudentsList',
    components: { StudentCard },
    data: function() {
        return {
            filteredRoles: roles,
            student_filters: {
                search: '',
                roles: [],
                alumni: false,
                student_coach: false,
                unmatched: false,
                suggested: false,
                status: ['yes', 'maybe', 'no', 'undecided'],
            },
        }
    },
    computed: {
        ...mapGetters(['getUser']),
        filteredStudents() {
            const filtered = this.$store.state.students.filter((student) => {
                if (!this.student_filters.status.includes(student.suggestion_status))
                    return false

                let shouldBeIn = true

                if (!tools.isEmptyStr(this.student_filters.search)) {
                    shouldBeIn =
                        student.firstname
                            .toUpperCase()
                            .includes(this.student_filters.search.toUpperCase()) ||
                        student.callname
                            .toUpperCase()
                            .includes(this.student_filters.search.toUpperCase()) ||
                        student.lastname
                            .toUpperCase()
                            .includes(this.student_filters.search.toUpperCase())
                }

                if (!shouldBeIn) return false

                if (this.student_filters.roles.length) {
                    shouldBeIn = false
                    this.student_filters.roles.forEach((role) => {
                        if (student.applicantDetails.applyingForRoles.includes(role)) {
                            shouldBeIn = true
                        }
                    })
                }

                if (!shouldBeIn) return false

                if (this.student_filters.alumni) {
                    shouldBeIn = student.applicantDetails.isAlumni
                }

                if (!shouldBeIn) return false

                if (this.student_filters.student_coach) {
                    shouldBeIn = student.applicantDetails.canWorkAsStudentCoach
                }

                if (!shouldBeIn) return false

                if (this.student_filters.suggested) {
                    shouldBeIn = false
                    student.suggestions.forEach((sugg) => {
                        let coachId = sugg.coach['@id'].split('/')
                        coachId = coachId[coachId.length - 1]
                        if (coachId == this.getUser.id) shouldBeIn = true
                    })
                }

                return shouldBeIn
            })

            return filtered
        },
        allYesses() {
            let count = 0
            this.$store.state.students.forEach((student) => {
                if (student.suggestion_status === 'yes') count++
            })
            return count
        },
        allNos() {
            let count = 0
            this.$store.state.students.forEach((student) => {
                if (student.suggestion_status === 'no') count++
            })
            return count
        },
        allMaybes() {
            let count = 0
            this.$store.state.students.forEach((student) => {
                if (student.suggestion_status === 'maybe') count++
            })
            return count
        },
        allUndecided() {
            let count = 0
            this.$store.state.students.forEach((student) => {
                if (student.suggestion_status === 'undecided') count++
            })
            return count
        },
    },
    methods: {
        ...mapMutations(['SET_SELECTED_STUDENT']),
        getFilteredRoles(text) {
            this.filteredTags = roles.filter((option) => {
                return (
                    option
                        .toString()
                        .toLowerCase()
                        .indexOf(text.toLowerCase()) >= 0
                )
            })
        },
        clearRoles() {
            this.student_filters.roles = []
        },
        showStudent(student) {
            this.SET_SELECTED_STUDENT(student)
        },
    },
}
</script>
<style lang="scss" scoped>
@import '../main.scss';

.students-list {
    box-shadow: 2px 0 0 0 whitesmoke;
    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: max-content auto;
    overflow-y: hidden;
}

.students-search {
    width: 100%;
    box-shadow: 0 2px 0 0 whitesmoke;
    z-index: 8;
}

.students-counter {
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.cards-container {
    overflow-y: auto;
}

.student-card {
    &.is-yes {
        border-color: $info;
    }

    &.is-maybe {
        border-color: $warning;
    }

    &.is-no {
        border-color: $dark;
    }
}
</style>
