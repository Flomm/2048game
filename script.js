import Board from './classes/Board.js';
import { qs } from './functions/utils.js';
import Tile from './classes/Tile.js';
import { slideTiles } from './functions/slideTiles.js';
import { canMove } from './functions/canMove.js';
import PopUp from './classes/PopUp.js';

const winningNumber = 8;

//Functions for movement
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

// Functions for input
const handleInput = async e => {
  switch (e.key) {
    case 'w':
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case 's':
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case 'd':
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    case 'a':
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    default:
      setupInput();
      return;
  }
  gameBoard.placeHolderList.forEach(pH => pH.mergeTiles());

  const newTile = new Tile(boardElem);
  gameBoard.getRandomEmptyPlaceholder().tile = newTile;

  if (gameBoard.placeHolderList.some(pH => pH.tile?.value >= winningNumber)) {
    newTile.waitTransition(true).then(() => {
      const newPopUp = new PopUp('You won!', 't');
    });
    return;
  }

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitTransition(true).then(() => {
      const newPopUp = new PopUp('You lose!', 't');
    });
    return;
  }

  setupInput();
};

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

//Start game

const boardElem = qs('#game-board');
const gameBoard = new Board(boardElem);

gameBoard.getRandomEmptyPlaceholder().tile = new Tile(boardElem);
gameBoard.getRandomEmptyPlaceholder().tile = new Tile(boardElem);

setupInput();
