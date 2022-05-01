export default class Placeholder {
  #placeHolderElem;
  #x;
  #y;
  #tile;
  #mergeTile;

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
