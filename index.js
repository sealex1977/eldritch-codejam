import { ancientsData } from "./data/ancients.js";
import { difficulties } from "./data/difficulties.js";
import { cardsData as blueCardsData } from "./data/mythicCards/blue/index.js";
import { cardsData as brownCardsData } from "./data/mythicCards/brown/index.js";
import { cardsData as greenCardsData } from "./data/mythicCards/green/index.js";

const ancients = document.querySelectorAll('.ancients-card');
const difficultiesWrap = document.querySelector('.difficulty-container');
const difficultiesBut = document.querySelectorAll('.difficulty-level');
const shuffleWrap = document.querySelector('.shuffle-container');
const stagesWrap = document.querySelector('.stages-container');
const cardDeckBg = document.querySelector('.card-deck');
const tableCurrCard = document.querySelector('.current-card');
let currentAncient;
let currentDifficulty;
const trackers = document.querySelectorAll('.tracker-text');
const stageNum = ['firstStage', 'secondStage', 'thirdStage'];
const cardColors = ['greenCards', 'brownCards', 'blueCards'];
let currentTracks;
console.log('Score: 105/105');

// Choose and Show an Ancient
ancients.forEach((el, i) => {
  el.addEventListener('click', () => {
    if (!el.classList.contains('ancients-card-active')) {
      difficultiesWrap.style.visibility = 'visible';
      stagesWrap.style.visibility = 'hidden';
      cardDeckBg.style.visibility = 'hidden';
      tableCurrCard.style.backgroundImage = 'none';
      if (currentDifficulty) {
        shuffleWrap.classList.add('shuffle-active');
      }
    }
    currentAncient = ancientsData[i];
    ancients.forEach((e, j) => {
      if (j === i) {
        e.classList.add('ancients-card-active');
      } else {
        e.classList.remove('ancients-card-active');
      }
    })
  })
})

// Choose Difficulty Level and Show Shuffle Button
difficultiesBut.forEach((el, i) => {
  el.addEventListener('click', () => {
    if (!el.classList.contains('difficulty-level-active')) {
      stagesWrap.style.visibility = 'hidden';
      cardDeckBg.style.visibility = 'hidden';
      shuffleWrap.classList.add('shuffle-active');
      tableCurrCard.style.backgroundImage = 'none';
    }
    currentDifficulty = difficulties[i].id;
    difficultiesBut.forEach((e, j) => {
      if (j === i) {
        e.classList.add('difficulty-level-active');
      } else {
        e.classList.remove('difficulty-level-active');
      }
    })
  })
})

// Define Tracker Initial Numbers
const setTrackers = () => {
  currentTracks = [];
  stageNum.forEach(el => {
    cardColors.forEach(e => {
      currentTracks.push(currentAncient[el][e])
    })
  })

  trackers.forEach((el, i) => {
    el.textContent = currentTracks[i];
  })
}

// Shuffle Any Deck
const shuffleCards = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

// Get Game Deck
const getMythDeck = (green, brown, blue, ancient, stage, color) => {
  const cards = [green, brown, blue];
  const mainDecks = [[], [], []];
  const mythDecks = [[], [], []];
  const stageDecks = [[], [], []];

  let greenQty = ancient.firstStage.greenCards + ancient.secondStage.greenCards + ancient.thirdStage.greenCards;
  let brownQty = ancient.firstStage.brownCards + ancient.secondStage.brownCards + ancient.thirdStage.brownCards;
  let blueQty = ancient.firstStage.blueCards + ancient.secondStage.blueCards + ancient.thirdStage.blueCards;
  const quantities = [greenQty, brownQty, blueQty];
  const variations = ['easy', 'hard', 'default'];

  // Get Myth Decks Depending on Current Difficulty Level
  const getMythDecks = (get, avoid) => {
    cards.forEach((el, i) => {
      el.forEach(e => {
        if (e.difficulty !== avoid) {
          mainDecks[i].push(e);
        }
      })
    })

    mainDecks.forEach(el => {
      shuffleCards(el);
    })

    if (currentDifficulty === `very ${get}`) {
      for (let i = 0; i < 2; i++) {
        mainDecks.forEach((el, i) => {
          el.forEach((e, j) => {
            if (e.difficulty === get && mythDecks[i].length < quantities[i]) {
              mythDecks[i].push(e);
              mainDecks[i].splice(j, 1);
            }
          })
        })
      }
    }

    mainDecks.forEach((el, i) => {
      while (mythDecks[i].length < quantities[i]) {
        mythDecks[i].push(el.pop());
      }
    })
  }

  if (currentDifficulty === 'very easy' || currentDifficulty === 'easy') {
    getMythDecks(variations[0], variations[1]);
  }
  if (currentDifficulty === 'very hard' || currentDifficulty === 'hard') {
    getMythDecks(variations[1], variations[0]);
  }
  if (currentDifficulty === 'normal') {
    getMythDecks(variations[2], variations[2]);
  }
  // Shuffle Myth Decks
  mythDecks.forEach(el => {
    shuffleCards(el);
  })
  // Get Stages Decks
  mythDecks.forEach((el, i) => {
    stageDecks.forEach((e, k) => {
      for (let j = 0; j < ancient[stage[k]][color[i]]; j++) {
        e.push(el.pop());
      }
    })
  })
  // Shuffle Stages Decks
  stageDecks.forEach(el => {
    shuffleCards(el);
  })
  // Set Initial Values of Trackers Depending on Current Ancient
  setTrackers();
  return [...stageDecks[2], ...stageDecks[1], ...stageDecks[0]];
}

// Show Deck Container and Get Game Deck
let gameDeck;
shuffleWrap.addEventListener('click', () => {
  shuffleWrap.classList.remove('shuffle-active');
  stagesWrap.style.visibility = 'visible';
  cardDeckBg.style.visibility = 'visible';
  cardDeckBg.style.backgroundImage = `url('./assets/mythicCardBackground.png')`;
  gameDeck = getMythDeck(greenCardsData, brownCardsData, blueCardsData, currentAncient, stageNum, cardColors);
})

// Show Current Card
cardDeckBg.addEventListener('click', () => {
  if (gameDeck.length > 0) {
    const currentCard = gameDeck.pop();
    console.log(`Текущая карта:\n\ ${JSON.stringify(currentCard)}`);
    tableCurrCard.style.backgroundImage = `url(${currentCard.cardFace})`;
    // Set Trackers Depending on Current Card
    let colorTracks = currentCard.color === 'green' ? [0, 3, 6] : currentCard.color === 'brown' ? [1, 4, 7] : [2, 5, 8];
    let curTrack = currentTracks[colorTracks[0]] > 0 ? colorTracks[0] : currentTracks[colorTracks[1]] > 0 ? colorTracks[1] : colorTracks[2];
    currentTracks[curTrack]--;
    trackers[curTrack].textContent = currentTracks[curTrack];

    if (gameDeck.length === 0) {
      cardDeckBg.style.backgroundImage = `none`;
    }
  }
})