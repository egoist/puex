import Vue from 'vue'
import { normalizeMap, resolveSource } from './utils'

export default ({ state, mutations = {}, actions = {}, middlewares } = {}) => {
  const vm = new Vue({
    data: {
      $$state: typeof state === 'function' ? state() : state
    }
  })

  const store = {
    state: vm.$data.$$state,
    mutations,
    actions,
    commit(type, ...payload) {
      const mutation = resolveSource(mutations, type)
      middlewares && middlewares.forEach(m => m(store, type, ...payload))
      return mutation && mutation(store.state, ...payload)
    },
    dispatch(type, ...payload) {
      const action = resolveSource(actions, type)
      return Promise.resolve(action && action(store, ...payload))
    }
  }

  store.mapState = states => {
    const res = {}
    for (const { k, v } of normalizeMap(states)) {
      res[k] = function() {
        return typeof v === 'function'
          ? v.call(this, store.state)
          : store.state[v]
      }
    }
    return res
  }

  const mapToMethods = (source, run) => map => {
    const res = {}
    for (const { k, v } of normalizeMap(map)) {
      res[k] = function(...args) {
        const actualSource = typeof v === 'function' ? v.call(this, source) : v
        return run(actualSource, ...args)
      }
    }
    return res
  }

  store.mapMutations = mapToMethods(store.mutations, store.commit)
  store.mapActions = mapToMethods(store.actions, store.dispatch)

  return store
}
