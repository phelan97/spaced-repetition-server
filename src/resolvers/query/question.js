
const Question = require('../../models/question');


module.exports = async (root, args, context) => {
  const decodedToken = context.isAuthorized();
  // Don't trust the jwt to be unmodified. Look up the next question by user id
  const user = await User.findById(decodedToken.user.id);
  const topQuestion = user.rootQuestion;
  // TODO: null checks?
  return topQuestion;
}