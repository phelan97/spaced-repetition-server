
const jwt = require('jsonwebtoken');
const createUser = require('../../utils/create-user')
require('dotenv').config();

module.exports = async (root, args) => {
  const userArgs = {
    email: args.email,
    password: args.password,
    firstName: args.first,
    lastName: args.last
  }
  const user = await createUser(userArgs);
  return jwt.sign({user}, process.env.JWT_SECRET);
}