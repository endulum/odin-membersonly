const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  username: { type: string, required: true },
  password: { type: string, required: true }
});

MemberSchema.virtual(url).get(function() {
  return `/member/${this._id}`;
});

module.exports = mongoose.model('Member', MemberSchema);