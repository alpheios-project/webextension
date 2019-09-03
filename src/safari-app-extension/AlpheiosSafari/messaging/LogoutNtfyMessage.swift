//
//  LogoutNtfyMessage.swift
//  AlpheiosSafari
//
//  Created by Kirill Latyshev on 31/08/2019.
//  Copyright © 2019 Alpheios Team. All rights reserved.
//

import Foundation

class LogoutNtfyMessage: RequestMessage {
    override init(body: [String: String]) {
        super.init(body: body)
        self.type = Message.types["logout_ntfy_message"]!
    }
}
