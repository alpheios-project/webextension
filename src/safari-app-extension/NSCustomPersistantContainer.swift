//
//  NSCustomPersistantContainer.swift
//  AlpheiosSafariExtension
//
//  Created by Kirill Latyshev on 19/08/2019.
//  Copyright © 2019 Alpheios Team. All rights reserved.
//

import Foundation
import CoreData

class NSCustomPersistentContainer: NSPersistentContainer {
    
    override open class func defaultDirectoryURL() -> URL {
        var storeURL = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "W79WNX2NKZ.AlpheiosExtensionSharedData")
        storeURL = storeURL?.appendingPathComponent("AlpheiosSharedStore.sqlite")
        print("store URL is \(String(describing: storeURL))")
        return storeURL!
    }
    
}
