"use strict";
var mine = [];
var drawArr = [];
var help = 0;
var canvas;
var seedSeeds;
var velikost;
function setup() {
  canvas = createCanvas(400, 400);
  start(20, 20);
  frameRate(5);
}
function start(seed, size) {
  seedSeeds = seed;
  velikost = size;
  var done = false;
  mine = [];
  drawArr = [];
  let zeroLine = [];
  for (var x = 0; x < size; x++) {
    let line = [];
    zeroLine = [];
    for (var y = 0; y < size; y++) {
      zeroLine.push(-1);
      if (Math.floor(Math.random() * seed) === 1) {
        line.push(1);
      } else {
        line.push(0);
      }
    }
    done = true;
    mine.push(line);
    drawArr.push(zeroLine);
  }
  help = width / size;
}
var reset = false;
document.addEventListener(
  "contextmenu",
  function(ev) {
    ev.preventDefault();
    var x = ev.pageX - $("#Hra").offset().left;
    var y = ev.pageY - $("#Hra").offset().top;
    if (x > 0 && y > 0 && x < canvas.width && y < canvas.height) {
      x = Math.floor(x / help);
      y = Math.floor(y / help);
      console.log(x + "," + y);
      if (reset) {
        start(seedSeeds, velikost);
        reset = false;
      } else {
        mineFound(x, y);
      }
    }
  },
  false
);
function mineFound(x, y) {
  drawArr[x][y] = -3;
}
document.addEventListener("click", function(evt) {
  var x = evt.pageX - $("#Hra").offset().left;
  var y = evt.pageY - $("#Hra").offset().top;
  if (x > 0 && y > 0 && x < canvas.width && y < canvas.height) {
    if (reset) {
      start(seedSeeds, velikost);
      reset = false;
    } else {
      x = Math.floor(x / help);
      y = Math.floor(y / help);
      console.log(x + "," + y);
      //drawArr[x][y] = mine[x][y];
      if (mine[x][y] === 1) {
        //start(seedSeeds, velikost);
        console.log("prohra");
        drawArr = mine;
        reset = true;
      }
      drawGrey(x, y);
    }
  }
});
function getMinesNextTo(x, y) {
  var amunt = 0;
  if (x < velikost - 1) {
    if (y < velikost - 1) {
      if (mine[x + 1][y + 1] === 1) amunt++;
    }
    if (mine[x + 1][y] === 1) amunt++;
    if (y > 0) {
      if (mine[x + 1][y - 1] === 1) amunt++;
    }
  }
  if (y > 0) {
    if (mine[x][y - 1] === 1) amunt++;
  }
  if (y < velikost - 1) {
    if (mine[x][y + 1] === 1) amunt++;
  }
  if (x > 0) {
    if (y < velikost - 1) {
      if (mine[x - 1][y + 1] === 1) amunt++;
    }
    if (mine[x - 1][y] === 1) amunt++;
    if (y > 0) {
      if (mine[x - 1][y - 1] === 1) amunt++;
    }
  }
  return amunt;
}

function drawGrey(o, p) {
  beenTo = [];
  for (var x = 0; x < velikost; x++) {
    let zeroLine = [];
    for (var y = 0; y < velikost; y++) {
      zeroLine.push(0);
    }
    beenTo.push(zeroLine);
  }
  drawGreyAgain(o, p, beenTo);
}
var beenTo;
function drawGreyAgain(x, y) {
  if (drawArr[x][y] === -2) {
  } else {
    drawArr[x][y] = mine[x][y];
  }
  beenTo[x][y] = 1;
  // console.log(beenTo + "," + x + "x" + "," + y + "y");
  if (x < velikost - 1) {
    if (x + 1 <= velikost && beenTo[x + 1][y] === 0) {
      if (
        mine[x + 1][y] === 0 &&
        (getMinesNextTo(x, y) === 0 || drawArr[x + 1][y] != -1)
      ) {
        drawGreyAgain(x + 1, y, beenTo);
      } else {
        drawArr[x][y] = -2;
      }
    }
  }
  if (x > 0) {
    if (x - 1 >= 0 && beenTo[x - 1][y] === 0) {
      if (
        mine[x - 1][y] === 0 &&
        (getMinesNextTo(x, y) === 0 || drawArr[x - 1][y] != -1)
      ) {
        drawGreyAgain(x - 1, y, beenTo);
      } else {
        drawArr[x][y] = -2;
      }
    }
  }
  if (y < velikost) {
    if (y + 1 <= velikost - 1 && beenTo[x][y + 1] === 0) {
      if (
        mine[x][y + 1] === 0 &&
        (getMinesNextTo(x, y) === 0 || drawArr[x][y + 1] != -1)
      ) {
        drawGreyAgain(x, y + 1, beenTo);
      } else {
        drawArr[x][y] = -2;
      }
    }
  }
  if (y > 0) {
    if (y - 1 >= 0 && beenTo[x][y - 1] === 0) {
      if (
        mine[x][y - 1] === 0 &&
        (getMinesNextTo(x, y) === 0 || drawArr[x][y - 1] != -1)
      ) {
        drawGreyAgain(x, y - 1, beenTo);
      } else {
        drawArr[x][y] = -2;
      }
    }
  }
}

function draw() {
  background(220);
  fill(0, 255, 0);
  stroke(255, 0, 0);
  for (var x = 0; x < mine.length; x++) {
    for (var y = 0; y < mine.length; y++) {
      switch (drawArr[x][y]) {
        case -3:
          fill(150, 0, 0);
          break;
        case -2:
          fill(150);
          break;
        case -1:
          fill(0, 255, 0);
          break;
        case 0:
          fill(150);
          break;
        case 1:
          fill(255);
          break;
      }
      rect(x * help, y * help, (x + 1) * help, (y + 1) * help);
      push();
      //stroke(255, 0, 0);
      fill(0);
      if (drawArr[x][y] === -2) {
        let amunt = getMinesNextTo(x, y);
        text(amunt, x * help, y * help, (x + 1) * help, (y + 1) * help);
      }
      pop();
    }
  }
}
