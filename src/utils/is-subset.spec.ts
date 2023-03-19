import { isSubset } from './is-subset';

const TEST_DATA = [
  [new Set(), [], true],
  [new Set(), ['a'], true],
  [new Set(['a']), [], false],
  [new Set(['a']), ['a'], true],
  [new Set(['a']), ['c'], false],
  [new Set(['a', 'b']), ['b'], false],
  [new Set(['a', 'b']), ['b', 'a'], true],
  [new Set(['a', 'b']), ['b', 'a', 'b'], true],
  [new Set(['a', 'b']), ['b', 'c', 'b'], false],
].map(([smallSet, big, expected]) => [
  JSON.stringify(smallSet),
  JSON.stringify(big),
  expected,
  smallSet,
  big,
]) as [string, string, boolean, Set<string>, Array<string>][];

describe('isSubset', () => {
  it.each(TEST_DATA)(
    'isSubset(%s,%s)=%s',
    (_smallSetStr, _bigStr, expected, smallSet, big) => {
      const actual = isSubset(smallSet, big);
      expect(actual).toStrictEqual(expected);
    }
  );
});
