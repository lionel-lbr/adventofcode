"""
Advent Of Code 2021
Day 22: Reactor Reboot part 1

https://adventofcode.com/2021/day/22 
"""
with open("2021/D22/d22-input.txt") as f:
  lines = f.readlines()

input = []
for l in lines:
  action, ranges = l.strip('\n').split(" ")
  xRange, yRange, zRange = ranges.split(',')
  input.append([action, 
      [int(i) for i in xRange.split("=")[1].split("..")], 
      [int(i) for i in yRange.split("=")[1].split("..")], 
      [int(i) for i in zRange.split("=")[1].split("..")]])
  input[-1][1].sort()
  input[-1][2].sort()
  input[-1][3].sort()

print(input)

cubesOn = set()
for i in input:
  action = i[0]
  currentSet = set()
  for x in range(max(-50,i[1][0]),min(50,i[1][1])+1):
    for y in range(max(-50,i[2][0]),min(50,i[2][1])+1):
      for z in range(max(-50,i[3][0]),min(50,i[3][1])+1):
        currentSet.add((x,y,z))
  if action == 'on':
    currentSet.difference_update(cubesOn)
    cubesOn.update(currentSet)
    continue
  if action == "off":
    currentSet.intersection_update(cubesOn)
    for c in currentSet:
      cubesOn.remove(c)
    continue

print(len(cubesOn))
