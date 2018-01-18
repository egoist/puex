# puex

[![NPM version](https://img.shields.io/npm/v/puex.svg?style=flat)](https://npmjs.com/package/puex) [![NPM downloads](https://img.shields.io/npm/dm/puex.svg?style=flat)](https://npmjs.com/package/puex) [![CircleCI](https://circleci.com/gh/egoist/puex/tree/master.svg?style=shield&circle-token=af0131758916e976003f5e909a703fe6821d3124)](https://circleci.com/gh/egoist/puex/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate)

## Features

- Small size, the goal is to have a 1kB state management library.
- Similar to Vuex
  - Dropped unnecessary features (for specific use cases).
  - Every developer that knows Vuex knows Puex already.
- `vue-devtools`: It just works™.

## Install

```bash
yarn add puex
```

CDN: [UNPKG](https://unpkg.com/puex/dist/) | [jsDelivr](https://cdn.jsdelivr.net/npm/puex/dist/)

## Usage

### Create store instance

```js
// store.js
import Vue from 'vue'
import Puex from 'puex'

Vue.use(Puex)

const store = new Puex({
  state: {},
  mutations: {},
  actions: {},
  plugins: []
})
```

### Bind store instance

In order to access `store` in every component:

```js
import Vue from 'vue'
import store from './store'

// In your root Vue instance:
new Vue({
  store,
  render: h => h(YourApp)
})
// this.$store will be available in component
```

### store

- store.state `readonly`
- store.mutations
- store.actions
- store.commit(type, payload)
- store.dispatch(type, payload)
- store.subscribe(subscriber)
- store.replaceState(newState)
- store.mapState(map)
- store.mapActions(map)
- store.mapMutations(map)

## API

### Constructor

```js
const store = new Puex({ state, mutations, actions })
```

#### state

`state` is nothing special, it can be either an object or a function that returns an object, then you can access it via `store.state` which will be read-only, to replace root state you can use `store.replaceState(newState)` instead.

#### mutations

```js
const mutations = {
  INCREMENT(state, amount = 1) {
    state.count += amount
  }
}

store.commit('INCREMENT', 10)
```

> **NOTE:** You can only mutate state inside a *mutation*.

#### actions

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

#### plugins

```js
const loggerPlugin = store => {
  store.subscribe(mutation => {
    console.log(mutation)
  })
}

new Puex({
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

### store.replaceState(newState)

Replace root state.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**puex** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/puex/contributors)).

> [egoistian.com](https://egoistian.com) · GitHub [@egoist](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
