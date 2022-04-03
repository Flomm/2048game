export default class Placeholder {
  #placeHolderElem;
  #x;
  #y;

  constructor(placeHolderElem, x, y) {
    this.#placeHolderElem = placeHolderElem;
    this.#x = x;
    this.#y = y;
  }
}
