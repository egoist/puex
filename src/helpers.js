import { normalizeMap } from './utils'

export const createMapState = _store => states => {
  const res = {}
  for (const { k, v } of normalizeMap(states)) {
    res[k] = function() {
      const store = _store || this.$store
      return typeof v === 'function'
        ? v.call(this, store.state)
        : store.state[v]
    }
  }
  return res
}

export const mapToMethods = (sourceName, runnerName, _store) => map => {
  const res = {}
  for (const { k, v } of normalizeMap(map)) {
    res[k] = function(payload) {
      const store = _store || this.$store
      const source = store[sourceName]
      const runner = store[runnerName]
      const actualSource = typeof v === 'function' ? v.call(this, source) : v
      return runner.call(store, actualSource, payload)
    }
  }
  return res
}
