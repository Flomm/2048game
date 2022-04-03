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
    this.#placeHolderList = this.#createPlaceholders().map(
      (placeholder, index) => {
        return new Placeholder(
          placeholder,
          index % this.#tileQty,
          Math.floor(index / this.#tileQty),
        );
      },
    );
    console.warn(this.#placeHolderList);
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
      newPlaceholder.classList.add('flex-center');
      placeHolderList.push(placeHolderList);
      this.boardElem.append(newPlaceholder);
    }
    return placeHolderList;
  }
}
