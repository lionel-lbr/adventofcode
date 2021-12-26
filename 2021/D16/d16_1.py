"""
Advent Of Code 2021
Day 16: Packet Decoder part 1

https://adventofcode.com/2021/day/16 
"""


class PacketParser:
  def __init__(self, hexStr):
    self._version = 0
    self._bitsStr = self._convertToBitString(hexStr)
    self._bitsStrLen = len(self._bitsStr)
    self._i = 0

  def _convertToBitString(self, hexStr):
    bits = ""
    for c in hexStr:
      bits += str(bin(int(c, 16)))[2:].zfill(4)
    return bits

  def parse(self):
    state = "version"
    while (self._bitsStrLen - self._i) > 6:
      if state == "version":
        self._readVersion()
        state = "type"
        continue
      if state == "type":
        t = self._readType()
        if t == 4:
          state = "literal"
        else:
          state = "operator"
        continue
      if state == "literal":
        lv = self._readLiteralValue()
        state = "version"
        continue
      if state == "operator":
        self._readSubPackets()
        state = "version"
        continue

  def _readBits(self, nbrOfBits):
    s = self._bitsStr[self._i:self._i+nbrOfBits]
    self._i += nbrOfBits
    return s

  def _readVersion(self):
    self._version += int(self._readBits(3), 2)

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
      self.parse()
      return

    # read 11 bits length
    l = int(self._readBits(11), 2)
    for j in range(l):
      self.parse()


with open("2021/D16/d16-input.txt") as f:
    lines = f.readlines()
input = lines[0].strip('\n')
PP = PacketParser(input)
PP.parse()
print("Version:", PP._version)

