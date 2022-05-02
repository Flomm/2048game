export const canMove = placeHolders => {
  return placeHolders.some(phGroup => {
    return phGroup.some((ph, index) => {
      if (index === 0 || !ph.tile) return false;
      const phToMoveTo = phGroup[index - 1];
      return phToMoveTo.canAccept(ph.tile);
    });
  });
};
