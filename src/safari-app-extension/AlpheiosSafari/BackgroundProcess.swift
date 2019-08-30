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
    
    // An object for testing a retrieval of users
    var users: [NSManagedObject] = []
    
    // MARK: - Core Data stack
    
    lazy var persistentContainer: NSCustomPersistentContainer = {
        /*
         The persistent container for the application. This implementation
         creates and returns a container, having loaded the store for the
         application to it. This property is optional since there are legitimate
         error conditions that could cause the creation of the store to fail.
         */
    
        let container = NSCustomPersistentContainer(name: "AlpheiosSafariExtension")
        #if DEBUG
        os_log("Created a persistent \"%@\" container", log: OSLog.sAuth, type: .info, container.name)
        #endif
        container.loadPersistentStores(completionHandler: { (storeDescription, error) in
            if let error = error as NSError? {
                // Replace this implementation with code to handle the error appropriately.
                // fatalError() causes the application to generate a crash log and terminate. You should not use this function in a shipping application, although it may be useful during development.
                
                /*
                 Typical reasons for an error here include:
                 * The parent directory does not exist, cannot be created, or disallows writing.
                 * The persistent store is not accessible, due to permissions or data protection when the device is locked.
                 * The device is out of space.
                 * The store could not be migrated to the current model version.
                 Check the error message to determine what the actual problem was.
                 */
                os_log("Load persistent store error: %@, %@", log: OSLog.sAuth, type: .error, error, error.userInfo)
                fatalError("Unresolved error \(error), \(error.userInfo)")
            } else {
                #if DEBUG
                os_log("Persistent store has been loaded successfully", log: OSLog.sAuth, type: .info, container.name)
                #endif
            }
        })
        return container
    }()
    
    // MARK: - Core Data Saving and Undo support
    
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
    // if stored value is not found
    func getTabFromTabsByHash(hashValue: Int) -> TabScript {
        if (BackgroundProcess.tabs[hashValue] == nil) {
            let curPage = TabScript(hashValue: hashValue)
            BackgroundProcess.tabs[hashValue] = curPage
        }
        return BackgroundProcess.tabs[hashValue]!
    }
    
    // Sends message to content script to update its state
    func setContentState(tab: TabScript, page: SFSafariPage) {
        let stateRequestMess = StateRequest(body: tab.convertForMessage())
        page.dispatchMessageToScript(withName: "fromBackground", userInfo: stateRequestMess.convertForMessage())
    }
    
    // This version is used for activations made by a BackgroundProcess
    func activateContent(tab: TabScript, window: SFSafariWindow) {
        #if DEBUG
        os_log("Activate content by a background process", log: OSLog.sAuth, type: .info)
        #endif
        
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(self.authEventDidHappen), name: .AlpheiosAuthEvent, object: nil)
        
        #if DEBUG
        os_log("Auth notification observer has been added", log: OSLog.sAuth, type: .info)
        #endif
        
        DistributedNotificationCenter.default().postNotificationName(.AlpheiosAuthEvent, object: nil, userInfo: nil, deliverImmediately: false)
        
        #if DEBUG
        os_log("Auth notification has been dispatched", log: OSLog.sAuth, type: .info)
        #endif
        
        // Check the persistent store
//        self.fetchUsers()
        
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                if tab.status != TabScript.props["status_disabled"] {
                    self.setContentState(tab: tab, page: activePage!)
                    self.updateIcon(active: true, window: window, embedLibActive: tab.isEmbedLibActive)
                }
            })
        })
        
        // Storing user data to verify callbacks
//        self.saveAuthUser(email: "test@test.com", authenticated: true)
    }
    
    @objc func authEventDidHappen(notification: NSNotification){
        #if DEBUG
        os_log("Auth event callback", log: OSLog.sAuth, type: .info)
        #endif
    }

   // This function is used for menu initiated activations
   func activateContent(page: SFSafariPage) {
        #if DEBUG
        os_log("Activate content by the menu", log: OSLog.sAuth, type: .info)
        #endif
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)
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
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)
        curTab.deactivate()
        curTab.setPanelDefault() // Reset panel state to a default
        curTab.setTablDefault() // Reset tab value on deactivation
        self.setContentState(tab: curTab, page: page)
    }
    
    func openPanel(page: SFSafariPage) {
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)
        if curTab.isActive {
            curTab.setPanelOpen()
            self.setContentState(tab: curTab, page: page)
        }
    }
    
    func showInfo(page: SFSafariPage) {
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)
        if curTab.isActive {
            curTab.setShowInfo()
            self.setContentState(tab: curTab, page: page)
        }
    }
    
    // This method is called every time users clicks on an extension icon
    func changeActiveTabStatus(page: SFSafariPage, window: SFSafariWindow) {
        #if DEBUG
        os_log("changeActiveTabStatus", log: OSLog.sAuth, type: .info)
        #endif
        let curTab = self.getTabFromTabsByHash(hashValue: (page.hashValue))

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
    func contentReadyHandler(hashValue: Int, tabdata: [String: Any]?, page: SFSafariPage) -> TabScript {
        var isNew:Bool = false
        if (BackgroundProcess.tabs[hashValue] == nil) {
            isNew = true
        }
        let curTab = self.getTabFromTabsByHash(hashValue: hashValue)
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
                let curTab = self.getTabFromTabsByHash(hashValue: hashValue)
                self.setContentState(tab: curTab, page: page)
                return curTab
            }
        }
        return curTab
    }
    
    // A notification that an active embedded library is found on a page
    func embedLibActiveHandler(hashValue: Int, tabdata: [String: Any]?, page: SFSafariPage) -> TabScript {
        let curTab = self.getTabFromTabsByHash(hashValue: hashValue)
        curTab.setEmbedLibActive()
        return curTab
    }
    
    // This method is called when we receive a state message from background
    // We need to use it to update a state of our tabdata object
    func updateTabData(hashValue: Int, tabdata: [String: Any]?, page: SFSafariPage) -> TabScript {
        let curTab = self.getTabFromTabsByHash(hashValue: hashValue)
        if let messageBody = tabdata?["body"] as? Dictionary<String, Any> {
            curTab.updateWithData(data: messageBody)
        }
        return curTab
    }
    
    func checkToolbarIcon(page: SFSafariPage, window: SFSafariWindow) {
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)

        if (curTab.isActive && curTab.isEmbedLibInactive) {
            self.updateIcon(active: true, window: window, embedLibActive: curTab.isEmbedLibActive)
        } else {
            self.updateIcon(active: false, window: window, embedLibActive: curTab.isEmbedLibActive)
        }
    }
    
    func checkContextMenuIconVisibility(command: String, hashValue: Int) -> Bool {
        let curTab = self.getTabFromTabsByHash(hashValue: hashValue)
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
    
    func authHasBeenCompleted(authData: [String: Any]) {
        #if DEBUG
        os_log("Authentication has been completed", log: OSLog.sAuth, type: .info)
        #endif
        
        SFSafariApplication.getActiveWindow { (activeWindow) in
            activeWindow!.getActiveTab(completionHandler: { (activeTab) in
                activeTab?.getActivePage(completionHandler: { (activePage) in
                    let stateRequestMess = StateMessage(body: ["email": authData["email"] as! String])
                    activePage?.dispatchMessageToScript(withName: "authEvent", userInfo: stateRequestMess.convertForMessage())
                })
            })
        }
    }
    
    func saveAuthUser(email: String, authenticated: Bool) {
        
        // 1
        let managedContext = self.persistentContainer.viewContext
        
        // 2
        let entity =
            NSEntityDescription.entity(forEntityName: "AuthUser", in: managedContext)!
        
        let user = NSManagedObject(entity: entity, insertInto: managedContext)
        
        // 3
        user.setValue(email, forKeyPath: "email")
        user.setValue(authenticated, forKeyPath: "authenticated")
        
        // 4
        do {
            try managedContext.save()
            // authUsers.append(user)
            #if DEBUG
            os_log("User data has been stored successfully", log: OSLog.sAuth, type: .info)
            #endif
        } catch let error as NSError {
            os_log("Cannot save user data: %@, %@", log: OSLog.sAuth, type: .info, error, error.userInfo)
        }
    }
    
    func fetchUsers() {
        /*Before you can do anything with Core Data, you need a managed object context. */
        let managedContext = self.persistentContainer.viewContext
        
        /*As the name suggests, NSFetchRequest is the class responsible for fetching from Core Data.
         
         Initializing a fetch request with init(entityName:), fetches all objects of a particular entity. This is what you do here to fetch all Person entities.
         */
        let fetchRequest = NSFetchRequest<NSManagedObject>(entityName: "AuthUser")
        
        /*You hand the fetch request over to the managed object context to do the heavy lifting. fetch(_:) returns an array of managed objects meeting the criteria specified by the fetch request.*/
        do {
            // Check how many records are in the store
            let recordsInStore = try managedContext.count(for: fetchRequest)
            #if DEBUG
            os_log("Persistent store has %d user records", log: OSLog.sAuth, type: .info, recordsInStore)
            #endif
            
            users = try managedContext.fetch(fetchRequest)
            #if DEBUG
            os_log("Retrieved %d user records from a persisten store", log: OSLog.sAuth, type: .info, users.count)
            #endif
        } catch let error as NSError {
            os_log("Could not fetch. %@, %@", log: OSLog.sAuth, type: .error, error, error.userInfo)
        }
        
    }
}
