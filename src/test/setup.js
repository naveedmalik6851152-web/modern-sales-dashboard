import '@testing-library/jest-dom/vitest';

// jsdom does not implement matchMedia or ResizeObserver.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = window.ResizeObserver || ResizeObserverStub;
window.HTMLElement.prototype.scrollTo = window.HTMLElement.prototype.scrollTo || (() => {});
