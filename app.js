var createError = require('http-errors');
var express = require('express');
var exphbs  = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

var compression = require('compression');
var helmet = require('helmet');

var app = express();

// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url_ll='mongodb+srv://cc:fab@cluster0-ueaqu.mongodb.net/local_library?retryWrites=true';
var dev_db_url='mongodb+srv://cc:fab@cluster0-shard-00-00-ueaqu.mongodb.net/delivery_service?retryWrites=true';
//var dev_db_url = 'mongodb+srv://cc:fab@cluster0-ueaqu.mongodb.net/test?retryWrites=true'
var mongoDB = process.env.MONGODB_URI || dev_db_url_ll;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression()); // Compress all routes

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
