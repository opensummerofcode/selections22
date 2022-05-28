import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => {
    return {
        showProjects: false,
        selectedStudent: null,
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
    },
})
