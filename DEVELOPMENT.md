# Alpheios Webextension Developer Notes

## Authentication
The Webextension uses Auth0 for Authentication. In order for Authentication to work,
the Auth0 Client ID secret must be present in the environment.
This is handled automatically for the QA and Production builds via the GitHub Actions
release workflow. This workflow can be executed from the GitHub UI manually
to produce a development release with authentication enabled for testing.

In addition, for Chrome and FF, the URL for the local testing profile id must be
added to the list of valid callback URLs for the Alpheios Reading Tools application
in the Auth0 console. (The URL is calculated automatically by the code and looks like
https://<profileid>.chromiumapp.org/auth0 and
https://<profileid>.extensions.mozilla.org/auth0 ). It is specific to the directory
a local testing extension is installed from, so it's easiest for testing to always
install the build you are testing from the same directory.

## Initialization sequence

1. Background script loads a content script, content styles, and, if necessary, a webextension polyfill into
a tab.
2. Content script sets itself to a default state.
3. Background script sends a StatusRequest to a content script with a desired content script status.
4. Content script responds with a StatusResponse that has an updated content script state.

If a background scripts wants to change a content script state, it sends a StatusRequest to a content script.
Content script responds with a StatusResponse that has an updated content script state.

If a content script changes its state, it sends a StatusMessage to a background script.

### Stateful Functions
The functions that are monitored should be stateful. They should have a `Statefull` word in their names
by convention. For more information on stateful functions please check "Stateful Functions" section in
Experience Monitor documentation.

## WebExtension ID
Explicit WebExtension ID is not necessary ([https://developer.mozilla.org/en-US/Add-ons/WebExtensions/WebExtensions_and_the_Add-on_ID]).

However, Mozilla Firefox does not support `storage.local` and `storage.sync` for extensions with a temporary ID
(i.e. for temporary extensions that are used during development, [https://bugzil.la/1323228]). Because of
that, ID must be provided in the `applications` section of `manifest.json`. However, Google Chrome will ignore it and produce a warning (but `storage.local` and `storage.sync` will work in Chrome even with a temporary extension's ID
so not a big deal).

`applications` section can be removed once development is complete.

## `sendResponse` callback in `onMessage`
It seems that sendResponse is not supported by webextension-polyfill:
[https://github.com/mozilla/webextension-polyfill/issues/16/#issuecomment-296693219]
The reason seems to be that a response callback might be removed from `onMessage` some time later.
Because of that, we have to implement our own request-response matching mechanism with `MessagingService`.

## Default parameters

### Webextension state (active or inactive)
Default webextension state is "inactive".

### Panel state (open or closed)
Default panel state is determined by a setting in configuration. If not configured by user explicitly,
it is "open".

### Selected panel tab
Default panel tab is "info".

## Usage Scenarios

Webextension uses a tab object to store state of an extension within a certain browser tab or window.
Because of this, each tab has its own state that is completely isolated from the state of the other tab.

Below are some scenarios that describe desired behavior of a webextension within a single tab.

### Activate for the first time in a tab
When an extension is activated in a tab for the first time, it uses default parameters to set its state.

### Activated, navigate to the new page
When an extension is activated, and user navigates to the other page, the webextension retains its
active state, as well as whether a panel is open or not and what tab is active within a panel.

### Activated, navigate to the new page with Alpheios embedded library
An Alpheios embedded library provides its own functionality that conflicts with webextension. Because of this,
on all pages where an embedded library is present and active, webextension will be deactivated. Webextension
UI will be updated to reflect the fact that it has been disabled.

### Activated, navigate to the new page with Alpheios embedded library, return to the previous page
Webextension should restore its state to what it had when the page was left. If webextension was
activated on a page and then disabled automatically after navigating to a page with embedded library, it should
restore its active state. Same applies to other settings such as panel open or closed status and
active tab name. Similar rules apply to scenarios when a webextension was deactivated initially.
After returning to a previous page a webextension state should be "inactive".

### Activated, navigate to the new page, deactivate, navigate back
In this case an extension should be deactivated on the initial page: it wll keep its inactive state
across pages.

### On the same page: activated, deactivated, then activated again
In this case an extension should should reset its state to a default one right before the second activation:
deactivation should always reset a webextension state to default.
