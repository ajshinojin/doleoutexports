var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//routes
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var staffRouter = require('./routes/staff');

//npm install express-handlebars
var hbs=require('express-handlebars')

//fileUpload
var fileUpload=require('express-fileupload')
var app = express()

//connection
var db=require('./config/connection')

//npm i express-session
var session=require('express-session')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//fileupload
app.use(fileUpload())


//npm i express-session
app.use(session({secret:"Key", cookie:{maxAge:600000}}))


//connection
db.connect((err)=>{
  if(err) console.log("Database error"+err);
  else console.log("Database conncetd")
})

//routes



app.use('/', usersRouter);

app.use('/admin', adminRouter );
app.use('/staff', staffRouter );


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

app.listen(8000, () => {
  console.log("Server has been started")
})

module.exports = app;
 