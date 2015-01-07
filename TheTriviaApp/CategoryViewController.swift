//
//  CategoryViewController.swift
//  TheTriviaApp
//
//  Created by John Tubert on 1/7/15.
//  Copyright (c) 2015 John Tubert. All rights reserved.
//

import Foundation

class CategoryViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var tableView: UITableView?
    
    var items: [String] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.tableView?.registerClass(UITableViewCell.self, forCellReuseIdentifier: "cell")
        
        self.getCategories()
    }    
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.items.count;
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        var cell:UITableViewCell = self.tableView?.dequeueReusableCellWithIdentifier("cell") as UITableViewCell
        
        cell.textLabel.text = self.items[indexPath.row]
        
        return cell
    }
    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        println("You selected cell #\(indexPath.row)!")
        
        let secondViewController = self.storyboard?.instantiateViewControllerWithIdentifier("viewController") as ViewController
        
        
        self.presentViewController(secondViewController, animated: true) { () -> Void in
            //
        }
        
        //self.navigationController?.pushViewController(secondViewController, animated: true)
    }
    
    func getCategories(){
        var dic = Dictionary<String, String>()
        
        PFCloud.callFunctionInBackground("listsList", withParameters: dic) { (result: AnyObject!, error: NSError!) -> Void in
            if(error == nil){
                
                let totalItems = result?.count
                
                for i in 0...totalItems!-1 {
                    var category:String = result[i]?["name"] as String
                    self.items.append(category)
                }
                
                self.tableView?.reloadData()
             }else{
                println(error)
            }
            
        }
        
    }

}
