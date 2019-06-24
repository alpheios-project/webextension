//
//  content-process.swift
//  AlpheiosSafariV2
//
//  Created by Irina Sklyarova on 13/09/2018.
//  Copyright © 2018 The Alpheios Project Ltd
//
import SafariServices

class BackgroundProcess {
    static let browserIcons: [String: NSImage] = [
        "active": NSImage.init(named: "alpheios.pdf")!,
        "nonactive": NSImage.init(named: "alpheios.pdf")!
    ]
    
    static var tabs: [Int: TabScript] = [:]
    
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
}
