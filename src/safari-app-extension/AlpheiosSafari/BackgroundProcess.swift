//
//  content-process.swift
//  AlpheiosSafariV2
//
//  Created by Irina Sklyarova on 13/09/2018.
//  Copyright © 2018 The Alpheios Project Ltd
//
import SafariServices
import os.log

class BackgroundProcess {
    static let browserIcons: [String: NSImage] = [
        "active": NSImage.init(named: "alpheios.pdf")!,
        "nonactive": NSImage.init(named: "alpheios.pdf")!
    ]
    
    static var tabs: [Int: TabScript] = [:]
    // If user is authenticated, userAuthInfo will hold its information.
    // Available keys are: userId, userName, userNickname, and accessToken.
    // If user is logged out, authInfo will be nil.
    // Checkin if authInfo is nil allow to detect if user has been authenticated successfully or not
    var authInfo: [String:Any]?
    #if DEBUG
    // A signup URL for testing
    let signUpUrl: String = "https://texts-test.alpheios.net/signup_safari"
    #else
    // A production signup URL
    let signUpUrl: String = "https://texts.alpheios.net/signup_safari"
    #endif
    
    // Core Data conteiner initialization
    lazy var persistentContainer: NSCustomPersistentContainer = {
        /*
         The persistent container for the application. This implementation
         creates and returns a container, having loaded the store for the
         application to it. This property is optional since there are legitimate
         error conditions that could cause the creation of the store to fail.
         */
    
        let container = NSCustomPersistentContainer(name: "AlpheiosSafariExtension")
        #if DEBUG
        os_log("Created a persistent \"%@\" container in the background process", log: OSLog.sAlpheios, type: .info, container.name)
        #endif
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                /*
                 Typical reasons for an error here include:
                 * The parent directory does not exist, cannot be created, or disallows writing.
                 * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                 * The device is out of space.
                 * The store could not be migrated to the current model version.
                 Check the error message to determine what the actual problem was.
                 */
                os_log("Cannot load persistent store: %@, %@. Any stored authentication data will be ignored", log: OSLog.sAlpheios, type: .error, error, error.userInfo)
            } else {
                #if DEBUG
                os_log("Persistent store has been loaded successfully in the background process", log: OSLog.sAlpheios, type: .info, container.name)
                #endif
            }
        })
        return container
    }()
    
    init () {
        #if DEBUG
        os_log("Background process has been created", log: OSLog.sAlpheios, type: .info)
        #endif
        
        // If there is an info about authenticated users in the store, fetch it into an authInfo object
        self.fetchAuthInfo()
    }
    
    deinit {
        #if DEBUG
        os_log("Background process has been deinitialized", log: OSLog.sAlpheios, type: .info)
        #endif
    }
    
    // Core Data Saving and Undo support
    @IBAction func saveAction(_ sender: AnyObject?) {
        // Performs the save action for the application, which is to send the save: message to the application's managed object context. Any encountered errors are presented to the user.
        let context = persistentContainer.viewContext
        
        if !context.commitEditing() {
            NSLog("\(NSStringFromClass(type(of: self))) unable to commit editing before saving (app extension)")
        }
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                // Customize this code block to include application-specific recovery steps.
                let nserror = error as NSError
                NSApplication.shared.presentError(nserror)
            }
        }
    }
    
    func updateIcon(active: Bool, window: SFSafariWindow, embedLibActive: Bool) {
        window.getToolbarItem { toolbarItem in
            var icon = BackgroundProcess.browserIcons["nonactive"]
            
            if (active) {
                icon = BackgroundProcess.browserIcons["active"]
                toolbarItem?.setBadgeText("On") // Open book icon
                toolbarItem?.setLabel("Deactivate Alpheios Reading Tools")
            } else {
                toolbarItem?.setBadgeText("")
                if (embedLibActive) {
                    toolbarItem?.setLabel("(Alpheios Reading Tools Disabled For Page)")
                } else {
                    toolbarItem?.setLabel("Activate Alpheios Reading Tools")
                }
            }
            
            toolbarItem?.setImage(icon)
        }
    }
    
    // Returns a stored value of a TabScript or creates a new TabScript instance
    // if a stored value is not found
    func getTabScriptForPage(for page: SFSafariPage) -> TabScript {
        let hashValue = page.hashValue
        #if DEBUG
        os_log("getTabScriptForPage(), page hash value is %d, tabs size: %d", log: OSLog.sAlpheios, type: .info, hashValue, BackgroundProcess.tabs.count)
        #endif
        if (BackgroundProcess.tabs[hashValue] == nil) {
            #if DEBUG
            os_log("Tab script is not found in a list, creating a new one, hash value is %d", log: OSLog.sAlpheios, type: .info, hashValue)
            #endif
            let curPage = TabScript(for: page)
            BackgroundProcess.tabs[hashValue] = curPage
        }
        return BackgroundProcess.tabs[hashValue]!
    }
    
    func stringifiedAuthInfo () -> [String:String]? {
        guard let authInfoData = self.authInfo else {
            return nil
        }
        // Cast expiresIn to Date
        let expiresIn = authInfoData["expiresIn"] as! Date
        // Convert to a Unix time string (in whole seconds)
        let unixTime = expiresIn.timeIntervalSince1970
        return [
            "userId": authInfoData["userId"] as! String,
            "userName": authInfoData["userName"] as! String,
            "userNickname": authInfoData["userNickname"] as! String,
            "accessToken": authInfoData["accessToken"] as! String,
            "accessTokenExpiresIn": String(format: "%.0f", unixTime)
        ]
    }
    
    // Sends message to content script to update its state
    func setContentState(tab: TabScript, page: SFSafariPage) {
        let stateRequestMsg = StateRequest(body: tab.convertForMessage())
        
        let authInfo = self.stringifiedAuthInfo()
        if (authInfo != nil) {
            // Add authentication information to the message body if user has been logged in
            stateRequestMsg.body["authStatus"] = Message.authStatuses["logged_in"]
            stateRequestMsg.body.merge(authInfo!) { (current, _) in current }
        } else {
            stateRequestMsg.body["authStatus"] = Message.authStatuses["logged_out"]
        }
        page.dispatchMessageToScript(withName: "fromBackground", userInfo: stateRequestMsg.convertForMessage())
    }
    
    // Sends a message to all content scripts by iterating over the list of known TabScript objects.
    // Looks like it does not work because BackgroundProcess is destryed and recreated several times
    // during the Safari App Extension lifecycle. msgToAllWindows() is a viable alternative.
    func msgToAllScripts(message: Message) {
        let qty = BackgroundProcess.tabs.count
        #if DEBUG
        os_log("msgToAllScripts, tabs quantity is: %d", log: OSLog.sAlpheios, type: .info, qty)
        #endif
        for (hashValue, tab) in BackgroundProcess.tabs {
            #if DEBUG
            os_log("Checking a tab with a hash value of %@, tab ID is %d", log: OSLog.sAlpheios, type: .info, hashValue, tab.ID)
            #endif
            if (tab.safariPage != nil) {
                #if DEBUG
                os_log("Sending a message to a content script with hash value %d: %@", log: OSLog.sAlpheios, type: .info, hashValue, message as! CVarArg)
                #endif
                // Send message to the script on that page
                tab.safariPage?.dispatchMessageToScript(withName: "fromBackground", userInfo: message.convertForMessage())
            } else {
                // The page for this script does not exist any more
                // We should remove a tab script object too
                self.removeTabScript(hashValue: hashValue)
            }
        }
    }
    
    // Sends a message to all windows. Only activated content scripts will process it.
    func msgToAllWindows(message: Message) {
        #if DEBUG
        os_log("msgToAllWindows() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        SFSafariApplication.getAllWindows { (allWindows) in
            for window in allWindows {
                window.getAllTabs(completionHandler: { (allTabs) in
                    for tab in allTabs {
                        tab.getActivePage(completionHandler: { (activePage) in
                            #if DEBUG
                            os_log("Sending a %s message to a page with a hash value of %d", log: OSLog.sAlpheios, type: .info, message.type, activePage.hashValue)
                            #endif
                            activePage?.dispatchMessageToScript(withName: "fromBackground", userInfo: message.convertForMessage())
                        })
                    }
                })
            }
        }
    }
    
    // Sends a message to a tab script within an active tab
    func msgToActiveTabScript(message: Message) {
        #if DEBUG
        os_log("msgToActiveTabScript() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        SFSafariApplication.getActiveWindow { (activeWindow) in
            activeWindow!.getActiveTab(completionHandler: { (activeTab) in
                activeTab?.getActivePage(completionHandler: { (activePage) in
                    #if DEBUG
                    os_log("Sending a %s message to an active page, hash value is %d", log: OSLog.sAlpheios, type: .info, message.type, activePage.hashValue)
                    #endif
                    activePage?.dispatchMessageToScript(withName: "fromBackground", userInfo: message.convertForMessage())
                })
            })
        }
    }
    
    func removeTabScript(hashValue: Int) {
        #if DEBUG
        os_log("Removing an outdated tab script for the following hash value: %d", log: OSLog.sAlpheios, type: .info, hashValue)
        #endif
        BackgroundProcess.tabs.removeValue(forKey: hashValue)
    }
    
    // This version is used for activations made by a BackgroundProcess
    func activateContent(tab: TabScript, window: SFSafariWindow) {
        #if DEBUG
        os_log("Activate content by a background process", log: OSLog.sAlpheios, type: .info)
        #endif
        
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                if tab.status != TabScript.props["status_disabled"] {
                    self.setContentState(tab: tab, page: activePage!)
                    self.updateIcon(active: true, window: window, embedLibActive: tab.isEmbedLibActive)
                }
            })
        })
    }

   // This function is used for menu initiated activations
   func activateContent(page: SFSafariPage) {
        #if DEBUG
        os_log("Activate content by the menu", log: OSLog.sAlpheios, type: .info)
        #endif
        let curTab = self.getTabScriptForPage(for: page)
        curTab.activate()
        curTab.setTablDefault() // Reset tab value on deactivation
        self.setContentState(tab: curTab, page: page)
    }
    
    // This function is used for deactivations made by a BackgroundProcess
    func deactivateContent(tab: TabScript, window: SFSafariWindow) {
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                tab.setPanelDefault() // Reset panel state to a default
                tab.setTablDefault() // Reset tab value on deactivation
                self.setContentState(tab: tab, page: activePage!)
                self.updateIcon(active: false, window: window, embedLibActive: tab.isEmbedLibActive)
            })
        })
    }
    
    // This function is used for menu initiated deactivations
    func deactivateContent(page: SFSafariPage) {
        let curTab = self.getTabScriptForPage(for: page)
        curTab.deactivate()
        curTab.setPanelDefault() // Reset panel state to a default
        curTab.setTablDefault() // Reset tab value on deactivation
        self.setContentState(tab: curTab, page: page)
    }
    
    func openPanel(page: SFSafariPage) {
        let curTab = self.getTabScriptForPage(for: page)
        if curTab.isActive {
            curTab.setPanelOpen()
            self.setContentState(tab: curTab, page: page)
        }
    }
    
    func showInfo(page: SFSafariPage) {
        let curTab = self.getTabScriptForPage(for: page)
        if curTab.isActive {
            curTab.setShowInfo()
            self.setContentState(tab: curTab, page: page)
        }
    }
    
    // This method is called every time users clicks on an extension icon
    func changeActiveTabStatus(page: SFSafariPage, window: SFSafariWindow) {
        #if DEBUG
        os_log("changeActiveTabStatus() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        let curTab = self.getTabScriptForPage(for: page)

        // We cannot activate content script if it's disabled due to page incompatibility
        if ((curTab.embedLibStatus != TabScript.props["status_embed_lib_active"]) && (curTab.status != TabScript.props["status_disabled"])) {
            // Toggle a state active status
            curTab.changeActiveStatus()
            
            // Toggle an icon state
            if (curTab.isActive) {
                self.activateContent(tab: curTab, window: window)
            } else {
                curTab.setPanelDefault() // Reset panel state to a default
                curTab.setTablDefault() // Reset tab value on deactivation
                self.deactivateContent(tab: curTab, window: window)
            }
        }
    }
    
    // This method is called when we receive a "contentReady" message
    // It means that a new instance of content script is loaded and is ready to receive background commands
    func contentReadyHandler(tabdata: [String: Any]?, page: SFSafariPage) -> TabScript {
        #if DEBUG
        os_log("contentReadyHandler() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        var isNew:Bool = false
        let hashValue = page.hashValue
        if (BackgroundProcess.tabs[hashValue] == nil) {
            isNew = true
        }
        let curTab = self.getTabScriptForPage(for: page)
        if let messageBody = tabdata?["body"] as? Dictionary<String, Any> {
            let embedLibStatus = messageBody["embedLibStatus"] as? String
            if (embedLibStatus == TabScript.props["status_embed_lib_active"]) {
                // There is an embedded lib discoverd on a page
                curTab.setEmbedLibActive()
            } else {
                curTab.setEmbedLibInactive()
            }

            if (!isNew) {
                // This is a page reload of an existing tab. Send tab informtion to the content script
                let curTab = self.getTabScriptForPage(for: page)
                self.setContentState(tab: curTab, page: page)
                return curTab
            }
        }
        return curTab
    }
    
    // A notification that an active embedded library is found on a page
    func embedLibActiveHandler(tabdata: [String: Any]?, page: SFSafariPage) -> TabScript {
        #if DEBUG
        os_log("embedLibActiveHandler() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        let curTab = self.getTabScriptForPage(for: page)
        curTab.setEmbedLibActive()
        return curTab
    }
    
    // This method is called when we receive a state message from background
    // We need to use it to update a state of our tabdata object
    func updateTabData(tabdata: [String: Any]?, page: SFSafariPage) -> TabScript {
        #if DEBUG
        os_log("updateTabData() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        let curTab = self.getTabScriptForPage(for: page)
        if let messageBody = tabdata?["body"] as? Dictionary<String, Any> {
            curTab.updateWithData(data: messageBody)
        }
        return curTab
    }
    
    func checkToolbarIcon(page: SFSafariPage, window: SFSafariWindow) {
        #if DEBUG
        os_log("checkToolbarIcon() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        let curTab = self.getTabScriptForPage(for: page)

        if (curTab.isActive && curTab.isEmbedLibInactive) {
            self.updateIcon(active: true, window: window, embedLibActive: curTab.isEmbedLibActive)
        } else {
            self.updateIcon(active: false, window: window, embedLibActive: curTab.isEmbedLibActive)
        }
    }
    
    func checkContextMenuIconVisibility(command: String, page: SFSafariPage) -> Bool {
        #if DEBUG
        os_log("checkContextMenuIconVisibility() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        let curTab = self.getTabScriptForPage(for: page)
        // Hide this menu item if content script is disabled
        if (command == "Activate" && !curTab.isActive && curTab.isEmbedLibInactive) {
            return true
        }
        if (command == "Deactivate" && curTab.isActive && curTab.isEmbedLibInactive) {
            return true
        }
        
        if (command == "ShowInfo"  && curTab.isActive && !curTab.isPanelOpen && curTab.isEmbedLibInactive) {
            return true
        }
        
        if (command == "Disabled"  &&  curTab.isEmbedLibActive) {
            // Hide menu if embedded lib is active
            return true
        }
            
        return false
    }
    
    func login(authInfo: [String: Any]) {
        #if DEBUG
        os_log("login(): authentication has been completed", log: OSLog.sAlpheios, type: .info)
        #endif
        
        // Store user information in the BackgorundProcess object
        self.authInfo = authInfo
        self.updateAuthInfo()
        
        // self.authInfo is guaranteed be not nil at this moment
        let authInfo = self.stringifiedAuthInfo()!
        let loginMsg = LoginNtfyMessage(body: authInfo)
        #if DEBUG
        os_log("Login message has been built, ID is %s", log: OSLog.sAlpheios, type: .info, authInfo["userId"] ?? "Unknown")
        #endif
        self.msgToAllWindows(message: loginMsg)
    }
    
    func logout() {
        #if DEBUG
        os_log("User has been logged out", log: OSLog.sAlpheios, type: .info)
        #endif
        // Clear user auth info
        self.authInfo = nil
        // Delete auth info from a persistent storage
        self.deleteAuthInfo()
        // Send a logout message to all windows
        let logoutMsg = LogoutNtfyMessage(body: [String: String]())
        self.msgToAllWindows(message: logoutMsg)
    }
    
    // Opens a sign up page in a new window of Safari
    func createAccount() {
        #if DEBUG
        os_log("createAccount() in background script", log: OSLog.sAlpheios, type: .info)
        #endif
        
        guard let signUpUrlObj = URL(string: self.signUpUrl) else {
            os_log("Cannot create a URL object for the Auth0 sign up page", log: OSLog.sAlpheios, type: .error)
            return
        }
        SFSafariApplication.openWindow(with: signUpUrlObj, completionHandler: nil)
    }
    
    // It will update user auth info in a permanent storage with the latest one
    func updateAuthInfo() {
        #if DEBUG
        os_log("saveAuthInfo() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        guard let authInfo = self.authInfo else {
            os_log("Unable to save authInfo data becase an authInfo object does not exist", log: OSLog.sAlpheios, type: .error)
            return
        }

        // Obtain a managed context
        let managedContext = self.persistentContainer.viewContext
        // Create a fetch request to obtain existing information (if any exists)
        let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "AuthUser")
        do {
            // Retrieve existing AuthUser records
            let items = try managedContext.fetch(fetchRequest)

            for item in items {
                // Mark a record for deletion
                managedContext.delete(item)
                #if DEBUG
                os_log("Marking a stored AuthUser record for deletion", log: OSLog.sAlpheios, type: .info)
                #endif
            }
        } catch let error as NSError {
            os_log("Error while fetching existing AuthUser records for deletion: %@", log: OSLog.sAlpheios, type: .error, error)
        }
        
        // Obtain an entity description for an "AuthUser"
        let entity = NSEntityDescription.entity(forEntityName: "AuthUser", in: managedContext)!
        // Create a user object for insertion
        let user = NSManagedObject(entity: entity, insertInto: managedContext)
        // Assign user data
        if let id = authInfo["userId"] {
            #if DEBUG
            os_log("Storing the id value of %s", log: OSLog.sAlpheios, type: .info, id as! String)
            #endif
            user.setValue(id as! String, forKeyPath: "id")
        } else {
            os_log("%s is empty on save", log: OSLog.sAlpheios, type: .error, "id")
        }
        if let name = authInfo["userName"] {
            #if DEBUG
            os_log("Storing the name value of %s", log: OSLog.sAlpheios, type: .info, name as! String)
            #endif
            user.setValue(name as! String, forKeyPath: "name")
        } else {
            os_log("%s is empty on save", log: OSLog.sAlpheios, type: .error, "name")
        }
        if let nickname = authInfo["userNickname"] {
            #if DEBUG
            os_log("Storing the nickname value of %s", log: OSLog.sAlpheios, type: .info, nickname as! String)
            #endif
            user.setValue(nickname as! String, forKeyPath: "nickname")
        } else {
            os_log("%s is empty on save", log: OSLog.sAlpheios, type: .error, "nickname")
        }
        if let accessToken = authInfo["accessToken"] {
            #if DEBUG
            os_log("Storing the access token value of %s", log: OSLog.sAlpheios, type: .info, accessToken as! String)
            #endif
            user.setValue(accessToken as! String, forKeyPath: "accessToken")
        } else {
            os_log("%s is empty on save", log: OSLog.sAlpheios, type: .error, "accessToken")
        }
        if let expiresIn = authInfo["expiresIn"] {
            #if DEBUG
            let dateFormatterPrint = DateFormatter()
            dateFormatterPrint.dateFormat = "yyyy-MMM-dd HH:mm:ss"
            os_log("Storing the date %s", log: OSLog.sAlpheios, type: .info, dateFormatterPrint.string(from: expiresIn as! Date))
            #endif
            user.setValue(expiresIn as! Date, forKeyPath: "expiresIn")
        } else {
            os_log("%s is empty on save", log: OSLog.sAlpheios, type: .error, "expiresIn")
        }
        // Save the data
        do {
            try managedContext.save()
            #if DEBUG
            os_log("User data has been stored successfully from a background process", log: OSLog.sAlpheios, type: .info)
            #endif
        } catch let error as NSError {
            os_log("Cannot save user data: %@, %@", log: OSLog.sAlpheios, type: .info, error, error.userInfo)
        }
    }
    
    func fetchAuthInfo() {
        // Obtain a managed context
        let managedContext = self.persistentContainer.viewContext
        // Create a fetch request
        let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "AuthUser")
        
        do {
            // Check how many records are in the store
            let recordsInStore = try managedContext.count(for: fetchRequest)
            #if DEBUG
            os_log("Persistent store has %d user records", log: OSLog.sAlpheios, type: .info, recordsInStore)
            #endif
            
            // Returns an array of managed objects meeting the criteria specified by the fetch request
            let users = try managedContext.fetch(fetchRequest)
            for user in users {
                guard let userId = user.value(forKeyPath: "id") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "id")
                    return
                }
                guard let userName = user.value(forKeyPath: "name") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "name")
                    return
                }
                guard let userNickname = user.value(forKeyPath: "nickname") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "nickname")
                    return
                }
                guard let accessToken = user.value(forKeyPath: "accessToken") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "accessToken")
                    return
                }
                guard let expiresIn = user.value(forKeyPath: "expiresIn") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "expiresIn")
                    return
                }
                
                let now = Date()
                if ((expiresIn as! Date) < now) {
                    os_log("An access token has been expired and will be purged from the store", log: OSLog.sAlpheios, type: .info)
                    self.deleteAuthInfo()
                    return
                }
                
                self.authInfo = [:]
                self.authInfo?["userId"] = userId as? String ?? ""
                self.authInfo?["userName"] = userName as? String ?? ""
                self.authInfo?["userNickname"] = userNickname as? String ?? ""
                self.authInfo?["accessToken"] = accessToken as? String ?? ""
                self.authInfo?["expiresIn"] = expiresIn as? Date ?? nil
            }
            
        } catch let error as NSError {
            os_log("Could not fetch user authentication data. %@, %@", log: OSLog.sAlpheios, type: .error, error, error.userInfo)
        }
    }
    
    func deleteAuthInfo() {
        let managedContext = self.persistentContainer.viewContext
        
        let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "AuthUser")
        
        do {
            let items = try managedContext.fetch(fetchRequest)
            
            for item in items {
                managedContext.delete(item)
                #if DEBUG
                os_log("Marking a stored AuthUser record for deletion", log: OSLog.sAlpheios, type: .info)
                #endif
            }
            
            // Save the data changes
            do {
                try managedContext.save()
                #if DEBUG
                os_log("A user data deletion has been stored successfully", log: OSLog.sAlpheios, type: .info)
                #endif
            } catch let error as NSError {
                os_log("Cannot store a user data deletion: %@, %@", log: OSLog.sAlpheios, type: .info, error, error.userInfo)
            }
            #if DEBUG
            os_log("Saving changes to disk", log: OSLog.sAlpheios, type: .info)
            #endif
            
        } catch let error as NSError {
            os_log("Error during user info deletion: %@", log: OSLog.sAlpheios, type: .error, error)
        }
    }
}
