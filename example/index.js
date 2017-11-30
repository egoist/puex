import Vue from 'vue'
import Puex from '../src'

const store = new Puex({
  state: {
    count: 0
  },
  mutations: {
    INC(state) {
      state.count++
    }
  },
  actions: {
    incAsync({ commit }) {
      setTimeout(() => {
        commit('INC')
      }, 300)
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
  store,
  computed: {
    ...store.mapState(['count']),
    ...store.mapState({
      countDouble: state => state.count * 2
    })
  },
  methods: {
    ...store.mapMutations(['INC']),
    ...store.mapActions(['incAsync'])
  },
  render() {
    return <button onClick={this.incAsync}>
      {this.count}:{this.countDouble}
    </button>
  }
})
