const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = new Schema({
  username: { type: String, required: true, maxLength: 32 },
  password: { type: String, required: true, minLength: 8, maxLength: 64 },
  isVerified: { type: Boolean, required: true, default: false },
  isAdmin: { type: Boolean, required: true, default: false }
});

MemberSchema.virtual('url').get(function() {
  return `/member/${this.username}`;
});

module.exports = mongoose.model('Member', MemberSchema);