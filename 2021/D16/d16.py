"""
Advent Of Code 2021
Day 16: Packet Decoder part 2

https://adventofcode.com/2021/day/16 
"""
import os

OPERATORS = ['sum', "pro", "min", "max", "T", "grt", "let", "equ"]

def readInput(filename):
  with open(os.path.join("2021", "D16", filename)) as f:
    lines = f.readlines()
  input = lines[0].strip('\n')
  return input

def convertToBitString(hexStr):
  bits = ""
  for c in hexStr:
    bits += str(bin(int(c, 16)))[2:].zfill(4)
  return bits

class PacketParser:

  def __init__(self, bitsStr):
    self._bitsStr = bitsStr
    self._bitsStrLen = len(self._bitsStr)
    self.version = 0
    self._i = 0
    self.values = []

  def parseOnePacket(self):
    self._readVersion()
    t = self._readType()
    if t == 4:
      lv = self._readLiteralValue()
      self.values.append(lv)
    else:
      self.values.append(OPERATORS[t])
      self._readSubPackets()
    return self._i

  def parse(self):
    while (self._bitsStrLen - self._i) > 6:
      self.parseOnePacket()

  def _readBits(self, bitsCount):
    s = self._bitsStr[self._i:self._i + bitsCount]
    self._i += bitsCount
    return s

  def _readVersion(self):
    self.version += int(self._readBits(3), 2)

  def _readType(self):
    return int(self._readBits(3), 2)

  def _readLiteralValue(self):
    r = ''
    while True:
      v = self._readBits(5)
      r += v[1:]
      if v[0] == '0':
        return int(r, 2)

  def _readSubPackets(self):
    v = self._readBits(1)
    if v == '0':
      # read 15 bits length
      l = int(self._readBits(15), 2)
      bs = self._bitsStr[self._i:self._i + l]
      p = PacketParser(bs)
      p.parse()
      self.values.extend(p.values)
      self.version += p.version
      self.reduce()
      self._i += l
      return

    # read number of operators' args
    l = int(self._readBits(11), 2)
    # read and parse every arg of operators, evaluate at the end
    for _ in range(l):
      bs = self._bitsStr[self._i:]
      p = PacketParser(bs)
      k = p.parseOnePacket()
      self.version += p.version
      self.values.append(p.values[0])
      self._i += k
    self.reduce()

  def reduce(self):
    s = []
    while self.values:
      v = self.values.pop()
      if v == "sum":
        self.values.append(sum(s))
        return
      if v == "pro":
        r = 1
        for i in s:
          r *= i
        self.values.append(r)
        return
      if v == "min":
        self.values.append(min(s))
        return
      if v == "max":
        self.values.append(max(s))
        return
      if v == "grt":
        self.values.append(1 if s[1] > s[0] else 0)
        return
      if v == "let":
        self.values.append(1 if s[1] < s[0] else 0)
        return
      if v == "equ":
        self.values.append(1 if s[0] == s[1] else 0)
        return
      s.append(v)

def solve(filename):
  input = readInput(filename)
  bs = convertToBitString(input)
  p = PacketParser(bs)
  p.parse()
  return p.version, p.values[0]

version, value = solve("d16-input.txt")
print(f"Part1: {version}")
print(f"Part2: {value}")
