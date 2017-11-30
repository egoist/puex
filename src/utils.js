export function resolveSource(source, type) {
  return typeof type === 'function' ? type : source[type]
}
