import Vue from 'vue'
import Vuex from 'vuex'
// import students from '../assets/dummy_students.json'
import cookies from '../utils/cookies'
import router from '../router'
import axios from '../axios'

Vue.use(Vuex)

const getDefaultState = () => {
    return {
        showProjects: false,
        selectedStudent: null,
        students: [],
        user: null,
    }
}

const state = getDefaultState()

export default new Vuex.Store({
    state,
    getters: {
        showProjects(state) {
            return state.showProjects
        },
        selectedStudent(state) {
            return state.selectedStudent
        },
        allStudents(state) {
            return state.students
        },
        getUser(state) {
            return state.user
        },
        isProjectPhaseEnabled() {
            return process.env.VUE_APP_PROJECT_PHASE.toUpperCase() === 'TRUE'
        },
    },
    mutations: {
        SET_SHOW_PROJECTS(state, value) {
            state.showProjects = value
        },
        SET_SELECTED_STUDENT(state, value) {
            if (state.selectedStudent && state.selectedStudent.id == value.id)
                state.selectedStudent = null
            else state.selectedStudent = value
        },
        SET_USER(state, value) {
            state.user = value
        },
        SET_STUDENTS(state, value) {
            state.students = value
        },
    },
    actions: {
        logOut(context) {
            cookies.delete('jwt')
            cookies.delete('refresh_token')
            context.commit('SET_USER', null)
            router.push({ name: 'signin' })
        },
        fetchStudents(context) {
            axios.get('/api/applicant_details').then((details_res) => {
                const details = details_res.data['hydra:member']
                axios.get('/api/applicants').then((applicants_res) => {
                    const applicants = applicants_res.data['hydra:member']
                    applicants.forEach((applicant, i) => {
                        let yes = 0
                        let maybe = 0
                        let no = 0

                        applicant.applicantDetails = details[i]

                        applicant.suggestions.forEach((sugg) => {
                            switch (sugg.status) {
                                case 'yes':
                                    yes++
                                    break
                                case 'maybe':
                                    maybe++
                                    break
                                case 'no':
                                    no++
                                    break
                                default:
                                    return
                            }
                        })

                        if (!yes && !maybe && !no)
                            applicant.suggestion_status = 'undecided'
                        else if (yes > maybe && yes > no)
                            applicant.suggestion_status = 'yes'
                        else if (maybe > yes && maybe > no)
                            applicant.suggestion_status = 'maybe'
                        else if (no > yes && no > maybe)
                            applicant.suggestion_status = 'is-no'
                        else if (maybe == yes || maybe == no || yes == no)
                            applicant.suggestion_status = 'is-maybe'
                    })
                    context.commit('SET_STUDENTS', applicants)
                })
            })
        },
    },
})
