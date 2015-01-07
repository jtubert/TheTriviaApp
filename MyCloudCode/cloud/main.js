///////////////////////////////////////////////////////////////////
//WEBSITE
///////////////////////////////////////////////////////////////////
require('cloud/app.js');
var oauth = require('cloud/oauth.js');
var sha = require('cloud/sha1.js');
var baseTwitterApiURL = 'https://api.twitter.com/1.1/';

Parse.Cloud.define("listsStatuses", function(request, response) {
    var urlLink = baseTwitterApiURL+'lists/statuses.json?list_id=187272793&include_entities=false&include_rts=false';
    
    twitterApiCall(urlLink,callback,onError);

    function callback(httpResponse){
        //parse twitter response and send it back to the app
        var jsonString = httpResponse.text;
        var json = JSON.parse(jsonString);        
        var arr = [];
        for (var i = json.length - 1; i >= 0; i--) {
            var obj = {};
            obj.name = json[i].user.name;
            obj.id = json[i].id;
            obj.text = json[i].text;
            arr.push(obj);       
        };
        
        response.success(arr);
    }

    function onError(httpResponse){
        response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
    }      
});


Parse.Cloud.define("listsMembers", function(request, response) {
    var urlLink = baseTwitterApiURL+'lists/members.json?list_id=187272793';
    
    twitterApiCall(urlLink,callback,onError);

    function callback(httpResponse){
        //parse twitter response and send it back to the app
        var jsonString = httpResponse.text;
        var json = JSON.parse(jsonString);
        var users = json.users;
        var arr = [];
        for (var i = users.length - 1; i >= 0; i--) {
            var obj = {};
            obj.name = users[i].name;
            obj.id = users[i].id;
            arr.push(obj);       
        };
        
        response.success(arr);
    }

    function onError(httpResponse){
        response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
    }      
});

Parse.Cloud.define("listsList", function(request, response) {
    var urlLink = baseTwitterApiURL+'lists/list.json';
    
    twitterApiCall(urlLink,callback,onError);

    function callback(httpResponse){
        //parse twitter response and send it back to the app
        var jsonString = httpResponse.text;
        var json = JSON.parse(jsonString);
        var arr = [];
        for (var i = json.length - 1; i >= 0; i--) {
            var obj = {};
            obj.name = json[i].name;
            obj.id = json[i].id;
            arr.push(obj);       
        };
        
        response.success(arr);
    }

    function onError(httpResponse){
        response.error('Request failed with response ' + httpResponse.status + ' , ' + httpResponse);
    }    
});



function twitterApiCall(urlLink,callback,onError){    
    var consumerSecret = "GmBMLUC3LOex6RH02L7K4tzz5LoataFoPR5XZKlhyPamHQ5M6P";
    var tokenSecret = "oPJytvelB93JrXrsOtVWz7IwQtMUNQL1n59pDziuwV4uh";
    var oauth_consumer_key = "FxtOUcAd70tqoYezrFvhP2hHu";
    var oauth_token = "2957458600-dzElCpHcBYShg73YhZNy9HgGccOyMAHXtb0ViaB";

    var nonce = oauth.nonce(32);
    var ts = Math.floor(new Date().getTime() / 1000);
    var timestamp = ts.toString();

    var accessor = {
        "consumerSecret": consumerSecret,
        "tokenSecret": tokenSecret
    };

    var params = {
        "oauth_version": "1.0",
        "oauth_consumer_key": oauth_consumer_key,
        "oauth_token": oauth_token,
        "oauth_timestamp": timestamp,
        "oauth_nonce": nonce,
        "oauth_signature_method": "HMAC-SHA1"
    };
    var message = {
        "method": "GET",
        "action": urlLink,
        "parameters": params
    };

    //lets create signature
    oauth.SignatureMethod.sign(message, accessor);
    var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
    console.log("Normalized Parameters: " + normPar);
    var baseString = oauth.SignatureMethod.getBaseString(message);
    console.log("BaseString: " + baseString);
    var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
    console.log("Non-Encode Signature: " + sig);
    var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
    console.log("Encoded Signature: " + encodedSig);

    Parse.Cloud.httpRequest({
        method: 'GET',
        url: urlLink,
        headers: {
            "Authorization": 'OAuth oauth_consumer_key="'+oauth_consumer_key+'", oauth_nonce=' + nonce + ', oauth_signature=' + encodedSig + ', oauth_signature_method="HMAC-SHA1", oauth_timestamp=' + timestamp + ',oauth_token="'+oauth_token+'", oauth_version="1.0"'
        },
        body: {
        },
        success: function(httpResponse) {
            callback((httpResponse));
        },
        error: function(httpResponse) {
            //https://dev.twitter.com/overview/api/response-codes
            onError(httpResponse);
        }
    });
}


function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}
