export function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(k => ({ k, v: k }))
    : Object.keys(map).map(k => ({ k, v: map[k] }))
}

export function resolveSource(source, type) {
  return typeof type === 'function' ? type : source[type]
}
