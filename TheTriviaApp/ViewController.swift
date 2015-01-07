//
//  ViewController.swift
//  TheTriviaApp
//
//  Created by John Tubert on 1/2/15.
//  Copyright (c) 2015 John Tubert. All rights reserved.
//

import UIKit
import Parse

extension Array {
    mutating func shuffle() {
        for i in 0..<(count - 1) {
            let j = Int(arc4random_uniform(UInt32(count - i))) + i
            swap(&self[i], &self[j])
        }
    }
}

class ViewController: UIViewController {
    
    @IBOutlet weak var tweetLabel: UILabel!
    @IBOutlet weak var twitterButton1: UIButton!
    @IBOutlet weak var twitterButton2: UIButton!
    @IBOutlet weak var twitterButton3: UIButton!
    
    var tweetsArr:[String] = []
    var tweetsUserArr:[String] = []
    var currentTweetNum:Int = 0
    var randomUsersArr:[String] = []
    

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        initialize()
        
        
    }
    
    @IBAction func refresh(sender: UIButton) {
        self.currentTweetNum++
        self.tweetLabel.text = self.tweetsArr[self.currentTweetNum]
        self.addRandomChoices()
    }
    
    func initialize(){
        
        self.twitterButton1.hidden = true
        self.twitterButton2.hidden = true
        self.twitterButton3.hidden = true
        
        
        //getCategories()
        getQuestions()
        getTweeters()
        
    }
    
    func getTweeters(){
        var dic = Dictionary<String, String>()
        
        PFCloud.callFunctionInBackground("listsMembers", withParameters: dic) { (result: AnyObject!, error: NSError!) -> Void in
            if(error == nil){
                
                let totalItems = result?.count
                
                for i in 0...totalItems!-1 {
                    var user:String = result[i]?["name"] as String
                    
                    println(user)
                    self.randomUsersArr.append(user)
                }
                
                self.addRandomChoices()
                
                
            }else{
                println(error)
            }
            
        }

    }
    
    func addRandomChoices(){
        self.randomUsersArr.shuffle()
        self.twitterButton1.setTitle(self.randomUsersArr[0], forState: UIControlState.Normal)
        self.twitterButton2.setTitle(self.randomUsersArr[1], forState: UIControlState.Normal)
        self.twitterButton3.setTitle(self.randomUsersArr[2], forState: UIControlState.Normal)
        
        self.twitterButton1.hidden = false
        self.twitterButton2.hidden = false
        self.twitterButton3.hidden = false
    }
    
    
    func getCategories(){
        var dic = Dictionary<String, String>()
        
        PFCloud.callFunctionInBackground("listsList", withParameters: dic) { (result: AnyObject!, error: NSError!) -> Void in
            if(error == nil){
                
                //let data:NSData = (result as NSData)
                //var error: NSError?
                //var json: AnyObject? = NSJSONSerialization.JSONObjectWithData(data, options: NSJSONReadingOptions.MutableContainers, error: &error)
                
                //var data = result as NSDictionary
                
                
                
                //let jsonDict = NSJSONSerialization.JSONObjectWithData(data, options: nil, error: &error) as NSDictionary
                
                
                //{"result":{"id":187272793,"name":"News"}}
                
                
                println(result[0]?["name"])
                
                
                                
            }else{
                println(error)
            }
            
        }

    }
    
    func getQuestions(){
        var dic = Dictionary<String, String>()
        
        
        PFCloud.callFunctionInBackground("listsStatuses", withParameters: dic) { (result: AnyObject!, error: NSError!) -> Void in
            if(error == nil){
                let totalItems = result?.count
                
                for i in 0...totalItems!-1 {
                    var text:String = result[i]?["text"] as String
                    var user:String = result[i]?["name"] as String
                    var id:Int = result[i]?["id"] as Int
                    
                    
                    self.tweetsArr.append(text)
                    self.tweetsUserArr.append(user)
                }
                
                self.tweetLabel.text = self.tweetsArr[self.currentTweetNum]
                
            }
        }
        
    }


    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

