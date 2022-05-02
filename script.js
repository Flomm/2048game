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

const canMoveUp = () => {
  return canMove(gameBoard.getPlaceholdersByColumns());
};
const canMoveDown = () => {
  return canMove(
    gameBoard.getPlaceholdersByColumns().map(col => [...col].reverse()),
  );
};
const canMoveLeft = () => {
  return canMove(gameBoard.getPlaceholdersByRow());
};
const canMoveRight = () => {
  return canMove(
    gameBoard.getPlaceholdersByRow().map(row => [...row].reverse()),
  );
};

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
    gameBoard.getPlaceholdersByRow().map(row => [...row].reverse()),
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

const canMove = placeHolders => {
  return placeHolders.some(phGroup => {
    return phGroup.some((ph, index) => {
      if (index === 0 || !ph.tile) return false;
      const phToMoveTo = phGroup[index - 1];
      return phToMoveTo.canAccept(ph.tile);
    });
  });
};

const handleInput = async e => {
  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        window.addEventListener('keydown', handleInput, { once: true });
        return;
      }
      await moveUp();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) {
        window.addEventListener('keydown', handleInput, { once: true });
        return;
      }
      await moveDown();
      break;
    case 'ArrowRight':
      if (!canMoveRight()) {
        window.addEventListener('keydown', handleInput, { once: true });
        return;
      }
      await moveRight();
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        window.addEventListener('keydown', handleInput, { once: true });
        return;
      }
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

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitTransition(true).then(() => alert('You lose!'));
    return;
  }
  window.addEventListener('keydown', handleInput, { once: true });
  //   setupInput();
};

window.addEventListener('keydown', handleInput, { once: true });
