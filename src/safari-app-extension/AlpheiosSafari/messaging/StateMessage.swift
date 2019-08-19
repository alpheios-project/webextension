//
//  StateMessage.swift
//  AlpheiosSafariV2
//
//  Created by Kirill Latyshev on 16/08/2019.
//  Copyright © 2019 Alpheios Team. All rights reserved.
//

import Foundation

class StateMessage: RequestMessage {
    override init(body: [String: String]) {
        super.init(body: body)
        self.type = Message.types["state_message"]!
    }
}
