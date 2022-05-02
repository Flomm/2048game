import { createElem } from '../functions/utils.js';
import Placeholder from './Placeholder.js';

export default class Board {
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
