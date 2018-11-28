const User = require('../../models/user');

module.exports = async (root, args, context) => {
  const decodedToken = context.isAuthorized();
  const user = await User.findById(decodedToken.user.id);
  const currentIndex = user.head;
  // questions array gets saved back to the db at the end
  const questions = user.questions;
  const question = questions[currentIndex];

  // save the next index to set the head to
  let nextIndex = question.next;
  if(!nextIndex || nextIndex >= questions.length) {
    nextIndex = 0;
  }

  let isCorrect = false;

  // FIXME: workaround for question weight because it isn't defaulting to 1 properly on the schema
  let weight = question.weight;
  if(weight <= 1) weight = 1;

  if(question.germanWord.toUpperCase() === args.germanAnswer.toUpperCase()) {
    weight *= 2;
    isCorrect = true;
  } else {
    weight = 1;
  }
  questions[currentIndex].weight = weight;

  // console.log('starting word: ', question);

  // TODO: can the current question still be null/undefined/out of bounds here?
  let currentQuestion = question;
  let questionIndex = currentIndex;
  let count = 0;
  // traverse the "linked list"
  while(currentQuestion.next < questions.length) {
    // move back based on weight (or until the end of the list)
    if(count === weight) {
      break;
    }
    questionIndex = currentQuestion.next;
    currentQuestion = questions[questionIndex];
    // console.log('current word: ', currentQuestion.germanWord, ' at index ', questionIndex);
    count++;
  }

  // Insert the answered question to its appropriate location in the list, depending on weight
  // console.log('currentQuestion', currentQuestion);
  // console.log('updated the head from ' + user.head + ' to ' + nextIndex);
  questions[currentIndex].next = currentQuestion.next;
  questions[questionIndex].next = currentIndex;

  await User.updateOne({_id: decodedToken.user.id}, {questions, head: nextIndex});
  return isCorrect;
}