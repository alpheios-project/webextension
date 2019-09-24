//
//  SafariExtensionHandler.swift
//  AlpheiosSafariV2
//
//  Created by Irina Sklyarova on 11/09/2018.
//  Copyright © 2018 The Alpheios Project, Ltd.
//

import SafariServices.SFSafariApplication
import os.log

class SafariExtensionHandler: SFSafariExtensionHandler {
    // There can be multiple instances of SafariExtensionHandler created for the same extension
    // In order to have BackgroundProcess shared across them, it must be a singleton
    // backgroundProcess will be instantiated lazily as thi si a default
    static let backgroundProcess: BackgroundProcess = BackgroundProcess()
    // let managedContext = SFSafariApplication.persistentContainer.viewContext
    
    override init() {
        #if DEBUG
        os_log("SafariExtensionHandler has been initialized", log: OSLog.sAlpheios, type: .info)
        #endif
    }
    
    deinit {
        #if DEBUG
        os_log("SafariExtensionHandler has been deinitialized", log: OSLog.sAlpheios, type: .info)
        #endif
    }
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        let hashValue = page.hashValue
        
        if (messageName == "contentReady") {
            // A page in a tab has been reloaded
            _ = SafariExtensionHandler.backgroundProcess.contentReadyHandler(tabdata: userInfo, page: page)
            SFSafariApplication.setToolbarItemsNeedUpdate()
            #if DEBUG
            os_log("Recieved a contentReady message from a content script, hash value is %d", log: OSLog.sAlpheios, type: .info, hashValue)
            #endif
        } else if (messageName == "embedLibActive") {
            // A notification about an active embedded lib
            _ = SafariExtensionHandler.backgroundProcess.embedLibActiveHandler(tabdata: userInfo, page: page)
            SFSafariApplication.setToolbarItemsNeedUpdate()
            #if DEBUG
            os_log("Recieved an embedLibActive message from a content script, hash value is %d", log: OSLog.sAlpheios, type: .info, hashValue)
            #endif
        } else if (messageName == "updateState") {
            // This is a state update message
            _ = SafariExtensionHandler.backgroundProcess.updateTabData(tabdata: userInfo, page: page)
            #if DEBUG
            os_log("Recieved an updateState message from a content script, hash value is %d", log: OSLog.sAlpheios, type: .info, hashValue)
            #endif
        } else if (messageName == "ping") {
            // This is a ping message to keep an extension alive
        }
    }
    
    // This method will be called when your toolbar item is clicked.
    override func toolbarItemClicked(in window: SFSafariWindow) {
        #if DEBUG
        os_log("toolbarItemClicked() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                activePage?.getPropertiesWithCompletionHandler { properties in
                    SafariExtensionHandler.backgroundProcess.changeActiveTabStatus(page: activePage!, window: window)
                }
            })
        })
    }
    
    override func messageReceivedFromContainingApp(withName messageName: String, userInfo: [String : Any]? = nil) {
        #if DEBUG
        os_log("Message from a containing app: \"%@\"", log: OSLog.sAlpheios, type: .info,  messageName)
        #endif
        
        if (messageName == "UserLogin") {
            let authData = userInfo!
            SafariExtensionHandler.backgroundProcess.login(authInfo: authData)
        } else if (messageName == "UserLogout") {
            SafariExtensionHandler.backgroundProcess.logout()
        } else if (messageName == "CreateAccount") {
            SafariExtensionHandler.backgroundProcess.createAccount()
        }
        
        
    }
    
    override func contextMenuItemSelected(withCommand command: String, in page: SFSafariPage, userInfo: [String : Any]? = nil) {
        if command == "OpenPanel" {
            SafariExtensionHandler.backgroundProcess.openPanel(page: page)
        }
        if command == "ShowInfo" {
            SafariExtensionHandler.backgroundProcess.showInfo(page: page)
        }
        if command == "Activate" {
            SafariExtensionHandler.backgroundProcess.activateContent(page: page)
            SFSafariApplication.setToolbarItemsNeedUpdate()
        }
        if command == "Deactivate" {
            SafariExtensionHandler.backgroundProcess.deactivateContent(page: page)
            SFSafariApplication.setToolbarItemsNeedUpdate()
        }
    }
    
    
    // This method is called when Safari's state is changed in some way that would require the extension's toolbar button state to be revalidated
    // Validation handler
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        #if DEBUG
        os_log("validateToolbarItem() has been called", log: OSLog.sAlpheios, type: .info)
        #endif
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                SafariExtensionHandler.backgroundProcess.checkToolbarIcon(page: activePage!, window: window)
                validationHandler(true, "")
            })
        })
    }
    
    override func validateContextMenuItem(withCommand command: String, in page: SFSafariPage, userInfo: [String : Any]? = nil, validationHandler: @escaping (Bool, String?) -> Void) {
        let check = SafariExtensionHandler.backgroundProcess.checkContextMenuIconVisibility(command: command, page: page)
        validationHandler(!check, nil)
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }
}
