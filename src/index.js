import Vue from 'vue'
import { resolveSource } from './utils'
import { createMapState, mapToMethods } from './helpers'
import devtoolPlugin from './devtoolPlugin'

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

    if (Vue.config.devtools) {
      this.getters = [] // hack for vue-devtools
      devtoolPlugin(this)
    }

    this.mapState = createMapState(this)
    this.mapActions = mapToMethods('actions', 'dispatch', this)
    this.mapMutations = mapToMethods('mutations', 'commit', this)
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
    const mutation = resolveSource(this.mutations, type)
    mutation && mutation(this.state, payload)
    for (const sub of this.subscribers) {
      sub({ type, payload }, this.state)
    }
  }

  dispatch(type, payload) {
    const action = resolveSource(this.actions, type)
    const ctx = {
      dispatch: this.dispatch.bind(this),
      commit: this.commit.bind(this)
    }
    return Promise.resolve(action && action(ctx, payload))
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

export const mapState = createMapState()
export const mapActions = mapToMethods('actions', 'dispatch')
export const mapMutations = mapToMethods('mutations', 'commit')
