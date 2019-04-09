'use strict';
/* global Renderer */

class QuizDisplay extends Renderer {    // eslint-disable-line no-unused-vars
  getEvents() {
    return {
      'click .start': 'handleStart',
      'click .play-again': 'handlePlayAgain',
      'submit .question-form': 'handleQuestionSubmit',
      'click .continue': 'handleReviewContinue'
    };
  }

  _generateIntro() {
    return `
      <div>
        <header role="banner">
          <h1>Welcome to the Trivia Quiz<h1>
        </header>
        <p>
          Test your smarts and see how high you can score!
        </p>
      </div>
      <div>
        <button class="start">Start</button>
      </div>
    `;
  }

  _generateQuestion() {
    return `
      <form class="question-form">
        <label for="question-choices">${this.model.currQuestion().text}</label>
        <input type="radio" name="question-choices" value="${this.model.currQuestion().answers[0]}">${this.model.currQuestion().answers[0]}</input>
        <input type="radio" name="question-choices" value="${this.model.currQuestion().answers[1]}">${this.model.currQuestion().answers[1]}</input>
        <input type="radio" name="question-choices" value="${this.model.currQuestion().answers[2]}">${this.model.currQuestion().answers[2]}</input>
        <input type="radio" name="question-choices" value="${this.model.currQuestion().answers[3]}">${this.model.currQuestion().answers[3]}</input>
        <button type="submit" class="question-submit">Submit</button>
      </form>
    `;
  }

  _generateReviewCorrect() {
    return `
      <div>
        <h2>${this.model.currQuestion().text}<h2>
        <p>
          You got it!<br>The correct answer was:
        </p>
        <p class="correct-answer">
          ${this.model.currQuestion().correctAnswer}
        </p>
      </div>
      <div>
        <button class="continue">Continue</button>
      </div>
    `;
  }

  _generateReviewIncorrect() {
    return `
      <div>
        <h2>${this.model.currQuestion().text}<h2>
        <p>
          Sorry, that's incorrect.<br>You answered:
        </p>
        <p class="incorrect-answer">
          ${this.model.currQuestion().userAnswer}
        </p>
        <p>
          The correct answer was:
        </p>
        <p class="correct-answer">
          ${this.model.currQuestion().correctAnswer}
        </p>
      </div>
      <div>
        <button class="continue">Continue</button>
      </div>
    `;
  }

  _generateEnd() {
    let newHighScore = "";
    if (this.model.highScore() === this.model.score) {
      newHighScore = "That's a new high score!";
    }
    return `
      <div>
        <h2>Good job!<h2>
        <p>
          Your final score was ${this.model.score} out of ${this.model.asked.length}
        </p>
        <p>
          ${newHighScore}
        </p>
      </div>
      <div>
        <button class="play-again">Play Again</button>
      </div>
    `;
  }

  template() {
    if (this.model.active && this.model.currQuestion().answerStatus() === -1) {
      return this._generateQuestion();
    } 
    else if (this.model.active && this.model.currQuestion().answerStatus() === 0) {
      return this._generateReviewIncorrect();
    }
    else if (this.model.active && this.model.currQuestion().answerStatus() === 1) {
      return this._generateReviewCorrect();
    }
    // else if () {

    // }
    else {
      return this._generateIntro();
    }
  }

  handleStart() {
    this.model.startNewGame()
    .then(() => this.model.askNextQuestion())
    .then(() => this.model.update());
  }

  handlePlayAgain() {
    this.model.resetGame();
    this.model.startNewGame();
    this.model.update();
  }

  handleQuestionSubmit(event) {
    console.log(event);
    event.preventDefault();
    const answer = $("input[name='question-choices']:checked").val();
    this.model.submitAnswer(answer);
    this.model.update();
  }

  handleReviewContinue() {
    this.model.askNextQuestion();
    this.model.update();
  }

}
