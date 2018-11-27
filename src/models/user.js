const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, minlength: 10},
  firstName: {type: String},
  lastName: {type: String},
  questions: [
    {
      englishWord: {type: String, required: true},
      germanWord: {type: String, required: true},
      weight: Number,
      next: Number
    }
  ],
  head: {type: Number, default: 0}
});

userSchema.virtual('fullname').get(function() {
  return this.firstName + ' ' + this.lastName;
});

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, result) {
    delete result.password;
    delete result.head;
    delete result.questions;
    delete result._id;
    return result;
  }
});

module.exports = mongoose.model('User', userSchema);