//
//  StateRequest.swift
//  AlpheiosSafariV2
//
//  Created by Irina Sklyarova on 11/09/2018.
//  Copyright © 2018 Irina Sklyarova. All rights reserved.
//

import Foundation

class StateRequest: RequestMessage {
    override init(body: [String: String]) {
        super.init(body: body)
        self.type = Message.types["state_request"]!
    }
}
