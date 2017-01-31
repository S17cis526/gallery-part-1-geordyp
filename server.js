"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
var http = require('http');
var fs = require('fs');
var port = 3000;

var stylesheet = fs.readFileSync('gallery.css');

var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

function serveImage(filename, req, res) {
  fs.readFile('images/' + filename, function(err, body) {
    if (err) {
      console.error(err);
      res.statusCode == 500;
      res.statusMessage = "Whoops";
      return;
    }
    res.setHeader("Content-Type", "image/jpeg");
    res.end(body);
  });
}

var server = http.createServer((req, res) => {

  switch (req.url) {
    case "/gallery":
      var gHtml = imageNames.map(function(fileName) {
        return '<img src="' + fileName + '">';
      }).join(' ');
      var html =  '<!DOCTYPE html>';
          html += '<head>';
          html += '<title>Dynamic Page</title>';
          html += '<link rel="stylesheet" type="text/css" href="gallery.css">';
          html += '</head>';
          html += '<body>';
            html += '<h1>Gallery</h1>';
            html += gHtml;
          html += '</body>';
      res.setHeader("Content-Type", "text/html");
      res.end(html);
      break;
    case "/ace":
    case "/ace.jpg":
      serveImage('ace.jpg', req, res);
      break;
    case "/bubble":
    case "/bubble.jpg":
      serveImage('bubble.jpg', req, res);
      break;
    case "/chess":
    case "/chess.jpg":
      serveImage('chess.jpg', req, res);
      break;
    case "/fern":
    case "/fern.jpg":
      serveImage('fern.jpg', req, res);
      break;
    case "/mobile":
    case "/mobile.jpg":
      serveImage('mobile.jpg', req, res);
      break;
    case "/gallery.css":
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
    default:
      res.statusCode = 404;
      res.statusMessage = "Resource not found";
      res.end("Couldn't find it");
  }

});

server.listen(port, () => {
  console.log("Listening on Port " + port);
});
