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
    let backgroundProcess: BackgroundProcess = BackgroundProcess()
    // let managedContext = SFSafariApplication.persistentContainer.viewContext
    
    override init() {
        #if DEBUG
        os_log("SafariExtensionHandler has been created", log: OSLog.sAuth, type: .info)
        #endif
    }

    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        let hashValue = page.hashValue
        
        if (messageName == "contentReady") {
            // A page in a tab has been reloaded
            _ = self.backgroundProcess.contentReadyHandler(tabdata: userInfo, page: page)
            SFSafariApplication.setToolbarItemsNeedUpdate()
            #if DEBUG
            os_log("Recieved a contentReady message from a content script, hash value is %d", log: OSLog.sAuth, type: .info, hashValue)
            #endif
        } else if (messageName == "embedLibActive") {
            // A notification about an active embedded lib
            _ = self.backgroundProcess.embedLibActiveHandler(tabdata: userInfo, page: page)
            SFSafariApplication.setToolbarItemsNeedUpdate()
            #if DEBUG
            os_log("Recieved an embedLibActive message from a content script, hash value is %d", log: OSLog.sAuth, type: .info, hashValue)
            #endif
        } else if (messageName == "updateState") {
            // This is a state update message
            _ = self.backgroundProcess.updateTabData(tabdata: userInfo, page: page)
            #if DEBUG
            os_log("Recieved an updateState message from a content script, hash value is %d", log: OSLog.sAuth, type: .info, hashValue)
            #endif
        } else if (messageName == "ping") {
            // This is a ping message to keep extension alive
        }
    }
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        // This method will be called when your toolbar item is clicked.
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                activePage?.getPropertiesWithCompletionHandler { properties in
                    self.backgroundProcess.changeActiveTabStatus(page: activePage!, window: window)
                }
            })
        })
        
    }
    
    override func messageReceivedFromContainingApp(withName messageName: String, userInfo: [String : Any]? = nil) {
        #if DEBUG
        os_log("Message from a containing app: \"%@\"", log: OSLog.sAuth, type: .info,  messageName)
        #endif
        
        if (messageName == "UserLogin") {
            let authData = userInfo!
            self.backgroundProcess.login(authData: authData)
        } else if (messageName == "UserLogout") {
            self.backgroundProcess.logout()
        }
        
        
    }
    
    override func contextMenuItemSelected(withCommand command: String, in page: SFSafariPage, userInfo: [String : Any]? = nil) {
        if command == "OpenPanel" {
            self.backgroundProcess.openPanel(page: page)
        }
        if command == "ShowInfo" {
            self.backgroundProcess.showInfo(page: page)
        }
        if command == "Activate" {
            self.backgroundProcess.activateContent(page: page)
            SFSafariApplication.setToolbarItemsNeedUpdate()
        }
        if command == "Deactivate" {
            self.backgroundProcess.deactivateContent(page: page)
            SFSafariApplication.setToolbarItemsNeedUpdate()
        }
        
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        // print("*********validate toolbar icon**************")
        
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                self.backgroundProcess.checkToolbarIcon(page: activePage!, window: window)
                validationHandler(true, "")
            })
        })
    }
    
    override func validateContextMenuItem(withCommand command: String, in page: SFSafariPage, userInfo: [String : Any]? = nil, validationHandler: @escaping (Bool, String?) -> Void) {
        // print("validateContextMenuItem start", page.hashValue)
 
        // print("validateContextMenuItem inside")
        let check = self.backgroundProcess.checkContextMenuIconVisibility(command: command, page: page)
        // print("validateContextMenuItem", check)
        validationHandler(!check, nil)

    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }
}
