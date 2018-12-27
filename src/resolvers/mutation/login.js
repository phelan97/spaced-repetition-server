const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (root, args) => {
  const user = await User.findOne({email: args.email});
  if(!user) {
    throw('Invalid credentials');
  }
  const isAuthorized = await bcrypt.compare(args.password, user.password);
  if(!isAuthorized) {
    throw('Invalid credentials');
  }
  return jwt.sign({user}, process.env.JWT_SECRET);
}