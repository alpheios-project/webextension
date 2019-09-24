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
    static let sAlpheios = OSLog(subsystem: subsystem, category: "AlpheiosSafari")
}

extension NSNotification.Name {
    static let AlpheiosAuthEvent = NSNotification.Name("AlpheiosAuthEvent")
}

// Reads and Alpheios data from a plist file
func readAlpheiosData() -> [String:AnyObject] {
    #if DEBUG
    os_log("readAlpheiosData() has been called", log: OSLog.sAlpheios, type: .info)
    #endif
    var format = PropertyListSerialization.PropertyListFormat.xml // Format of the property list
    var plistData:[String:AnyObject] = [:]  // Data from properties
    let plistPath:String? = Bundle.main.path(forResource: "AlpheiosData", ofType: "plist")! //the path of the data
    let plistXML = FileManager.default.contents(atPath: plistPath!)! //the data in XML format
    do{ //convert the data to a dictionary and handle errors.
        plistData = try PropertyListSerialization.propertyList(from: plistXML,options: .mutableContainersAndLeaves,format: &format)as! [String:AnyObject]
    }
    catch{ // error condition
        os_log("Cannot read an Alpheios data plist: %s", log: OSLog.sAlpheios, type: .info, error.localizedDescription)
    }
    return plistData
}
