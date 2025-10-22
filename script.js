const cards = document.querySelectorAll(".card");
let  killerCount = 0;
let doorKey = 0
let moveCounter = 0;
let maxMoves = 12; 
let timer = {
  seconds: 0,
  minutes: 0,
  clearTime: -1,
  isRunning: false
};
let cardOne, cardTwo;
let disableDeck = false;

// Start timer function
function startTimer() {
  timer.clearTime = setInterval(() => {
    if (timer.seconds === 59) {
      timer.minutes++;
      timer.seconds = 0;
    } else {
      timer.seconds++;
    }

    // Ensure that single digit seconds are preceded with a 0
    let formattedSec = timer.seconds < 10 ? "0" + timer.seconds : timer.seconds;
    let time = `${timer.minutes}:${formattedSec}`;
    document.querySelector(".timer").textContent = time;
  }, 1000);
}

// Resets timer state and restarts timer
function resetTimer() {
  clearInterval(timer.clearTime);
  timer.seconds = 0;
  timer.minutes = 0;
  timer.isRunning = false;
  document.querySelector(".timer").textContent = "0:00";

 
}

// Update moves counter and check if game is over
function updateMoves() {
  moveCounter++;
  document.querySelector(".moves").textContent = moveCounter;

  if (moveCounter >= maxMoves) {
    alert("You've reached the maximum number of moves!");
    resetGame();
  }
}

// Reset the game (shuffling cards, resetting timer and moves)
function resetGame() {
  resetTimer();
  moveCounter = 0;
  document.querySelector(".moves").textContent = moveCounter;
  shuffleCard();
}

function flipCard({ target: clickedCard }) {
   if (!timer.isRunning) {
    startTimer();
    timer.isRunning = true;
  }

  if (cardOne !== clickedCard && !disableDeck) {
    clickedCard.classList.add("flip");
    if (!cardOne) {
      cardOne = clickedCard;
      return;
    }
    cardTwo = clickedCard;
    disableDeck = true;
    let cardOneImg = cardOne.querySelector(".back-view img").src,
      cardTwoImg = cardTwo.querySelector(".back-view img").src;
    matchCards(cardOneImg, cardTwoImg);
    updateMoves(); // Increment move counter after each pair is checked
  }
}

function matchCards(img1, img2) {
  
  const name1 = img1.split("/").pop().split(".")[0]; // e.g. "door"
  const name2 = img2.split("/").pop().split(".")[0]; // e.g. "key"
  console.log(name1,name2)
  if (name1 === name2) {
    killerCount++;
    if (killerCount == 2) {
      setTimeout(() => {
        alert(`You got caught by ${name1}!`);
        resetGame();
      }, 500);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    disableDeck = false;
  } else if (
    (name1 === "door" && name2 === "key") ||
    (name1 === "key" && name2 === "door")
  ) {
    doorKey++;
    if (doorKey == 1) {
      setTimeout(() => {
        alert(`You found the key and unlocked the door. You have Escaped!!`);
        resetGame();
      }, 500);
    }
    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    cardOne = cardTwo = "";
    disableDeck = false;
  }
  else {
    setTimeout(() => {
      cardOne.classList.add("shake");
      cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
      cardOne.classList.remove("shake", "flip");
      cardTwo.classList.remove("shake", "flip");
      cardOne = cardTwo = "";
      disableDeck = false;
    }, 1200);
  }
}

function shuffleCard() {
  killerCount = 0;
  doorKey = 0;
  disableDeck = false;
  cardOne = cardTwo = "";
  let arr = ['door', 'freddy', 'mm', 'jason', 'pinhead', 'pennywise', 'freddy', 'mm', 'jason', 'pinhead', 'key', 'pennywise'];
  arr.sort(() => Math.random() > 0.5 ? 1 : -1);
  cards.forEach((card, i) => {
    card.classList.remove("flip");
    let imgTag = card.querySelector(".back-view img");
    imgTag.src = `img/${arr[i]}.png`;
    card.addEventListener("click", flipCard);
  });
}

// Start the game
resetGame();
cards.forEach(card => {
  card.addEventListener("click", flipCard);
});
document.querySelector(".restart").addEventListener("click", () => {
  resetGame();
});
