//
//  Message.swift
//  AlpheiosSafariV2
//
//  Created by Irina Sklyarova on 11/09/2018.
//  Copyright © 2018 Irina Sklyarova. All rights reserved.
//
import Foundation

class Message {
    var role:String = ""
    var type:String = ""
    var ID:String = ""
    var body: [String: String] = [:]
    
    static let types: [String: String] = [
        "generic_message": "Alpheios_GenericMessage",
        "state_request": "Alpheios_StateRequest",
        "state_message": "Alpheios_StateMessage"
    ]
    
    static let roles: [String: String] = [
        "request": "Alpheios_Request"
    ]
    
    init(body: [String: String]) {
        self.role = Message.types["generic_message"]!
        self.ID = UUID().uuidString
        self.body = body
    }
    
    func convertForMessage() -> [String: Any] {
        return [
            "role": self.role,
            "type": self.type,
            "ID": self.ID,
            "body": self.body
        ]
    }
}
