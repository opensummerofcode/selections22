<template>
    <div class="p-5">
        <h1 class="title">Manage members</h1>
        <b-table :data="members" hoverable scrollable>
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
                    <template v-if="column.isCustomRoles" #default="props">
                        <b-select
                            @input="onRoleChange($event, props.row)"
                            :value="props.row[column.field]"
                        >
                            <option value="ROLE_USER">No access</option>
                            <option value="ROLE_COACH">Coach</option>
                            <option value="ROLE_ADMIN">Coordinator</option>
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
export default {
    name: 'Members',
    data() {
        return {
            members: [],
        }
    },
    computed: {
        columns() {
            return [
                {
                    field: 'email',
                    label: 'Email',
                    visible: false,
                },
                {
                    field: 'firstname',
                    label: 'First Name',
                    searchable: true,
                    sortable: true,
                },
                {
                    field: 'lastname',
                    label: 'Last Name',
                    searchable: true,
                    sortable: true,
                },
                {
                    field: 'roles',
                    label: 'Roles',
                    isCustomRoles: true,
                    visible: false,
                },
                {
                    field: 'role',
                    label: 'Role',
                    isCustomRoles: true,
                },
            ]
        },
    },
    mounted() {
        this.$axios.get('api/users').then((res) => {
            this.members = res.data['hydra:member']
            this.members.forEach((member) => {
                member.role = 'ROLE_USER'
                if (member.roles.length > 1) {
                    member.role = member.roles.filter((role) => role != 'ROLE_USER')[0]
                }
            })
        })
    },
    methods: {
        onRoleChange(role, row) {
            let userId = row['@id'].split('/')
            userId = userId[userId.length - 1]

            const body = {
                uuid: userId,
                role,
            }

            this.$axios.post('/api/users/change-role', body).then((res) => {})
        },
    },
}
</script>
