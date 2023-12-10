const express = require('express');
const routing = express.Router();

const Members = require('./models/member');
const Messages = require('./models/message');

const MemberController = require('./controllers/memberController');
const MessageController = require('./controllers/messageController');

routing.route('/')
  .get(async (req, res, next) => {
    const allMessages = await Messages.find({}).populate('author').exec();
    console.log(allMessages);
    res.render('index', { 
      title: 'Messages',
      messages: allMessages,
    });
  });

routing.route('/sign-up')
  .get(MemberController.sign_up_get)
  .post(MemberController.sign_up_post);

routing.route('/log-in')
  .get(MemberController.log_in_get)
  .post(MemberController.log_in_post);

routing.route('/log-out')
  .get(MemberController.log_out_get);

routing.route('/member/:username')
  .get(MemberController.member_get);

routing.route('/new-message')
  .get(MessageController.new_message_get)
  .post(MessageController.new_message_post);

module.exports = routing;