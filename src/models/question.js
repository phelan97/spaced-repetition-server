const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const questionSchema = new mongoose.Schema({
  englishWord: {type: String, required: true},
  germanWord: {type: String, required: true},
  next: {type: ObjectId}
});

questionSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, result) {
    delete result._id;
    return result;
  }
});

module.exports = mongoose.model('Question', questionSchema);
