# puex

[![NPM version](https://img.shields.io/npm/v/puex.svg?style=flat)](https://npmjs.com/package/puex) [![NPM downloads](https://img.shields.io/npm/dm/puex.svg?style=flat)](https://npmjs.com/package/puex) [![CircleCI](https://circleci.com/gh/egoist/puex/tree/master.svg?style=shield&circle-token=af0131758916e976003f5e909a703fe6821d3124)](https://circleci.com/gh/egoist/puex/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Install

```bash
yarn add puex
```

CDN: [UNPKG](https://unpkg.com/puex/dist/) | [jsDelivr](https://cdn.jsdelivr.net/npm/puex/dist/)

## Usage

```js
import { createStore } from 'puex'

const store = createStore({
  state: {},
  mutations: {},
  actions: {},
  plugins: []
})
```

### bindStore

In order to access `store` in every component:

```js
import Vue from 'vue'
import { bindStore } from 'puex'

Vue.use(bindStore)

// In your root Vue instance:
new Vue({
  store,
  render: h => h(YourApp)
})
// this.$store will be available in component
```

> **NOTE:** This is not necessary, you can always manually `import store from './path/to/store'` and use it in your component.

### store

- store.state
- store.mutations
- store.actions
- store.commit(type, payload)
- store.dispatch(type, payload)
- store.mapState(states)
- store.mapMutations(mutations)
- store.mapActions(actions)
- store.subscribe(subscriber)

### state

`state` is nothing special, it can be either an object or a function that returns an object, you might need to use the latter while doing Vue SSR with `runInNewContext: false` option in order to get a fresh copy of new states for each HTTP request.

### mutation

```js
const mutations = {
  INCREMENT(state, amount = 1) {
    state.count += amount
  }
}

store.commit('INCREMENT', 10)
```

### action

```js
const actions = {
  incrementAsync(store, id) {
    return getAmountByIdAsync(id).then(amount => {
      store.commit('INCREMENT', amount)
    })
  }
}

store.dispatch('incrementAsync', 42)
```

### plugin

```js
const loggerPlugin = store => {
  store.subscribe(mutation => {
    console.log(mutation)
  })
}

createStore({
  plugins: [loggerPlugin]
})
```

### store.subscribe(subscriber)

```js
const unsubscribe = store.subscribe((mutation, state) => {
  console.log(mutation.type)
  console.log(mutation.payload)
})
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**puex** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/puex/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@rem_rin_rin](https://twitter.com/rem_rin_rin)
