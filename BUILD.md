## Build Process

Prerequisites: Node 10.5.0

1. Set the version/build number

Set the build number in the following files:

* package.json (package version - javascript)
* dist/manifest.json (package version - Chrome and FF archive)
* src/safari-app-extension/AlpheiosReadingTools/Info.plist (MacOS App)
* src/safari-app-extension/AlpheiosSafari/Info.plist (Safari App Extension)


2. Build the distribution Javascript and CSS files

```
npm install
npm update
npm run build
```

This uses Webpack to build the distribution Javascript and CSS files for Chrome, FF and Safari

3. Commit the build

Commit the distribution files to GitHub

```
git add .
git commit 
```

4. Build Firefox and Chrome Package

```
npm run zip <version>
```

Creates the zip file for upload to the Chrome Developer Dashboard and FF Add-Ons site

5. Build Safari Package (Development/QA Build)

Prerequisites: 

* XCode 10.0
* Swift 4.2
* Developer Certificate Registered with the Alpheios Apple Developer Account installed in your XCode environment


*If producing a development build:*

In **XCode**

* Choose menu **Product** -> **Clean Build Folder**
* Choose menu **Product** -> **Archive**
* Click **Distribute App**, Select **Development** and click **Next**
* Click **Automatically Manage Signing**
* Click **Export**

This *should* create an archive that is signed using the Alpheios Development Distribution profile, enabled for installation on registered development device ids.

A development build can be packaged using the MacOS **Disk Utility** application:

* Choose menu **File** ->  **New Image** -> **Image From Folder**
* Choose the archive directory exported from XCode
* Click **Save**

This creates a .dmg file which can be opened directly to mount the application disk image.

An installatino package for a development build can be produced:

In **XCode**

* if you haven't already, create a Developer ID Installer Signing Certificate (choose menu **Preferences** -> **Accounts** ->  **+** -> **Developer ID Installer**

From a terminal:

```
cd <location of location of archive directory exported from XCode>
productbuild --component "Alpheios Reading Tools.app" /Applications --sign “<name of developer id installer certificate>" Alpheios.pkg
```

This packgae should be installable using 

```
sudo installer -store -pkg Alpheios.pkg -target /
```

*If producing an AppStore build:*

In **XCode**

* Choose menu **Product** -> **Clean Build Folder**
* Choose menu **Product** -> **Archive**
* Click **Distribute App**
* Select **Mac App Store**
* Click **Next**
* Click **Upload**



