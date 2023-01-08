/*
Advent Of Code 2022
Day 22: Monkey Map part 1 & 2

https://adventofcode.com/2022/day/22
*/

const fs = require('fs');
const path = require('path');

const YEAR = '2022';
const DAY = '22';

function readInput(filename) {
  return fs
    .readFileSync(path.join(`${YEAR}`, `D${DAY}`, filename))
    .toString()
    .split(`\n`)
    .filter((l) => l);
}

function solve(pathCommands, faces, cubeSize) {
  let currentDirection = 'RIGHT';
  let currentFace = faces[0];
  let [posX, posY] = [0, 0];

  const getNextPosition = (posX, posY, face, direction) => {
    let x = posX;
    let y = posY;
    let nextFace = null;
    if (direction === 'RIGHT') {
      x = x + 1;
      if (x >= cubeSize) nextFace = face.right;
    } else if (direction === 'LEFT') {
      x = x - 1;
      if (x < 0) nextFace = face.left;
    } else if (direction === 'DOWN') {
      y = y + 1;
      if (y >= cubeSize) nextFace = face.down;
    } else if (direction === 'UP') {
      y = y - 1;
      if (y < 0) nextFace = face.up;
    }

    if (nextFace != null) {
      const { nFace, nDirection, translateXY } = nextFace;
      face = nFace;
      direction = nDirection;
      const { nX, nY } = translateXY(x, y);
      x = nX;
      y = nY;
    }

    const c = face.getCell(x, y);
    return { x, y, c, face, direction };
  };

  let pathIndex = -1;
  const setNextDirection = (direction) => {
    if (pathIndex === -1) {
      pathIndex += 1;
      return { d: 'RIGHT', sc: pathCommands[pathIndex] };
    }
    pathIndex += 1;
    const d = pathCommands[pathIndex];
    switch (direction) {
      case 'RIGHT':
        direction = d === 'R' ? 'DOWN' : 'UP';
        break;
      case 'DOWN':
        direction = d === 'R' ? 'LEFT' : 'RIGHT';
        break;
      case 'LEFT':
        direction = d === 'R' ? 'UP' : 'DOWN';
        break;
      case 'UP':
        direction = d === 'R' ? 'RIGHT' : 'LEFT';
        break;
    }
    pathIndex += 1;
    return { d: direction, sc: pathCommands[pathIndex] };
  };

  let stepCount = 0;
  while (true) {
    if (stepCount === 0) {
      if (pathIndex === pathCommands.length - 1)
        return (
          1000 * (currentFace.orgY + posY + 1) +
          4 * (currentFace.orgX + posX + 1) +
          ['RIGHT', 'DOWN', 'LEFT', 'UP'].findIndex((f) => f === currentDirection)
        );

      // move up in pathCommands and change direction
      const { d, sc } = setNextDirection(currentDirection);
      currentDirection = d;
      stepCount = sc;
    }

    const { x, y, c, face, direction } = getNextPosition(posX, posY, currentFace, currentDirection);
    if (c === '.') {
      currentFace = face;
      currentDirection = direction;
      posX = x;
      posY = y;
      stepCount -= 1;
      continue;
    }
    if (c === '#') {
      stepCount = 0;
      continue;
    }
  }
}

function Face(input, { x, y }) {
  const map = input;
  this.orgX = x;
  this.orgY = y;
  this.getCell = (x, y) => {
    return map[this.orgY + y][this.orgX + x];
  };
}

function part1(input, pathCommands, cubeSize) {
  // build the cube
  const faces = [
    new Face(input, { x: cubeSize, y: 0 }), // face 0
    new Face(input, { x: cubeSize * 2, y: 0 }), // face 1
    new Face(input, { x: cubeSize, y: cubeSize }), // face 2
    new Face(input, { x: 0, y: cubeSize * 2 }), // face 3
    new Face(input, { x: cubeSize, y: cubeSize * 2 }), // face 4
    new Face(input, { x: 0, y: cubeSize * 3 }), // face 5
  ];

  // link all faces
  faces[0].right = { nFace: faces[1], nDirection: 'RIGHT', translateXY: (x, y) => ({ nX: 0, nY: y }) };
  faces[0].left = { nFace: faces[1], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: y }) };
  faces[0].up = { nFace: faces[4], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[0].down = { nFace: faces[2], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  faces[1].right = { nFace: faces[0], nDirection: 'RIGHT', translateXY: (x, y) => ({ nX: 0, nY: y }) };
  faces[1].left = { nFace: faces[0], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: y }) };
  faces[1].up = { nFace: faces[1], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[1].down = { nFace: faces[1], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  faces[2].right = { nFace: faces[2], nDirection: 'RIGHT', translateXY: (x, y) => ({ nX: 0, nY: y }) };
  faces[2].left = { nFace: faces[2], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: y }) };
  faces[2].up = { nFace: faces[0], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[2].down = { nFace: faces[4], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  faces[3].right = { nFace: faces[4], nDirection: 'RIGHT', translateXY: (x, y) => ({ nX: 0, nY: y }) };
  faces[3].left = { nFace: faces[4], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: y }) };
  faces[3].up = { nFace: faces[5], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[3].down = { nFace: faces[5], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  faces[4].right = { nFace: faces[3], nDirection: 'RIGHT', translateXY: (x, y) => ({ nX: 0, nY: y }) };
  faces[4].left = { nFace: faces[3], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: y }) };
  faces[4].up = { nFace: faces[2], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[4].down = { nFace: faces[0], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  faces[5].right = { nFace: faces[5], nDirection: 'RIGHT', translateXY: (x, y) => ({ nX: 0, nY: y }) };
  faces[5].left = { nFace: faces[5], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: y }) };
  faces[5].up = { nFace: faces[3], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[5].down = { nFace: faces[3], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  // solve the path
  const result = solve(pathCommands, faces, cubeSize);
  return result;
}

function part2(input, pathCommands, cubeSize) {
  const FRONT = 0;
  const RIGHT = 1;
  const BOTTOM = 2;
  const BACK = 3;
  const LEFT = 4;
  const TOP = 5;

  const faces = [
    new Face(input, { x: cubeSize, y: cubeSize }), // front
    new Face(input, { x: cubeSize * 2, y: 0 }), // right
    new Face(input, { x: cubeSize, y: cubeSize * 2 }), // bottom
    new Face(input, { x: 0, y: cubeSize * 3 }), // back
    new Face(input, { x: 0, y: cubeSize * 2 }), // left
    new Face(input, { x: cubeSize, y: 0 }), // top
  ];

  // link all faces as a cube
  faces[FRONT].right = { nFace: faces[RIGHT], nDirection: 'UP', translateXY: (x, y) => ({ nX: y, nY: cubeSize - 1 }) };
  faces[FRONT].left = { nFace: faces[LEFT], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: y, nY: 0 }) };
  faces[FRONT].up = { nFace: faces[TOP], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[FRONT].down = { nFace: faces[BOTTOM], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  faces[RIGHT].right = {
    nFace: faces[BOTTOM],
    nDirection: 'LEFT',
    translateXY: (x, y) => ({ nX: cubeSize - 1, nY: cubeSize - 1 - y }),
  };
  faces[RIGHT].left = { nFace: faces[TOP], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: y }) };
  faces[RIGHT].up = { nFace: faces[BACK], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[RIGHT].down = { nFace: faces[FRONT], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: x }) };

  faces[BOTTOM].right = {
    nFace: faces[RIGHT],
    nDirection: 'LEFT',
    translateXY: (x, y) => ({ nX: cubeSize - 1, nY: cubeSize - 1 - y }),
  };
  faces[BOTTOM].left = { nFace: faces[LEFT], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: y }) };
  faces[BOTTOM].up = { nFace: faces[FRONT], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[BOTTOM].down = { nFace: faces[BACK], nDirection: 'LEFT', translateXY: (x, y) => ({ nX: cubeSize - 1, nY: x }) };

  faces[BACK].right = {
    nFace: faces[BOTTOM],
    nDirection: 'UP',
    translateXY: (x, y) => ({ nX: y, nY: cubeSize - 1 }),
  };
  faces[BACK].left = { nFace: faces[TOP], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: y, nY: 0 }) };
  faces[BACK].up = { nFace: faces[LEFT], nDirection: 'UP', translateXY: (x, y) => ({ nX: x, nY: cubeSize - 1 }) };
  faces[BACK].down = { nFace: faces[RIGHT], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  faces[LEFT].right = {
    nFace: faces[BOTTOM],
    nDirection: 'RIGHT',
    translateXY: (x, y) => ({ nX: 0, nY: y }),
  };
  faces[LEFT].left = {
    nFace: faces[TOP],
    nDirection: 'RIGHT',
    translateXY: (x, y) => ({ nX: 0, nY: cubeSize - 1 - y }),
  };
  faces[LEFT].up = { nFace: faces[FRONT], nDirection: 'RIGHT', translateXY: (x, y) => ({ nX: 0, nY: x }) };
  faces[LEFT].down = { nFace: faces[BACK], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  faces[TOP].right = {
    nFace: faces[RIGHT],
    nDirection: 'RIGHT',
    translateXY: (x, y) => ({ nX: 0, nY: y }),
  };
  faces[TOP].left = {
    nFace: faces[LEFT],
    nDirection: 'RIGHT',
    translateXY: (x, y) => ({ nX: 0, nY: cubeSize - 1 - y }),
  };
  faces[TOP].up = { nFace: faces[BACK], nDirection: 'RIGHT', translateXY: (x, y) => ({ nX: 0, nY: x }) };
  faces[TOP].down = { nFace: faces[FRONT], nDirection: 'DOWN', translateXY: (x, y) => ({ nX: x, nY: 0 }) };

  // solve the path
  const result = solve(pathCommands, faces, cubeSize);
  return result;
}

//const input = readInput(`d${DAY}-sample.txt`);
const input = readInput(`d${DAY}-input.txt`);
const pathCommands = input[input.length - 1].split('').reduce((list, c) => {
  if (c === 'L' || c === 'R') {
    list.push(c);
    return list;
  }
  // convert 2 digits to 1 integer.
  const last = list.length - 1;
  if (last === -1 || list[last] === 'L' || list[last] === 'R') list.push(Number(c));
  else list[last] = list[last] * 10 + Number(c);
  return list;
}, []);

console.log(`Part 1: ${part1(input, pathCommands, 50)}`);
console.log(`Part 2: ${part2(input, pathCommands, 50)}`);
