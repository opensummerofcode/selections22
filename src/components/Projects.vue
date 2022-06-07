<template>
    <div class="p-5">
        <div class="is-flex is-justify-content-space-between">
            <h1 class="title">Manage projects</h1>
            <b-button type="is-success" @click="openCreationModal">
                Create project
            </b-button>
        </div>
        <b-table
            class="projects-table"
            :data="$store.state.projects"
            hoverable
            scrollable
            sticky-header
        >
            <template v-for="column in columns">
                <b-table-column v-bind="column" :key="column.id">
                    <template v-if="column.searchable" #searchable="props">
                        <b-input
                            v-model="props.filters[props.column.field]"
                            placeholder="Search"
                            icon="magnify"
                            size="is-small"
                        />
                    </template>
                    <template v-if="column.field === 'headCoach'" #default="props">
                        {{
                            props.row.headCoach
                                ? `${props.row.headCoach.firstname} ${props.row.headCoach.lastname}`
                                : 'N/A'
                        }}
                    </template>
                    <template v-else-if="column.field === 'actions'" #default="props">
                        <b-button
                            type="is-success"
                            class="mr-2"
                            @click="openEditModal(props.row)"
                        >
                            Edit
                        </b-button>
                        <b-button type="is-danger" @click="openDeleteModal(props.row)">
                            Delete
                        </b-button>
                    </template>
                    <template v-else #default="props">
                        {{ props.row[column.field] }}
                    </template>
                </b-table-column>
            </template>
        </b-table>
        <b-modal v-model="creationModal" width="640px" :on-cancel="closeCreationModal">
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        Create a new project
                    </p>
                    <button type="button" class="delete" @click="closeCreationModal" />
                </header>
                <section class="modal-card-body">
                    <b-field label="Name of the project (required)">
                        <b-input v-model="creationModalForm.title" type="text" />
                    </b-field>
                    <b-field label="Client (required)">
                        <b-input v-model="creationModalForm.client" type="text" />
                    </b-field>
                    <b-field label="Head Coach">
                        <b-select v-model="creationModalForm.headCoach" expanded>
                            <option :value="null"></option>
                            <option
                                v-for="coach in coaches"
                                :key="coach['@id']"
                                :value="coach['@id']"
                            >
                                {{ coach.firstname }} {{ coach.lastname }}
                            </option>
                        </b-select>
                    </b-field>
                    <b-field label="Description">
                        <b-input
                            v-model="creationModalForm.description"
                            type="textarea"
                            rows="4"
                        />
                    </b-field>
                    <b-field label="Number of students">
                        <b-input
                            v-model="creationModalForm.capacity"
                            type="number"
                            :min="0"
                        />
                    </b-field>
                    <b-field label="Positions" class="positions_field">
                        <div class="positions">
                            <div
                                v-for="(position,
                                index) in creationModalForm.displayPositions"
                                :key="'position_row_' + index"
                                class="positions-row"
                                :class="{ 'mt-3': index > 0 }"
                            >
                                <b-input
                                    v-model="position.amount"
                                    type="number"
                                    :min="1"
                                />
                                <b-autocomplete
                                    v-model="position.title"
                                    type="text"
                                    :data="filteredRoles"
                                    dropdown-position="auto"
                                    :open-on-focus="true"
                                    @typing="getFilteredRoles"
                                />
                                <b-button
                                    :disabled="
                                        creationModalForm.displayPositions.length < 2
                                    "
                                    @click="removePosition(index)"
                                >
                                    <b-icon icon="close" />
                                </b-button>
                            </div>
                        </div>
                    </b-field>
                    <b-button
                        label="Add position"
                        type="is-primary"
                        class="add-positions-button"
                        @click="addPositionRow"
                    />
                    <!-- <b-field label="Coaches">
                        <b-input type="text" />
                    </b-field> -->
                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Create project"
                        type="is-success"
                        :disabled="creationModalSubmitDisabled"
                        @click="createProject"
                    />
                    <b-button label="Cancel" @click="closeCreationModal" />
                </footer>
            </div>
        </b-modal>
        <b-modal
            v-if="projectToEdit"
            v-model="editModal"
            width="640px"
            :on-cancel="closeEditModal"
        >
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Edit {{ projectToEdit.title }}</p>
                    <button type="button" class="delete" @click="closeEditModal" />
                </header>
                <section class="modal-card-body">
                    <b-field label="Name of the project (required)">
                        <b-input v-model="projectToEdit.title" type="text" />
                    </b-field>
                    <b-field label="Client (required)">
                        <b-input v-model="projectToEdit.client" type="text" />
                    </b-field>
                    <b-field label="Head Coach">
                        <b-select v-model="projectToEdit.headCoach" expanded>
                            <option :value="null">N/A</option>
                            <option
                                v-for="coach in coaches"
                                :key="coach['@id']"
                                :value="coach['@id']"
                            >
                                {{ coach.firstname }} {{ coach.lastname }}
                            </option>
                        </b-select>
                    </b-field>
                    <b-field label="Description">
                        <b-input
                            v-model="projectToEdit.description"
                            type="textarea"
                            rows="4"
                        />
                    </b-field>
                    <b-field label="Number of students">
                        <b-input
                            v-model="projectToEdit.capacity"
                            type="number"
                            :min="0"
                        />
                    </b-field>
                    <b-field label="Positions" class="positions_field">
                        <div class="positions">
                            <div
                                v-for="(position, index) in projectToEdit.positions"
                                :key="'position_row_' + index"
                                class="positions-row"
                                :class="{ 'mt-3': index > 0 }"
                            >
                                <b-input
                                    v-model="position.amount"
                                    type="number"
                                    :min="1"
                                />
                                <b-autocomplete
                                    v-model="position.title"
                                    type="text"
                                    :data="filteredRoles"
                                    dropdown-position="auto"
                                    :open-on-focus="true"
                                    @typing="getFilteredRoles"
                                />
                                <b-button
                                    :disabled="projectToEdit.positions.length < 2"
                                    @click="removePositionFromEditProject(index)"
                                >
                                    <b-icon icon="close" />
                                </b-button>
                            </div>
                        </div>
                    </b-field>
                    <b-button
                        label="Add position"
                        type="is-primary"
                        class="add-positions-button"
                        @click="addPositionRowToEditProject"
                    />
                    <!-- <b-field label="Coaches">
                        <b-input type="text" />
                    </b-field> -->
                </section>
                <footer class="modal-card-foot">
                    <b-button
                        label="Save project"
                        type="is-success"
                        :disabled="editModalSubmitDisabled"
                        @click="editProject"
                    />
                    <b-button label="Cancel" @click="closeEditModal" />
                </footer>
            </div>
        </b-modal>
        <b-modal
            v-if="projectToDelete"
            v-model="deleteModal"
            width="640px"
            :on-cancel="closeDeleteModal"
        >
            <header class="modal-card-head">
                <p class="modal-card-title">Delete {{ projectToDelete.title }}?</p>
                <button type="button" class="delete" @click="closeDeleteModal" />
            </header>
            <section class="modal-card-body">
                Are you sure you want to delete the {{ projectToDelete.title }} project?
                This action can't be reverted
            </section>
            <footer class="modal-card-foot">
                <b-button
                    label="Delete project"
                    type="is-danger"
                    @click="deleteProject"
                />
                <b-button label="Cancel" @click="closeDeleteModal" />
            </footer>
        </b-modal>
    </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import tools from '../utils/tools'

const roles = [
    'Front-end developer',
    'Back-end developer',
    'UX / UI designer',
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
    name: 'Projects',
    data() {
        return {
            projectToDelete: null,
            deleteModal: false,
            projectToEdit: null,
            editModal: false,
            filteredRoles: roles,
            coaches: [],
            checked_rows: [],
            isLoading: true,
            creationModal: false,
            creationModalForm: {
                title: '',
                description: '',
                capacity: 0,
                client: '',
                headCoach: null,
                positions: [],
                displayPositions: [
                    {
                        title: '',
                        amount: 1,
                    },
                ],
            },
        }
    },
    computed: {
        ...mapGetters(['getProjects']),
        creationModalSubmitDisabled() {
            return (
                tools.isEmptyStr(this.creationModalForm.title) ||
                tools.isEmptyStr(this.creationModalForm.client) ||
                this.creationModalForm.displayPositions.some((position) =>
                    tools.isEmptyStr(position.title)
                )
            )
        },
        editModalSubmitDisabled() {
            return (
                tools.isEmptyStr(this.projectToEdit.title) ||
                tools.isEmptyStr(this.projectToEdit.client) ||
                this.projectToEdit.positions.some((position) =>
                    tools.isEmptyStr(position.title)
                )
            )
        },
        columns() {
            return [
                {
                    field: 'id',
                    visible: false,
                },
                {
                    field: 'title',
                    label: 'Name',
                    searchable: true,
                    sortable: true,
                },
                {
                    field: 'client',
                    label: 'Client',
                    searchable: true,
                    sortable: true,
                },
                {
                    field: 'headCoach',
                    label: 'Head Coach',
                    searchable: true,
                    sortable: true,
                },
                {
                    field: 'actions',
                    label: '',
                    numeric: true,
                },
            ]
        },
    },
    mounted() {
        this.fetchProjects()
        this.getCoaches()
    },
    methods: {
        ...mapActions(['fetchProjects']),
        ...mapMutations(['ADD_PROJECT']),
        openDeleteModal(project) {
            this.projectToDelete = project
            this.deleteModal = true
        },
        closeDeleteModal() {
            this.deleteModal = false
            this.projectToDelete = null
        },
        openEditModal(project) {
            this.projectToEdit = project
            this.editModal = true
        },
        closeEditModal() {
            this.editModal = false
            this.projectToEdit = null
        },
        editProject() {
            const body = {
                title: this.projectToEdit.title,
                description: this.projectToEdit.description,
                capacity: +this.projectToEdit.capacity,
                client: this.projectToEdit.client,
                positions: this.projectToEdit.positions,
            }

            if (this.projectToEdit.headCoach)
                body.headCoach = this.projectToEdit.headCoach.hasOwnProperty('@id')
                    ? this.projectToEdit.headCoach['@id']
                    : this.projectToEdit.headCoach

            body.positions.forEach((_, i) => {
                body.positions[i].amount = +body.positions[i].amount
            })

            this.$axios.put(this.projectToEdit['@id'], body).then((_) => {
                this.fetchProjects()
                this.closeEditModal()
            })
        },
        deleteProject() {
            this.$axios.delete(this.projectToDelete['@id']).then((_) => {
                this.fetchProjects()
                this.closeDeleteModal()
            })
        },
        openCreationModal() {
            this.creationModal = true
        },
        getCoaches() {
            this.$axios.get('api/users').then((res) => {
                this.coaches = res.data['hydra:member']
            })
        },
        getFilteredRoles(text) {
            this.filteredRoles = [
                ...roles.filter((option) => {
                    return (
                        option
                            .toString()
                            .toLowerCase()
                            .indexOf(text.toLowerCase()) >= 0
                    )
                }),
                !tools.isEmptyStr(text) ? text : undefined,
            ]
        },
        closeCreationModal() {
            this.creationModal = false
            this.creationModalForm = {
                title: '',
                description: '',
                capacity: 0,
                client: '',
                headCoach: null,
                positions: [],
                displayPositions: [
                    {
                        title: '',
                        amount: 1,
                    },
                ],
            }
        },
        createProject() {
            const body = {
                title: this.projectToEdit.title,
                description: this.projectToEdit.description,
                capacity: +this.projectToEdit.capacity,
                client: this.projectToEdit.client,
                positions: this.projectToEdit.positions,
            }

            if (this.projectToEdit.headCoach)
                body.headCoach = this.projectToEdit.headCoach

            body.positions.forEach((_, i) => {
                body.positions[i].amount = +body.positions[i].amount
            })

            this.$axios.post('/api/projects', body).then((res) => {
                this.ADD_PROJECT(res.data)
                this.closeCreationModal()
            })
        },
        addPositionRow() {
            this.creationModalForm.displayPositions.push({
                title: '',
                amount: 1,
            })
        },
        addPositionRowToEditProject() {
            this.projectToEdit.positions.push({
                title: '',
                amount: 1,
            })
        },
        removePosition(index) {
            this.creationModalForm.displayPositions.splice(index, 1)
        },
        removePositionFromEditProject(index) {
            this.projectToEdit.positions.splice(index, 1)
        },
    },
}
</script>
<style lang="scss">
.projects-table {
    td {
        vertical-align: middle;
    }

    .table-wrapper {
        height: 80vh !important;
    }
}

.positions_field {
    .field {
        width: 100%;
    }

    .positions {
        width: 100%;

        .positions-row {
            display: grid;
            grid-template-columns: 4rem auto max-content;
            column-gap: 0.75rem;
            width: 100%;
        }
    }
}

.add-positions-button {
    width: 100%;
}
</style>
