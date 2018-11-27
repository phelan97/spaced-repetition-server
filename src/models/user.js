const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true, minlength: 10},
  firstName: {type: String},
  lastName: {type: String},
  rootQuestion: {type: ObjectId}
});

userSchema.virtual('fullname').get(function() {
  return this.firstName + ' ' + this.lastName;
});

userSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, result) {
    delete result.password;
    delete result.rootQuestion;
    delete result._id;
    return result;
  }
});

module.exports = mongoose.model('User', userSchema);