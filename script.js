const killers = ['freddy', 'mm', 'jason', 'pinhead', 'pennywise']
let killerCount = 
  {
  freddy: 0,
  jason: 0,
  mm: 0,
  pinhead: 0,
  pennywise: 0
}


const cards = document.querySelectorAll(".card");
let doorKey = 0
let moveCounter = 0;
let maxMoves = 10; 
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
    updateMoves();
    
    // After matchCards, count all flipped killer cards
    setTimeout(() => {
      // Reset counts
      for (let killer in killerCount) killerCount[killer] = 0;
      
      // Count all flipped cards
      const flippedCards = document.querySelectorAll(".card.flip");
      flippedCards.forEach(card => {
        const imgSrc = card.querySelector(".back-view img").src;
        const cardName = imgSrc.split("/").pop().split(".")[0];
        if (killers.includes(cardName)) {
          killerCount[cardName]++;
        }
      });
      
      console.log("Killer counts:", killerCount);
      
      // Check how many killers have 2 cards showing (pairs)
      const killersWithPairs = Object.values(killerCount).filter(count => count >= 2).length;
      console.log("Killers with pairs showing:", killersWithPairs);
      
      if (killersWithPairs >= 2) {
        alert("You got caught!");
        resetGame();
      }
    }, 100);
  }
}
function matchCards(img1, img2) {
  
  const name1 = img1.split("/").pop().split(".")[0];
  const name2 = img2.split("/").pop().split(".")[0];
  console.log(name1, name2);
  
   if (name1 === name2 && killers.includes(name1)) {
    // Matched a killer pair - just keep them flipped
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
    const cardOneIsKiller = killers.includes(name1);
    const cardTwoIsKiller = killers.includes(name2);
    setTimeout(() => {
      cardOne.classList.add("shake");
      cardTwo.classList.add("shake");
    }, 400);
    setTimeout(() => {
      cardOne.classList.remove("shake");
      cardTwo.classList.remove("shake");
      if (!cardOneIsKiller) cardOne.classList.remove("flip");
      if (!cardTwoIsKiller) cardTwo.classList.remove("flip");
      cardOne = cardTwo = "";
      disableDeck = false;
    }, 1200);
  }
}
function shuffleCard() {
   for (let killer in killerCount) killerCount[killer] = 0;
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
