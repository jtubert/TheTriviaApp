
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var path = require('path');
var url = require('url');
var http = require('http');
var Buffer = require('buffer').Buffer;

var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

// // Example reading from the request query string of an HTTP get request.
app.get('/test', function(req, res) {
	// GET http://example.parseapp.com/test?message=hello
	res.send(req.query.message);
});

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

app.get('/proxied_image', function(request_from_client, response_to_client){
  console.log("Starting proxy");
  var image_url = request_from_client.query.image_url;

  Parse.Cloud.httpRequest({
    url: image_url,
    method: 'GET',
    success: function(httpResponse) {
      var imageBuffer = httpResponse.buffer;
      var filename = url.parse(image_url).pathname.split("/").pop()
	  response_to_client.contentType(filename);
      response_to_client.send(imageBuffer);
    },
    error: function(httpResponse) {
      response_to_client.send('Error getting image');
    }
  });
});



// Attach the Express app to Cloud Code.
app.listen();
