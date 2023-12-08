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

// set up routes
const router = express.Router();
router.route('/')
  .get((req, res, next) => {
    res.send('Hello World')
  });
app.use('/', router);

// finally, start listening
app.listen(3000, () => console.log("app listening on port 3000"));