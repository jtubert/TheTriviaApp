$(document).ready (function () {

    //$.couch.urlPrefix = "https://jtubert.cloudant.com";



    // "connect" to the database
    var db = $.couch.db("couchapp");


    var userDoc = {
        _id: "b",
        _rev: "1-c9f1576d06e12af51ece1bac75b26bad",
        name: "bob is the name",
        lastname: "G"
    };

    $.couch.login({
        name: "jtubert",
        password: "cb7978",
        success: function(data) {
            console.log(data);
        },
        error: function(status) {
            console.log(status);
        }
    });




    $.couch.allDbs({
        success: function(data) {
            console.log(data);
        }
    });


    // insert the doc into the db
    db.saveDoc(userDoc, {
        success: function(response, textStatus, jqXHR){
            console.log(response, textStatus, jqXHR);
            // do something if the save works
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR, textStatus, errorThrown);
            //do something else if it goes wrong
        }
    })


    /*
     $.couch.signup(userDoc, "cb7978", {
     success: function(data) {
     console.log(data);
     },
     error: function(status) {
     console.log(status);
     }
     });
     */
});