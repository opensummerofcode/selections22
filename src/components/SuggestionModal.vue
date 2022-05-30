<template>
    <div class="py-5 px-3 suggestion-modal">
        <b-field
            :label="`Suggest ${suggestion}`"
            custom-class="has-text-weight-bold mb-4"
        >
            <b-input
                type="textarea"
                placeholder="Provide a reason"
                :value="suggestionReason"
                @input="$emit('updateReason', $event)"
            />
        </b-field>
        <p class="is-size-6 mb-3">
            This will open up discussion and help us and your fellow coaches understand.
        </p>
        <b-button
            :type="buttonType"
            :disabled="!suggestionReason"
            @click="$emit('suggest', suggestion)"
        >
            Suggest {{ suggestion }}
        </b-button>
    </div>
</template>
<script>
export default {
    name: 'SuggestionModal',
    props: {
        suggestion: {
            type: String,
            required: true,
        },
        suggestionReason: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            reason: null,
        }
    },
    computed: {
        buttonType() {
            if (this.suggestion.toUpperCase() === 'YES') return 'is-info'
            if (this.suggestion.toUpperCase() === 'MAYBE') return 'is-warning'
            if (this.suggestion.toUpperCase() === 'NO') return 'is-dark'
            return ''
        },
    },
}
</script>
<style lang="scss" scoped>
.suggestion-modal {
    width: 400px;
}
</style>
