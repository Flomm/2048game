import { createElem, qs, appendChildren } from '../functions/utils.js';

export default class PopUp {
  #window;
  #restartButton;

  constructor(message, className) {
    this.#showWindow(message, className);
  }

  #showWindow(message, className) {
    this.#window = createElem('div');
    this.#window.classList.add('pop-up');
    const messageBox = createElem('div', {
      class: `${className}`,
      text: message,
    });
    const buttonHolder = createElem('div');
    this.#restartButton = createElem('button', { text: 'Restart' });
    appendChildren(buttonHolder, [this.#restartButton]);
    appendChildren(this.#window, [messageBox, buttonHolder]);

    qs('.wrapper').classList.add('disabled');
    qs('body').appendChild(this.#window);
  }

  waitForClick() {
    return new Promise(resolve => {
      this.#restartButton.addEventListener('click', resolve, { once: true });
    });
  }

  removeWindow() {
    qs('.wrapper').classList.remove('disabled');
    qs('body').removeChild(this.#window);
  }
}
