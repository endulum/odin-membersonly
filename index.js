const createError = require('http-errors');
const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const logger = require('morgan');

const Member = require('./models/member');

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

// TODO: what does this thing do exactly?
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const member = await Member.findOne({ username: username });
      if (!member) {
        return done(null, false, { message: "Incorrect username" });
      };
      const match = await bcrypt.compare(password, member.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, member);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser((member, done) => {
  done(null, member.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const member = await Member.findById(id);
    done(null, member);
  } catch(err) {
    done(err);
  };
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// temporary until favicon found
app.get('/favicon.ico', (req, res) => res.status(204));

// store user locally
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

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
  console.log(err.stack);
  res.render('error', {
    title: err.status,
    message: err.message
  });
});

// finally, start listening
app.listen(3000, () => console.log("app listening on port 3000"));