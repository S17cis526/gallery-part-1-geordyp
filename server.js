"use strict";

/**
 * server.js
 * This file defines the server for a
 * simple photo gallery web app.
 */
var multipart = require('./multipart');
var http = require('http');
var url = require('url');
var fs = require('fs');
var port = 3000;

/* load cached files */
var config = JSON.parse(fs.readFileSync('config.json'));
var stylesheet = fs.readFileSync('gallery.css');

// var imageNames = ['ace.jpg', 'bubble.jpg', 'chess.jpg', 'fern.jpg', 'mobile.jpg'];

function getImageNames(callback) {
  fs.readdir('images/', function(err, fileNames) {
    if (err) callback(err, undefined);
    else callback(false, fileNames);
  });
}

function imageNamesToTags(fileNames) {
  return fileNames.map(function(fileName) {
    return `<img src="${fileName}" alt="${fileName}">`;
  });
}

function buildGallery(imageTags) {
  var html =  '<!DOCTYPE html>';
      html += '<head>';
        html += '<title>' + config.title + '</title>';
        html += '<link rel="stylesheet" type="text/css" href="gallery.css">';
      html += '</head>';
      html += '<body>';
        html += '<h1>' + config.title + '</h1>';
        html += '<form action="">';
          html += '<input type="text" name="title">';
          html += '<input type="submit" value="Change Gallery Title">';
        html += '</form>';
        html += imageNamesToTags(imageTags).join('');
        html += '<form action="" method="POST" encrypt="multipart/form-data">';
          html += '<input type="file" name="image">';
          html += '<input type="submit" value="Upload Image">';
        html += '</form>';
      html += '</body>';

  return html;
}

function serveGallery(req, res) {
  getImageNames(function(err, imageNames) {
    if (err) {
      console.error(err);
      res.statusCode = 500;
      res.statusMessage = 'Server error';
      res.end();
      return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.end(buildGallery(imageNames));
  })
}

function serveImage(filename, req, res) {
  fs.readFile('images/' + decodeURIComponent(filename), function(err, data) {
    if (err) {
      console.error(err);
      res.statusCode == 404;
      res.statusMessage = "Resource not found";
      res.end()
      return;
    }
    res.setHeader("Content-Type", "image/*");
    res.end(data);
  });
}

function uploadImage(req, res) {
  multipart(req, res, function(req, res) {
    // make sure an image was uploaded
    console.log('filename', req.body.filename)
    if(!req.body.image.filename) {
      console.error("No file in upload");
      res.statusCode = 400;
      res.statusMessage = "No file specified"
      res.end("No file specified");
      return;
    }
    fs.writeFile('images/' + req.body.image.filename, req.body.image.data, function(err){
      if(err) {
        console.error(err);
        res.statusCode = 500;
        res.statusMessage = "Server Error";
        res.end("Server Error");
        return;
      }
      serveGallery(req, res);
    });
  });
}

function handleRequest(req, res) {
  // at most, the url should have two parts -
  // a resource and a querystring separated by a ?
  var urlParts = url.parse(req.url);

  if(urlParts.query){
    var matches = /title=(.+)($|&)/.exec(urlParts.query);
    if(matches && matches[1]){
      config.title = decodeURIComponent(matches[1]);
      fs.writeFile('config.json', JSON.stringify(config));
    }
  }

  switch(urlParts.pathname) {
    case '/':
    case '/gallery':
      if(req.method == 'GET') {
        serveGallery(req, res);
      } else if(req.method == 'POST') {
        uploadImage(req, res);
      }
      break;
    case '/gallery.css':
      res.setHeader('Content-Type', 'text/css');
      res.end(stylesheet);
      break;
    default:
      serveImage(req.url, req, res);
  }
}

/* Create and launch the webserver */
var server = http.createServer(handleRequest);
server.listen(port, function(){
  console.log("Server is listening on port ", port);
});
