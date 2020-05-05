const express      = require('express');
const path         = require('path');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');
const engine       = require('ejs');
const LRU          = require('lru-cache');
const errorHandler = require('errorhandler');
const session      = require('express-session');
const bodyParser   = require('body-parser');
const mongoose     = require('./modules/mongoose');
const MongoStore   = require('connect-mongo')(session);
const indexRouter  = require('./routes/index');
const config       = require('./config/index');
const app          = express();
const http         = require('http');
const server       = http.createServer(app);

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: config.get('session:secret'),
  key:    config.get('session:key'),
  cookie: config.get('session:cookie'),
  store:  new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use(errorHandler());

server.listen(config.get('port'));

require('./socket/index')(server);

module.exports = app;
module.exports = server;