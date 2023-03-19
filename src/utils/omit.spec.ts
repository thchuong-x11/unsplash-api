import { omit } from './omit';

const TEST_DATA = [
  [{}, [], {}],
  [{ a: 'b' }, [], { a: 'b' }],
  [{ a: 'b' }, ['a'], {}],
  [{ a: 'b', c: 'd', e: 'f' }, ['c'], { a: 'b', e: 'f' }],
].map(([obj, keys, expected]) => [
  JSON.stringify(obj),
  JSON.stringify(keys),
  JSON.stringify(expected),
  obj,
  keys,
  expected,
]) as [string, string, string, object, any[], object][];

describe('omit', () => {
  it.each(TEST_DATA)(
    'omit(%s,%s)=%s',
    (_objStr, _keysStr, _expectedStr, obj, keys, expected) => {
      const actual = omit<any, any>(obj, ...keys);
      expect(actual).toStrictEqual(expected);
    }
  );
});
