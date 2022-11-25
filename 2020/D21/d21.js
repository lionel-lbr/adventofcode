/*
Advent Of Code 2020
Day 21: Allergen Assessment Part 1 & 2

https://adventofcode.com/2020/day/21
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2020';
const DAY = '21';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data
      .toString()
      .split(`\n`)
      .filter((l) => l);
    return lines;
  };

  try {
    const allergenMap = new Map(); // allergen -> list of foods
    const foods = [];

    const lines = readRawIntput();
    lines.forEach((line) => {
      const [foodString, allergensString] = line.split(' (contains ');

      const ingredients = foodString.split(' ').map((i) => i.trim());
      foods.push(ingredients);

      const allergens = allergensString
        .slice(0, -1) // remove last ")"
        .split(',')
        .map((a) => a.trim());

      allergens.forEach((allergen) => {
        if (!allergenMap.has(allergen)) allergenMap.set(allergen, []);
        allergenMap.get(allergen).push(ingredients);
      });
    });

    return { foods, allergenMap };
  } catch (err) {
    console.error(err);
  }
}

function solve(input) {
  // part 1
  const { foods, allergenMap } = input;
  const allergens = [...allergenMap.keys()].sort(); // need to sort because of part 2

  // for each allergent, ingredient which contains allergen is the intersection of each food
  const allergenToIngredients = allergens.map((allergen) => {
    const listOfFoods = allergenMap.get(allergen);
    const ingredients = listOfFoods.reduce(
      (intersection, food) => intersection.filter((e1) => food.some((e2) => e1 === e2)),
      listOfFoods[0]
    );

    return [allergen, ingredients];
  });

  // list of unique allergenic ingredients
  const allergenicIngredients = allergenToIngredients.reduce(
    (set, [_, ingredientList]) => new Set([...set, ...ingredientList]),
    new Set()
  );

  // remove allergenic ingredients from each food and count the remaining food's ingredients
  const safeFoods = foods.map((food) => food.filter((e1) => !allergenicIngredients.has(e1)));
  console.log(`Part 1: ${safeFoods.flat().length}`);

  // part 2
  // identify which ingredient has which allergen
  const keys = new Set();
  while (keys.size < allergens.length) {
    const [key, ingredient] = allergenToIngredients.find(
      ([allergen, ingredientList]) => !keys.has(allergen) && ingredientList.length === 1
    );

    allergenToIngredients.forEach(([allergen, ingredientList]) => {
      if (allergen !== key) {
        const index = ingredientList.findIndex((i) => i === ingredient[0]);
        if (index > -1) {
          ingredientList.splice(index, 1);
        }
      }
    });
    keys.add(key);
  }

  const dangerousIngredients = allergenToIngredients.map(([_, ingredient]) => ingredient[0]);
  console.log(`Part 2: ${dangerousIngredients.join(',')}`);
}

const input = readInput(`d${DAY}-input.txt`);
solve(input);
