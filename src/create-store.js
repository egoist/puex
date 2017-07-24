import Vue from 'vue'
import { normalizeMap, resolveSource } from './utils'

export default (
  { state, mutations = {}, actions = {}, plugins, subscribers = [] } = {}
) => {
  const vm = new Vue({
    data: {
      $$state: typeof state === 'function' ? state() : state
    }
  })

  const store = {
    get state() {
      return vm.$data.$$state
    },
    set state(v) {
      if (process.env.NODE_ENV === 'development') {
        throw new Error('[puex] store.state is read-only, use store.replaceState(state) instead')
      }
    },
    mutations,
    actions,
    subscribers,
    subscribe: sub => {
      store.subscribers.push(sub)
      return () => store.subscribers.splice(store.subscribers.indexOf(sub), 1)
    },
    commit(type, payload) {
      for (const sub of store.subscribers) {
        sub({ type, payload }, store.state)
      }
      const mutation = resolveSource(mutations, type)
      return mutation && mutation(vm.$data.$$state, payload)
    },
    dispatch(type, payload) {
      const action = resolveSource(actions, type)
      return Promise.resolve(action && action(store, payload))
    },
    use: fn => fn(store),
    replaceState(state) {
      vm.$data.$$state = state
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
      res[k] = function(payload) {
        const actualSource = typeof v === 'function' ? v.call(this, source) : v
        return run(actualSource, payload)
      }
    }
    return res
  }

  store.mapMutations = mapToMethods(store.mutations, store.commit)
  store.mapActions = mapToMethods(store.actions, store.dispatch)

  plugins && plugins.forEach(p => store.use(p))

  return store
}
