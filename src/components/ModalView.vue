<template>
  <div class="modal">
    <div class="overlay" @click="emit('closeModal')"></div>
    <div class="modal-card">
      <div class="close-modal" @click="emit('closeModal')">X</div>
      <slot/>
    </div>
  </div>
</template>

<script>

import useKeydown from "@/composables/use-keydown";

export default {
  name: "ModalView",

  setup(_, {emit}) {
    useKeydown([
        {
          key: "Escape", callback: () => {
            emit("closeModal")
          }
        }
      ]
    )
    return {
      emit
    }
  },
}
</script>

<style scoped>
.modal-card {
  position: relative;
}

.close-modal {
  padding: 5px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
