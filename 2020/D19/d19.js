/*
Advent Of Code 2020
Day 19: Monster Messages part 1 & 2

https://adventofcode.com/2022/day/19
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2020';
const DAY = '19';

function readInput(filename) {
  const readRawIntput = () => {
    const data = fs.readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename));
    const lines = data
      .toString()
      .split(`\n`)
      .filter((l) => l);
    return lines;
  };

  const messages = [];
  const rules = [];
  const parseALine = (line) => {
    if (line.startsWith('a') || line.startsWith('b')) {
      messages.push(line);
      return;
    }

    const [id, rule] = line.split(':');
    const entry = {
      id: Number(id),
      resolved: false,
      rules: [[]],
    };
    rule
      .trim()
      .split(' ')
      .forEach((r) => {
        if (r === '|') entry.rules.push([]);
        else if (r === '"a"') {
          entry.rules[entry.rules.length - 1].push('a');
          entry.resolved = true;
        } else if (r === '"b"') {
          entry.rules[entry.rules.length - 1].push('b');
          entry.resolved = true;
        } else entry.rules[entry.rules.length - 1].push(Number(r));
      });

    rules.push(entry);
  };

  try {
    const lines = readRawIntput();
    lines.forEach((l) => parseALine(l));

    return { rules, messages };
  } catch (err) {
    console.error(err);
  }
}

function generatePermutations(list) {
  const result = [];
  const indexes = new Array(list.length).fill(0);
  const permutations = (level) => {
    if (level === indexes.length) {
      const r = list.reduce((r, item, index) => {
        r.push(item[indexes[index]]);
        return r;
      }, []);
      result.push(r);
      return;
    }
    while (indexes[level] < list[level].length) {
      permutations(level + 1);
      indexes[level] += 1;
    }
    indexes[level] = 0;
    return;
  };
  permutations(0);
  return result;
}
function resolveRule(rule1, rule2) {
  const { id } = rule1;

  let rulesToReduce = rule2.rules.filter((r) => r.some((v) => v === id));
  if (rulesToReduce.length === 0) return;
  console.log(`rule #:${rule1.id} -> #${rule2.id}`);
  const unchangedRules = rule2.rules.filter((r) => r.every((v) => v !== id));
  const newRuleSet = [...unchangedRules];

  // replace all rule that matched id by -1
  rulesToReduce = rulesToReduce.map((rule) => rule.map((v) => (v === id ? -1 : v)));
  // proceed with replacement of each matching rule
  rulesToReduce.forEach((rule) => {
    const reducedRule = rule.map((v) => (v === -1 ? rule1.rules.flat(1) : [v]));
    const p = generatePermutations(reducedRule);
    newRuleSet.push(...p);
  });

  // join rules that can be joined
  rule2.rules = newRuleSet.map((rule) => (rule.every((v) => !Number.isInteger(v)) ? [rule.join('')] : rule));

  if (rule2.rules.every((rule) => rule.every((v) => !Number.isInteger(v)))) {
    rule2.resolved = true;
    rule2.rules = rule2.rules.map((rule) => [rule.join('')]);
  }
  return rule2.resolved;
}

function part1(rules, messages) {
  rules.sort((a, b) => a.id - b.id);
  let resolvedRules = rules.filter(({ resolved }) => resolved);
  let remainingRules = rules.filter(({ resolved }) => !resolved);

  while (remainingRules.length > 0) {
    resolvedRules.forEach((rule1) => {
      remainingRules.forEach((rule2) => {
        resolveRule(rule1, rule2);
      });
    });
    resolvedRules = remainingRules.filter(({ resolved }) => resolved);
    remainingRules = remainingRules.filter(({ resolved }) => !resolved);
    console.log(`Resolve:${resolvedRules.length} Remaining:${remainingRules.length} `);
  }

  console.log('======================================');
  const ruleSet = new Set(resolvedRules[0].rules.map((r) => r[0]));
  const result = [...new Set(messages)].filter((m) => ruleSet.has(m));
  return result.length;
}

function part2(rules, messages) {
  let resolvedRules = rules.filter(({ resolved }) => resolved);
  let remainingRules = rules.filter(({ resolved }) => !resolved);

  const rule0 = rules.find(({ id }) => id === 0);
  const rule8 = rules.find(({ id }) => id === 8);
  const rule11 = rules.find(({ id }) => id === 11);

  //create loop in rule 8 and 11
  rule8.rules.push([42, 8]);
  rule11.rules.push([42, 11, 31]);

  while (resolvedRules.length > 1) {
    resolvedRules.forEach((rule1) => {
      remainingRules.forEach((rule2) => {
        resolveRule(rule1, rule2);
      });
    });
    resolvedRules = remainingRules.filter(({ resolved }) => resolved);
    remainingRules = remainingRules.filter(({ resolved }) => !resolved);
    console.log(`Resolve:${resolvedRules.length} Remaining:${remainingRules.length} `);
  }
  console.log('======================================');

  // we should be left with 3 rules ...
  // first partialy resolve rule 8 & 11
  rule8.rules = rule8.rules.map((rule) => {
    if (rule.every((s) => !Number.isInteger(s))) return [rule.join('')];
    return rule;
  });
  rule11.rules = rule11.rules.map((rule) => {
    if (rule.every((s) => !Number.isInteger(s))) return [rule.join('')];
    return rule;
  });

  const matchedMessages = [];
  while (true) {
    resolveRule(rule8, rule0);
    resolveRule(rule11, rule0);
    rule0.rules = rule0.rules.map((rule) => {
      if (rule.every((s) => !Number.isInteger(s))) return [rule.join('')];
      return rule;
    });
    const ruleSet = new Set(rule0.rules.filter((rule) => rule.every((r) => !Number.isInteger(r))).map((r) => r[0]));
    const result = [...new Set(messages)].filter((m) => ruleSet.has(m));
    if (result.length === 0) break;
    matchedMessages.push(...result);
    // remove resulved rules from rule 0
    rule0.rules = rule0.rules.filter((r) => r.some((v) => Number.isInteger(v)));
  }

  return matchedMessages.length;
}

let input = readInput(`d${DAY}-input.txt`);
let sample1 = readInput(`d${DAY}-sample1.txt`);
let sample2 = readInput(`d${DAY}-sample2.txt`);
console.log(`Part 1 sample1 : ${part1(sample1.rules, sample1.messages)}`);
console.log(`Part 1 sample2 : ${part1(sample2.rules, sample2.messages)}`);
console.log(`Part 1 input: ${part1(input.rules, input.messages)}`);

input = readInput(`d${DAY}-input.txt`);
sample2 = readInput(`d${DAY}-sample2.txt`);
console.log(`Part 2 sample2 : ${part2(sample2.rules, sample2.messages)}`);
console.log(`Part 2 input: ${part2(input.rules, input.messages)}`);
