const answers = [
    'cat', 'dog', 'sheep', 'python',
    'life', 'poop', 'laser', 'random'
]
const guessLimit = 7;
let answer = '';
let answerArray = []
let remainingLetters = 0
let wordStatus = null;

let mistakes = 0;
let lives = 7;
let score = 0;
let guessed = [];




// generate keyboard to click on to choose answers
function generateKeyboardButtons() {    
    let letterHTML = 'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => {
        return `
        <button class="btn btn-lg btn-primary m-2" id="${letter}" onClick="handleGuess('${letter}')">
        ${letter}
        </button>
        `
    }).join('')
    document.querySelector('#keyboard').innerHTML = letterHTML
}

// chooses random word from answers array
function chooseWord() {
    answer = answers[Math.floor(Math.random() * answers.length)];
    remainingLetters = answer.length;
    for (let i = 0; 9 < answer.length; i++) {
        answer[i] = "_"
    };
}
function guessedWord() {
    let splitAnswer = answer.split('');
    let convertedAnswer = [];
    for (let i = 0; i < splitAnswer.length; i++) {
        if (guessed.indexOf(splitAnswer[i]) >= 0) {
            convertedAnswer.push(splitAnswer[i]);
        } else {
            convertedAnswer.push(" _ ");
        }
    }
    wordStatus = convertedAnswer.join('');
    document.querySelector("#wordSpotlight").textContent = convertedAnswer.join('');
}

function handleGuess(letter) {
    let answerArray = answer.split('');
    if (guessed.indexOf(letter) === -1) {
        guessed.push(letter);
    }
    document.getElementById(letter).setAttribute('disabled', true);
    
    if (answer.indexOf(letter) >= 0) {
        answerArray.forEach(answerLetter => {
            if (answerLetter === letter) {
                score++;
                console.log('yes')
            }
        })
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
    console.log(wordStatus, answer)
    if (wordStatus === answer){
        console.log("Succesfully won!")
        document.querySelector('#keyboard').innerHTML = "You have won a round! Keep going to increase your score!"
        document.querySelector('#wordHint').innerHTML = "Reset the game!"
        document.querySelector("#continueButton").style.display = "inline-block";
    }
}

function lose() {
    console.log(mistakes, guessLimit);
    if (mistakes === guessLimit) {
        document.querySelector('#wordSpotlight').innerHTML = ` ${answer}`;
        document.querySelector('#keyboard').innerHTML = "You have lost the round and lost 1 life."
        document.querySelector('#wordHint').innerHTML = "Please try again."
        lives--;
        updateLives();
        console.log("Lost round")
        document.querySelector("#continueButton").style.display = "inline-block";
    }
}

function updateHangmanImage() {
    console.log("Update the hangman image to reflect wrong guess")
}

function updateMistakes() {
    document.querySelector('#mistakes').innerHTML = mistakes;
}

function updateLives() {
    document.querySelector('#lives').innerHTML = `You currently have ${lives} lives`
}

function updateScore() {
    document.querySelector('#score').innerHTML = `Score: ${score}`
}

function continueGame() {
    mistakes = 0;
    guessed = [];

    chooseWord();
    guessedWord();
    generateKeyboardButtons();

    updateMistakes();
    updateScore();
    updateLives();
    document.querySelector("#continueButton").style.display = "none";
}

function reset() {
    score = 0;
    lives = 7;
    mistakes = 0;
    guessed = [];

    chooseWord();
    guessedWord();
    generateKeyboardButtons();

    updateMistakes();
    updateScore();
    updateLives();
    document.querySelector("#continueButton").style.display = "none";
}


function main() {
    document.querySelector('#guessLimit').textContent = guessLimit;
    document.querySelector("#continueButton").style.display = "none";
    
    chooseWord();
    guessedWord()
    generateKeyboardButtons();
    console.log(answer)
    
}

main();
