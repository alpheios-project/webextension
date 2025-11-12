/**
 * Some third-party libraries expect `window` (and sometimes `self`) to be defined.
 * Service workers do not provide a window object, so expose the global scope to keep them happy.
 */
if (typeof globalThis.window === 'undefined') {
  globalThis.window = globalThis
}

if (typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis
}

if (typeof globalThis.document === 'undefined') {
  const noop = () => {}
  const createNode = (withWindow = false) => {
    const node = {
      style: {},
      appendChild: noop,
      removeChild: noop,
      insertBefore: noop,
      setAttribute: noop,
      getAttribute: () => null,
      addEventListener: noop,
      removeEventListener: noop
    }
    if (withWindow) {
      node.contentWindow = { eval: noop, execScript: noop }
    }
    return node
  }

  const body = {
    appendChild: noop,
    removeChild: noop,
    addEventListener: noop,
    removeEventListener: noop
  }

  globalThis.document = {
    createElement: () => createNode(true),
    createTextNode: () => ({ textContent: '' }),
    createEvent: (type) => ({
      type,
      initEvent: noop,
      preventDefault: noop,
      stopPropagation: noop
    }),
    body,
    head: createNode(),
    documentElement: createNode(),
    addEventListener: noop,
    removeEventListener: noop,
    querySelector: () => null,
    querySelectorAll: () => []
  }
}
