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
    // Holds auth data of a user
    var authData = AuthData()
    
    lazy var props:[String:AnyObject] = readAlpheiosData()
    
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
    
    // Sends message to content script to update its state
    func setContentState(tab: TabScript, page: SFSafariPage) {
        let stateRequestMsg = StateRequest(body: tab.convertForMessage())
        
        let authInfo = authData.toStringDict()
//        if (authInfo != nil) {
//            // Add authentication information to the message body if user has been logged in
//            stateRequestMsg.body["authStatus"] = Message.authStatuses["logged_in"]
//            stateRequestMsg.body.merge(authInfo!) { (current, _) in current }
//        } else {
//            stateRequestMsg.body["authStatus"] = Message.authStatuses["logged_out"]
//        }
        stateRequestMsg.body.merge(authInfo) { (current, _) in current }
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
    
    func loginHandler(authMsg: [String: Any], page: SFSafariPage) {
        #if DEBUG
        os_log("loginHandler() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        
        let msgType = authMsg["type"] as! String
        #if DEBUG
        os_log("Message type is %s", log: OSLog.sAlpheios, type: .info, msgType)
        #endif
        
        if let messageBody = authMsg["body"] as? Dictionary<String, Any> {
            authData.updateFromLogin(msgBody: messageBody)
//            let msgBody = messageBody
//            #if DEBUG
//            os_log("Message body is available", log: OSLog.sAlpheios, type: .info)
//            #endif
//            let accessToken = messageBody["accessToken"] as! String
//            #if DEBUG
//            os_log("Acess token is %s", log: OSLog.sAlpheios, type: .info, accessToken)
//            #endif
//
//            let unixExpirationDT = messageBody["expirationDateTime"] as! Int
//            #if DEBUG
//            os_log("unixExpirationDT is %d", log: OSLog.sAlpheios, type: .info, unixExpirationDT)
//            #endif
//            let expiresIn = Date(timeIntervalSince1970: TimeInterval(unixExpirationDT))
//            #if DEBUG
//            let dateFormatterPrint = DateFormatter()
//            dateFormatterPrint.dateFormat = "yyyy-MMM-dd HH:mm:ss"
//            os_log("Authenticated successfully, expiration date is %s", log: OSLog.sAlpheios, type: .info, dateFormatterPrint.string(from: expiresIn))
//            #endif
//
//            let authInfo = [
//                "userId": msgBody["userId"] as! String,
//                "userName": msgBody["userName"] as! String,
//                "userNickname": msgBody["userNickname"] as! String,
//                "accessToken": accessToken,
//                "expiresIn": expiresIn
//                ] as [String : Any]
//
//            self.authInfo = authInfo


            // Update auth data in a persistent storage
            self.updateAuthInfo()
            let authInfoMsg = authData.toStringDict()
            let loginMsg = LoginNtfyMessage(body: authInfoMsg)
            #if DEBUG
            os_log("Login message has been built, ID is %s", log: OSLog.sAlpheios, type: .info, authInfoMsg["userId"] ?? "undefined")
            #endif
            self.msgToAllWindows(message: loginMsg)
            
        } else {
            #if DEBUG
            os_log("Cannot obtain a message body", log: OSLog.sAlpheios, type: .error)
            #endif
        }
    }
    
    func logoutHandler(authMsg: [String: Any]) {
        #if DEBUG
        os_log("User has been logged out", log: OSLog.sAlpheios, type: .info)
        #endif
        if let messageBody = authMsg["body"] as? Dictionary<String, Any> {
            // In case of logout due to session expiration
            // there can be multiple logout messages from various pages
            // sent almost at once. We shall ignore all but the first one.
            if (authData.isAuthenticated == true) {
                // User has been looged in previously
                authData.updateFromLogout(msgBody: messageBody)
                
                // Update auth data in a persistent storage
                self.updateAuthInfo()
                
                let authInfoMsg = authData.toStringDict()
                // Send a logout message to all windows
                let logoutMsg = LogoutNtfyMessage(body: authInfoMsg)
                self.msgToAllWindows(message: logoutMsg)
            }
        } else {
            #if DEBUG
            os_log("Cannot obtain a body of a logout message. This message will be ignored", log: OSLog.sAlpheios, type: .error)
            #endif
        }
    }
    
    // It will update user auth info in a permanent storage with the latest one
    func updateAuthInfo() {
        #if DEBUG
        os_log("saveAuthInfo() has been called", log: OSLog.sAlpheios, type: .info)
        #endif

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
                os_log("Marking a stored AuthUser record for deletion during update", log: OSLog.sAlpheios, type: .info)
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
        #if DEBUG
        os_log("Storing the isAuthenticated: %s", log: OSLog.sAlpheios, type: .info, authData.isAuthenticated.description)
        #endif
        user.setValue(authData.isAuthenticated, forKeyPath: "isAuthenticated")
        
        #if DEBUG
        os_log("Storing the accessToken: %s", log: OSLog.sAlpheios, type: .info, authData.accessToken)
        #endif
        user.setValue(authData.accessToken, forKeyPath: "accessToken")

        #if DEBUG
        let dateFormatterPrint = DateFormatter()
        dateFormatterPrint.dateFormat = "yyyy-MMM-dd HH:mm:ss"
        os_log("Storing the date %s", log: OSLog.sAlpheios, type: .info, dateFormatterPrint.string(from: authData.expirationDateTime))
        #endif
        user.setValue(authData.expirationDateTime, forKeyPath: "expirationDateTime")
        
        #if DEBUG
        os_log("Storing the hasSessionExpired: %s", log: OSLog.sAlpheios, type: .info, authData.hasSessionExpired.description)
        #endif
        user.setValue(authData.hasSessionExpired, forKeyPath: "hasSessionExpired")
        
        #if DEBUG
        os_log("Storing the user id: %s", log: OSLog.sAlpheios, type: .info, authData.userId)
        #endif
        user.setValue(authData.userId, forKeyPath: "userId")
        
        #if DEBUG
        os_log("Storing the user name: %s", log: OSLog.sAlpheios, type: .info, authData.userName)
        #endif
        user.setValue(authData.userName, forKeyPath: "userName")
        
        #if DEBUG
        os_log("Storing the user nickname: %s", log: OSLog.sAlpheios, type: .info, authData.userNickname)
        #endif
        user.setValue(authData.userNickname, forKeyPath: "userNickname")
        
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
                guard let isAuthenticated = user.value(forKeyPath: "isAuthenticated") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "isAuthenticated")
                    return
                }
                guard let accessToken = user.value(forKeyPath: "accessToken") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "accessToken")
                    return
                }
                guard let expirationDateTime = user.value(forKeyPath: "expirationDateTime") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "expirationDateTime")
                    return
                }
                guard let hasSessionExpired = user.value(forKeyPath: "hasSessionExpired") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "hasSessionExpired")
                    return
                }
                guard let userId = user.value(forKeyPath: "userId") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "userId")
                    return
                }
                guard let userName = user.value(forKeyPath: "userName") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "userName")
                    return
                }
                guard let userNickname = user.value(forKeyPath: "userNickname") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "userNickname")
                    return
                }
                
                self.authData = AuthData()
                self.authData.isAuthenticated = isAuthenticated as! Bool
                self.authData.accessToken = accessToken as! String
                self.authData.expirationDateTime = expirationDateTime as! Date
                self.authData.hasSessionExpired = hasSessionExpired as! Bool
                self.authData.userId = userId as! String
                self.authData.userName = userName as! String
                self.authData.userNickname = userNickname as! String
                
                
                let now = Date()
                if (self.authData.expirationDateTime < now) {
                    os_log("An access token has expired", log: OSLog.sAlpheios, type: .info)
                    if (self.authData.isAuthenticated) {
                        // If user has been authenticated previously, mark session as expired
                        self.authData.expireSession()
                    }
                    // self.deleteAuthInfo()
                    return
                }
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
