const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  author: { type: Schema.ObjectId, ref: 'Member', required: true },
  text: { type: String, required: true, maxLength: 512 },
  date: { type: Date, required: true, default: Date.now }
});

MessageSchema.virtual('date_formatted').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString({ month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' });
});

module.exports = mongoose.model('Message', MessageSchema);