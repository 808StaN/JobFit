import "@testing-library/jest-dom/vitest";

class MemoryClipboard {
  text = "";

  writeText(value: string) {
    this.text = value;
    return Promise.resolve();
  }
}

Object.assign(navigator, { clipboard: new MemoryClipboard() });
