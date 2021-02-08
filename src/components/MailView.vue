<template>
  <div class="email-display">
    <div>
      <button @click="toggleArchived">{{ email.archived ? 'Move to inbox (e)' : 'Archive  (e)' }}</button>
      <button @click="toggleRead">{{ email.read ? 'Mark Unread (r)' : 'Mark Read (r)' }}</button>
      <button @click="goNewer">Newer (k)</button>
      <button @click="goOlder">Older (j)</button>
    </div>
    <h2 class="mb-0">Subject: <strong>{{ email.subject }}</strong></h2>
    <div><em>From {{ email.from }} on {{ format(new Date(email.sentAt), "dd.MM.yyyy") }}</em></div>
    <div v-html="marked(email.body)"/>
  </div>
</template>

<script>
import {format} from "date-fns";
import marked from "marked"
import axios from "axios";
import useKeydown from "@/composables/use-keydown";

export default {
  name: "MailView",
  setup({email}, {emit}) {
    // let toggleRead = () => {
    //   email.read = !email.read
    //   axios.put(`http://localhost:3000/emails/${email.id}`, email)
    // }
    // let toggleArchived = () => {
    //   email.archived= !email.archived
    //   axios.put(`http://localhost:3000/emails/${email.id}`, email)
    //}
    let toggleRead = () => {
      emit("changeEmail", {toggleRead: true, save: true})
    }
    let toggleArchived = () => {
      emit("changeEmail", {toggleArchived: true, save: true, closeModal: true})
    }
    let goNewer = () => {
      emit("changeEmail", {changeIndex: -1})
    }
    let goOlder = () => {
      emit("changeEmail", {changeIndex: 1})
    }
    let goNewerAndArchive = () => {
      emit("changeEmail", {changeIndex: -1, toggleArchived: true, save: true})
    }
    let goOlderAndArchive = () => {
      emit("changeEmail", {changeIndex: 1, toggleArchived: true, save: true})
    }
    useKeydown([
      {key: "r", callback: toggleRead},
      {key: "e", callback: toggleArchived},
      {key: "k", callback: goNewer},
      {key: "j", callback: goOlder},
      {key: "[", callback: goNewerAndArchive},
      {key: "]", callback: goOlderAndArchive},
    ])
    return {
      format,
      marked,
      toggleRead,
      toggleArchived,
      goNewer,
      goOlder
    }
  },
  props: {
    email: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
