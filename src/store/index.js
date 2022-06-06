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
        projects: [],
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
            return state.students.find(
                (student) => student['@id'] == state.selectedStudent
            )
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
        getProjects(state) {
            return state.projects
        },
    },
    mutations: {
        SET_SHOW_PROJECTS(state, value) {
            state.showProjects = value
        },
        SET_SELECTED_STUDENT(state, value) {
            if (state.selectedStudent && state.selectedStudent == value) {
                state.selectedStudent = null
            } else {
                state.selectedStudent = value
            }
        },
        SET_USER(state, value) {
            state.user = value
        },
        SET_STUDENTS(state, value) {
            state.students = value
        },
        SET_PROJECTS(state, value) {
            state.projects = value
        },
        ADD_PROJECT(state, value) {
            state.projects = [...state.projects, value]
        },
    },
    actions: {
        fetchUser(context) {
            return axios.get('api/me').then((user_res) => {
                context.commit('SET_USER', user_res.data)
                return user_res.data
            })
        },
        logOut(context) {
            cookies.delete('jwt')
            cookies.delete('jwt_expiration')
            cookies.delete('json_web_token')
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
                            applicant.suggestion_status = 'no'
                        else if (maybe == yes || maybe == no || yes == no)
                            applicant.suggestion_status = 'maybe'
                    })
                    context.commit('SET_STUDENTS', applicants)
                })
            })
        },
        fetchProjects(context) {
            axios.get('/api/projects').then((res) => {
                context.commit('SET_PROJECTS', res.data['hydra:member'])
            })
        },
        addSuggestion(context, suggestion) {
            state.students.forEach((student) => {
                if (student['@id'] !== state.selectedStudent) return
                student.suggestions.push(suggestion)
            })
        },
        deleteSuggestion(context, id) {
            state.students.forEach((student) => {
                if (student['@id'] !== state.selectedStudent) return

                const index = student.suggestions.findIndex((sugg) => sugg['@id'] === id)
                if (index > -1) student.suggestions.splice(index, 1)
            })
        },
    },
})
