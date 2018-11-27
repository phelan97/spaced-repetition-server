
const User = require('../../models/user');

module.exports = async (root, args, context) => {
  const decodedToken = context.isAuthorized();
  // Don't trust the jwt to be unmodified. Look up the next question by user id
  const user = await User.findById(decodedToken.user.id);
  const topQuestion = user.questions[user.head];
  // TODO: null checks?
  return topQuestion;
}