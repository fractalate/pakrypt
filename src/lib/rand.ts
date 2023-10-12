export function randomId() {
  return 'id' + Math.random().toPrecision(12).slice(2);
}
