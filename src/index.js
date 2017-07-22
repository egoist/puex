import Vue from 'vue'

export const createStore = ({
  state,
  mutations = {},
  actions = {},
  middlewares
} = {}) => {
  const vm = new Vue({
    data: {
      $$state: typeof state === 'function' ? state() : state
    }
  })

  const store = {
    state: vm.$data.$$state,
    commit(type, ...payload) {
      const mutation = mutations[type]
      middlewares && middlewares.forEach(m => m(store, type, ...payload))
      return mutation && mutation(store.state, ...payload)
    },
    dispatch(type, ...payload) {
      const action = actions[type]
      return action && Promise.resolve(action(store, ...payload))
    }
  }

  return store
}
