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
}
