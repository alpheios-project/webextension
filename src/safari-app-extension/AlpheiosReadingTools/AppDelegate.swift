//
//  AppDelegate.swift
//  AlpheiosV2
//
//  Created by Irina Sklyarova on 11/09/2018.
//  Copyright © 2018 The Alpheios Project, Ltd.
//

import Cocoa
import SafariServices
import os.log
import CoreData
import Auth0

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

    @IBOutlet weak var window: NSWindow!
    @IBOutlet weak var headerLabel: NSTextField!
    @IBOutlet weak var mainIcon: NSImageView!
    @IBOutlet weak var helloText: NSTextField!
    @IBOutlet weak var usernameTextInput: NSTextField!
    @IBOutlet weak var passwordTextInput: NSSecureTextField!
    @IBOutlet weak var authText: NSTextField!
    
    let headerText: String = "Alpheios Reading Tools"
    let headerIcon: NSImage! = NSImage.init(named: "AppIcon")
    
    let littleIconInHelloText: NSImage! = NSImage.init(named: "alpheios_black_32_inverted")
    
    let headerFontSize: CGFloat = 21
    let headerFontName: String = "Arial Bold"
    let headerColor: [String: CGFloat] = ["r": 62, "g": 141, "b": 156] // #3e8d9c
    
    let currentFontSize: CGFloat = 13
    let currentFontName: String = "Arial"
    
    let textPartBeforeIcon = "Provides clickable access to dictionary entries, morphological analyses, inflection tables and grammars for Latin and Ancient Greek and limited support for Classical Arabic and Persian.      1. Open Safari application     2. Open Safari Preferences Window in Menubar (⌘,)     3. Choose Extension Tab     4. Check \"AlpheiosReadingTools\"  Then activate on a page with Latin, Ancient Greek, Arabic or Persian text by clicking on the Alpheios icon  "
    
    let textPartAfterIcon: String = "  in the Safari toolbar.  Double-click on a word to retrieve morphology and short definitions."
    
    // An array to store a list of Auth0 users
    var authUsers: [NSManagedObject] = []
    
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
        #if DEBUG
        os_log("Save action callback is executiong", log: OSLog.sAuth, type: .info)
        #endif
        
        // Performs the save action for the application, which is to send the save: message to the application's managed object context. Any encountered errors are presented to the user.
        let context = persistentContainer.viewContext
        
        if !context.commitEditing() {
            NSLog("\(NSStringFromClass(type(of: self))) unable to commit editing before saving")
        }
        if context.hasChanges {
            #if DEBUG
            os_log("Store context has changes", log: OSLog.sAuth, type: .info)
            #endif
            do {
                try context.save()
                #if DEBUG
                os_log("Store context has been changed", log: OSLog.sAuth, type: .info)
                #endif
            } catch {
                // Customize this code block to include application-specific recovery steps.
                let nserror = error as NSError
                os_log("Cannot save tore context: %@", log: OSLog.sAuth, type: .error, nserror)
                NSApplication.shared.presentError(nserror)
            }
        }
    }
    
    func applicationWillFinishLaunching(_ notification: Notification) {
        #if DEBUG
        os_log("applicationWillFinishLaunching CB", log: OSLog.sAuth, type: .info)
        #endif
    }
    
    // Initial event of Application Launch
    func applicationDidFinishLaunching(_ notification: Notification) {
        #if DEBUG
        os_log("applicationDidFinishLaunching CB", log: OSLog.sAuth, type: .info)
        #endif
        
        self.updateHeaderLabel()
        self.updateMainIcon()
        self.updateHelloText()
        
        DistributedNotificationCenter.default().addObserver(self, selector: #selector(self.authEventDidHappen), name: .AlpheiosAuthEvent, object: nil)
        
        #if DEBUG
        os_log("Auth event observer has been added", log: OSLog.sAuth, type: .info)
        #endif
    }


    // Method to update header - text and font settings are defined inside class:
    // headerText, headerFontName, headerFontSize, headerColor
    func updateHeaderLabel() {
        let headerAS = NSMutableAttributedString(string: headerText)
        let currentFont: NSFont = NSFont.init(name: headerFontName, size: headerFontSize) ?? NSFont.systemFont(ofSize: headerFontSize)
        
        let textAttributes: [NSMutableAttributedString.Key: Any] = [
            .font: currentFont,
            .foregroundColor: self.createColorRGB(rgbDict: headerColor)
        ]
        
        let headerASRange = (headerAS.string as NSString).range(of: headerText)
        headerAS.setAttributes(textAttributes, range: headerASRange)
        headerLabel.attributedStringValue = headerAS
    }
    
    // Method to update icon in the header - icon is defined inside class: headerIcon
    func updateMainIcon() {
        mainIcon.image = headerIcon
    }
    
    // Method to update the big text block - text is defined inside the class in 2 parts:
    // textPartBeforeIcon and textPartAfterIcon
    // icon is defined inside class: littleIconInHelloText
    func updateHelloText() {
        let fullAS = NSMutableAttributedString(string: textPartBeforeIcon)
        
        let attachment = self.addAttachmentImage(image: littleIconInHelloText)
        
        fullAS.append(NSAttributedString(attachment: attachment))
        fullAS.append(NSAttributedString(string: textPartAfterIcon))
        
        self.updateFontAttributesHelloText(fullAS: fullAS)
        
        helloText.attributedStringValue = fullAS
    }
    
    // Specific method to convert rgb values to be used with NSColor init method
    func createColorRGB(rgbDict: [String: CGFloat]) -> NSColor {
        let redNorm = (rgbDict["r"] ?? 0)/255
        let greenNorm = (rgbDict["g"] ?? 0)/255
        let blueNorm = (rgbDict["b"] ?? 0)/255
        
        return NSColor.init(red: redNorm, green: greenNorm, blue: blueNorm, alpha: rgbDict["alpha"] ?? 1)
    }
    
    // Method to create an attachment with icon image to add to the big text
    func addAttachmentImage(image: NSImage) -> NSTextAttachment {
        let attachment = NSTextAttachment()
        
        attachment.image = littleIconInHelloText
        
        let xCord: CGFloat = ceil(-currentFontSize * 0.4)
        let yCord: CGFloat = ceil(-currentFontSize * 0.4)
        let imageWidth: CGFloat = ceil(currentFontSize * 1.85)
        let imageHeight: CGFloat = ceil(currentFontSize * 1.85)
        
        attachment.bounds = NSRect(x: xCord, y:yCord, width: imageWidth, height: imageHeight)
        return attachment
    }
    
    // Method to update font properties defined in the class to all the text:
    // currentFontName, currentFontSize
    // textPartBeforeIcon and textPartAfterIcon are used to calculate range for applying font
    func updateFontAttributesHelloText(fullAS: NSMutableAttributedString) {
        let currentFont: NSFont = NSFont.init(name: currentFontName, size: currentFontSize) ?? NSFont.systemFont(ofSize: currentFontSize)
        let fullASRange1 = (fullAS.string as NSString).range(of: textPartBeforeIcon)
        let fullASRange2 = (fullAS.string as NSString).range(of: textPartAfterIcon)
        
        fullAS.setAttributes([.font: currentFont], range: fullASRange1)
        fullAS.setAttributes([.font: currentFont], range: fullASRange2)
    }
    
    
    func applicationWillTerminate(_ aNotification: Notification) {
        // Insert code here to tear down your application
    }
    
    func windowWillReturnUndoManager(window: NSWindow) -> UndoManager? {
        // Returns the NSUndoManager for the application. In this case, the manager returned is that of the managed object context for the application.
        return persistentContainer.viewContext.undoManager
    }
    
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        // Save changes in the application's managed object context before the application terminates.
        let context = persistentContainer.viewContext
        
        if !context.commitEditing() {
            NSLog("\(NSStringFromClass(type(of: self))) unable to commit editing to terminate")
            return .terminateCancel
        }
        
        if !context.hasChanges {
            return .terminateNow
        }
        
        do {
            try context.save()
        } catch {
            let nserror = error as NSError
            
            // Customize this code block to include application-specific recovery steps.
            let result = sender.presentError(nserror)
            if (result) {
                return .terminateCancel
            }
            
            let question = NSLocalizedString("Could not save changes while quitting. Quit anyway?", comment: "Quit without saves error question message")
            let info = NSLocalizedString("Quitting now will lose any changes you have made since the last successful save", comment: "Quit without saves error question info");
            let quitButton = NSLocalizedString("Quit anyway", comment: "Quit anyway button title")
            let cancelButton = NSLocalizedString("Cancel", comment: "Cancel button title")
            let alert = NSAlert()
            alert.messageText = question
            alert.informativeText = info
            alert.addButton(withTitle: quitButton)
            alert.addButton(withTitle: cancelButton)
            
            let answer = alert.runModal()
            if answer == .alertSecondButtonReturn {
                return .terminateCancel
            }
        }
        // If we got here, it is time to quit.
        return .terminateNow
    }
    
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
    
    @IBAction func LogInClicked(_ sender: Any) {
        let username = usernameTextInput.stringValue
        let password = passwordTextInput.stringValue
        var msg = ""
        
        let authentication = Auth0.authentication()
        
        authentication.login(
            usernameOrEmail: username,
            password: password,
            realm: "Username-Password-Authentication",
            scope: "openid")
            .start { result in
                switch result {
                case .success(let credentials):
                    // Available credentials fields are:
                    // accessToken (String?)
                    // tokernType (String?) - Example: "Bearer"
                    // expiresIn (Date?)
                    // refreshToken (String?)
                    // idToken (String?)
                    // scope (String?) - Example: "openid profile email address phone"
                    
                    var accessToken = ""
                    if (credentials.accessToken != nil) {
                        accessToken = credentials.accessToken!
                    } else {
                        msg += "Authentication failed\n"
                    }
                    let tokenType = credentials.tokenType
                    let expiresIn = credentials.expiresIn
                    let dateFormatterPrint = DateFormatter()
                    dateFormatterPrint.dateFormat = "MMM dd,yyyy"
                    #if DEBUG
                    os_log("Authenticated successfully, access token is %@, token type is %@, expires in %@", log: OSLog.sAuth, type: .info, accessToken, tokenType!, dateFormatterPrint.string(from: expiresIn!))
                    #endif
                    
                    // Other available fields are:
                    // let refreshToken = credentials.refreshToken
                    // let idToken = credentials.idToken
                    // let scope = credentials.scope
                    Auth0
                        .authentication()
                        .userInfo(withAccessToken: accessToken)
                        .start { result in
                            switch result {
                            case .success(let profile):
                                // Available profile fields are:
                                // sub (String) - This is the user ID. It's always presnet
                                // name (String?) - usually this is user's email
                                // givenName (String?)
                                // familyName (String?)
                                // middleName (String?)
                                // nickname (String?)
                                // preferredUsername (String?)
                                // profile (URL?)
                                // picture (URL?)
                                // website (URL?)
                                // email (String?)
                                // emailVerified (Bool?)
                                // gender (String?)
                                // birthdate (String?)
                                // zoneinfo (TimeZone?)
                                // locale (Locale?)
                                // phoneNumber (String?)
                                // phoneNumberVerified (Bool?)
                                // address ([String:String]?)
                                // updatedAt (Date?)
                                // customClaims ([String:Any]?)
                                #if DEBUG
                                os_log("User info was obtained successfully for %@ (%@)", log: OSLog.sAuth, type: .info, profile.nickname ?? "", profile.email ?? "")
                                #endif
                                
                                // Send user info to the extension
                                let userInfo = [
                                    "email": profile.email ?? "",
                                    "id": profile.sub,
                                    "name": profile.name ?? "",
                                    "nickname": profile.nickname ?? "",
                                    "accessToken": accessToken
                                ]
                                SFSafariApplication.dispatchMessage(withName: "UserLogin", toExtensionWithIdentifier: "net.alpheios.safari.ext", userInfo: userInfo, completionHandler: nil)
                                
                                self.saveAuthUser(email: profile.email ?? "", authenticated: true)
                            case .failure(let error):
                                os_log("User info retrieval failed: %@", log: OSLog.sAuth, type: .error, error as CVarArg)
                            }
                    }
                case .failure(let error):
                    os_log("Authentication failed: %@", log: OSLog.sAuth, type: .error, error as CVarArg)
                }
        }
    }
    
    @IBAction func TestLoginClicked(_ sender: Any) {
        #if DEBUG
        os_log("Test login has been initiated", log: OSLog.sAuth, type: .info)
        #endif
        
        let userInfo = [
            "email": "email@test.com",
            "id": "userID",
            "name": "Test user name",
            "nickname": "Test nickname",
            "accessToken": "TEST_ACCESS_TOKEN"
        ]
        SFSafariApplication.dispatchMessage(withName: "UserLogin", toExtensionWithIdentifier: "net.alpheios.safari.ext", userInfo: userInfo, completionHandler: nil)
        
        #if DEBUG
        os_log("UserLogin test notification has been dispatched", log: OSLog.sAuth, type: .info)
        #endif
    }
    
    
    @IBAction func LogOutClicked(_ sender: Any) {
        #if DEBUG
        os_log("Logout has been initiated", log: OSLog.sAuth, type: .info)
        #endif
        SFSafariApplication.dispatchMessage(withName: "UserLogout", toExtensionWithIdentifier: "net.alpheios.safari.ext", userInfo: nil, completionHandler: nil)
    }
    
    @objc func authEventDidHappen(notification: NSNotification){
        #if DEBUG
        os_log("Auth event callback", log: OSLog.sAuth, type: .info)
        #endif
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
            authUsers.append(user)
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
    
    func applicationWillBecomeActive(_ notification: Notification) {
    }
    
    func applicationDidBecomeActive(_ notification: Notification) {
    }

    func applicationWillResignActive(_ notification: Notification) {
    }
    
    func applicationDidResignActive(_ notification: Notification) {
    }
}

