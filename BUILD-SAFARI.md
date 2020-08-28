## Safari App Extension Build Instructions

**1. Install Dependencies

**Prerequisites**:

* Node 14.1.0 or higher
* npm 6.14.6 or higher.
* XCode 11.3.1 or higher
* Swift 5.1.3 or higher
* Developer Certificate Registered with the Alpheios Apple Developer Account
  installed in your XCode environment
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

**3. Build Safari Package**

***If producing a development build:***

In **XCode**

* Choose menu **Product** -> **Clean Build Folder**
* Choose menu **Product** -> **Archive**
* Click **Distribute App**, Select **Development** and click **Next**
* Click **Automatically Manage Signing**
* Click **Export**

This *should* create an archive that is signed using the Alpheios Development
Distribution profile, enabled for installation on registered development device ids.

A development build can be packaged using the MacOS **Disk Utility** application:

* Choose menu **File** ->  **New Image** -> **Image From Folder**
* Choose the archive directory exported from XCode
* Click **Save**

This creates a .dmg file which can be opened directly to mount the application disk image.

An installation package for a development build can be produced:

In **XCode**

* if you haven't already, create a Developer ID Installer Signing Certificate
(choose menu **Preferences** -> **Accounts** ->  **+** -> **Developer ID Installer**

From a terminal:

```
cd <location of location of archive directory exported from XCode>
productbuild --component "Alpheios Reading Tools.app" /Applications --sign “<name of developer id installer certificate>" Alpheios.pkg
```

This packgae should be installable using

```
sudo installer -store -pkg Alpheios.pkg -target /
```

***If producing an AppStore build:***

In **XCode**

* Choose menu **Product** -> **Clean Build Folder**
* Choose menu **Product** -> **Archive**
* Click **Distribute App**
* Select **Mac App Store**
* Click **Next**
* Click **Upload**



