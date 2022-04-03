export const qs = (selector, parent = document) => {
  return parent.querySelector(selector);
};

export const qsa = (selector, parent = document) => {
  return [...parent.querySelectorAll(selector)];
};

export const createElem = (type, opts = {}) => {
  const elem = document.createElement(type);
  Object.entries(opts).forEach(([key, value]) => {
    if (key === 'class') {
      elem.classList.add(value);
      return;
    }

    if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        elem.dataset[dataKey] = dataValue;
      });
      return;
    }

    if (key === 'text') {
      elem.textContent = value;
      return;
    }

    elem.setAttribute(key, value);
  });
  return elem;
};
