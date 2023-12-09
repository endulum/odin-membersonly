const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.sign_up_get = (req, res, next) => {
  res.render('sign-up', { title: 'Sign Up' })
};

exports.sign_up_post = [
  body('username')
    .trim()
    .escape(),

  body('password')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    console.log(req.body);
    res.redirect('/sign-up');
  })
];

exports.log_in_get = (req, res, next) => {
  res.render('log-in', { title: 'Log In' })
};

exports.log_in_post = [
  body('username')
    .trim()
    .escape(),

  body('password')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    console.log(req.body);
    res.redirect('/log-in');
  })
];

exports.member_get = asyncHandler(async (req, res, next) => {
  let thisMember;
  try { thisMember = await Members.findById(req.params.id) }
  catch { thisMember = null };

  if (thisMember === null) {
    const err = new Error('Member not found.');
    err.status = 404;
    return next(err);
  } else {
    res.render('member', {
      title: `Viewing Member: ${thisMember.username}`,
      member: thisMember
    });
  };
});