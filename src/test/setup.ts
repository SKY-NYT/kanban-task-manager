import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});


Object.defineProperty(window, "scrollTo", {
  value: () => {},
  writable: true,
});

if (!window.matchMedia) {

  (window as Window & typeof globalThis).matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}




vi.mock('*.svg', () => ({
  default: 'svg-url',
  ReactComponent: 'svg-node'
}));