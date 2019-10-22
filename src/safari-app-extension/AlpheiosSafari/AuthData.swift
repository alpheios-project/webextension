//
//  AuthData.swift
//  AlpheiosSafari
//
//  Created by Kirill Latyshev on 18/10/2019.
//  Copyright © 2019 Alpheios Team. All rights reserved.
//

import Foundation
import os.log

class AuthData {
    var isAuthenticated: Bool
    var accessToken: String
    var expirationDateTime: Date
    var hasSessionExpired: Bool
    var userId: String
    var userName: String
    var userNickname: String
    
    init() {
        isAuthenticated = false
        accessToken = ""
        expirationDateTime = Date(timeIntervalSince1970: 0)
        hasSessionExpired = false
        userId = ""
        userName = ""
        userNickname = ""
    }
    
    // Checks if session has been expired or not
    func expireIfNotValid () {
        let now = Date()
        if (expirationDateTime < now) {
            os_log("expireIfNotValid: An access token has expired", log: OSLog.sAlpheios, type: .info)
            if (isAuthenticated) {
                // If user has been authenticated previously, mark session as expired
                expireSession()
            }
            return
        }
    }
    
    func updateFromLogin (msgBody: [String:Any]) {
        #if DEBUG
        os_log("updateFromLogin()", log: OSLog.sAlpheios, type: .info)
        #endif
        isAuthenticated = true
        accessToken = msgBody["accessToken"] as! String
        let unixExpirationDT = msgBody["expirationDateTime"] as! Int
        #if DEBUG
        os_log("unixExpirationDT is %d", log: OSLog.sAlpheios, type: .info, unixExpirationDT)
        #endif
        expirationDateTime = Date(timeIntervalSince1970: TimeInterval(unixExpirationDT))
        hasSessionExpired = false
        userId = msgBody["userId"] as! String
        userName = msgBody["userName"] as! String
        userNickname = msgBody["userNickname"] as! String
    }
    
    func updateFromLogout (msgBody: [String:Any]) {
        #if DEBUG
        os_log("updateFromLogout()", log: OSLog.sAlpheios, type: .info)
        #endif
        
        isAuthenticated = false
        accessToken = ""
        expirationDateTime = Date(timeIntervalSince1970: 0)
        hasSessionExpired = msgBody["hasSessionExpired"] as! Bool
        userId = ""
        userName = ""
        userNickname = ""
    }
    
    func expireSession () {
        #if DEBUG
        os_log("expireSession()", log: OSLog.sAlpheios, type: .info)
        #endif
        isAuthenticated = false
        expirationDateTime = Date(timeIntervalSince1970: 0)
        hasSessionExpired = true
    }
    
    func toStringDict () -> [String:String] {
        #if DEBUG
        os_log("toStringDict()", log: OSLog.sAlpheios, type: .info)
        #endif
        return [
            "accessToken": accessToken,
            "accessTokenExpiresIn": String(format: "%.0f", expirationDateTime.timeIntervalSince1970),
            "hasSessionExpired": hasSessionExpired.description,
            "isAuthenticated": isAuthenticated.description,
            "userId": userId,
            "userName": userName,
            "userNickname": userNickname
        ]
    }
}
