"""
Advent Of Code 2020
Day 18: Operation Order part 1 & 2

https://adventofcode.com/2020/day/18
"""
from time import perf_counter as pfc
import os

def readInput(filename):
  with open(os.path.join("2020", "D18", filename)) as f:
    lines = f.readlines()
  input = (tuple(d.strip('\n').replace(" ", "")) for d in lines)
  return tuple(input)

def calculate(operands, operators):
  op1 = operands.pop()
  op2 = operands.pop()
  oper = operators.pop()
  return op1 + op2 if oper == '+' else op1 * op2

def part1(input):
  startTime = pfc()
  result = 0
  for exp in input:
    if not exp:
      continue
    operators = []
    operands = []
    for s in exp:
      if s in "0123456789":
        operands.append(int(s))
        if operators and operators[-1] in "+*":
          r = calculate(operands, operators)
          operands.append(r)
      elif s in "+*(":
        operators.append(s)
      elif s == ')':
        while operators and operators[-1] != '(':
          r = calculate(operands, operators)
          operands.append(r)
        if operators:  # pop and discard the left parentesis
          operators.pop()
        while operators and operators[-1] in "+*":
          r = calculate(operands, operators)
          operands.append(r)
    result += operands[0]

  print(f"Part 1 time: {pfc() - startTime:.4}")
  return result

def toPostfix(exp):
  postfix = []
  stack = []
  for s in exp:
    if s in "0123456789":
      postfix.append(int(s))
    elif s == "(":
      stack.append(s)
    elif s == ")":
      while stack and stack[-1] != "(":
        postfix.append(stack.pop())
      if stack:
        stack.pop()
    elif s in "+*":
      if not stack or stack[-1] == "(":
        stack.append(s)
      else:
        while stack and stack[-1] not in "(*":
          postfix.append(stack.pop())
        stack.append(s)
  while stack:
    postfix.append(stack.pop())
  return postfix

def part2(input):
  startTime = pfc()
  result = 0
  for exp in input:
    if not exp:
      continue
    postfix = toPostfix(exp)
    # evaluate postfix exp
    stack = []
    for s in postfix:
      if isinstance(s, int):
        stack.append(s)
      else:
        r = calculate(stack, [s])
        stack.append(r)
    result += stack[0]

  print(f"Part 2 time: {pfc() - startTime:.4}")
  return result

#input = readInput(f"d18-sample.txt")
input = readInput(f"d18-input.txt")
print(f"Part 1 for puzzle input: {part1(input)}")
print(f"Part 2 for puzzle input: {part2(input)}")
