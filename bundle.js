const qs = (selector, parent = document) => {
  return parent.querySelector(selector);
};

const createElem = (type, opts = {}) => {
  const elem = document.createElement(type);
  Object.entries(opts).forEach(([key, value]) => {
    if (key === 'class') {
      elem.classList.add(value);
      return;
    }

    if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        elem.dataset[dataKey] = dataValue;
      });
      return;
    }

    if (key === 'text') {
      elem.textContent = value;
      return;
    }

    elem.setAttribute(key, value);
  });
  return elem;
};

function appendChildren(parent, children) {
  children.forEach(child => {
    parent.appendChild(child);
  });
}

class Placeholder {
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  set x(newX) {
    this.#x = newX;
  }

  get y() {
    return this.#y;
  }

  set y(newY) {
    this.#y = newY;
  }

  get tile() {
    return this.#tile;
  }

  set tile(newTile) {
    this.#tile = newTile;
    if (newTile) {
      this.#tile.x = this.#x;
      this.#tile.y = this.#y;
    }
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(tile) {
    this.#mergeTile = tile;
    if (!tile) return;
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
  }

  canAccept(tile) {
    return !this.tile || (!this.#mergeTile && this.tile.value === tile.value);
  }

  mergeTiles() {
    if (this.#tile && this.#mergeTile) {
      this.#tile.value = this.#tile.value + this.#mergeTile.value;
      this.#mergeTile.remove();
      this.#mergeTile = null;
    }
  }
}

class Board {
  #tileSize = 20;
  #tileQty = 4;
  #gapSize = 2;
  #placeHolderList;
  boardElem;

  constructor(boardElem) {
    this.boardElem = boardElem;
    this.#setBoardProps();
    this.#placeHolderList = this.#createPlaceholders().map((_, index) => {
      return new Placeholder(
        index % this.#tileQty,
        Math.floor(index / this.#tileQty),
      );
    });
  }

  get placeHolderList() {
    return this.#placeHolderList;
  }

  #setBoardProps() {
    this.boardElem.style.setProperty('--tile-qty', this.#tileQty);
    this.boardElem.style.setProperty('--tile-size', `${this.#tileSize}vmin`);
    this.boardElem.style.setProperty('--gap-size', `${this.#gapSize}vmin`);
  }

  #createPlaceholders() {
    const placeHolderList = [];
    for (let i = 0; i < this.#tileQty * this.#tileQty; i++) {
      const newPlaceholder = createElem('div', {
        class: 'placeholder',
      });
      placeHolderList.push(placeHolderList);
      this.boardElem.append(newPlaceholder);
    }
    return placeHolderList;
  }

  clearBoard() {
    this.#placeHolderList.forEach(pH => {
      pH.tile?.remove();
      pH.tile = null;
    });
  }

  getPlaceholdersByColumns() {
    return this.#placeHolderList.reduce((pHList, pH) => {
      pHList[pH.x] = pHList[pH.x] || [];
      pHList[pH.x][pH.y] = pH;
      return pHList;
    }, []);
  }

  getPlaceholdersByRow() {
    return this.#placeHolderList.reduce((pHList, pH) => {
      pHList[pH.y] = pHList[pH.y] || [];
      pHList[pH.y][pH.x] = pH;
      return pHList;
    }, []);
  }

  getRandomEmptyPlaceholder() {
    const emptyPlaceholders = this.#placeHolderList.filter(
      placeholder => !placeholder.tile,
    );
    const randomNumber = Math.floor(Math.random() * emptyPlaceholders.length);
    return emptyPlaceholders[randomNumber];
  }
}

class Tile {
  #x;
  #y;
  #tileElem;
  #value;

  constructor(container, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElem = createElem('div', { class: 'tile' });
    container.append(this.#tileElem);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    this.#value = value;
    this.#tileElem.textContent = value;
    const bgLightness = 100 - Math.log2(value) * 8;
    this.#tileElem.style.setProperty(
      '--background-lightness',
      `${bgLightness}%`,
    );
    this.#tileElem.style.setProperty(
      '--text-lightness',
      `${bgLightness <= 50 ? 90 : 10}%`,
    );
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  set x(value) {
    this.#x = value;
    this.#tileElem.style.setProperty('--x', value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElem.style.setProperty('--y', value);
  }

  remove() {
    this.#tileElem.remove();
  }

  waitTransition(isAnimation = false) {
    return new Promise(resolve => {
      this.#tileElem.addEventListener(
        isAnimation ? 'animationend' : 'transitionend',
        resolve,
        { once: true },
      );
    });
  }
}

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

class PopUp {
  #window;
  #restartButton;

  constructor(message, className) {
    this.#showWindow(message, className);
  }

  #showWindow(message, className) {
    this.#window = createElem('div');
    this.#window.classList.add('pop-up');
    const messageBox = createElem('div', {
      class: `${className}`,
      text: message,
    });
    const buttonHolder = createElem('div');
    this.#restartButton = createElem('button', { text: 'Restart' });
    appendChildren(buttonHolder, [this.#restartButton]);
    appendChildren(this.#window, [messageBox, buttonHolder]);

    qs('.wrapper').classList.add('disabled');
    qs('body').appendChild(this.#window);
  }

  waitForClick() {
    return new Promise(resolve => {
      this.#restartButton.addEventListener('click', resolve, { once: true });
    });
  }

  removeWindow() {
    qs('.wrapper').classList.remove('disabled');
    qs('body').removeChild(this.#window);
  }
}

const winningNumber = 2048;

//Start game

const boardElem = qs('#game-board');
const gameBoard = new Board(boardElem);

gameBoard.getRandomEmptyPlaceholder().tile = new Tile(boardElem);
gameBoard.getRandomEmptyPlaceholder().tile = new Tile(boardElem);

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
      const newPopUp = new PopUp('You won!', 'winner');
      newPopUp.waitForClick().then(() => {
        gameBoard.clearBoard();
        gameBoard.getRandomEmptyPlaceholder().tile = new Tile(boardElem);
        gameBoard.getRandomEmptyPlaceholder().tile = new Tile(boardElem);
        newPopUp.removeWindow();
        setupInput();
      });
    });
    return;
  }

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitTransition(true).then(() => {
      const newPopUp = new PopUp('You lose!', 'loser');
      newPopUp.waitForClick().then(() => {
        gameBoard.clearBoard();
        gameBoard.getRandomEmptyPlaceholder().tile = new Tile(boardElem);
        gameBoard.getRandomEmptyPlaceholder().tile = new Tile(boardElem);
        newPopUp.removeWindow();
        setupInput();
      });
    });
    return;
  }

  setupInput();
};

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

setupInput();
