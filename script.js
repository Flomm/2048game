import Board from './classes/Board.js';
import { qs } from './functions/utils.js';
import Tile from './classes/Tile.js';

const boardElem = qs('#game-board');
const gameBoard = new Board(boardElem);

gameBoard.getRandomPlaceholder().tile = new Tile(boardElem);
gameBoard.getRandomPlaceholder().tile = new Tile(boardElem);

// const setupInput = () => {
//   window.addEventListener('keydown', handleInput, { once: true });
// };

const moveUp = () => {
  return slideTiles(gameBoard.getPlaceholdersByColumns());
};
const moveDown = () => {
  return slideTiles(
    gameBoard.getPlaceholdersByColumns().map(col => [...col].reverse()),
  );
};
const moveLeft = () => {
  return slideTiles(gameBoard.getPlaceholdersByRow());
};
const moveRight = () => {
  return slideTiles(
    gameBoard.getPlaceholdersByRow().map(col => [...col].reverse()),
  );
};

const slideTiles = placeHolders => {
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

const handleInput = async e => {
  switch (e.key) {
    case 'ArrowUp':
      await moveUp();
      break;
    case 'ArrowDown':
      await moveDown();
      break;
    case 'ArrowRight':
      await moveRight();
      break;
    case 'ArrowLeft':
      await moveLeft();
      break;
    default:
      window.addEventListener('keydown', handleInput, { once: true });
      //   setupInput();
      return;
  }
  gameBoard.placeHolderList.forEach(pH => pH.mergeTiles());
  const newTile = new Tile(boardElem);
  gameBoard.getRandomPlaceholder().tile = newTile;
  window.addEventListener('keydown', handleInput, { once: true });
  //   setupInput();
};

window.addEventListener('keydown', handleInput, { once: true });
