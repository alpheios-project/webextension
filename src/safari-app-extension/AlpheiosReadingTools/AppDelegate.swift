//
//  AppDelegate.swift
//  AlpheiosV2
//
//  Created by Irina Sklyarova on 11/09/2018.
//  Copyright © 2018 The Alpheios Project, Ltd.
//

import Cocoa
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
    
    // Initial event of Application Launch
    func applicationDidFinishLaunching(_ aNotification: Notification) {
        self.updateHeaderLabel()
        self.updateMainIcon()
        self.updateHelloText()
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
    
    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
    
    @IBAction func LogInClicked(_ sender: Any) {
        let username = usernameTextInput.stringValue
        let password = passwordTextInput.stringValue
        var msg = ""
        
        Auth0.authentication().login(
            usernameOrEmail: username,
            password: password,
            realm: "Username-Password-Authentication",
            scope: "openid")
            .start { result in
                switch result {
                case .success(let credentials):
                    var accessToken = ""
                    if (credentials.accessToken != nil) {
                        accessToken = credentials.accessToken!
                    } else {
                        msg += "Authentication failed\n"
                    }
                    // let tokenType = credentials.tokenType
                    // let expiresIn = credentials.expiresIn
                    // let refreshToken = credentials.refreshToken
                    // let idToken = credentials.idToken
                    // let scope = credentials.scope
                    Auth0
                        .authentication()
                        .userInfo(withAccessToken: accessToken)
                        .start { result in
                            switch result {
                            case .success(let profile):
                                
                                let nickname = profile.nickname != nil ? profile.nickname! : ""
                                let email = profile.email != nil ? profile.email! : ""
                                msg += "User nickname is: \(nickname)\n"
                                msg += "User email is: \(email)\n"
                                DispatchQueue.main.async { [weak self] in
                                    self?.authText.stringValue = msg
                                }
                            case .failure(let error):
                                print("Failed with \(error)")
                            }
                    }
                case .failure(let error):
                    print("Failed with \(error)")
                }
        }
    }
}

