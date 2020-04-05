var firebaseConfig = {
  apiKey: "AIzaSyDtFiyzTNb7eUDLeNHfASR-sZDcljMn8eQ",
  authDomain: "hangman-ee2cd.firebaseapp.com",
  databaseURL: "https://hangman-ee2cd.firebaseio.com",
  projectId: "hangman-ee2cd",
  storageBucket: "hangman-ee2cd.appspot.com",
  messagingSenderId: "508758567676",
  appId: "1:508758567676:web:094859b07a9c8c1bd4c579",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const answers = [
  "cat",
  "dog",
  "sheep",
  "python",
  "jazz",
  "dwarves",
  "tattoo",
  "electricity",
  "fuchsia",
  "espionage",
  "embezzle",
  "daiquiri",
  "committee",
];

const hints = [
  "an evil creature",
  "a furry creature",
  "precursor of haggis",
  "a reptile",
  "type of music",
  "A fictional character",
  "a form of body modification where a design is made by inserting ink",
  "is the set of physical phenomena associated with the presence and motion of electric charge",
  "A color",
  "A military tactic",
  "To funnel or steal out from",
  "Type of drink",
  "A group of people",
];

const testwords = {
  committee: "a group of people",
  Jazz: "a style",
  daiquiri: "Type of drink",
  dizzying: "Type of feeling",
  duplex: "Style of housing",
  dwarves: "Fictional Character",
  embezzle: "To funnel or steal out from",
  equip: "Verb",
  espionage: "Military Tactic",
  fuchsia: "A Color",
};

function pickWord(obj) {
  let keys = Object.keys(obj);
  // let randomkey= [keys.length * Math.random() <<0]
  let randomNumber = Math.floor(keys.length * Math.random());
  let randomKey = keys[randomNumber];
  console.log(randomKey);
  console.log(obj[randomKey]);
}

const guessLimit = 7;
let answer = "";
let answerArray = [];
let remainingLetters = 0;
let wordStatus = null;

let mistakes = 0;
let lives = 7;
let score = 0;
let guessed = [];

// generate keyboard to click on to choose answers

function Button(letter) {
  this.letter = letter;
  this.btn = document.createElement("button");
  this.btn.className = "btn btn-lg btn-primary m-2";
  this.btn.id = letter;
  this.btn.innerHTML = letter;
  document.querySelector("#keyboard").appendChild(this.btn);
}

function generateKeyboardButtons() {
  let letterHTML = "abcdefghijklmnopqrstuvwxyz".split("").forEach((letter) => {
    let button = new Button(letter);
    button.btn.onclick = () => {
      handleGuess(button.letter);
    };
  });
}

// chooses random word from answers array
function chooseWord() {
  answer = answers[Math.floor(Math.random() * answers.length)];
  remainingLetters = answer.length;
  for (let i = 0; 9 < answer.length; i++) {
    answer[i] = "_";
  }
  thisHint = answers.indexOf(answer);
  hintString = hints[thisHint];
  document.getElementById("wordHint").innerHTML = hintString;
  console.log(`my hint ${hintString} for word ${answer}`);
}
function guessedWord() {
  let splitAnswer = answer.split("");
  let convertedAnswer = [];
  for (let i = 0; i < splitAnswer.length; i++) {
    if (guessed.indexOf(splitAnswer[i]) >= 0) {
      convertedAnswer.push(splitAnswer[i]);
    } else {
      convertedAnswer.push(" _ ");
    }
  }
  wordStatus = convertedAnswer.join("");
  document.querySelector("#wordSpotlight").textContent = convertedAnswer.join(
    ""
  );
}

function handleGuess(letter) {
  let answerArray = answer.split("");
  if (guessed.indexOf(letter) === -1) {
    guessed.push(letter);
  }
  document.getElementById(letter).setAttribute("disabled", true);

  if (answer.indexOf(letter) >= 0) {
    answerArray.forEach((answerLetter) => {
      if (answerLetter === letter) {
        score++;
        console.log("yes");
      }
    });
    guessedWord();
    win();
    updateScore();
  } else if (answer.indexOf(letter) === -1) {
    mistakes++;
    score--;
    updateMistakes();
    lose();
    updateHangmanImage();
    updateScore();
  }
}

function win() {
  console.log(wordStatus, answer);
  if (wordStatus === answer) {
    console.log("Succesfully won!");
    document.querySelector("#keyboard").innerHTML =
      "You have won a round! Keep going to increase your score! <br> Or enter your name to post your score to leaderboard!";
    document.querySelector("#wordHint").innerHTML = "Reset the game!";
    document.querySelector("#continueButton").style.display = "inline-block";
    document.querySelector("#submitForm").style.display = "inline-block";
  }
}

function lose() {
  console.log(mistakes, guessLimit);
  if (mistakes === guessLimit) {
    document.querySelector("#wordSpotlight").innerHTML = ` ${answer}`;
    document.querySelector("#keyboard").innerHTML =
      "You have lost the round and lost 1 life.";
    document.querySelector("#wordHint").innerHTML = "Please try again.";
    lives--;
    updateLives();
    console.log("Lost round");
    document.querySelector("#continueButton").style.display = "inline-block";
  }
}

function updateHangmanImage() {
  document.getElementById("hangman").src = `transparent stickman/img${
    mistakes + 1
  }.png`;

  console.log("Update the hangman image to reflect wrong guess");
}

function updateMistakes() {
  document.querySelector("#mistakes").innerHTML = mistakes;
}

function updateLives() {
  document.querySelector(
    "#lives"
  ).innerHTML = `You currently have ${lives} lives`;
}

function updateScore() {
  document.querySelector("#score").innerHTML = `Score: ${score}`;
}

function continueGame() {
  mistakes = 0;
  guessed = [];
  document.querySelector("#keyboard").innerHTML = "";
  updateHangmanImage();
  chooseWord();
  guessedWord();
  generateKeyboardButtons();

  updateMistakes();
  updateScore();
  updateLives();
  document.querySelector("#continueButton").style.display = "none";
  document.querySelector("#submitForm").style.display = "none";
}

function reset() {
  score = 0;
  lives = 7;
  mistakes = 0;
  guessed = [];
  document.querySelector("#keyboard").innerHTML = "";
  chooseWord();
  guessedWord();
  generateKeyboardButtons();
  updateHangmanImage();
  updateMistakes();
  updateScore();
  updateLives();
  document.querySelector("#continueButton").style.display = "none";
  document.querySelector("#submitForm").style.display = "none";
}

function readJson() {
  let object = JSON.parse(testwords);
}

function sendScore() {
  let ref = database.ref();
  let name = document.querySelector("#nameInput").value;
  let data = {
    name: name,
    score: score,
  };
  ref.push(data);
  ref.on("value", gotData, errData);

  reset();
}

function gotData(data) {
  let scores = data.val();
  let keys = Object.keys(scores);
  console.log(keys);
  keys.forEach((key) => {
    let name = scores[key].name;
    let score = scores[key].score;
    console.log(name, score);
  });
}

function errData(err) {
  console.log("Error");
  console.log(err);
}

function main() {
  let parent = document.createElement("div");
  parent.id = "submitForm";
  let input = document.createElement("input");
  input.type = "text";
  input.id = "nameInput";
  input.placeholder = "Enter your name";
  parent.appendChild(input);
  let btn = document.createElement("button");
  btn.type = "button";
  btn.id = "submitScore";
  btn.onclick = sendScore;
  btn.innerHTML = "Submit Score";
  parent.appendChild(btn);
  document.querySelector(".text-center").appendChild(parent);

  parent.style.display = "none";
  document.querySelector("#guessLimit").textContent = guessLimit;
  document.querySelector("#continueButton").style.display = "none";

  chooseWord();
  guessedWord();
  generateKeyboardButtons();
  console.log(answer);
}

main();
