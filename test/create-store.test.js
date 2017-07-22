import createStore from '../src/create-store'

describe('createStore', () => {
  it('exposes public api', () => {
    const store = createStore()
    const props = Object.keys(store)
    expect(props.length).toBe(9)
    expect(props).toContain('state')
    expect(props).toContain('commit')
    expect(props).toContain('dispatch')
    expect(props).toContain('mutations')
    expect(props).toContain('actions')
    expect(props).toContain('mapState')
    expect(props).toContain('mapActions')
    expect(props).toContain('mapMutations')
    expect(props).toContain('use')
  })
})
