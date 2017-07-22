import Vue from 'vue'
import { createStore } from '../src'

const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    INC(state) {
      console.log(state)
      state.count++
    }
  },
  middlewares: [
    (store, type) => {
      console.log(type)
    }
  ]
})

new Vue({
  el: '#app',
  render() {
    return <button onClick={() => store.commit('INC')}>
      {store.state.count}
    </button>
  }
})
