//
//  content-process.swift
//  AlpheiosSafariV2
//
//  Created by Irina Sklyarova on 13/09/2018.
//  Copyright © 2018 Irina Sklyarova. All rights reserved.
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
    
    func setContentState(tab: TabScript, page: SFSafariPage) {
        let stateRequestMess = StateRequest(body: tab.convertForMessage())
        page.dispatchMessageToScript(withName: "fromBackground", userInfo: stateRequestMess.convertForMessage())
    }
    
    func activateContent(tab: TabScript, window: SFSafariWindow) {
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                self.setContentState(tab: tab, page: activePage!)
                self.updateIcon(active: true, window: window)
            })
        })
    }
    
   func activateContent(page: SFSafariPage) {
        let curTab = self.getTabFromTabsByHash(hashValue: page.hashValue)
        curTab.activate()
        self.setContentState(tab: curTab, page: page)
    }
    
    func deactivateContent(tab: TabScript, window: SFSafariWindow) {
        window.getActiveTab(completionHandler: { (activeTab) in
            activeTab?.getActivePage(completionHandler: { (activePage) in
                self.setContentState(tab: tab, page: activePage!)
                self.updateIcon(active: false, window: window)
            })
        })
    }
    
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
    
    func changeActiveTabStatus(page: SFSafariPage, window: SFSafariWindow) {
        let curTab = self.getTabFromTabsByHash(hashValue: (page.hashValue))

        curTab.changeActiveStatus()
        
        if (curTab.isActive) {
            self.activateContent(tab: curTab, window: window)
        } else {
            self.deactivateContent(tab: curTab, window: window)
        }
    }
    
    func updateTabData(hashValue: Int, tabdata: [String: Any]?, page: SFSafariPage) -> TabScript {
        let curTab = self.getTabFromTabsByHash(hashValue: hashValue)
        if let bodyUserInfo = tabdata?["body"] as? Dictionary<String, Any> {
            if bodyUserInfo["status"] as! String != "Alpheios_Status_Active" && curTab.isActive {
                self.reactivate(tab: curTab, page: page)
            } else {
                curTab.updateWithData(data: bodyUserInfo)
            }

        }
        // print("curTab", curTab.convertForMessage())
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
        if (command == "Activate" && !curTab.isActive) {
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
