export default class Placeholder {
  #placeHolderElem;
  #x;
  #y;
  #tile;

  constructor(placeHolderElem, x, y) {
    this.#placeHolderElem = placeHolderElem;
    this.#x = x;
    this.#y = y;
  }

  get tile() {
    return this.#tile;
  }
}
