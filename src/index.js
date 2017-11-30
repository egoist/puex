import Vue from 'vue'
import { resolveSource } from './utils'

export default class Store {
  static install(Vue) {
    Vue.mixin({
      beforeCreate() {
        this.$store =
          this.$options.store || (this.$parent && this.$parent.$store)
      }
    })
  }

  constructor(
    { state, mutations = {}, actions = {}, plugins, subscribers = [] } = {}
  ) {
    this.vm = new Vue({
      data: {
        $$state: typeof state === 'function' ? state() : state
      }
    })
    this.mutations = mutations
    this.actions = actions
    this.subscribers = subscribers

    if (plugins) {
      plugins.forEach(p => this.use(p))
    }
  }

  get state() {
    return this.vm.$data.$$state
  }

  set state(v) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        '[puex] store.state is read-only, use store.replaceState(state) instead'
      )
    }
  }

  subscribe(sub) {
    this.subscribers.push(sub)
    return () => this.subscribers.splice(this.subscribers.indexOf(sub), 1)
  }

  commit(type, payload) {
    for (const sub of this.subscribers) {
      sub({ type, payload }, this.state)
    }
    const mutation = resolveSource(this.mutations, type)
    return mutation && mutation(this.state, payload)
  }

  dispatch(type, payload) {
    const action = resolveSource(this.actions, type)
    return Promise.resolve(action && action(this, payload))
  }

  use(fn) {
    fn(this)
    return this
  }

  replaceState(state) {
    this.vm.$data.$$state = state
    return this
  }
}
