"""
Advent Of Code 2021
Day 8: Seven Segment Search part 1 & 2

https://adventofcode.com/2021/day/8
"""
def part1():
  with open("2021/D8/d8-input.txt") as f:
    lines = f.readlines()
  count = sum([1 for sublist in [l.strip("\n").split('|')[1].strip(" ").split(" ") \
    for l in lines] for s in sublist if len(s) in [2, 4, 3, 7]])
  return count

#     1
#    ___
# 6 |___| 2
# 5 | 7 | 3
#    ---
#     4
SEG_1 = 0x01
SEG_2 = 0x02
SEG_3 = 0x04
SEG_4 = 0x08
SEG_5 = 0x10
SEG_6 = 0x20
SEG_7 = 0x40

DIGITS = {
 SEG_1 | SEG_2 | SEG_3 | SEG_4 | SEG_5 | SEG_6: "0",
 SEG_2 | SEG_3: "1",
 SEG_1 | SEG_2 | SEG_4 | SEG_5 | SEG_7: "2",
 SEG_1 | SEG_2 | SEG_3 | SEG_4 | SEG_7: "3",
 SEG_2 | SEG_3 | SEG_6 | SEG_7: "4",
 SEG_1 | SEG_3 | SEG_4 | SEG_6 | SEG_7: "5",
 SEG_1 | SEG_3 | SEG_4 | SEG_5 | SEG_6 | SEG_7: "6",
 SEG_1 | SEG_2 | SEG_3 : "7",
 SEG_1 | SEG_2 | SEG_3 | SEG_4 | SEG_5 | SEG_6 | SEG_7: "8",
 SEG_1 | SEG_2 | SEG_3 | SEG_4 | SEG_6 | SEG_7: "9",
}

def part2():
  with open("2021/D8/d8-input.txt") as f:
    lines = f.readlines()

  input = []
  for e in [l.strip("\n").split('|') for l in lines]:
    input.append([e[0].strip(' ').split(' '), e[1].strip(' ').split(' ')])

  result = 0
  for encodingString, toDecode in input: 
    
    # decoding wire to segment 
    WiresToSegment = dict()
    one = [set(s) for s in encodingString if len(s) == 2][0]
    seven = [set(s) for s in encodingString if len(s) == 3][0]
    four = [set(s) for s in encodingString if len(s) == 4][0]
    height = [set(s) for s in encodingString if len(s) == 7][0]
    twoThreeFive = [set(s) for s in encodingString if len(s) == 5]
    zeroSixNine = [set(s) for s in encodingString if len(s) == 6]

    # top segment: SEG_1
    WiresToSegment[seven.difference(one).pop()] = SEG_1
    six = [s for s in zeroSixNine if len(one.intersection(s)) == 1][0]
    zeroSixNine.remove(six)
    three = [s for s in twoThreeFive if len(one.intersection(s)) == 2][0]
    twoThreeFive.remove(three)
    WiresToSegment[six.intersection(one).pop()] = SEG_3
    WiresToSegment[one.difference(six).pop()] = SEG_2
    seg56 = height.difference(three)
    nine = [s for s in zeroSixNine if len(seg56.intersection(s)) == 1][0]
    seg6 = nine.intersection(seg56)
    WiresToSegment[seg56.difference(seg6).pop()] = SEG_5
    WiresToSegment[seg6.pop()] = SEG_6
    zeroSixNine.remove(nine)
    zero = zeroSixNine[0]
    WiresToSegment[height.difference(zero).pop()] = SEG_7 
    WiresToSegment[height.difference(WiresToSegment.keys()).pop()] = SEG_4

    code = ""
    for s in toDecode:
      d = sum([WiresToSegment[c] for c in s])
      code += DIGITS[d]
    result += int(code)
  return result
  
print("part 1:", part1())
print("part 2:", part2())

