const Member = require('../models/member');
const Message = require('../models/message');
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require('passport');
const bcrypt = require('bcryptjs');

exports.sign_up_get = (req, res, next) => {
  if (res.locals.currentUser) {
    res.redirect('/');
  } else {
    res.render('sign-up', { title: 'Sign Up' });
  }
};

exports.sign_up_post = [
  body('username', 'Please input a username.')
    .trim()
    .isLength({ min: 1, max: 32 }).withMessage('Usernames must be between 1 and 32 characters long.')
    .isAlphanumeric().withMessage('Username can only consist of letters and numbers.')
    .escape(),

  body('password')
    .trim()
    .isLength({ min: 8, max: 64 }).withMessage('Password must be between 8 and 64 characters long.')
    .escape(),

  body('confirm-password')
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    }).withMessage('Passwords do not match.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    if (res.locals.currentUser) {
      res.redirect('/');
    } else {
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
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
          if (err) return next(err);
          const member = await Member.create({
            username: req.body.username,
            password: hashedPassword
          });
          req.login(member, (err) => {
            if (err) return next(err);
            return res.redirect(`/member/${req.user.username}`)
          });
        });
      }
    }
  }),
];

exports.log_in_get = (req, res, next) => {
  if (res.locals.currentUser) {
    res.redirect('/');
  } else {
    let loginErrors = [];
    if (req.session.messages) {
      req.session.messages.forEach(message => {
        loginErrors.push({ msg: message })
      });
      req.session.messages = null;
      // clearing out the messages might have an unintended effect?
    };

    res.render('log-in', {
      title: 'Log In',
      errors: loginErrors.length > 0 ? loginErrors : null
    })
  }
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
    if (res.locals.currentUser) {
      res.redirect('/');
    } else {
      const errorsArray = validationResult(req).array();
      if (errorsArray.length > 0) {
        res.render('log-in', {
          title: 'Log In',
          username: req.body.username,
          errors: errorsArray
        });
      } else {
        next();
      }
    }
  }),

  // TODO: what does this do exactly?
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureMessage: true,
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
    const thisMembersMessages = await Message.find({ author: thisMember });
    res.render('member', {
      title: `${thisMember.username}`,
      member: thisMember,
      messages: thisMembersMessages
    });
  };
});

exports.member_post = [
  body('passcode')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    let thisMember;
    try { thisMember = await Member.findOne({ username: req.params.username }) }
    catch { thisMember = null };

    if (thisMember === null) {
      const err = new Error('Member not found.');
      err.status = 404;
      return next(err);
    }

    if (req.body.passcode === 'ilovecomputers') {
      thisMember.isVerified = true;
      await thisMember.save();
      res.redirect(`/member/${thisMember.username}`)
    } else {
      const thisMembersMessages = await Message.find({ author: thisMember });
      res.render('member', {
        title: `${thisMember.username}`,
        member: thisMember,
        messages: thisMembersMessages,
        wrongPasscode: true
      })
    }
    // res.redirect(`/member/${res.locals.currentUser}`);
  })
]