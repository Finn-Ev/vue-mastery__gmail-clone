import {reactive} from "vue";
import axios from "axios";

let emails = reactive(new Set())
export const useEmailSelection = function () {

  let toggle = function (email) {
    if (emails.has(email)) {
      emails.delete(email)
    } else {
      emails.add(email)
    }
  }
  let clear = () => {
    emails.clear()
  }
  let addMultiple = (newEmails) => {
    newEmails.forEach(email => emails.add(email))
  }
  let forSelected = (callback) => {
    emails.forEach(email => {
      callback(email)
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    })
  }

  let markRead = () => forSelected((email) => email.read = true)
  let markUnread = () => forSelected((email) => email.read = false)
  let markArchived = () => {
    forSelected((email) => email.archived = true)
    clear()
  }

  return {
    emails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    markArchived
  }
}

export default useEmailSelection()
