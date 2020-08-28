# Alpheios WebExtension
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Overview

This repository contains the wrapper code for the Alpheios Reading Tools Browser
extensions for Chrome, Firefox and Safari.  The core functionality is provided
by the [`alpheios-components`](https://github.com/alpheios-project/alpheios-core/tree/master/packages/components)
library. The webextension wrapper code provides the implementation of the
[WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API) (Chrome/FF)
and [App Extension API](https://developer.apple.com/documentation/safariservices/safari_app_extensions) (Safari).

See also [DEVELOPMENT.md](DEVELOPMENT.md).

## Development and Reviewer Build Instructions

See [BUILD-FF-CHROME.md](BUILD-FF-CHROME.md) and [BUILD-SAFARI.md](BUILD-SAFARI.md).

## QA Build Instructions

1. merge the `master` branch to the `qa` branch and push to GitHub
2. GitHub Actions will execute the release.yml workflow to inject the build
number, install the `qa` branch of alpheios-components,  
build the distribution files, and tag a pre-release in GitHub, with the dist files
packaged as a release artifact.
3. In the Safari build environment, pull the `qa` branch  and extract
the `dist.zip` from the Pre-release in GitHub to the local `dist` directory.
4. Create the Safari Package as described in BUILD-SAFARI.md

### Production Version and Build Instructions

1. merge the `master` branch to the `production` branch and push to GitHub
2. Update the version in `package.json` and `manifest.json`
3. Commit and push the change to GitHub
4. GitHub Actions will execute the release.yml workflow to inject the build
number, install the `production` branch of alpheios-components,  
build the distribution files, and tag a pre-release in GitHub, with the dist files
packaged as a release artifact.
5. In the Safari build environment, pull the `production` branch  and extract
the `dist.zip` from the Pre-release in GitHub to the local `dist` directory.
6. Create the Safari Package as described in BUILD-SAFARI.md
7. When ready to release the code remove the "Pre-release" flag from the
Release in GitHub.
8. Merge the version and any other code changes from `production` back to `master`

