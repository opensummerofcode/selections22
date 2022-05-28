<template>
    <div class="students-list">
        <div class="students-search p-4">
            <h1
                class="has-text-grey-dark has-text-weight-light is-size-7 students-counter mb-3"
            >
                40 of 80 students shown
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
                <b-checkbox v-model="student_filters.unmatched" class="mb-1">
                    Only unmatched students
                </b-checkbox>
                <b-checkbox v-model="student_filters.suggested" class="mb-1">
                    Show students I've suggested for
                </b-checkbox>
            </div>
            <b-field>
                <b-checkbox-button type="is-info" size="is-small">
                    Yes (20)
                </b-checkbox-button>
                <b-checkbox-button type="is-warning" size="is-small">
                    Maybe (20)
                </b-checkbox-button>
                <b-checkbox-button type="is-dark" size="is-small">
                    No (20)
                </b-checkbox-button>
                <b-checkbox-button type="is-primary" size="is-small">
                    Undecided (20)
                </b-checkbox-button>
            </b-field>
        </div>
        <div class="cards-container p-4">
            <student-card
                v-for="student in students"
                :key="student.id"
                :student="student"
                :click-fn="() => showStudent(student)"
            />
        </div>
    </div>
</template>
<script>
import StudentCard from './StudentCard.vue'
import students from '../assets/dummy_students.json'
import { mapMutations } from 'vuex'

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
            students,
            student_filters: {
                search: '',
                roles: [],
                alumni: false,
                student_coach: false,
                unmatched: false,
                suggested: false,
            },
        }
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
    grid-template-rows: auto auto;
    overflow-y: hidden;
}

.students-search {
    width: 100%;
    box-shadow: 0 2px 0 0 whitesmoke;
    z-index: 99;
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
