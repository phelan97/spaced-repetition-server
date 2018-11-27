const User = require('../../models/user');

module.exports = async (root, args, context) => {
  const decodedToken = context.isAuthorized();
  // find user data and load the questions array
  const user = await User.findById(decodedToken.user.id);
  const currentIndex = user.head;
  const questions = user.questions;
  const question = questions[currentIndex];

  // save the next index to set the head to
  let nextIndex = question.next;
  if(!nextIndex || nextIndex >= questions.length) {
    nextIndex = 0;
  }

  // check if the user got the question right
  if(question.germanWord.toUpperCase() === args.germanAnswer.toUpperCase()) {
    let currentQuestion = question;
    let questionIndex = currentIndex;
    // find the end of the "linked list"
    while(currentQuestion.next && currentQuestion.next < questions.length) {
      questionIndex = currentQuestion.next;
      currentQuestion = questions[questionIndex];
    }
    // TODO: can the current question still be null/undefined/out of bounds here?
    // Append the answered question to the very end of the list
    questions[questionIndex].next = currentIndex;
    // TODO: note that the answered question isn't updated to point to another element

    console.log('set question ' + questionIndex + ' to point to question ' + currentIndex);
    console.log('updated the head from ' + user.head + ' to ' + nextIndex);
    // update questions array in the database
    await User.updateOne({_id: decodedToken.user.id}, {questions, head: nextIndex})
    return true;
  }
  // For now don't move the head if the answer is incorrect. With this implementation
  // the question will only change when the user enters the expected answer
  return false;
}