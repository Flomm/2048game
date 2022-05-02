export const slideTiles = placeHolders => {
  return Promise.all(
    placeHolders.flatMap(holderGroup => {
      const promises = [];
      for (let i = 1; i < holderGroup.length; i++) {
        const holder = holderGroup[i];
        if (!holder.tile) continue;
        let lastValidHolder;
        for (let j = i - 1; j >= 0; j--) {
          const moveToHolder = holderGroup[j];
          if (!moveToHolder.canAccept(holder.tile)) break;
          lastValidHolder = moveToHolder;
        }
        if (lastValidHolder) {
          promises.push(holder.tile.waitTransition());
          if (lastValidHolder.tile) {
            lastValidHolder.mergeTile = holder.tile;
          } else {
            lastValidHolder.tile = holder.tile;
          }
          holder.tile = null;
        }
      }
    }),
  );
};
