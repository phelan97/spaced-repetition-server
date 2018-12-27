
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const {questionData} = require('../db/questionData');

const createUser = async function(userData) {
  if(!userData.password) {
    throw('No password provided');
  }

  // build question array
  const questions = [];
  for(let i=0; i<questionData.length; i++) {
    const questionObj = {
      weight: 0,
      next: i+1,
      ...questionData[i]
    }
    questions[i] = questionObj;
  }

  // hash password and create user
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = await User.create(
    {
      ...userData,
      questions,
      password: hashedPassword
    }
  );
  
  return user;
}

module.exports = createUser;