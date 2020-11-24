var createError = require('http-errors'),
  express = require('express'),
  path = require('path'),
  cookieParser = require('cookie-parser'),
  logger = require('morgan'),
  compression = require('compression'),
  favicon = require('serve-favicon');

require('dotenv').config();

var app = express();
app.use(compression());
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routing ADMIN
var adminRouter = require('./routes/admin/admin');

// Routing INDEX
var indexRouter = require('./routes/index');

app.use('/admin', adminRouter);
app.use('/', indexRouter);


var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(err, req, res, next) {
  logger.error(err);
  return res.render('site/default/404', { title: ' 404' });
});

module.exports = app;
