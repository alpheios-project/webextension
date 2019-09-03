//
//  Shared.swift
//  AlpheiosSafariExtension
//
//  Created by Kirill Latyshev on 24/08/2019.
//  Copyright © 2019 Alpheios Team. All rights reserved.
//

import Foundation
import os.log

extension OSLog {
    private static var subsystem = Bundle.main.bundleIdentifier!
    
    /// Logs the view cycles like viewDidLoad.
    static let sAuth = OSLog(subsystem: subsystem, category: "AlpheiosSafari")
}

extension NSNotification.Name {
    static let AlpheiosAuthEvent = NSNotification.Name("AlpheiosAuthEvent")
}
