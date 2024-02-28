import readline from "readline";
import { Answer } from "./class/answer.js";
import { Question } from "./class/question.js";
const answer_1 = new Answer("a", "2023");
const answer_2 = new Answer("b", "2024");
const question1 = new Question(
  "1",
  "¿En que año estamos?",
  [answer_1, answer_2],
  answer_2,
  1
);
let questions = [question1];
let end = false;
let puntaje = 0;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

while (!end) {
  console.log(
    "Por favor marque con una letra la alternativa que considere correcta. \r"
  );
  questions.forEach((question) => {
    console.log(`${question._title} \r`);
    question._answers.forEach((answer) => {
      console.log(`${answer._name}) ${answer._statement} \r`);
    });
    rl.question("Respuesta: ", (answer) => {
      answer == question._correct_answer._name ? puntaje++ : null;
      rl.close();
    });
  });
  end = true;
}
//console.log(`Su puntaje es: ${puntaje}`);
