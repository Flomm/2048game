export const qs = (selector, parent = document) => {
  return parent.querySelector(selector);
};

export const qsa = (selector, parent = document) => {
  return [...parent.querySelectorAll(selector)];
};

export const createElem = (type, opts = {}) => {
  const element = document.createElement(type);
  Object.entries(opts).forEach(([key, value]) => {
    if (key === 'class') {
      element.classList.add(value);
      return;
    }

    if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
      return;
    }

    if (key === 'text') {
      element.textContent = value;
      return;
    }

    element.setAttribute(key, value);
  });
  return element;
};
