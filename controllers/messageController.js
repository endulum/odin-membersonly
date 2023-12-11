const Member = require('../models/member');
const Message = require('../models/message');

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.new_message_get = asyncHandler((req, res, next) => {
  res.render('new-message', { title: 'New Message' })
});

exports.new_message_post = [
  body('new-message')
    .trim()
    .isLength({ min: 1, max: 512 }).withMessage('Messages must be between 1 and 512 characters long.')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errorsArray = validationResult(req).array();
    if (res.locals.currentUser) {
      if (!res.locals.currentUserIsVerified) {
        errorsArray.push({ msg: 'You must be verified to send messages.'})
      }
    } else {
      errorsArray.push({ msg: 'You must be logged in and verified to send messages.' })
    }

    if (errorsArray.length > 0) {
      res.render('new-message', {
        title: 'New Message',
        errors: errorsArray
      })
    } else {
      let messageAuthor;
      try { messageAuthor = await Member.findOne({ username: res.locals.currentUser }) }
      catch { messageAuthor = null };

      if (messageAuthor === null) {
        const err = new Error('Member not found.');
        err.status = 404;
        return next(err);
      } // is this necessary? maybe

      await Message.create({
        author: messageAuthor,
        text: req.body['new-message']
      });

      res.redirect('/');
    }
  })
]

exports.delete_message_get = asyncHandler(async (req, res, next) => {
  let thisMessage;
  try { thisMessage = await Message.findById(req.params.id).populate('author').exec() }
  catch { thisMessage = null }

  if (thisMessage === null) {
    const err = new Error('Message not found.');
    err.status = 404;
    return next(err);
  }

  res.render('delete', {
    title: 'Delete Message',
    message: thisMessage
  });
});

exports.delete_message_post = asyncHandler(async (req, res, next) => {
  let thisMessage;
  try { thisMessage = await Message.findById(req.body.message_id).populate('author').exec() }
  catch { thisMessage = null }

  if (thisMessage === null) {
    const err = new Error('Message not found.');
    err.status = 404;
    return next(err);
  } else {
    await Message.findByIdAndDelete(req.body.message_id).exec();
    res.redirect('/');
  }
})