/* Flashcards Functionality


const term = document.querySelector('.term');
const definition = document.querySelector('.definition');
const checkButton = document.querySelector('.check');
const nextButton = document.querySelector('.next');


cards = {
    "term": "definition",
    "term2": "definition2",
    "term3": "definition3"
}

data = Object.entries(cards);

function getRandomWord() {
    randomterm = data[Math.floor(Math.random() * data.length)];
    term.innerHTML = `<h3>${randomterm[0]}</h3>`;
    definition.innerHTML = `<h3>${randomterm[1]}</h3>`;
}

checkButton.addEventListener('click', function(){
  definition.style.display = 'block';
});

nextButton.addEventListener('click', function(){
  getRandomWord();
});
 */


const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const flipButton = document.getElementById('flip-btn');
const courseButton = document.getElementById('course-btn');
const questionContainerElement = document.getElementById('question-container');
const timerElement = document.getElementById('timer');
const questionElement = document.getElementById('question');
const resultElement = document.getElementById('result');
const resultTwoElement = document.getElementById('result-two');
const statusElement = document.getElementById('status');
const answerButtonsElement = document.getElementById('answer-buttons');
const questionImageElement = document.getElementById('question-image');
const questionCountSelect = document.getElementById('questionCount');
const questionCategorySelect = document.getElementById('questionCategory');
let shuffledQuestions, currentQuestionIndex;
let correctCount = 0;
let incorrectCount = 0;
let isClickLocked = false;
let flipped = false;
let flipClickCount = 0;
let currentImageInterval = null;


function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        setNextQuestion();
    } else {
        // Reset the current question index and reshuffle the questions
        currentQuestionIndex = 0;
        shuffledQuestions = shuffle(questions).slice(0, numQuestions);
        setNextQuestion();
    }
    // Unlock click functionality when "Next" button is clicked
    isClickLocked = false;
}

startButton.addEventListener('click', () => {
    const selectedValue = questionCountSelect.value;
    const selectedRulebook = questionCategorySelect.value;

    // Determine the number of questions based on the selected value
    let numQuestions;
    if (selectedValue === 'all') {
        numQuestions = questions.length;
    } else {
        numQuestions = parseInt(selectedValue, 10);
    }

    // Filter the questions based on the selected rulebook
    let filteredQuestions = questions;
    if (selectedRulebook !== 'all') {
        filteredQuestions = questions.filter(question => {
            return Array.isArray(question.category) 
                ? question.category.includes(selectedRulebook)
                : question.category === selectedRulebook;
        });
    }

    // Reset the current question index
    currentQuestionIndex = 0;

    // Shuffle the filtered questions and take the first numQuestions
    shuffledQuestions = shuffle(filteredQuestions).slice(0, numQuestions);

    // Log the number of questions
    console.log(`Number of questions: ${shuffledQuestions.length}`);

    // Remove existing event listeners
    flipButton.removeEventListener('click', flipCard);
    nextButton.removeEventListener('click', nextQuestion);

    // Add new event listeners
    flipButton.addEventListener('click', flipCard);
    nextButton.addEventListener('click', nextQuestion);

    startGame(); // Call startGame function after setting up the game
});function startGame() {
    startButton.classList.add('hide');
    flipButton.classList.remove('hide');
     questionCountSelect.classList.add('hide');
    questionCategorySelect.classList.add('hide');
    /* statusElement.classList.remove('hide');
    statusElement.style.display = 'flex'; */
    currentQuestionIndex = 0;
    questionContainerElement.classList.remove('hide');
    timerElement.style.display = 'block';
    flipClickCount = 0;
    setNextQuestion();
}

function flipCard() {
    flipClickCount++;
    console.log(flipClickCount);
    console.log(flipped);
    const timeBar = document.querySelector(".round-time-bar");
    timeBar.style.display = 'none';
    if (flipped === false) {
        answerButtonsElement.classList.remove('hide');
        questionElement.classList.add('hide');
        timeBar.style.display = 'block';
        flipped = true;

        // Start the timer when the card is flipped for the first time
        if (flipClickCount === 1) {
            startTimer();
        }
    }
    else {
        answerButtonsElement.classList.add('hide');
        questionElement.classList.remove('hide');
        timeBar.style.display = 'none';
        flipped = false;
    }

    if (flipClickCount > 0) {
        timeBar.style.display = 'block';
    }
}

function setNextQuestion() {
    if (currentImageInterval) {
        clearInterval(currentImageInterval);
        currentImageInterval = null; // Set the interval ID to null
    }
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
    const timeBar = document.querySelector(".round-time-bar");
    timeBar.style.display = 'none';
    // Unlock click functionality when a new question is set
    isClickLocked = false;
    flipped = false;
    flipClickCount = 0; // Reset flipClickCount for the next question
    startTime = null; // Reset startTime for the next question
    flipButton.classList.remove('hide');
    answerButtonsElement.classList.add('hide');
    questionImageElement.classList.remove('hide');
    questionElement.classList.remove('hide');
    timeBar.style.display = 'none';
    document.getElementById('icon').style.display = 'none';

     // Clear the interval that toggles the display of the whistle-back image
     if (whistleBackInterval) {
        clearInterval(whistleBackInterval);
        whistleBackInterval = null;
    }
}

let startTime;
let totalPoints = 0;
function startTimer() {
    startTime = new Date();
}

function calculatePoints() {
    let endTime = new Date();
    let timeDiff = endTime - startTime; // in ms
    let timeElapsed = Math.round(timeDiff / 1000); // convert to seconds

    if (timeElapsed <= 5) {
        return 500;
    } else if (timeElapsed <= 10) {
        return 300;
    } else if (timeElapsed <= 15) {
        return 100;
    } else {
        return 0;
    }
}

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function showQuestion(question) {
    isClickLocked = false;
    questionElement.innerText = question.question;
    flipped = true;
    // Shuffle the answers
    question.answers = shuffle(question.answers);

    // Get the video element and its parent div
    const videoElement = document.getElementById('question-video');
    const videoParentDiv = document.getElementById('question-vid');

    // Check if the question has a video
    if (flipped === true && question.qvideos) {
        videoElement.src = question.qvideos;
        videoElement.autoplay = true;
        videoElement.loop = true;
        videoElement.muted = true; // Mute the video by default
        videoElement.controls = true; // Allow the user to control the video

        videoParentDiv.classList.remove('hide'); // Remove the hide class from the parent div
    } else {
        videoParentDiv.classList.add('hide'); // Add the hide class to the parent div
    }

    // Check if the question has a picture
    if (flipped === true && question.picture) {
        // If there is a picture, display the picture
        if (Array.isArray(question.picture)) {
            let imageIndex = 0;
            questionImageElement.src = question.picture[imageIndex];
            questionImageElement.parentElement.style.display = 'flex';

            // Start an interval that swaps the image every second
            currentImageInterval = setInterval(() => {
                imageIndex = (imageIndex + 1) % question.picture.length; // This will alternate between 0 and 1
                questionImageElement.src = question.picture[imageIndex];
            }, 300);
        } else {
            // If the picture property is not an array, just display the single image
            questionImageElement.src = question.picture;
            questionImageElement.parentElement.style.display = 'flex';
        }
    } else {
        questionImageElement.src = ''; // Clear the src attribute if there is no image or video
        questionImageElement.parentElement.style.display = 'none';
    }

    // Clear existing answer buttons
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.classList.add('btn');
        button.dataset.answerIndex = index; // Use data attribute to store answer index

        if (answer.text) {
            // If there is text, create a text element
            const textElement = document.createElement('span');
            textElement.innerText = answer.text;
            button.appendChild(textElement);
        }

        if (answer.image) {
            // If there is an image, create an img element
            const imgElement = document.createElement('img');
            imgElement.src = answer.image;
            imgElement.alt = `Answer ${index + 1}`;
            button.appendChild(imgElement);
        }

        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }

        button.addEventListener('click', selectAnswer); // Add event listener to each answer button

        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    clearStatusClass(document.body);
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

let lastPointAddedQuestionIndex = -1;
let whistleBackInterval;
function selectAnswer(e) {
   
    if (isClickLocked) return;

    let selectedButton = e.target;

     // If the selected element is not a button (i.e., it's a child of the button), get the parent button element
     if (selectedButton.nodeName !== 'BUTTON') {
        selectedButton = selectedButton.parentElement;
    }

    const correct = selectedButton.dataset.correct;

  
    if (correct && lastPointAddedQuestionIndex !== currentQuestionIndex) {
        let points = calculatePoints(); // Calculate points when an answer is selected
        totalPoints += points; // Add the points to the total

        // Update the points div
        const pointsDiv = document.getElementById('points');
        pointsDiv.textContent = '+' + points;
        pointsDiv.classList.remove('hide');

        // Update the total points div
        const totalPointsDiv = document.getElementById('total-points');
        totalPointsDiv.textContent = 'Total Points: ' + totalPoints;
        totalPointsDiv.classList.remove('hide');

        // Hide the points div after the animation
        setTimeout(() => {
            pointsDiv.classList.add('hide');
        }, 1000);

        // Update the last question index for which points were added
        lastPointAddedQuestionIndex = currentQuestionIndex;
    } else {
        // Show the icon when the answer is incorrect
        document.getElementById('icon').style.display = 'flex';

        // Set the video source to the video of the current question
        document.getElementById('video').src = shuffledQuestions[currentQuestionIndex].video;

        // Start an interval that toggles the display of the whistle-back image every second
        whistleBackInterval = setInterval(() => {
            const whistleBack = document.getElementById('whistle-back');
            whistleBack.style.display = whistleBack.style.display === 'none' ? 'block' : 'none';
        }, 500);

    }

    setStatusClass(document.body, correct);
    flipButton.classList.add('hide');
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    })
    isClickLocked = true; // Lock click functionality
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'Restart';
        startButton.classList.remove('hide');
        startButton.addEventListener("click", () => {
            resetStatusBar();
        });
    }

    if (correct) {
        correctCount++; // Increment correct count
    } else {
        incorrectCount++; // Increment incorrect count
    }

    // Update status bars
    updateStatusBars();

}

document.getElementById('whistle').addEventListener('click', function() {
    // Hide the icon
    document.getElementById('icon').style.display = 'none';

    // Show the pop-up window
    document.getElementById('popup').style.display = 'flex';

});

// Add an event listener for the pop-up click
document.getElementById('popup').addEventListener('click', function() {
    // Hide the pop-up window
    this.style.display = 'none';
});

// Add an event listener for the video click to stop event propagation
document.getElementById('video').addEventListener('click', function(event) {
    event.stopPropagation();
});

function updateStatusBars() {
    const totalQuestions = shuffledQuestions.length; // Use shuffledQuestions.length instead of questions.length
    const correctPercentage = Math.round((correctCount / totalQuestions) * 100);


    const statusFill = document.getElementById('status-fill');
    statusFill.style.height = correctPercentage + '%';

    const statusText = document.getElementById('status-text');
    statusText.textContent = `${correctPercentage}%`;
    resultElement.innerHTML = `You answered ${correctCount} out of ${totalQuestions} questions correctly, achieving a ${correctPercentage}% accuracy.`;
    resultTwoElement.innerHTML = `You answered ${correctCount} out of ${totalQuestions} questions correctly, achieving a ${correctPercentage}% accuracy.`;


    // Check if all questions are answered
    if (totalQuestions === (correctCount + incorrectCount)) {
        if (correctPercentage >= 75) {
            // Display pass popup
            const mainGame = document.querySelector('.container');
            mainGame.style.display = 'none';
            const passPopup = document.querySelector('.pass-popup');
            passPopup.style.display = 'block';
            statusElement.classList.add('hide');
            statusElement.style.display = 'none';
            document.getElementById('icon').style.display = 'none';
        } else {
            // Display fail popup
            const mainGame = document.querySelector('.container');
            mainGame.style.display = 'none';
            const failPopup = document.querySelector('.fail-popup');
            failPopup.style.display = 'block';
            statusElement.classList.add('hide');
            statusElement.style.display = 'none';
            document.getElementById('icon').style.display = 'none';
        }
        clearStatusClass(document.body);
    }
}

function setStatusClass(element, correct) {
    if (isClickLocked) {
        return; // Exit the function if click is locked
    }

    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
        const timeBar = document.querySelector(".round-time-bar");
        timeBar.style.display = 'none';
    } else {
        element.classList.add('wrong');
    }
    
}



// Function to reset the status bar
function resetStatusBar() {
    correctCount = 0;
    incorrectCount = 0;
    updateStatusBars();

     // Hide both pass and fail popups
     const passPopup = document.querySelector('.pass-popup');
     passPopup.style.display = 'none';
 
     const failPopup = document.querySelector('.fail-popup');
     failPopup.style.display = 'none';

     const mainGame = document.querySelector('.container');
     mainGame.style.display = 'block';
}

// Select all elements with the class 'round-time-bar'
const timeBars = document.querySelectorAll(".round-time-bar");
// Loop through each '.round-time-bar' element
timeBars.forEach(bar => {
    // Get the child element with class 'time-progress'
    const timeProgress = bar.querySelector('.time-progress');

    // Add an event listener to the 'animationend' event for each progress bar
    timeProgress.addEventListener('animationend', (event) => {
        incorrectCount++;
        // Check if the animation that has ended is 'roundtime'
        if (event.animationName === 'roundtime') {
            setStatusClass(document.body, false);
            Array.from(answerButtonsElement.children).forEach(button => {
                setStatusClass(button, button.dataset.correct);
            })
            isClickLocked = true; // Lock click functionality
            if (shuffledQuestions.length > currentQuestionIndex + 1) {
                nextButton.classList.remove('hide');
                flipButton.classList.add('hide');
                } else {
                    updateStatusBars();
                }
        } 
    });
});



// Timer Functionality
const bars = document.querySelectorAll(".round-time-bar");
nextButton.addEventListener("click", () => {
  bars.forEach((bar) => {
    bar.classList.remove("round-time-bar");
    bar.offsetWidth;
    bar.classList.add("round-time-bar");
  });
});

startButton.addEventListener("click", () => {
    bars.forEach((bar) => {
      bar.classList.remove("round-time-bar");
      bar.offsetWidth;
      bar.classList.add("round-time-bar");
    });
  });


function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function handleRestartClick() {
    console.log("Restart button clicked");
    const passPopup = document.querySelector('.pass-popup');
    passPopup.style.display = 'none';
    const failPopup = document.querySelector('.fail-popup');
    failPopup.style.display = 'none';

    // Reset the game state
    resetState();
    flipCard();

    // Hide the game elements
    questionContainerElement.classList.add('hide');
    document.getElementById('timer').style.display = 'none';
    document.getElementById('next-btn').classList.add('hide');
    document.getElementById('flip-btn').classList.add('hide');
    document.getElementById('status').classList.add('hide');

    // Show the start screen and the select box
    startButton.classList.remove('hide');
    questionCountSelect.classList.remove('hide');
    questionCategorySelect.classList.remove('hide');

    // Reset the select dropdown to its default value
    questionCountSelect.value = '10';
    questionCategorySelect.value = 'all';

    // Change the text of the start button
    startButton.innerHTML = 'Start';

    // Reset the points
    totalPoints = 0;

    // Update the total points div
    const totalPointsDiv = document.getElementById('total-points');
    totalPointsDiv.textContent = 'Total Points: ' + totalPoints;
    totalPointsDiv.classList.add('hide');


    // Reset the status bar
    resetStatusBar();
};

const restartButtons = document.querySelectorAll('[id="restart-btn"]');

restartButtons.forEach(button => {
    button.addEventListener('click', handleRestartClick);
});



const questions = [
    {
        picture: 'images/5Seconds.png',
        question: 'What is this signal?',
        video: 'videos/5-SecondViolation.m4v',
        category: 'NFHS',
        answers: [
            { text: '5-Second Violation', correct: true },
            { text: '30-Second Tiemout', correct: false },
            { text: 'Illegal Contact', correct: false },
            { text: 'Illegal Use of Hands', correct: false }
        ]
    }, 
    {
        picture: 'images/Doublefoul.png',
        question: 'What is being signaled here?',
        video: 'videos/DoubleFoul.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: 'Lane Violation', correct: false },
            { text: 'Double Foul', correct: true },
            { text: 'Illegal Screen', correct: false },
            { text: 'Travel', correct: false }
        ]
    }, 
    {
        picture: 'images/Heldball.png',
        question: 'What is being signaled here?',
        video: 'videos/HeldBall.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: 'Free Throw', correct: false },
            { text: 'Jump Ball', correct: true },
            { text: 'Start Clock', correct: false },
            { text: 'Travel', correct: false }
        ]
    }, 
    {
        picture: 'images/Push.png',
        question: 'What type of foul is being signaled here?',
        video: 'videos/Pushing.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: 'Hold', correct: false },
            { text: 'Push', correct: true },
            { text: 'Illegal Use of Hands', correct: false },
            { text: 'Illegal Contact', correct: false }
        ]
    }, 
    {
        picture: 'images/30.png',
        question: 'How long of a timeout is this?',
        video: 'videos/30-SecondTimeout.m4v',
        category: 'NFHS',
        answers: [
            { text: '60 Seconds', correct: false },
            { text: '30 Seconds', correct: true }
        ]
    },
    {
        picture: 'images/Full-to.png',
        question: 'How long of a timeout is this?',
        video: 'videos/FullTimeout.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: '60 Seconds', correct: true },
            { text: '30 Seconds', correct: false }
        ]
    },
    {
        picture: 'images/Startclock.png',
        question: 'Is the clock being started or stopped here?',
        video: 'videos/StartClock.m4v',
        category: 'NFHS',
        answers: [
            { text: 'Start', correct: true },
            { text: 'Stop', correct: false }
        ]
    },
    {
        picture: 'images/Foul.png',
        question: 'Is the clock being started or stopped here?',
        video: 'videos/StopClock.m4v',
        category: 'NFHS',
        answers: [
            { text: 'Start', correct: false },
            { text: 'Stop', correct: true }
        ]
    },
    {
        question: 'Which of the following is Foul Report signal?',
        category: 'NFHS',
        answers: [
            { image: 'images/5Seconds.png', correct: false },
            { image: 'images/Blocking.png', correct: false },
            { image: 'images/Foulreport.png', correct: true },
            { image: 'images/Handcheck.png', correct: false }
        ]
    },
    {
        question: 'Which of the following is Team Control Foul signal?',
        video: 'videos/ControlFoul.m4v',
        category: 'NFHS',
        answers: [
            { image: 'images/Push.png', correct: false },
            { image: 'images/Playercontrol.png', correct: false },
            { image: 'images/Teamcontrol.png', correct: true },
            { image: 'images/Laneviolation.png', correct: false }
        ]
    },
    {
        picture: 'images/Intentionalfoul.png',
        question: "True or False: This is an Intentional Foul signal.",
        video: 'videos/IntentionalFoul.m4v',
        category: 'NFHS',
        answers: [
            { text: "True", correct: true },
            { text: "False", correct: false }
        ]
    },
    {
        picture: 'images/Hold.png',
        question: "True or False: This is a Technical Foul signal.",
        video: 'videos/Holding.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: "True", correct: false },
            { text: "False", correct: true }
        ]
    },

    {
        picture: 'images/Playercontrol.png',
        question: "True or False: This is a Player Control signal.",
        video: 'videos/PlayerControlFoul.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: "True", correct: true },
            { text: "False", correct: false }
        ]
    },

    {
        question: 'Which of the following is a Blocking signal?',
        video: 'videos/BlockingFoul.m4v',
        category: ['NFHS', 'NCAA',],
        answers: [
            { image: 'images/5Seconds.png', correct: false },
            { image: 'images/Blocking.png', correct: true },
            { image: 'images/Full-to.png', correct: false },
            { image: 'images/Handcheck.png', correct: false }
        ]
    },

    {
        question: 'Which of the following is an Illegal Contact signal?',
        category: 'NFHS',
        answers: [
            { image: 'images/Blocking.png', correct: false },
            { image: 'images/Illegalcontact.png', correct: true },
            { image: 'images/Hold.png', correct: false },
            { image: 'images/Handcheck.png', correct: false }
        ]
    },

    {
        question: 'Which of the following is a Handcheck signal?',
        video: 'videos/HandCheck.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { image: 'images/5Seconds.png', correct: false },
            { image: 'images/OaBTwo.png', correct: false },
            { image: 'images/Full-to.png', correct: false },
            { image: 'images/Handcheck.png', correct: true }
        ]
    },
    {
        question: 'Which of the following is the signal for a 3 Point attempt?',
        video: 'videos/ThreePointAttempt.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { image: 'images/OaBThree.png', correct: false },
            { image: 'images/3attempt.png', correct: true },
            { image: 'images/3shots.png', correct: false },
            { image: 'images/Startclock.png', correct: false }
        ]
    },
    {
        question: 'Which of the following is not part of a Back Court Violation signal?',
        video: 'videos/BackcourtViolation.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { image: 'images/OaBOne.png', correct: false },
            { image: 'images/Doublefoul.png', correct: true },
            { image: 'images/OaBTwo.png', correct: false },
            { image: 'images/OaBThree.png', correct: false }
        ]
    },
    {
        picture: ['images/countBasketOne.png', 'images/countBasketTwo.png'], // Make this an array
        question: 'What is this signal?',
        category: 'NFHS',
        answers: [
            { text: '2nd Quarter Signal', correct: false },
            { text: 'Double Foul', correct: false },
            { text: 'Illegal Use of Hands', correct: false },
            { text: 'Count Basket', correct: true },
        ]
    }, 
    {
        picture: 'images/DirectionalPoint.jpg',
        question: 'What is this signal indicating?',
        video: 'videos/DirectionalPoint.m4v',
        category: 'NFHS',
        answers: [
            { text: 'Lane Violation', correct: false },
            { text: 'Backcourt Violation', correct: false },
            { text: 'Directional Signal', correct: true },
            { text: 'Flagrant Foul', correct: false },
        ]
    },
    {
        picture: 'images/Laneviolation.png',
        question: 'What is this signal indicating?',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: 'Free Throw Shot', correct: false },
            { text: 'Lane Violation', correct: true },
        ]
    },
    {
        picture: ['images/1Shot.png', 'images/1and1.png', 'images/2Shots.png', 'images/3Shots.png'], // Make this an array
        question: 'What are these signals symbolizing?',
        category: 'NFHS',
        answers: [
            { text: 'Number of Points Scored', correct: false },
            { text: 'Timeout Lengths', correct: false },
            { text: 'Current Quarter', correct: false },
            { text: 'Free Throw Shots', correct: true },
        ]
    }, 
    {
        picture: ['images/Illegaldribble1.png', 'images/Illegaldribble2.png'], // Make this an array
        question: 'What is this signal symbolizing?',
        video: 'videos/IllegalDribble.m4v',
        category: 'NFHS',
        answers: [
            { text: 'Kicked Ball Violation', correct: false },
            { text: 'Delay of Game', correct: false },
            { text: 'Backcourt Violation', correct: false },
            { text: 'Illegal Dribble', correct: true },
        ]
    }, 
    {
        picture: 'images/tech.png',
        question: 'Is this a Technical Foul or a Timeout?',
        video: 'videos/TechnicalFoul.m4v',
        category: 'NFHS',
        answers: [
            { text: 'Timeout', correct: false },
            { text: 'Technical Foul', correct: true },
        ]
    },
    {
        picture: 'images/10.png',
        question: 'Is this a Pushing Foul or a 10 Second Violation?',
        video: 'videos/Ten-SecondViolation.m4v',
        category: 'NFHS',
        answers: [
            { text: '10 Second Violation', correct: true },
            { text: 'Pushing Foul', correct: false },
        ]
    },
    {
        picture: 'images/3made.png',
        question: 'What is this signal?',
        video: 'videos/ThreePointMade.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: '3 Point Made', correct: true },
            { text: 'Jump Ball', correct: false },
            { text: 'Goaltending', correct: false },
            { text: 'Field Goal Good', correct: false },
        ]
    },
    {
        qvideos: 'videos/3SecondViolationTwo.mp4',
        question: 'What are these signals symbolizing?',
        video: 'videos/ThreeSecondViolation.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: 'Three Point Attempt', correct: false },
            { text: 'Three Point Made', correct: false },
            { text: 'Three Free Throws', correct: false },
            { text: 'Three Second Violation', correct: true },
        ]
    }, 
    {
        qvideos: 'videos/trav.m4v', 
        question: 'What is this signal?',
        video: 'videos/Traveling.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: 'Double Dribble', correct: false },
            { text: 'Illegal Screen', correct: false },
            { text: 'Out of Bounds', correct: false },
            { text: 'Travel', correct: true },
        ]
    }, 
    {
        picture: ['images/Count1.png', 'images/Count2.png'], // Make this an array
        question: 'What is this signal?',
        video: 'videos/VisibleCounts.m4v',
        category: 'NFHS',
        answers: [
            { text: '30 Second Timeout', correct: false },
            { text: 'Backcourt Violation', correct: false },
            { text: 'Intentional Foul', correct: false },
            { text: 'Keeping Count', correct: true },
        ]
    }, 

    {
        picture: 'images/AtoB.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'A to B', correct: true },
            { text: 'Three Point Made', correct: false },
            { text: 'Three Second Violation', correct: false },
            { text: 'Travel', correct: false },
        ]
    },

    {
        picture: 'images/BallDeflected.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'Ball Deflected', correct: true },
            { text: '30 Second Timeout', correct: false },
            { text: '60 Second Timeout', correct: false },
            { text: 'Technical Foul', correct: false },
        ]
    },

    {
        picture: 'images/BeckonSub.png', 
        question: 'What is this signal?',
        video: 'videos/BeckonSub.m4v',
        category: ['NFHS', 'NCAA'],
        answers: [
            { text: 'Backcourt Violation', correct: false },
            { text: 'Illegal Screen', correct: false },
            { text: 'Out of Bounds', correct: false },
            { text: 'Beckoning Substitutes', correct: true },
        ]
    }, 
    
    {
        picture: 'images/BlockCylinder.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'Block Cylinder', correct: true },
            { text: '30 Second Timeout', correct: false },
            { text: '60 Second Timeout', correct: false },
            { text: 'Technical Foul', correct: false },
        ]
    },

    {
        question: 'Which of the following is a Body Check Foul?',
        category: 'NCAA',
        answers: [
            { image: 'images/Blocking.png', correct: false },
            { image: 'images/BodyCheck.png', correct: true },
            { image: 'images/IllegalContact.png', correct: false },
            { image: 'images/Push.png', correct: false }
        ]
    },

    {
        picture: 'images/Dislodge.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'Dislodge with Knee', correct: true },
            { text: 'Illegal Dribble', correct: false },
        ]
    },

    {
        question: 'Which of the following is a Flop Warning?',
        category: 'NCAA',
        answers: [
            { image: 'images/Blocking.png', correct: false },
            { image: 'images/FlopWarning.png', correct: true },
            { image: 'images/Teamcontrol.png', correct: false },
            { image: 'images/Foul.png', correct: false }
        ]
    },

    {
        picture: 'images/Hit.png',
        question: 'True or False, this is a hit to the head signal?',
        category: 'NCAA',
        answers: [
            { text: 'True', correct: true },
            { text: 'False', correct: false },
        ]
    },

    {
        picture: 'images/IllegalHands.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'Illegal Use of Hands', correct: true },
            { text: 'Illegal Dribble', correct: false },
            { text: 'Technical Foul', correct: false },
            { text: 'Hold', correct: false },
        ]
    },

    {
        picture: 'images/Hit.png',
        question: 'True or False, this is a Kicked Ball Violation?',
        category: 'NCAA',
        answers: [
            { text: 'True', correct: true },
            { text: 'False', correct: false },
        ]
    },

    {
        picture: 'images/NearShot.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'Near Shot Clock Expiration', correct: true },
            { text: 'Turnover', correct: false },
            { text: '60 Second Timeout', correct: false },
            { text: 'Player Ejection', correct: false },
        ]
    },

    {
        picture: 'images/NoBucket.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'No Bucket', correct: true },
            { text: 'Double Foul', correct: false },
            { text: '60 Second Timeout', correct: false },
            { text: 'Flop Warning', correct: false },
        ]
    },

    {
        picture: 'images/OnthePass.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'On the Pass', correct: true },
            { text: 'Pushing Foul', correct: false },
            { text: 'Illegal Contact', correct: false },
            { text: 'Backcourt Violation', correct: false },
        ]
    },

    {
        picture: 'images/PinDefender.png',
        question: 'True or False, this is a Illegal Screen?',
        category: 'NCAA',
        answers: [
            { text: 'True', correct: false },
            { text: 'False', correct: true },
        ]
    },

    {
        picture: 'images/ResetShotClock.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'Reset Shot Clock', correct: true },
            { text: 'One Free Throw Attempt', correct: false },
        ]
    },

    {
        picture: 'images/ShotClockViolation.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'Shot Clock Violation', correct: true },
            { text: 'Illegal Hit to the Head', correct: false },
            { text: 'Jump Ball', correct: false },
            { text: 'End of Half', correct: false },
        ]
    },

    {
        question: 'Which of the following is a Spot Throw In signal?',
        category: 'NCAA',
        answers: [
            { image: 'images/NearShot.png', correct: false },
            { image: 'images/SpotThrowIn.png', correct: true },
            { image: 'images/ShotClockViolation.png', correct: false },
            { image: 'images/ResetShotClock.png', correct: false }
        ]
    },

    {
        picture: 'images/TrippingFoul.png',
        question: 'What is this signal?',
        category: 'NCAA',
        answers: [
            { text: 'Tripping Foul', correct: true },
            { text: 'Kicked Ball Violation', correct: false },
        ]
    },

];



