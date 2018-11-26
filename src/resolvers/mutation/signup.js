const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (root, args) => {
  const hashedPassword = await bcrypt.hash(args.password, 10);
  const userData = {
    email: args.email,
    password: hashedPassword,
    firstName: args.first,
    lastName: args.last
  }
  const user = await User.create(userData);
  return jwt.sign({user}, process.env.JWT_SECRET);
}