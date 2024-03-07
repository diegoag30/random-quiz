// quiz.js

let quizData = []; // Empty array to hold questions and answers
let currentQuestionIndex = 0;

// Function to parse questions from CSV content using PapaParse
function parseQuestionsFromCSV(csvContent) {
  const questions = [];
  Papa.parse(csvContent, {
    header: false,
    skipEmptyLines: true,
    complete: function (results) {
      results.data.forEach((row) => {
        console.log(row);
        const questionParts = row.map((part) => part.trim());
        console.log(questionParts);
        if (questionParts.length > 1) {
          // Ensure question and at least one option are provided
          const question = {
            question: questionParts[0], // First part is the question
            answer: questionParts[1], // Second part is the correct answer
            options: questionParts.slice(2), // Remaining parts are options
          };
          questions.push(question);
        }
      });
      console.log("Parsed quiz data:", questions); // Log the parsed quiz data
    },
  });
  return questions;
}

// Function to end the quiz and show the result
function endQuiz() {
  const totalQuestions = quizData.length;
  const correctAnswers = quizData.filter(
    (question) => question.answeredCorrectly
  ).length;
  const incorrectAnswers = totalQuestions - correctAnswers;

  const resultMessage = `Quiz ended!\nTotal Questions: ${totalQuestions}\nCorrect Answers: ${correctAnswers}\nIncorrect Answers: ${incorrectAnswers}`;
  alert(resultMessage);
}

// Function to check the answer selected by the user
function checkAnswer(selectedOption) {
  const currentQuestion = quizData[currentQuestionIndex];
  if (selectedOption === currentQuestion.answer) {
    // Handle correct answer
    console.log("Correct answer!");
  } else {
    // Handle incorrect answer
    console.log("Incorrect answer!");
  }
  // Move to the next question
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    displayQuestion();
  } else {
    // End of quiz
    endQuiz();
  }
}

// Function to display a question
function displayQuestion() {
  const questionElement = document.getElementById("question");
  const optionsElement = document.getElementById("options");

  // Clear previous question and options
  questionElement.textContent = "";
  optionsElement.innerHTML = "";

  // Check if currentQuestionIndex is within bounds
  if (currentQuestionIndex >= 0 && currentQuestionIndex < quizData.length) {
    // Get current question
    const currentQuestion = quizData[currentQuestionIndex];

    // Display question
    questionElement.textContent = currentQuestion.question;

    // Display options
    currentQuestion.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () => checkAnswer(option));
      optionsElement.appendChild(button);
    });
  } else {
    console.log("No more questions or index out of bounds.");
  }
}

document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const csvContent = e.target.result;
        quizData = parseQuestionsFromCSV(csvContent);
        document.getElementById("startButton").disabled = false;
      };
      reader.readAsText(file);
    }
  });

document.getElementById("startButton").addEventListener("click", function () {
  displayQuestion();
  document.getElementById("startButton").style.display = "none";
  document.getElementById("nextButton").style.display = "block";
});

// Quiz logic...
