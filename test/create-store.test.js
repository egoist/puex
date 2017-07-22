import createStore from '../src/create-store'

describe('createStore', () => {
  it('exposes public api', () => {
    const store = createStore()
    const props = Object.keys(store)
    expect(props.length).toBe(3)
    expect(props).toContain('state')
    expect(props).toContain('commit')
    expect(props).toContain('dispatch')
  })
})
