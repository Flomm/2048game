import { createElem } from '../functions/utils.js';

export default class Tile {
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
