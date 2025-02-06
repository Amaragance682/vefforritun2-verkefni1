document.addEventListener('DOMContentLoaded', () => {
  console.log('Hello from the browser script!');
  const form = document.getElementById('quiz-form');
  const questions = Array.from(form.querySelectorAll('.questionDiv'));
  const submitButton = document.getElementById('submitButton');

  
  document.addEventListener('change', (evt) => {
    if (evt.target && evt.target.matches('input[type="radio"]')) {
      updateSubmitButtonState();
    }
  });

  submitButton.addEventListener('click', handleSubmit);
  form.addEventListener('change', updateSubmitButtonState);

  function updateSubmitButtonState() {
    const allAnswered = Array.from(questions).every(questionDiv => {
      return questionDiv.querySelector('input[type="radio"]:checked');
    });
    submitButton.disabled = !allAnswered; // ef allt er ekki answered er ekki haegt ad submita
  }
});



function handleSubmit() {
  document.querySelectorAll('.questionDiv').forEach((question) => {
    const selected = question.querySelector('input[type="radio"]:checked');
    const correct_answer = question.querySelector('input[data-is-correct="true"]');

    removeAnswerFeedback(question);
    showAnswerFeedback(correct_answer, selected);
  });
}

function showAnswerFeedback(correctAnswer, selectedAnswer) {
  if (correctAnswer === selectedAnswer) {
    selectedAnswer.classList.add("correct");
  } else {
    selectedAnswer.classList.add("incorrect");
    correctAnswer.classList.add("correct");
  }

}

function removeAnswerFeedback(question) {
  question.querySelectorAll('input').forEach((input) => {
    input.classList.remove("correct", "incorrect");
  })
}
  
