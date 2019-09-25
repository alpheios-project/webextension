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
    
    @IBOutlet weak var loggedOutBox: NSBox!
    @IBOutlet weak var loggedInBox: NSBox!
    @IBOutlet weak var loggedInText: NSTextField!
    @IBOutlet weak var loggedOutText: NSTextField!
    @IBOutlet weak var usernameTextInput: NSTextField!
    @IBOutlet weak var passwordTextInput: NSSecureTextField!
    @IBOutlet weak var logInButton: NSButton!
    
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
    
    // Whether the current user has been authenticated or not
    var isAuthenticated: Bool = false
    // Some user data that is required for the containing app
    var userId: String?
    var userNickname: String?
    
    // Core Data container initialization
    lazy var persistentContainer: NSCustomPersistentContainer = {
        /*
         The persistent container for the application. This implementation
         creates and returns a container, having loaded the store for the
         application to it. This property is optional since there are legitimate
         error conditions that could cause the creation of the store to fail.
         */
        let container = NSCustomPersistentContainer(name: "AlpheiosSafariExtension")
        #if DEBUG
        os_log("Initiated a persistent \"%@\" container object", log: OSLog.sAlpheios, type: .info, container.name)
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
                os_log("Persistent store has been loaded successfully", log: OSLog.sAlpheios, type: .info, container.name)
                #endif
            }
        })
        return container
    }()
    
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
                guard let userNickname = user.value(forKeyPath: "nickname") else {
                    os_log("Obligatory AuthUser field, %s, is missing. Stored user authentication data will be ignored", log: OSLog.sAlpheios, type: .error, "nickname")
                    return
                }
                
                self.isAuthenticated = true
                self.userId = userId as? String ?? ""
                self.userNickname = userNickname as? String ?? ""
            }
            
        } catch let error as NSError {
            os_log("Could not fetch user authentication data. %@, %@", log: OSLog.sAlpheios, type: .error, error, error.userInfo)
        }
    }
    
    func applicationWillFinishLaunching(_ notification: Notification) {
        #if DEBUG
        os_log("applicationWillFinishLaunching CB", log: OSLog.sAlpheios, type: .info)
        #endif
        self.fetchAuthInfo()
    }
    
    // Initial event of Application Launch
    func applicationDidFinishLaunching(_ notification: Notification) {
        #if DEBUG
        os_log("applicationDidFinishLaunching CB", log: OSLog.sAlpheios, type: .info)
        #endif
        
        self.updateHeaderLabel()
        self.updateMainIcon()
        self.updateHelloText()
        self.updateAuthUI()
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
    
    func windowWillReturnUndoManager(window: NSWindow) -> UndoManager? {
        // Returns the NSUndoManager for the application. In this case, the manager returned is that of the managed object context for the application.
        return persistentContainer.viewContext.undoManager
    }
    
    func applicationShouldTerminate(_ sender: NSApplication) -> NSApplication.TerminateReply {
        // Application is ready to terminate
        return .terminateNow
    }
    
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
    
    @IBAction func LogInClicked(_ sender: Any) {
        let username = self.usernameTextInput.stringValue
        let password = self.passwordTextInput.stringValue
        // Clear text fields
        self.usernameTextInput.stringValue = ""
        self.passwordTextInput.stringValue = ""
        // Try to take focus away from input fields
        self.window?.makeFirstResponder(self.logInButton)
        
        let authentication = Auth0.authentication()
        self.loggedOutText.stringValue = "Please wait while we are logging you in..."
        authentication.login(
            usernameOrEmail: username,
            password: password,
            realm: "Username-Password-Authentication",
            audience: "alpheios.net:apis",
            scope: "openid profile offline_access") // "profile" scope will not return an email claim, use "email" to get access to it
            .start { result in
                switch result {
                case .success(let credentials):
                    // Credentials fields are (some fileds may be not available with some request configurations):
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
                        // Output the error message
                        self.loggedOutText.stringValue = "Authentication aborted: access token is missing from server response"
                        os_log("Authentication aborted: access token is missing from server response", log: OSLog.sAlpheios, type: .error)
                        // If an obligatory piece of data is missing, we cannot continue
                        return
                    }
                    
                    var expiresIn: Date? = nil
                    if (credentials.accessToken != nil) {
                        expiresIn = credentials.expiresIn!
                    } else {
                        // Output the error message
                        self.loggedOutText.stringValue = "Authentication aborted: expiration date is missing from server response"
                        os_log("Authentication aborted: expiration date is missing from server response", log: OSLog.sAlpheios, type: .error)
                        // If an obligatory piece of data is missing, we cannot continue
                        return
                    }

                    #if DEBUG
                    let dateFormatterPrint = DateFormatter()
                    dateFormatterPrint.dateFormat = "yyyy-MMM-dd HH:mm:ss"
                    os_log("Authenticated successfully, expiration date is %s", log: OSLog.sAlpheios, type: .info, dateFormatterPrint.string(from: expiresIn!))
                    #endif
                    
                    self.loggedOutText.stringValue = "Please wait while we are retrieving your profile..."
                    
                    Auth0
                        .authentication()
                        .userInfo(withAccessToken: accessToken)
                        .start { result in
                            switch result {
                            case .success(let profile):
                                // Profile fields are (some fileds may be not available with some request configurations):
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
                                
                                self.loggedOutText.stringValue = "Data retrieval is complete"
                                self.userNickname = profile.nickname ?? ""
                                #if DEBUG
                                os_log("User info was obtained successfully for %s (%s)", log: OSLog.sAlpheios, type: .info, self.userNickname ?? "Nickname is missing", profile.sub)
                                #endif
                                
                                self.isAuthenticated = true
                                // Send user info to the extension
                                let userInfo = [
                                    "userId": profile.sub,
                                    "userName": profile.name ?? "",
                                    "userNickname": self.userNickname!,
                                    "accessToken": accessToken,
                                    "expiresIn": expiresIn!
                                    ] as [String : Any]
                                SFSafariApplication.dispatchMessage(withName: "UserLogin", toExtensionWithIdentifier: "net.alpheios.safari.ext", userInfo: userInfo, completionHandler: { (error) -> Void in
                                    if (error == nil) {
                                        os_log("Login message to the Safari App Extension has been dispatched successfully", log: OSLog.sAlpheios, type: .info)
                                    } else {
                                        os_log("Login message to the Safari App Extension has failed: %s", log: OSLog.sAlpheios, type: .error, error!.localizedDescription)
                                    }
                                })
                                
                                self.updateAuthUI()
                                
                            case .failure(let error):
                                os_log("User info retrieval failed: %s", log: OSLog.sAlpheios, type: .error, error.localizedDescription)
                                self.loggedOutText.stringValue = error.localizedDescription
                            }
                    }
                case .failure(let error):
                    os_log("Authentication failed: %s", log: OSLog.sAlpheios, type: .error, error.localizedDescription)
                    self.loggedOutText.stringValue = error.localizedDescription
                }
        }
    }
    
    @IBAction func LogOutClicked(_ sender: Any) {
        #if DEBUG
        os_log("Logout has been initiated", log: OSLog.sAlpheios, type: .info)
        #endif
        
        self.isAuthenticated = false
        self.userNickname = nil
        self.updateAuthUI()
        
        SFSafariApplication.dispatchMessage(withName: "UserLogout", toExtensionWithIdentifier: "net.alpheios.safari.ext", userInfo: nil, completionHandler: { (error) -> Void in
            if (error == nil) {
                os_log("Logout message to the Safari App Extension has been dispatched successfully", log: OSLog.sAlpheios, type: .info)
            } else {
                os_log("Logout message to the Safari App Extension has failed: %s", log: OSLog.sAlpheios, type: .error, error!.localizedDescription)
            }
        })
    }
    
    @IBAction func CreateAccountClicked(_ sender: Any) {
        #if DEBUG
        os_log("Create account action has been initiated", log: OSLog.sAlpheios, type: .info)
        #endif
        
        SFSafariApplication.dispatchMessage(withName: "CreateAccount", toExtensionWithIdentifier: "net.alpheios.safari.ext", userInfo: nil, completionHandler: nil)
    }
    
    @IBAction func UserAcctTutorialClicked(_ sender: Any) {
        #if DEBUG
        os_log("A user account tutorial has been clicked", log: OSLog.sAlpheios, type: .info)
        #endif
        
        SFSafariApplication.dispatchMessage(withName: "ShowUserAcctTutorial", toExtensionWithIdentifier: "net.alpheios.safari.ext", userInfo: nil, completionHandler: nil)
    }
    
    func updateAuthUI() {
        #if DEBUG
        os_log("updateAuthUI() has been called, auth status is %s", log: OSLog.sAlpheios, type: .info, self.isAuthenticated.description)
        #endif
        if (self.isAuthenticated) {
            if (self.userNickname != nil) {
                self.loggedInText.stringValue = "You are logged in as \(self.userNickname!)"
            } else {
                self.loggedInText.stringValue = "You are logged in"
            }
            self.loggedOutBox.isHidden = true
            self.loggedInBox.isHidden = false
        } else {
            self.loggedOutText.stringValue = "Login to save your wordlist."
            self.loggedOutBox.isHidden = false
            self.loggedInBox.isHidden = true
        }
    }
}

