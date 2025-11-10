const { normalizePriority } = require('../src/routes/requestTypes');

test('normalizePriority maps known values', () => {
  expect(normalizePriority('HIGH')).toBe('high');
  expect(normalizePriority('low')).toBe('low');
  expect(normalizePriority('critical')).toBe('critical');
});

test('normalizePriority defaults to medium for unknown', () => {
  expect(normalizePriority('???')).toBe('medium');
  expect(normalizePriority(undefined)).toBe('medium');
});
