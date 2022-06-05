<template>
    <div class="p-5">
        <div class="is-flex is-justify-content-space-between">
            <h1 class="title">Manage student pipeline</h1>
            <b-dropdown
                ref="dropdown_yes"
                :close-on-click="true"
                position="is-bottom-left"
            >
                <template #trigger>
                    <b-button class="mr-1" type="is-info">
                        Bulk assign
                    </b-button>
                </template>
                <b-dropdown-item @click="batchUpdate('SCREENING')">
                    Screening
                </b-dropdown-item>
                <b-dropdown-item @click="batchUpdate('REJECTED')">
                    No, rejected
                </b-dropdown-item>
                <b-dropdown-item @click="batchUpdate('AWAITING_MAYBE')">
                    Maybe, awaiting project
                </b-dropdown-item>
                <b-dropdown-item @click="batchUpdate('AWAITING_YES')">
                    Yes, awaiting project
                </b-dropdown-item>
                <b-dropdown-item @click="batchUpdate('APPROVED')">
                    Yes, assigned project
                </b-dropdown-item>
                <b-dropdown-item @click="batchUpdate('CONFIRMED')">
                    Confirmed contract and project
                </b-dropdown-item>
                <b-dropdown-item @click="batchUpdate('DECLINED')">
                    Declined contract
                </b-dropdown-item>
                <hr
                    v-if="isDeleteEnabled"
                    class="dropdown-divider"
                    aria-role="menuitem"
                />
                <b-dropdown-item v-if="isDeleteEnabled" @click="deleteStudents">
                    Remove from selection overview
                </b-dropdown-item>
            </b-dropdown>
        </div>
        <b-table
            class="applicants-table"
            :data="applicants"
            hoverable
            scrollable
            checkable
            :checked-rows.sync="checked_rows"
            sticky-header
            :loading="isLoading"
        >
            <template v-for="column in columns">
                <b-table-column v-bind="column" :key="column.email">
                    <template v-if="column.searchable" #searchable="props">
                        <b-input
                            v-model="props.filters[props.column.field]"
                            placeholder="Search"
                            icon="magnify"
                            size="is-small"
                        />
                    </template>
                    <template v-if="column.field === 'status'" #default="props">
                        <b-select
                            :value="props.row[column.field]"
                            @input="updateStudentStatus($event, props.row)"
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
                    </template>
                    <template v-else #default="props">
                        {{ props.row[column.field] }}
                    </template>
                </b-table-column>
            </template>
        </b-table>
    </div>
</template>
<script>
import tools from '../utils/tools'
export default {
    name: 'Pipeline',
    data() {
        return {
            applicants: [],
            checked_rows: [],
            isLoading: true,
        }
    },
    computed: {
        columns() {
            return [
                {
                    field: 'firstname',
                    label: 'First Name',
                    searchable: true,
                    sortable: true,
                    visible: false,
                },
                {
                    field: 'callname',
                    label: 'Call Name',
                    searchable: true,
                    sortable: true,
                    visible: false,
                },
                {
                    field: 'lastname',
                    label: 'Last Name',
                    searchable: true,
                    sortable: true,
                    visible: false,
                },
                {
                    field: 'displayname',
                    label: 'Name',
                    searchable: true,
                    sortable: true,
                },
                {
                    field: 'email',
                    label: 'Email',
                    searchable: true,
                },
                {
                    field: 'status',
                    label: 'Status',
                    visible: true,
                },
            ]
        },
        isDeleteEnabled() {
            return process.env.VUE_APP_DELETE_STUDENTS_ENABLED.toUpperCase() === 'TRUE'
        },
    },
    mounted() {
        this.populateTable()
    },
    methods: {
        populateTable() {
            this.$axios.get('api/applicants').then((res) => {
                this.applicants = res.data['hydra:member']
                this.applicants.forEach((applicant) => {
                    applicant.displayname = tools.isEmptyStr(applicant.callname)
                        ? `${applicant.firstname} ${applicant.lastname}`
                        : `${applicant.callname} (${applicant.firstname}) ${applicant.lastname}`
                })
                this.isLoading = false
            })
        },
        updateStudentStatus(status, student) {
            const body = { status }
            this.$axios.put(`/api/applicants/${student.id}`, body)
        },
        batchUpdate(status) {
            this.isLoading = true
            const promises = []
            this.checked_rows.forEach((student) => {
                promises.push(
                    this.$axios.put(`/api/applicants/${student.id}`, { status })
                )
            })
            Promise.all(promises).then(() => {
                this.populateTable()
            })
        },
        deleteStudents() {
            this.isLoading = true
            const promises = []
            this.checked_rows.forEach((student) => {
                promises.push(this.$axios.delete(`/api/applicants/${student.id}`))
            })
            Promise.all(promises).then(() => {
                this.populateTable()
            })
        },
    },
}
</script>
<style lang="scss">
.applicants-table {
    td {
        vertical-align: middle;
    }

    .table-wrapper {
        height: 80vh !important;
    }
}
</style>
