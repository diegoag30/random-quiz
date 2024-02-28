export class Question {
  constructor(name, title, answers, correct_answer, score) {
    this._name = name;
    this._title = title;
    this._answers = answers;
    this._correct_answer = correct_answer;
    this._score = score;
  }
}
