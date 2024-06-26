<template>
  <button @click="selectScreen('inbox')" :style="`font-weight: ${selectedScreen === 'inbox' && 600 }`">
    Inbox
  </button>
  <button @click="selectScreen('archived')"
          :style="`font-weight: ${selectedScreen === 'archived' && 600 }`">
    Archived
  </button>
  <BulkActionBar :emails="filteredEmails"/>
  <table class="mail-table">
    <tbody>
    <tr
      v-for="email in filteredEmails"
      :key="email.id"
      :class="['clickable', email.read ? 'read' : '']"

    >
      <td>
        <label>
          <input type="checkbox" @click="emailSelection.toggle(email)" :checked="emailSelection.emails.has(email)"/>
        </label>
      </td>
      <td @click="openEmail(email)">{{ email.from }}</td>
      <td @click="openEmail(email)">
        <strong>{{ email.subject }}</strong> - <p> {{ email.body }}</p>
      </td>
      <td @click="openEmail(email)" class="date">{{ format(new Date(email.sentAt), "dd.MM.yyyy") }}</td>
      <td>

        <button  @click="toggleArchived(email)">{{email.archived ? 'Un-archive' : 'Archive'}}</button>
      </td>
    </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView @changeEmail="changeEmail" :email="openedEmail"/>
  </ModalView>
</template>

<script>
import {format} from "date-fns";
import axios from "axios"
import MailView from "@/components/MailView";
import ModalView from "@/components/ModalView";
import {useEmailSelection} from "@/composables/use-email-selection";
import BulkActionBar from "@/components/BulkActionBar";
import {reactive, ref} from "vue"

export default {
  components: {BulkActionBar, ModalView, MailView},
  async setup() {
    let {data: emails} = await axios.get("http://localhost:3000/emails")

    return {
      emailSelection: reactive(useEmailSelection()),
      format,
      emails: ref(emails),
      openedEmail: ref(null),
      selectedScreen: 'inbox'
    };
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1, e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1;
      });
    },
    filteredEmails() {
      if(this.selectedScreen === 'inbox') return this.sortedEmails.filter(e => !e.archived);
      return this.sortedEmails.filter(e => e.archived);
    }
  },
  methods: {
    selectScreen(newScreen){
      this.selectedScreen = newScreen
      this.emailSelection.clear()
    },
    openEmail(email) {
      this.openedEmail = email
      if (email) {
        email.read = true
        this.updateEmail(email)
      }
    },
    toggleArchived(email) {
      email.archived = !email.archived
      this.updateEmail(email)
    },
    changeEmail({toggleRead, toggleArchived, save, closeModal, changeIndex}) {
      let email = this.openedEmail
      if (toggleRead) email.read = !email.read
      if (toggleArchived) email.archived = !email.archived
      if (save) this.updateEmail(email)
      if (closeModal) this.openedEmail = null

      if (changeIndex) {
        let emails = this.filteredEmails
        let currentIndex = emails.indexOf(this.openedEmail)
        let newEmail = emails[currentIndex + changeIndex]
        this.openEmail(newEmail)
      }
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    }
  }
};
</script>

<style lang="scss" scoped></style>
