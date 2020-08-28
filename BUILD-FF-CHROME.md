## Webextension Build Instructions (Chrome and Firefox)

**1. Install Dependencies**

**Prerequisites**: Node 13.7.0 or higher, npm 6.13.6 or higher.

```
npm install
npm update
```

**2. Build the distribution Javascript and CSS files**

```
npm run update-dist && npm run update-styles
bash scripts/update_env.sh <AUTH0_CLIENT_ID>
npm run prod
```

This uses Webpack to build the distribution Javascript and CSS files for Chrome
and Firefox.

**3. Build Firefox and Chrome Package**
```
npm run zip <version>
```
Creates the extension zip file.

