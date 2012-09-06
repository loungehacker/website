process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.ENDPOINT = process.env.ENDPOINT || 'loungehackers.dev';
process.env.PORT = process.env.PORT || 1337;

// DOCS: http://expressjs.com/api.html

// == DEBUG

if (process.env.NODE_ENV !== 'test' && /true|1/i.test(process.env.NODETIME) && /\w+/.test(process.env.NODETIME_API_KEY)) {
  require('nodetime').profile({
    accountKey: process.env.NODETIME_API_KEY,
    appName: 'loungehackers'
  });
}

// == DEPENDENCIES

var express = require('express'),
    server = require('./server');


// == APP

var app = express();


// == CONFIG

// Development
app.configure('development', function() {
  app
    .use(express.logger({immediate: true, format: 'dev'}));

  app
    .use(express.errorHandler({
      showStack: true,
      dumpExceptions: true
    }));
});

// Staging
app.configure('staging', function() {
  app
    .use(express.logger({format: 'short'}));

  app
    .use(express.errorHandler({
      showStack: true,
      dumpExceptions: true
    }));
});

// Production
app.configure('production', function() {
  app
    .use(express.logger({format: 'short'}));

  app
    .use(express.errorHandler({
      showStack: false,
      dumpExceptions: false
    }));
});

// All
app.configure(function() {
  app.set('port', process.env.PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app
    .use(express.favicon(__dirname + '/public/favicon.ico'));

  app
    .use(require('connect-gzip').gzip()),

  app
    .use(express.responseTime());

  app
    .use(function(req, res, next) {
      res.charset = 'UTF-8';
      next();
    });

  app
    .use(function(req, res, next) {
      res.removeHeader('X-Powered-By');
      next();
    });

  app
    .use(require('connect-alive')());

  app
    .use(require('stylus').middleware({ src: __dirname + '/assets', dest: __dirname + '/public', force: (process.env.NODE_ENV === 'development') }));

  app
    .use(app.router);

  app
    .use(express.static(__dirname + '/public'));
});


// == ROUTES

// ...


// == EXPORT & RUN

app.start = function(callback) {
  server.start(app, callback);
};

module.exports = app;
