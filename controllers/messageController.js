const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.new_message_get = asyncHandler((req, res, next) => {
  res.render('new-message', { title: 'New Message' })
});

exports.new_message_post = [
  body('text')
    .trim()
    .escape(),

  asyncHandler((req, res, next) => {
    // ...
  })
]