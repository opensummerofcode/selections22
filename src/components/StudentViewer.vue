<template>
    <div class="student-viewer" :class="{ narrow: showProjects }">
        <div class="student-header p-4 m-0" :class="{ columns: !showProjects }">
            <div class="column">
                <h1 class="is-size-3 has-text-weight-semibold student-name">
                    {{ callname }} {{ student.lastname }}
                </h1>
                <h3 class="is-size-5 mb-5">
                    {{ paperworkName || '' }}
                    {{ paperworkName && student.pronouns ? ' – ' : '' }}
                    {{ student.pronouns }}
                </h3>
                <div>
                    <b-tag
                        v-for="role in student.applicantDetails.applyingForRoles"
                        :key="`${student.id}_${role}`"
                        class="mr-1"
                        icon="briefcase"
                    >
                        {{ role }}
                    </b-tag>
                    <b-tag
                        v-for="field in student.applicantDetails.fieldOfStudy"
                        :key="`${student.id}_${field}`"
                        class="mr-1"
                        icon="school"
                    >
                        {{ field }}
                    </b-tag>
                    <b-tag class="mr-1" icon="flare">
                        {{ student.applicantDetails.bestSkill }}
                    </b-tag>
                </div>
            </div>
            <div class="column" :class="{ 'has-text-right': !showProjects }">
                <b-tag v-if="hasProject" class="mr-1">
                    {{ student.project.title }}
                </b-tag>
                <b-tag v-if="student.applicantDetails.isAlumni" class="mr-1">
                    osoc Alumnus
                </b-tag>
                <b-tag v-if="student.applicantDetails.canWorkAsStudentCoach" class="mr-1">
                    Student coach
                </b-tag>
            </div>
        </div>
        <div class="student-details p-5 m-0">
            <div class="is-2 is-multiline" :class="{ columns: !showProjects }">
                <div class="column" :class="{ 'is-half': !showProjects }">
                    <div class="card p-5 pb-6">
                        <h4 class="is-size-6 has-text-weight-bold mb-2">
                            Suggest
                        </h4>
                        <div class="mb-4">
                            <b-dropdown
                                :close-on-click="false"
                                @active-change="onSuggestionModalToggle"
                            >
                                <template #trigger>
                                    <b-button class="mr-1" type="is-info">
                                        Yes
                                    </b-button>
                                </template>
                                <b-dropdown-item :focusable="false" custom>
                                    <suggestion-modal
                                        suggestion="yes"
                                        :suggestion-reason="suggestionReason"
                                        @updateReason="updateSuggestionReason"
                                        @suggest="onSuggestionSubmit"
                                    />
                                </b-dropdown-item>
                            </b-dropdown>
                            <b-dropdown
                                :close-on-click="false"
                                @active-change="onSuggestionModalToggle"
                            >
                                <template #trigger>
                                    <b-button class="mr-1" type="is-warning">
                                        Maybe
                                    </b-button>
                                </template>
                                <b-dropdown-item :focusable="false" custom>
                                    <suggestion-modal
                                        suggestion="maybe"
                                        :suggestion-reason="suggestionReason"
                                        @updateReason="updateSuggestionReason"
                                        @suggest="onSuggestionSubmit"
                                    />
                                </b-dropdown-item>
                            </b-dropdown>
                            <b-dropdown
                                :close-on-click="false"
                                @active-change="onSuggestionModalToggle"
                            >
                                <template #trigger>
                                    <b-button type="is-dark">
                                        No
                                    </b-button>
                                </template>
                                <b-dropdown-item :focusable="false" custom>
                                    <suggestion-modal
                                        suggestion="no"
                                        :suggestion-reason="suggestionReason"
                                        @updateReason="updateSuggestionReason"
                                        @suggest="onSuggestionSubmit"
                                    />
                                </b-dropdown-item>
                            </b-dropdown>
                        </div>
                        <div
                            v-for="(suggestion, i) in student.suggestions"
                            :key="`${student.id}_suggestion_${i}`"
                            class="is-flex is-justify-content-flex-start is-align-items-center mb-4"
                        >
                            <div class="is-flex-grow-0 mr-2">
                                <b-tag :type="suggestionType(suggestion)">
                                    {{ suggestionLetter(suggestion) }}
                                </b-tag>
                            </div>
                            <div class="is-flex-grow-1">
                                <p>
                                    {{ suggestion.coach.firstname }}:
                                    {{ suggestion.comment }}
                                </p>
                            </div>
                            <b-button
                                class="is-flex-grow-0"
                                @click="removeSuggestion(suggestion['@id'])"
                            >
                                <b-icon icon="close" />
                            </b-button>
                        </div>
                        <h4 class="is-size-6 has-text-weight-bold mb-2 mt-5">
                            Coordinator decision
                        </h4>
                        <b-select
                            :value="student.status"
                            :disabled="$store.state.user.roles.includes('ROLE_MEMBER')"
                            @input="updateStudentStatus"
                        >
                            <option value="SCREENING">
                                Screening
                            </option>
                            <option value="REJECTED">
                                No, rejected
                            </option>
                            <option value="AWAITING_MAYBE">
                                Maybe, awaiting project
                            </option>
                            <option value="AWAITING_YES">
                                Yes, awaiting project
                            </option>
                            <option value="APPROVED">
                                Yes, assigned project
                            </option>
                            <option value="CONFIRMED">
                                Confirmed contract and project
                            </option>
                            <option value="DECLINED">
                                Declined contract
                            </option>
                        </b-select>
                    </div>
                </div>
                <div class="column" :class="{ 'is-half': !showProjects }">
                    <div class="card p-5 pb-6">
                        <div class="columns is-multiline is-1">
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Join live on-site
                                </h4>
                                <p>
                                    {{
                                        student.applicantDetails.canWorkOnsite
                                            ? 'Yes'
                                            : 'No'
                                    }}
                                </p>
                            </div>
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Work 09:00-17:00
                                </h4>
                                <p>Yes</p>
                            </div>
                            <div class="column is-full">
                                <h4 class="mb-2 has-text-weight-bold">Work 128 hours</h4>
                                <p>
                                    {{ employmentAgreement }}
                                </p>
                            </div>
                            <div class="column is-full">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Responsibilities during the day
                                </h4>
                                <p>
                                    {{ student.applicantDetails.responsibilities || '-' }}
                                </p>
                            </div>
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    osoc Alumnus
                                </h4>
                                <p>
                                    {{ student.applicantDetails.isAlumni ? 'Yes' : 'No' }}
                                </p>
                            </div>
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Student coach volunteer
                                </h4>
                                <p>
                                    {{
                                        student.applicantDetails.canWorkAsStudentCoach
                                            ? 'Yes'
                                            : 'No'
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column" :class="{ 'is-half': !showProjects }">
                    <div class="card p-5">
                        <div class="columns is-1 is-multiline">
                            <div class="column is-half mb-1">
                                <h3 class="is-size-5">
                                    Academia
                                </h3>
                            </div>
                            <div class="column is-half mb-1">
                                <b-tag>{{ student.applicantDetails.nameOfSchool }}</b-tag>
                            </div>
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Studies
                                </h4>
                                <p>
                                    {{ fieldOfStudy }}
                                </p>
                            </div>
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Duration of degree
                                </h4>
                                <p>
                                    {{ student.applicantDetails.lengthOfDegree }} year(s)
                                </p>
                            </div>
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Degree
                                </h4>
                                <p>{{ student.applicantDetails.typeOfDegree }}</p>
                            </div>
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Current year of degree
                                </h4>
                                <p>{{ student.applicantDetails.yearIntoDegree }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column" :class="{ 'is-half': !showProjects }">
                    <div class="card p-5">
                        <div class="columns is-1 is-multiline">
                            <div class="column is-full">
                                <h3 class="is-size-5">
                                    Skills
                                </h3>
                            </div>
                            <div class="column is-half">
                                <h4 class="mb-2 has-text-weight-bold">
                                    Best skill
                                </h4>
                                <p>{{ student.applicantDetails.bestSkill }}</p>
                                <h4 class="my-2 has-text-weight-bold">
                                    Most fluent language
                                </h4>
                                <p>{{ student.firstLanguage }}</p>
                                <h4 class="my-2 has-text-weight-bold">
                                    English proficiency
                                </h4>
                                <div
                                    class="is-flex is-align-content-center is-justify-content-flex-start"
                                >
                                    <b-rate
                                        disabled
                                        :value="student.applicantDetails.levelOfEnglish"
                                        size="is-small"
                                        class="mb-0 mr-1"
                                    />
                                    <span>{{ levelOfEnglishText }}</span>
                                </div>
                            </div>
                            <div class="column is-half">
                                <div v-if="hasCVUpload">
                                    <b-button
                                        type="is-primary"
                                        icon-left="download"
                                        @click="
                                            download(student.applicantDetails.cvUpload)
                                        "
                                    >
                                        Download CV
                                    </b-button>
                                    <p>{{ cvFileName }}</p>
                                </div>
                                <div v-if="hasCVLink">
                                    <b-button
                                        type="is-primary"
                                        icon-left="exit-to-app"
                                        @click="openUrl(student.applicantDetails.cvLink)"
                                    >
                                        Go to CV
                                    </b-button>
                                </div>
                                <div v-if="hasPortfolioUpload" class="mt-5">
                                    <b-button
                                        type="is-primary"
                                        icon-left="download"
                                        @click="
                                            download(
                                                student.applicantDetails.portfolioUpload
                                            )
                                        "
                                    >
                                        Download portfolio
                                    </b-button>
                                    <p>{{ portfolioFileName }}</p>
                                </div>
                                <div v-if="hasPortfolioLink" class="mt-5">
                                    <b-button
                                        type="is-primary"
                                        icon-left="exit-to-app"
                                        @click="
                                            openUrl(
                                                student.applicantDetails.portfolioLink
                                            )
                                        "
                                    >
                                        Go to portfolio
                                    </b-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="column is-full">
                    <div class="card p-5">
                        <div class="columns is-gapless is-multiline">
                            <div class="column is-half">
                                <h3 class="is-size-5">
                                    Motivation
                                </h3>
                            </div>
                            <div class="column is-half mb-1 has-text-right">
                                <span v-if="hasMotivationUpload">
                                    <b-button
                                        type="is-primary"
                                        icon-left="download"
                                        @click="
                                            download(
                                                student.applicantDetails.motivationUpload
                                            )
                                        "
                                    >
                                        Download motivation
                                    </b-button>
                                    <p>{{ motivationFileName }}</p>
                                </span>
                                <span v-if="hasMotivationLink">
                                    <b-button
                                        type="is-primary"
                                        icon-left="exit-to-app"
                                        @click="
                                            openUrl(
                                                student.applicantDetails.motivationLink
                                            )
                                        "
                                    >
                                        Go to motivation
                                    </b-button>
                                </span>
                            </div>
                        </div>
                        <h4 class="my-2 has-text-weight-bold">
                            Written motivation
                        </h4>
                        <p class="mb-4">
                            {{ student.applicantDetails.motivationText }}
                        </p>
                        <h4 class="my-2 has-text-weight-bold">
                            Fun fact
                        </h4>
                        <p>
                            {{ student.applicantDetails.funfact }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SuggestionModal from './SuggestionModal.vue'
import tools from '../utils/tools'

export default {
    name: 'StudentViewer',
    components: { SuggestionModal },
    data() {
        return {
            coachSuggestion: null,
            suggestionReason: null,
        }
    },
    computed: {
        ...mapGetters(['showProjects', 'selectedStudent', 'getUser']),
        student() {
            return this.selectedStudent
        },
        hasProject() {
            return (
                this.student.project &&
                this.student.project.hasOwnProperty('title') &&
                !!this.student.project.title
            )
        },
        hasCVUpload() {
            return !tools.isEmptyStr(this.student.applicantDetails.cvUpload)
        },
        cvFileName() {
            const file = this.student.applicantDetails.cvUpload.split('/')
            return file[file.length - 1]
        },
        hasCVLink() {
            return !tools.isEmptyStr(this.student.applicantDetails.cvLink)
        },
        hasPortfolioUpload() {
            return !tools.isEmptyStr(this.student.applicantDetails.portfolioUpload)
        },
        portfolioFileName() {
            const file = this.student.applicantDetails.portfolioUpload.split('/')
            return file[file.length - 1]
        },
        hasPortfolioLink() {
            return !tools.isEmptyStr(this.student.applicantDetails.portfolioLink)
        },
        hasMotivationUpload() {
            return !tools.isEmptyStr(this.student.applicantDetails.motivationUpload)
        },
        motivationFileName() {
            const file = this.student.applicantDetails.motivationUpload.split('/')
            return file[file.length - 1]
        },
        hasMotivationLink() {
            return !tools.isEmptyStr(this.student.applicantDetails.motivationLink)
        },
        employmentAgreement() {
            switch (this.student.applicantDetails.canWorkUnderEmploymentAgreement) {
                case '1':
                    return 'Yes, I can work with a student employment agreement in Belgium'
                case '2':
                    return 'Yes, I can work as a volunteer in Belgium'
                case '3':
                    return 'No–but I would like to join this experience for free'
                case '4':
                    return "No, I won't be able to work as a student, as a volunteer or for free"
                default:
                    return ''
            }
        },
        levelOfEnglishText() {
            switch (this.student.applicantDetails.levelOfEnglish) {
                case 1:
                    return 'I can understand your form, but it is hard for me to reply.'
                case 2:
                    return 'I can have simple conversations.'
                case 3:
                    return 'I can express myself, understand people and get a point across.'
                case 4:
                    return 'I can have extensive and complicated conversations.'
                case 5:
                    return 'I am fluent.'
                default:
                    return ''
            }
        },
        fieldOfStudy() {
            const fields = this.student.applicantDetails.fieldOfStudy
            let returnStr = ''
            fields.forEach((field, i) => {
                returnStr += field
                if (i < fields.length - 1) returnStr += ', '
            })
            return returnStr
        },
        callname() {
            return tools.isEmptyStr(this.student.callname)
                ? this.student.firstname
                : this.student.callname
        },
        paperworkName() {
            return !tools.isEmptyStr(this.student.callname)
                ? this.student.firstname + ' (on paper)'
                : null
        },
    },
    methods: {
        suggestionType(suggestion) {
            if (suggestion.status.toUpperCase() === 'YES') return 'is-info'
            if (suggestion.status.toUpperCase() === 'MAYBE') return 'is-warning'
            if (suggestion.status.toUpperCase() === 'NO') return 'is-dark'
        },
        suggestionLetter(suggestion) {
            if (suggestion.status.toUpperCase() === 'YES') return 'Y'
            if (suggestion.status.toUpperCase() === 'MAYBE') return 'M'
            if (suggestion.status.toUpperCase() === 'NO') return 'N'
        },
        updateSuggestionReason(val) {
            this.suggestionReason = val
        },
        onSuggestionModalToggle(active) {
            if (!active) {
                this.suggestionReason = null
            }
        },
        onSuggestionSubmit(suggestion) {
            const body = {
                status: suggestion,
                comment: this.suggestionReason,
                applicant: `api/applicants/${this.student.id}`,
                coach: `api/users/${this.getUser.id}`,
            }
            this.$axios.post('/api/suggestions', body).then((res) => {
                console.log({ res })
            })
        },
        updateStudentStatus(status) {
            const body = { status }
            this.$axios.put(`/api/applicants/${this.student.id}`, body)
        },
        removeSuggestion(id) {
            this.$axios.delete(id)
        },
        openUrl(url) {
            window.open(url, '_blank').focus()
        },
        download(url) {
            var element = document.createElement('a')
            element.setAttribute('href', url)
            element.setAttribute('target', '_blank')

            element.style.display = 'none'
            document.body.appendChild(element)

            element.click()

            document.body.removeChild(element)
        },
    },
}
</script>
<style lang="scss" scoped>
.student-viewer {
    display: grid;
    grid-template-rows: max-content auto;
    grid-template-columns: 100%;
    overflow: hidden;

    .student-header {
        box-shadow: 0 2px 0 0 whitesmoke;
        z-index: 8;
    }

    .student-name {
        line-height: 1.125;
    }

    .student-details {
        overflow-y: scroll;
    }

    &.narrow {
        box-shadow: 2px 0 0 0 whitesmoke;
        overflow: auto;

        .student-details {
            overflow-y: visible;
        }
    }
}
</style>
