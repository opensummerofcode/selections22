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
                        <b-switch
                            :value="props.row.roles.includes('ROLE_ADMIN')"
                            @input="toggleAdminRights($event, props.row)"
                        >
                            Admin rights
                        </b-switch>
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
                },
            ]
        },
    },
    mounted() {
        this.$axios.get('api/users').then((res) => {
            this.members = res.data['hydra:member']
        })
    },
    methods: {
        toggleAdminRights(val, row) {
            const roles = row.roles

            if (roles.includes('ROLE_ADMIN') && !val) {
                const index = array.indexOf(item)
                if (index !== -1) {
                    roles.splice(index, 1)
                }
            } else if (!roles.includes('ROLE_ADMIN') && val) {
                roles.push('ROLE_ADMIN')
            }

            let userId = row['@id'].split('/')
            userId = userId[userId.length - 1]

            this.$axios.put(`/api/users/change-role/${userId}`, roles).then((res) => {
                console.log(res)
            })
        },
    },
}
</script>
