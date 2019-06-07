const express = require('express')              
const path = require('path');
const http = require('http');
const morgan  = require('morgan');            // For request/response logging
const morganBody  = require('morgan-body')    // For request/response body logging
const usersApi = require('./routes/user_api');
const booksApi = require('./routes/library_api');
const bodyParser = require('body-parser');    // pull information from HTML POST (express4)
const jwt = require('./jwt');
const errorHandler = require('./error-handler');
const mongoose = require('mongoose');
const config = require('./mongodb/DB');

// DB Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);

const app = express();

app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json  

// Logging with Morgan
app.use(morgan( ':url :req[Authorization]'));
morganBody(app);   // display request/response body (including password!)

// use JWT auth to secure the api
app.use(jwt());

// Intercept api calls for extra validation. e.g username matches jwt
app.use('/api',function (req, res, next) {
    console.log("request jwt data =");
    console.log(req.user);
    //console.log("request auth=" + req.get('Authorization'));
    if (req.user) {
        console.log("request username="+req.user.sub);
    }
    // Extra token validation. Validate username here?
    next();
});

// Redirect api calls to Express Routers
app.use('/api/user', usersApi);
app.use('/api/library', booksApi);

// Global error handler
app.use(errorHandler);

// Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

// Create and start the Node server
const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));