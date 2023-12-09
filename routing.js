const express = require('express');
const routing = express.Router();

const Members = require('./models/member');
const Messages = require('./models/message');

routing.route('/')
  .get(async (req, res, next) => {
    const allMessages = await Messages.find({}).exec();
    res.render('index', { 
      title: 'Messages',
      messages: allMessages,
    });
  });

routing.route('/sign-up')
  .get((req, res, next) => {
    res.render('sign-up', { title: 'Sign Up' })
  });

routing.route('/log-in')
  .get((req, res, next) => {
    res.render('log-in', { title: 'Log In' })
  });

routing.route('/new-message')
  .get((req, res, next) => {
    res.render('new-message', { title: 'New Message' })
  });

routing.route('/member/:id')
  .get(async (req, res, next) => {
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

module.exports = routing;