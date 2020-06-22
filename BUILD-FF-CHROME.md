## Webextension Build Instructions (Chrome and Firefox)

**1. Install Dependencies

**Prerequisites**: Node 13.7.0 or higher, npm 6.13.6 or higher.

```
npm install
npm update
```

**2. Build the distribution Javascript and CSS files**

```
npm run build-prod
```

This uses Webpack to build the distribution Javascript and CSS files for Chrome
and Firefox.

**3. Add Environment file**

Add a file named `env-webext.js` to the dist directory with the following
contents:

```
const auth0Env = {
  AUTH0_DOMAIN: 'alpheios.auth0.com',
  AUTH0_CLIENT_ID: '',
  ENDPOINTS: {
    'wordlist' : 'https://userapis.alpheios.net/v1/words',
    'settings' : 'https://settings.alpheios.net/v1/settings'
  },
  AUDIENCE: 'alpheios.net:apis',
  LOGOUT_URL: 'https://alpheios.net/pages/logout'
}
```
In the internal build process this is pulled in from local clone of a protected
repository. The `AUTH0_CLIENT_ID` variable is an internal protected secret.
Without this set the code will work but authentication will fail.

**4. Build Firefox and Chrome Package**
```
npm run zip <version>
```
Creates the extension zip file.

