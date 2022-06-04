<template>
    <div class="p-5">
        <h1 class="title">Manage student pipeline</h1>
        <b-table
            :data="applicants"
            hoverable
            scrollable
            checkable
            :checked-rows="checked_rows"
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
    },
    mounted() {
        this.$axios.get('api/applicants').then((res) => {
            this.applicants = res.data['hydra:member']
            this.applicants.forEach((applicant) => {
                applicant.displayname = tools.isEmptyStr(applicant.callname)
                    ? `${applicant.firstname} ${applicant.lastname}`
                    : `${applicant.callname} (${applicant.firstname}) ${applicant.lastname}`
            })
        })
    },
    methods: {
        updateStudentStatus(status, student) {
            const body = { status }
            this.$axios.put(`/api/applicants/${student.id}`, body)
        },
    },
}
</script>
