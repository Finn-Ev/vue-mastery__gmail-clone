import {onBeforeUnmount} from "vue"

let useKeydown = (keydownConfigs) => {

  let onKeydown = (event) => {
    let key = keydownConfigs.find(config => config.key === event.key)
    if (key) {
      key.callback()
    }
  }
  window.addEventListener("keydown", onKeydown)
  onBeforeUnmount(
    () => window.removeEventListener("keydown", onKeydown))
}

export default useKeydown
