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
  slideTiles(gameBoard.getPlaceholdersByColumns());
};
const moveDown = () => {
  slideTiles(
    gameBoard.getPlaceholdersByColumns().map(col => [...col].reverse()),
  );
};
const moveLeft = () => {
  slideTiles(gameBoard.getPlaceholdersByRow());
};
const moveRight = () => {
  slideTiles(gameBoard.getPlaceholdersByRow().map(col => [...col].reverse()));
};

const slideTiles = placeHolders => {
  placeHolders.forEach(holderGroup => {
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
        if (lastValidHolder.tile) {
          lastValidHolder.mergeTile = holder.tile;
        } else {
          lastValidHolder.tile = holder.tile;
        }
        holder.tile = null;
      }
    }
  });
};

const handleInput = e => {
  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowRight':
      moveRight();
      break;
    case 'ArrowLeft':
      moveLeft();
      break;
    default:
      window.addEventListener('keydown', handleInput, { once: true });
      //   setupInput();
      break;
  }
  gameBoard.placeHolderList.forEach(pH => pH.mergeTiles());
  window.addEventListener('keydown', handleInput, { once: true });
  //   setupInput();
};

window.addEventListener('keydown', handleInput, { once: true });
