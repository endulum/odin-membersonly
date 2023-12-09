const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { DateTime } = require("luxon");

const MessageSchema = new Schema({
  author: { type: Schema.ObjectId, ref: 'Member', required: true },
  text: { type: String, required: true, maxLength: 512 },
  date: { type: Date, required: true, default: Date.now }
});

MessageSchema.virtual('date-formatted').get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model('Message', MessageSchema);