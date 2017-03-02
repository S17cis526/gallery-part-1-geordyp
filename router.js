/** @module router */

module.exports = Router;

var url = require('url');


function Router() {
  this._getRoutes = [];
  this._getActions = [];
  this._postRoutes = [];
  this._postActions =[];
}

function pathToRegularExpression(path) {
  var tokens = path.split('/');
  var keys = [];
  var parts = tokens.map(function(token) {
    if (token.charAt(0) == ":") {
      keys.push(token.slice(1));
      return "(\\w+)"
    }
    else {
      return token;
    }
  });
  var regexp = new RexExp('^' + parts.join('/') + '/?$')
}

Router.prototype.get = function(path, handler) {
  var index = this._getRoutes.length;
  this._getRoutes[index] = ;
  this._getActions[index] = handler;
}

Router.prototype.post = function(path, handler) {
  this._postRoutes[path] = handler;
}

Router.prototype.route(req, res) {
  var urlParts = url.parse(req.url);

  switch(req.method) {
    case 'get':
      for (i = 0; i < route.length; i++) {
        var route = this._getRoutes;
        var match = route[i].exec(urlParts.pathname);
        if (match) {
          req.params = {};
          for (var j = 1; j < match.length; j++) {
            req.params[route.keys[j-1]] = match[j]
          }
          return this._getActions[i](req, res);
        }
      }
      res.statusCode = 404;
      res.statusMessage = "Resource not found";
      res.end();
      break;
    case 'post':
      break;
    default:
      var msg = "Unknown method " + req.method;
      res.statusCode(400);
      res.statusMessage = msg;
      console.error(msg)
      res.end(msg);
  }
}
