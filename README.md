# Alpheios WebExtension
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Initialization sequence

1. Background script loads a content script, content styles, and, if necessary, a webextension polyfill into
a tab.
2. Content script sets itself to a default state.
3. Background script sends a StatusRequest to a content script with a desired content script status.
4. Content script responds with a StatusResponse that has an updated content script state.

If a background scripts wants to change a content script state, it sends a StatusRequest to a content script.
Content script responds with a StatusResponse that has an updated content script state.

If a content script changes its state, it sends a StatusMessage to a background script.

## Libraries

### Experience

Experience library [documentation](../experience/README.md).

## Development Notes

### Auth0
Webextension uses an Auth0 script from <https://github.com/alpheios-project/auth0-chrome>. This repository
should be installed alongside with `webextension` (both `webextension` and `auth0-chrome` should be located
within the same directory). Use `npm run auth0-update` helper command from `package.json` to copy an updated
script version from `auth0-chrome/dist` into `webextension/support/auth0`.

### Stateful Functions
The functions that are monitored should be statefull. They should have a `Statefull` word in their names
by convention. For more information on statefull functions please check "Statefull Functions" section in
Experience Monitor documentation.

### WebExtension ID
Explicit WebExtension ID is not necessary ([https://developer.mozilla.org/en-US/Add-ons/WebExtensions/WebExtensions_and_the_Add-on_ID]).

However, Mozilla Firefox does not support `storage.local` and `storage.sync` for extensions with a temporary ID 
(i.e. for temporary extensions that are used during development, [https://bugzil.la/1323228]). Because of
that, ID must be provided in the `applications` section of `manifest.json`. However, Google Chrome will ignore it and produce
a warning (but `storage.local` and `storage.sync` will work in Chrome even with a temporary extension's ID
so not a big deal).

`applications` section can be removed once development is complete.

### `sendResponse` callback in `onMessage`
It seems that sendResponse is not supported by webextension-polyfill: 
[https://github.com/mozilla/webextension-polyfill/issues/16/#issuecomment-296693219]
The reason seems to be that a response callback might be removed from `onMessage` some time later. 
Because of that, we have to implement our own request-response matching mechanism with `MessagingService`.
