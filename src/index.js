export { default as createStore } from './create-store'

export const bindStore = Vue => {
  Vue.mixin({
    beforeCreate() {
      this.$store = this.$options.store || this.$parent.$store
    }
  })
}
