const createError = require('http-errors');
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const logger = require('morgan');

// start dotenv
const dotenv = require('dotenv');
dotenv.config();

// connect to mongo database
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGO;
main().catch(e => console.log(e));
async function main() { await mongoose.connect(mongoDB) }

// start the app
const app = express();

// get views from the 'views' directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// start the middleware chain
app.use(logger('dev'));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// temporary until favicon found
app.get('/favicon.ico', (req, res) => res.status(204));

// hook up routes
const routing = require('./routing');
app.use('/', routing);

// catch errors
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', {
    title: err.status,
    message: err.message
  });
});

// finally, start listening
app.listen(3000, () => console.log("app listening on port 3000"));