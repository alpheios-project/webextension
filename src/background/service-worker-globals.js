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
    createElement: (tagName) => {
      const node = createNode(true)
      node.tagName = tagName ? tagName.toUpperCase() : ''
      node.nodeName = tagName ? tagName.toUpperCase() : ''
      node.nodeType = 1 // ELEMENT_NODE
      return node
    },
    createTextNode: (text) => ({
      textContent: text || '',
      nodeType: 3 // TEXT_NODE
    }),
    createEvent: (type) => ({
      type: type || '',
      initEvent: noop,
      preventDefault: noop,
      stopPropagation: noop,
      stopImmediatePropagation: noop,
      bubbles: false,
      cancelable: false
    }),
    getElementsByTagName: () => [],
    getElementById: () => null,
    getElementsByClassName: () => [],
    body,
    head: createNode(),
    documentElement: createNode(),
    addEventListener: noop,
    removeEventListener: noop,
    querySelector: () => null,
    querySelectorAll: () => []
  }
}
