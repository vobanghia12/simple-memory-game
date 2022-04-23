//Global Variables
let clueHoldTime = 1000; //how long to hold each clue's light and sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

var pattern = [5, 2, 4, 3, 2, 1, 2, 4];
var progress = 0; //progress is each level we play
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5; //must be between 0.0 and 1.0
var guessCounter = 0;
var mistakeCounter;

//initialize variables to start the game
function startGame() {
  //initialize game variables
  mistakeCounter = 0;
  progress = 0;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  //initialize game variables
  gamePlaying = false;
  document.getElementById("stopBtn").classList.add("hidden");
  document.getElementById("startBtn").classList.remove("hidden");
}

// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 600.2,
};

function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}

function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

//add light for button
function lightButton(btn) {
  //document.getElementById("button" + btn).classList.add("lit");
  document.getElementById("image" + btn).classList.remove('hidden');
}
//clear button
function clearButton(btn) {
 // document.getElementById("button" + btn).classList.remove("lit");
  document.getElementById("image" + btn).classList.add('hidden');
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  context.resume();
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

//notify that the user lost game
function loseGame() {
  stopGame();
  alert("Game Over. You lost.");
}

function winGame() {
  stopGame();
  alert("Game Over. You won.");
}
//keep playing if player not lose yet
function inProgress(btn) {
  if (guessCounter === progress) {
    if (guessCounter === pattern.length) winGame();
    else {
      progress++;
      // decrease the time when it is up to 1 level
      clueHoldTime -= 120;
      playClueSequence();
    }
  }
  //guessCounter to check next press
  else {
    guessCounter++;
  }
}

function guess(btn) {
  console.log("user guessed: " + btn);
  if (!gamePlaying) {
    return;
  }
  //check we press the right button
  if (pattern[guessCounter] === btn) {
    inProgress(btn);
  } else {
    //when user makes mistake
    mistakeCounter++;
    guessCounter--;
    progress--;
    clueHoldTime += 120;
    inProgress(btn);
    //check to decide when user lose game
    if (mistakeCounter === 3) loseGame();
  }
}

// Page Initialization
// Init Sound Synthesizer
//get audioContext API
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator(); //create oscillator
var g = context.createGain(); // controll the volume
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
