import { createElem } from '../functions/utils';

export default class Tile {
  #x;
  #y;
  #tileElem;
  value;

  constructor(container, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElem = createElem('div', { class: 'tile' });
    container.append(this.#tileElem);
    this.value = value;
  }

  set x(value) {
    this.#x = value;
    this.#tileElem.setProperty('--x', value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElem.setProperty('--y', value);
  }
}
