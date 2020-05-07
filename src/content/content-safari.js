/* global safari, BUILD_NUMBER, BUILD_BRANCH, BUILD_NAME */
import Message from '@/lib/messaging/message/message.js'
import StateMessage from '@/lib/messaging/message/state-message.js'
import LoginMessage from '@/lib/messaging/message/login-message.js'
import LogoutMessage from '@/lib/messaging/message/logout-message.js'
import MessagingService from '@/lib/messaging/service-safari.js'
import {
  TabScript, UIController, AuthModule, AuthData, ToolbarModule, ActionPanelModule, PanelModule, PopupModule, Platform,
  LocalStorageArea, HTMLPage, L10n, enUS, Locales, enGB, Logger
} from 'alpheios-components'
import SafariAuthenticator from '@/lib/auth/safari-authenticator.js'
import Package from '../../package.json'
import env from '../../../protected-config/auth0/prod/env-safari-app-ext.js'
import createAuth0Client from '@auth0/auth0-spa-js'
import jwt from 'jsonwebtoken'
const LOGIN_TIMEOUT = 300

const pingInterval = 15000 // How often to ping background with a state message, in ms
let pingIntervalID = null
let uiController = null
let state = null
const logger = Logger.getInstance()
let authenticator = null
let messagingService = null
let authClient

/**
 * Activates a ping that will send state to background periodically
 */
const activatePing = function activatePing () {
  /*
If Safari with an activated Alpheios Safari App Extension is moved out of focus,
as when user is temporarily switched to some other application,  Safari App
Extension will automatically be deactivated. Thus usually happens after a few
dozen seconds (exact amount of time is not clear). As a result of this, an icon
of an extension will be switched to an inactive state. To prevent this, we have
to ping a background with a state message periodically.
There might be a more elegant way to handle this in future versions of
Safari App Extension API, but for now it seems to be the only way.
 */
  pingIntervalID = window.setInterval(() => {
    if (state && state.isActive()) {
      sendMessageToBackground('ping')
    }
  }, pingInterval)
}

/**
 * Deactivates a ping that was set by `activatePing`
 */
const deactivatePing = function deactivatePing () {
  if (pingIntervalID) {
    window.clearInterval(pingIntervalID)
  }
}

/**
 * Dispatch an Alpheios_Active event to the page
 */
const notifyPageActive = function () {
  document.body.dispatchEvent(new Event('Alpheios_Active'))
}

/**
 * Dispatch an Alpheios_Inactive event to the page
 */
const notifyPageInactive = function () {
  document.body.dispatchEvent(new Event('Alpheios_Inactive'))
}

/**
 * Deactivates a UI controller and notifies Safari app extension about it,
 * depending on the `notify` parameter value.
 * @param {Boolean} notify - Will notify app extension only if this parameter is true.
 */
const deactivateUIController = function deactivateUIController (notify = true) {
  uiController.deactivate()
    .then(() => {
      if (notify) {
        sendMessageToBackground('updateState')
      }
      deactivatePing()
      notifyPageInactive()
    })
    .catch((error) => logger.error(`Unable to deactivate Alpheios: ${error}`))
}

/**
 * A listener for an Alpheios embedded library event message.
 */
const embeddedLibListener = function embeddedLibListener () {
  // We discovered that an Alpheios embedded lib is active
  state.setEmbedLibStatus(HTMLPage.isEmbedLibActive)
  // Notify background that an embed lib is active
  sendMessageToBackground('embedLibActive')
  if (state.isActive()) {
    // Display a panel with a warning about extension being deactivated
    const l10n = new L10n().addMessages(enUS, Locales.en_US).addMessages(enGB, Locales.en_GB).setLocale(Locales.en_US)
    const embedLibWarning = UIController.getEmbedLibWarning(l10n.getMsg('EMBED_LIB_WARNING_TEXT'))
    document.body.appendChild(embedLibWarning.$el)
    deactivateUIController(false)
  }
}

/**
 * State request processing function.
 */
const handleStateRequest = async function handleStateRequest (message) {
  state.setEmbedLibStatus(HTMLPage.isEmbedLibActive)
  if (state.isEmbedLibActive()) {
    // Inform a background that an Alpheios embedded library is active
    sendMessageToBackground('embedLibActive')
    return
  }

  if (message.body.hasOwnProperty('accessTokenExpiresIn')) { // eslint-disable-line no-prototype-builtins
    // Expiration datetime in the state request is in the Unix time (whole seconds)
    // It will be converted to a Date format below
    message.body.accessTokenExpiresIn = new Date(Number.parseInt(message.body.accessTokenExpiresIn, 10) * 1000)
  }

  const requestState = TabScript.readObject(message.body)
  const diff = state.diff(requestState)

  /*
  As opposed to webextension, where content script is injected into a document (i.e. `window.document`)
  by a background script, Safari app extension injects content script into each document within a page
  (including documents within frames) on every page load. Since it happens automatically, script injection
  occurs event if extension is not activated by the user. That's why we don't want to create a controller
  instance when a script is injected (i.e. in DOMContentLoaded callback): if Alpheios extension will never
  be activated on a particular page (document) we would still waste resources creating an instance
  of a UI controller that will never be used. The more rational approach would be on page load
  to activate a message listener instead that, when an activation request from Safari App Extension is
  received, would create an instance of a UI controller, following a lazy initialization approach.
   */
  if (!uiController) {
    if (diff.has('status') && diff.status === TabScript.statuses.script.ACTIVE) {
      uiController = UIController.create(state, {
        storageAdapter: LocalStorageArea,
        app: { name: 'Safari App Extension', version: Package.version, buildBranch: BUILD_BRANCH, buildNumber: BUILD_NUMBER, buildName: BUILD_NAME },
        appType: Platform.appTypes.SAFARI_APP_EXTENSION
      })
      authenticator = new SafariAuthenticator(messagingService)
      uiController.registerModule(AuthModule, { auth: authenticator })
      uiController.registerModule(PanelModule, {
        mountPoint: '#alpheios-panel' // To what element a panel will be mounted
      })
      uiController.registerModule(PopupModule, {
        mountPoint: '#alpheios-popup'
      })
      uiController.registerModule(ToolbarModule, {})
      uiController.registerModule(ActionPanelModule)
      await uiController.init()
    } else {
      // If uninitialized, ignore all other requests other than activate
      // TODO: This is due to Safari background sending state request after reload. Need to fix
      return
    }
  }

  if (diff.has('status') && diff.status === TabScript.statuses.script.ACTIVE) {
    // This is an activation request

    // Set state according to activation request data
    if (diff.has('panelStatus')) { state.panelStatus = diff.panelStatus }
    if (diff.has('tab')) { state.tab = diff.tab }
    uiController.activate()
      .then(() => {
        if (uiController.hasModule('auth')) {
          // Restore the logged in state if it was established during the previous sessions
          if (message.body.isAuthenticated === 'true') {
            // We need to update an authentication status only if the user has been logged in
            uiController.api.auth.authenticate(message.body)
          }
          if (message.body.hasSessionExpired === 'true') {
            // We need to update an authentication status only if the user has been logged in
            uiController.api.auth.expireSession()
          }

          // Subscribe to the SESSION_EXPIRED event
          AuthModule.evt.SESSION_EXPIRED.sub(() => {
            const msg = new LogoutMessage(new AuthData().expireSession().interopSerializable())
            safari.extension.dispatchMessage(Message.types.LOGOUT_MESSAGE.description, msg)
          })
        }

        // Set watchers after UI Controller activation so they will not notify background of activation-related events
        uiController.state.setWatcher('panelStatus', sendMessageToBackground.bind(this, 'updateState'))
        uiController.state.setWatcher('tab', sendMessageToBackground.bind(this, 'updateState'))
        activatePing()
        notifyPageActive()
        sendMessageToBackground('updateState')
      })
      .catch((error) => logger.error(`Unable to activate Alpheios: ${error}`))
    return
  } else if (diff.has('status') && diff.status === TabScript.statuses.script.DEACTIVATED) {
    // This is a deactivation request

    // Set state according to activation request data
    if (diff.has('panelStatus')) { state.panelStatus = diff.panelStatus }
    if (diff.has('tab')) { state.tab = diff.tab }
    deactivateUIController()
    return
  }

  if (diff.has('panelStatus')) {
    if (diff.panelStatus === TabScript.statuses.panel.OPEN) {
      uiController.api.ui.openPanel()
    } else if (diff.panelStatus === TabScript.statuses.panel.CLOSED) {
      uiController.api.ui.closePanel()
    }
  }
  if (diff.has('tab') && diff.tab) { uiController.changeTab(diff.tab) }
  sendMessageToBackground('updateState')
}

const handleLoginRequest = async function handleLoginRequest (message) {
  // Expiration datetime in the state request is in the Unix time (whole seconds)
  // It will be converted to a Date format below
  message.body.accessTokenExpiresIn = new Date(Number.parseInt(message.body.accessTokenExpiresIn, 10) * 1000)
  uiController.api.auth.authenticate(message.body)
}

const handleLogoutRequest = async function handleLogoutRequest (message) {
  // Boolean values are sent being converted to strings
  if (message.body.hasSessionExpired === 'true') {
    // This is a logout due to expiration of a session
    uiController.api.auth.expireSession()
  } else {
    // This is a user-initiated logout
    uiController.api.auth.logout()
  }
}

const sendMessageToBackground = function sendMessageToBackground (messageName) {
  safari.extension.dispatchMessage(messageName, new StateMessage(state))
}

document.addEventListener('DOMContentLoaded', (event) => {
  // Handle the Auth0 logout page
  if (window.document.URL.includes(env.AUTH0_LOGOUT_URL)) {
    // Empty the logout page
    window.document.body.innerHTML = ''
    /*
    This is an Auth0 logout page. We need to navigate away from it.
    Logout is happening in a frame with a log in button.
    Because of this we need to set auth to 1 so that the log out button
    will be rendered in that frame.
     */
    window.document.location.replace(`${env.ALPHEIOS_DOMAIN}#auth=1`)
    return
  }

  if (window.document.URL.includes(env.ALPHEIOS_DOMAIN)) {
    const searchRes = window.document.URL.match(/auth=(\d+)/)
    if (!searchRes) {
      // Do not inject anything if `auth` is not present
      return
    }
    const authStatus = (searchRes && searchRes.length === 2 && searchRes[1] === '1')
    let authDiv = document.createElement('div') // eslint-disable-line prefer-const

    authDiv.innerHTML += authStatus
      ? '<button id="alpheios-logout" class="alpheios-button-primary">Log Out</button>'
      : '<button id="alpheios-login" class="alpheios-button-primary">Log In</button>'
    document.body.appendChild(authDiv)

    createAuth0Client({
      domain: env.AUTH0_DOMAIN,
      client_id: env.AUTH0_CLIENT_ID,
      audience: env.AUDIENCE,
      scope: env.SCOPE
    }).then(auth0 => {
      authClient = auth0
    }).catch(err => {
      console.error('Auth0 client creation failed:', err)
    })

    const loginBtn = window.document.body.querySelector('#alpheios-login')
    const logoutBtn = document.body.querySelector('#alpheios-logout')

    console.info('A')
    if (loginBtn) {
      loginBtn.addEventListener('click', async () => {
        if (authClient) {
          const popup = window.open(
            '',
            'auth0:authorize:popup',
            'left=100,top=100,width=400,height=600,resizable,scrollbars=yes,status=1'
          )
          try {
            await authClient.loginWithPopup(
              { max_age: env.AUTH0_MAX_AGE || 60 },
              { timeoutInSeconds: LOGIN_TIMEOUT, popup }
            )
          } catch (err) {
            console.error('Auth0 login request failed:', err)
          }

          let authData = new AuthData() // eslint-disable-line prefer-const
          authData.setAuthStatus(true)
          try {
            const accessToken = await authClient.getTokenSilently()
            const decoded = jwt.decode(accessToken)
            authData.accessToken = accessToken
            // `exp` contains an expiration datetime in unix epoch, in seconds
            authData.expirationDateTime = decoded.exp
          } catch (err) {
            console.error('Unable to get Auth0 token:', err)
          }

          try {
            const user = await authClient.getUser()
            authData.userId = user.sub
            authData.userName = user.name
            authData.userNickname = user.nickname

            const msg = new LoginMessage(authData)
            safari.extension.dispatchMessage(Message.types.LOGIN_MESSAGE.description, msg)
          } catch (err) {
            console.error('Auth0 user info request failed:', err)
          }
        } else {
          console.error('Auth0 client object does not exist')
        }
      })
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (authClient) {
          authClient.logout()
          // Use an empty AuthData object to confirm to the protocol
          //     and indicate that this logout is user-initiated, not due to a timeout.
          const msg = new LogoutMessage(new AuthData().interopSerializable())
          safari.extension.dispatchMessage(Message.types.LOGOUT_MESSAGE.description, msg)
        } else {
          console.error('Auth0 client object does not exist')
        }
      })
    }
    return
  }

  /*
  In Safari, if page contains several documents (as in case with frames), a content script is
  loaded for the "main" document (the topmost document) AND for each of the child documents
  (i.e. frames). Safari might also load content script for one or several blank documents
  that are created during Vue.js component rendering.
  We will use `HTMLPage.isValidTarget` to filter out documents where an Alpheios UI can and should
  be shown from those where it can not. If we're lucky, a single document will be selected.
  If not, we should adjust filtering rules to accommodate such cases.
   */
  if (HTMLPage.isValidTarget) {
    messagingService = new MessagingService()
    messagingService.addHandler(Message.types.STATE_REQUEST, handleStateRequest)
    messagingService.addHandler(Message.types.LOGIN_NTFY_MESSAGE, handleLoginRequest)
    messagingService.addHandler(Message.types.LOGOUT_NTFY_MESSAGE, handleLogoutRequest)
    safari.self.addEventListener('message', messagingService.listener.bind(messagingService))

    /*
    In situations where a page with an already activated content script is reloaded
    and a UI controller is deactivated because of that,
    we need to notify Safari app extension about this
    so that it could update states of an icon and a pop-up menu
     */
    state = new TabScript()
    state.deactivate()
    state.setPanelDefault()
    state.setTabDefault()
    state.setEmbedLibStatus(HTMLPage.isEmbedLibActive)
    if (!state.isEmbedLibActive()) {
      // We did not discover embedded library right away. Let's set a message listener for its response
      // and fire an event to double check
      document.body.addEventListener('Alpheios_Embedded_Response', embeddedLibListener)
      document.body.dispatchEvent(new Event('Alpheios_Embedded_Check'))
    }
    sendMessageToBackground('contentReady')
  }
})
