const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (root, args) => {
  const user = await User.findOne({email: args.email});
  if(!user) {
    throw('Invalid credentials');
  }
  const isAuthorized = bcrypt.compare(args.password, user.password);
  if(!isAuthorized) {
    throw('Invalid credentials');
  }
  return jwt.sign({user}, process.env.JWT_SECRET);
}