const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, minlength: 10},
  firstName: {type: String},
  lastName: {type: String}
});

userSchema.virtual('fullname').get(function() {
  return this.firstName + ' ' + this.lastName;
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, result) {
    delete result.password;
    delete result._id;
    return result;
  }
});

module.exports = mongoose.model('User', userSchema);