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

  set tile(newTile) {
    this.#tile = newTile;
    if (newTile) {
      this.#tile.x = this.#x;
      this.#tile.y = this.#y;
    }
  }
}
