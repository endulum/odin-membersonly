const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, required: true, default: false }
});

MemberSchema.virtual('url').get(function() {
  return `/member/${this.username}`;
});

module.exports = mongoose.model('Member', MemberSchema);