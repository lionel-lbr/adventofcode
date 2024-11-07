/*
Advent Of Code 2023
Day 7: Camel Cards part 2

https://adventofcode.com/2023/day/7
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2023';
const DAY = '07';

function readInput(filename) {
  const readRawInput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const input = data
      .toString()
      .split('\n')
      .filter((s) => s.length > 0)
      .map((s) => {
        const [hand, bet] = s.split(' ');
        return { hand, bet: parseInt(bet) };
      });
    return input;
  };

  const parseALine = (line) => {};

  try {
    return readRawInput();
  } catch (err) {
    console.error(err);
  }
}

function countSpecificCharacters(str) {
  const pattern = /[AKQJT98765432]/g;
  const matches = str.match(pattern) || [];
  return matches.reduce((acc, char) => {
    acc[char] = (acc[char] || 0) + 1;
    return acc;
  }, {});
}

const cardValue = {
  A: 13,
  K: 12,
  Q: 11,
  J: 1,
  T: 10,
  9: 9,
  8: 8,
  7: 7,
  6: 6,
  5: 5,
  4: 4,
  3: 3,
  2: 2,
};

const handTypes = {
  FiveAKind: 7,
  FourAKind: 6,
  FullHouse: 5,
  ThreeAKind: 4,
  TwoPair: 3,
  OnePair: 2,
  HighCard: 1,
};

function determineHands(input) {
  input.forEach((elt) => {
    const cards = countSpecificCharacters(elt.hand);
    let keys = Object.keys(cards);

    elt.jCount = cards['J'] || 0;
    keys = keys.filter((c) => c !== 'J');

    if (elt.jCount === 5 || keys.some((c) => cards[c] === 5)) {
      elt.rank = handTypes.FiveAKind;
      return;
    }
    if (keys.some((c) => cards[c] === 4)) {
      if (elt.jCount > 0) elt.rank = handTypes.FiveAKind;
      else elt.rank = handTypes.FourAKind;
      return;
    }
    if (keys.some((c) => cards[c] === 3) && keys.some((c) => cards[c] === 2)) {
      elt.rank = handTypes.FullHouse;
      return;
    }
    if (keys.some((c) => cards[c] === 3)) {
      if (elt.jCount === 2) elt.rank = handTypes.FiveAKind;
      else if (elt.jCount === 1) elt.rank = handTypes.FourAKind;
      else elt.rank = handTypes.ThreeAKind;
      return;
    }
    if (keys.filter((c) => cards[c] === 2).length === 2) {
      if (elt.jCount === 1) elt.rank = handTypes.FullHouse;
      else elt.rank = handTypes.TwoPair;
      return;
    }
    if (keys.filter((c) => cards[c] === 2).length === 1) {
      if (elt.jCount === 3) elt.rank = handTypes.FiveAKind;
      else if (elt.jCount === 2) elt.rank = handTypes.FourAKind;
      else if (elt.jCount === 1) elt.rank = handTypes.ThreeAKind;
      else elt.rank = handTypes.OnePair;
      return;
    }
    if (elt.jCount === 4) elt.rank = handTypes.FiveAKind;
    else if (elt.jCount === 3) elt.rank = handTypes.FourAKind;
    else if (elt.jCount === 2) elt.rank = handTypes.ThreeAKind;
    else if (elt.jCount === 1) elt.rank = handTypes.OnePair;
    else elt.rank = handTypes.HighCard;
    return;
  });
}

function sortHand(hand1, hand2) {
  for (let i = 0; i < 5; i++) {
    if (hand1[i] === hand2[i]) continue;
    if (cardValue[hand1[i]] < cardValue[hand2[i]]) return -1;
    return 1;
  }
  return 0;
}

function part2(input) {
  determineHands(input);
  input.sort((a, b) => (a.rank - b.rank === 0 ? sortHand(a.hand, b.hand) : a.rank - b.rank));
  const result = input.reduce((score, elt, index) => score + (index + 1) * elt.bet, 0);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
console.log(`Part 2: ${part2(input)}`);
