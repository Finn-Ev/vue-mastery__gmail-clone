<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input @click="bulkSelect"
             type="checkbox"
             :checked="allEmailsSelected"
             :class="[someEmailsSelected ? 'partial-check' : '']">
    </span>
    <span class="buttons">
       <button :disabled="[...emailSelection.emails].every(e=>e.read)"
               @click="emailSelection.markRead">Mark read</button>
       <button :disabled="[...emailSelection.emails].every(e=>!e.read)"
               @click="emailSelection.markUnread">Mark Unread</button>
       <button :disabled="amountSelectedEmails === 0" @click="emailSelection.markArchived">Archive</button>
    </span>
  </div>
</template>

<script>
import {useEmailSelection} from "@/composables/use-email-selection";
import {computed} from "vue"

export default {
  name: "BulkActionBar",
  props: {
    emails: {
      type: Array,
      required: true
    }
  },

  setup({emails}) {
    let emailSelection = useEmailSelection()
    let amountSelectedEmails = computed(() => emailSelection.emails.size)
    let totalEmails = computed(() => emails.length)
    let allEmailsSelected = computed(() => amountSelectedEmails.value === totalEmails.value)
    let someEmailsSelected = computed(() => {
      return amountSelectedEmails.value > 0 && amountSelectedEmails.value < totalEmails.value
    })
    let bulkSelect = () => {
      if (allEmailsSelected.value) emailSelection.clear()
      else emailSelection.addMultiple(emails)
    }
    return {
      allEmailsSelected,
      someEmailsSelected,
      emailSelection,
      bulkSelect,
      amountSelectedEmails
    }
  }
}
</script>

<style scoped>

</style>
