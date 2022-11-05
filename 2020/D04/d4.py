"""
Advent Of Code 2020
Day 4: Passport Processing part 1 & 2

https://adventofcode.com/2020/day/4
"""
import os

def readInput(filename):
  with open(os.path.join("2020", "D04", filename)) as f:
    lines = f.readlines()
  str = ""
  passports = []
  for s in (d.strip('\n') for d in lines):
    if len(s) == 0:
      # process one passport
      passports.append(dict())
      fields = str.split(" ")
      for f in fields:
        k, v = f.split(":")
        passports[-1][k] = v
      str = ""
    str = f"{str} {s}" if len(str) > 0 else f"{s}"
  return tuple(passports)

def part1(passports):
  validPassports = []
  fields = ('byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid')
  for p in passports:
    fCount = 0
    for f in fields:
      if f in p:
        fCount += 1
    if fCount == 8 or (fCount == 7 and 'cid' not in p):
      validPassports.append(p)
  return validPassports

def part2(passports):
  def checkHgt(x):
    if x.endswith("cm"):
      s = x[:-2]
      if s.isdigit() and int(s) >= 150 and int(s) <= 193:
        return True
      return False
    if x.endswith("in"):
      s = x[:-2]
      if s.isdigit() and int(s) >= 59 and int(s) <= 76:
        return True
      return False
    return False

  def checkHcl(x):
    if x.startswith("#") and len(x[1:]) == 6:
      return all(c in "0123456789abcdef" for c in x[1:])
    return False

  fields = {'byr': lambda x: x.isdigit() and int(x) >= 1920 and int(x) <= 2002,
            'iyr': lambda x: x.isdigit() and int(x) >= 2010 and int(x) <= 2020,
            'eyr': lambda x: x.isdigit() and int(x) >= 2020 and int(x) <= 2030, \
            'hgt': checkHgt, 'hcl':checkHcl,
            'ecl': lambda x: x in ('amb','blu','brn','gry','grn','hzl','oth'),
            'pid': lambda x: x.isdigit() and len(x) == 9,
            'cid': lambda x: True
            }
  validPassports = part1(passports)
  validCount = 0
  for p in validPassports:
    if all(fields[k](p[k]) for k in p):
      validCount += 1
  return validCount

input = readInput("d4-input.txt")
print(f"Part 1: {len(part1(input))}")
print(f"Part 2: {part2(input)}")
