import { createElem, qs, appendChildren } from '../functions/utils.js';

export default class PopUp {
  #message;
  #window;
  #restartButton;

  constructor(message) {
    this.#message = message;
    this.buildWindow();
    this.showWindow();
  }

  showWindow() {
    qs('.wrapper').classList.add('disabled');
    qs('body').appendChild(this.#window);
  }

  waitForClick() {
    return new Promise(resolve => {
      this.#restartButton.addEventListener('click', resolve, { once: true });
    });
  }

  buildWindow() {
    this.#window = createElem('div');
    this.#window.classList.add('pop-up');
    const messageBox = createElem('div');
    messageBox.classList.add('centered');
    messageBox.textContent = this.#message;
    const buttonHolder = createElem('div');
    this.#restartButton = createElem('button');
    this.#restartButton.textContent = 'Restart';
    appendChildren(buttonHolder, [this.#restartButton]);
    appendChildren(this.#window, [messageBox, buttonHolder]);
  }

  removeWindow() {
    qs('.wrapper').classList.remove('disabled');
    qs('body').removeChild(this.#window);
  }
}
