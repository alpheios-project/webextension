let authEnvPromise = null

function normalizeEnvModule (module) {
  if (!module) {
    return {}
  }
  if (module.default) {
    return module.default
  }
  if (module.auth0Env) {
    return module.auth0Env
  }
  return module
}

export function loadAuthEnv () {
  if (!authEnvPromise) {
    authEnvPromise = (async () => {
      try {
        const runtime = (globalThis.chrome && globalThis.chrome.runtime) || (globalThis.browser && globalThis.browser.runtime)
        if (runtime && runtime.getURL) {
          const runtimeUrl = runtime.getURL('env-webext.js')
          const runtimeModule = await import(/* webpackIgnore: true */ runtimeUrl)
          return normalizeEnvModule(runtimeModule)
        }
      } catch (error) {
        console.warn('Unable to load env-webext.js, falling back to template values.', error)
      }

      const fallbackModule = await import('../env/env-webext-template.js')
      return normalizeEnvModule(fallbackModule)
    })()
  }

  return authEnvPromise
}
