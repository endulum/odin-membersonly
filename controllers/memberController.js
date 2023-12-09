const Member = require('../models/member');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require('passport');

exports.sign_up_get = (req, res, next) => {
  res.render('sign-up', { title: 'Sign Up' })
};

exports.sign_up_post = [
  body('username')
    .trim()
    .notEmpty().withMessage('Please input a username.')
    .isAlphanumeric().withMessage('Username can only consist of letters and numbers.')
    .escape(),

  body('password')
    .trim()
    .notEmpty().withMessage('Please input a password.')
    .escape(),
  // todo: escaping a password can change it up? how to work around this?

  asyncHandler(async (req, res, next) => {
    const errorsArray = validationResult(req).array();
    const existingMember = await Member.findOne({ username: req.body.username }).exec();
    if (existingMember !== null) {
      errorsArray.push({ msg: 'A member already exists with this username. Please choose another.' })
    };
    if (errorsArray.length > 0) {
      res.render('sign-up', {
        title: 'Sign Up',
        username: req.body.username,
        errors: errorsArray
      });
    } else {
      await Member.create({
        username: req.body.username,
        password: req.body.password
      });
      next();
    }
  }),

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
];

exports.log_in_get = (req, res, next) => {
  res.render('log-in', { title: 'Log In' })
};

exports.log_in_post = [
  body('username')
    .trim()
    .notEmpty().withMessage('Please input a username.')
    .escape(),

  body('password')
    .trim()
    .notEmpty().withMessage('Please input a password.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errorsArray = validationResult(req).array();
    const existingMember = await Member.findOne({ username: req.body.username }).exec();
    if (existingMember === null) {
      errorsArray.unshift({ msg: 'No members exist with that username.' })
    };
    if (errorsArray.length > 0) {
      res.render('log-in', {
        title: 'Log In',
        username: req.body.username,
        errors: errorsArray
      });
    } else { next() }
  }),

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
];

exports.log_out_get = asyncHandler((req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

exports.member_get = asyncHandler(async (req, res, next) => {
  let thisMember;
  try { thisMember = await Member.findOne({ username: req.params.username }) }
  catch { thisMember = null };

  if (thisMember === null) {
    const err = new Error('Member not found.');
    err.status = 404;
    return next(err);
  } else {
    res.render('member', {
      title: `${thisMember.username}`,
      member: thisMember
    });
  };
});