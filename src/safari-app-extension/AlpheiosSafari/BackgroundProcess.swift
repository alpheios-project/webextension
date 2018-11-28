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
    
    func updateIcon(active: Bool, window: SFSafariWindow) {
        window.getToolbarItem { toolbarItem in
            var icon = BackgroundProcess.browserIcons["nonactive"]
            
            if (active) {
                icon = BackgroundProcess.browserIcons["active"]
                toolbarItem?.setBadgeText("\u{1f4d6}") // Open book icon
                toolbarItem?.setLabel("Deactivate Alpheios")
            } else {
                toolbarItem?.setBadgeText("")
                toolbarItem?.setLabel("Activate Alpheios")
            }
            
            toolbarItem?.setImage(icon)
        }
    }
    
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
                    self.updateIcon(active: true, window: window)
                }
            })
        })
    }

   // This version is used for menu initiated activations
   func activateContent(page: SFSafariPage) {
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)
        curTab.activate()
        self.setContentState(tab: curTab, page: page)
    }
    
    // This version is used for deactivations made by a BackgroundProcess
    func deactivateContent(tab: TabScript, window: SFSafariWindow) {
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                self.setContentState(tab: tab, page: activePage!)
                self.updateIcon(active: false, window: window)
            })
        })
    }
    
    // This version is used for menu initiated deactivations
    func deactivateContent(page: SFSafariPage) {
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)
        curTab.deactivate()
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
        if (curTab.status != TabScript.props["status_disabled"]) {
            // Toggle a state active status
            curTab.changeActiveStatus()
            
            // Do not act
            if (curTab.isActive) {
                self.activateContent(tab: curTab, window: window)
            } else {
                self.deactivateContent(tab: curTab, window: window)
            }
        }
    }
    
    // This method is called when we receive a state message from background
    // We need to use it to update a state of our tabdata object
    func updateTabData(hashValue: Int, tabdata: [String: Any]?, page: SFSafariPage) -> TabScript {
        let curTab = self.getTabFromTabsByHash(hashValue: hashValue)
        if let messageBody = tabdata?["body"] as? Dictionary<String, Any> {
            // If we receive a request with a "PENDING" status and we already have stat of same tab stored
            // then it is a page reload and we should restore its state to what it was before reloading.
            // In this case we don't need to update a tab status, but send a request to update
            // content state to what it was before reloading.
            let status = messageBody["status"] as? String
            if status == TabScript.props["status_pending"] {
                // Tab content has been loaded
                let storedStatus = curTab.status
                if storedStatus != "" {
                    // Since we do have a stored state of a tab, this is a reload, not a new tab load.
                    // We will send a state message to content so it will update its state
                    // to what we have been stored by the background.
                    self.setContentState(tab: curTab, page: page)
                }
            } else {
                curTab.updateWithData(data: messageBody)
            }
        }
        return curTab
    }
    
    func reactivate(tab: TabScript, page: SFSafariPage) {
        self.setContentState(tab: tab, page: page)
    }
    
    func checkToolbarIcon(page: SFSafariPage, window: SFSafariWindow) {
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)

        if (curTab.isActive) {
            self.updateIcon(active: true, window: window)
        } else {
            self.updateIcon(active: false, window: window)
        }
    }
    
    func checkContextMenuIconVisibility(command: String, hashValue: Int) -> Bool {
        let curTab = self.getTabFromTabsByHash(hashValue: hashValue)
        // Hide this menu item if content script is disabled
        if (command == "Activate" && !curTab.isActive && curTab.status != TabScript.props["status_disabled"]) {
            return true
        }
        if (command == "Deactivate" && curTab.isActive) {
            return true
        }
        if (command == "OpenPanel" && curTab.isActive && !curTab.isPanelOpen) {
            return true
        }
        if (command == "ShowInfo"  && curTab.isActive && !curTab.isPanelOpen) {
            return true
        }
            
        return false
    }
}
