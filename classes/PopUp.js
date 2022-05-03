import { createElem, qs, appendChildren } from '../functions/utils.js';

export default class PopUp {
  #message;
  #type;
  #window;

  constructor(message, type) {
    this.#message = message;
    this.type = type;
    this.buildWindow();
    this.showWindow();
  }

  showWindow() {
    qs('.wrapper').classList.add('disabled');
    qs('body').appendChild(this.#window);
  }

  buildWindow() {
    this.#window = createElem('div');
    this.#window.classList.add('pop-up');
    const messageBox = createElem('div');
    messageBox.classList.add('centered');
    messageBox.textContent = this.#message;
    const buttonHolder = createElem('div');
    const restartButton = createElem('button');
    restartButton.textContent = 'Restart';
    restartButton.addEventListener('click', this.removeWindow);
    appendChildren(buttonHolder, [restartButton]);
    appendChildren(this.#window, [messageBox, buttonHolder]);
  }

  removeWindow() {
    console.warn('REMOVE');
  }
}
