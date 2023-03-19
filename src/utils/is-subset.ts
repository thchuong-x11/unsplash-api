export const isSubset = (smallSet: Set<string>, big: string[]): boolean => {
  const bigSet = new Set(big);
  if (smallSet.size > bigSet.size) {
    return false;
  }

  for (const e of smallSet) {
    if (!bigSet.has(e)) {
      return false;
    }
  }

  return true;
};
