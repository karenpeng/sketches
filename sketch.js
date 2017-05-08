var FRAME_RATE = 80;
var WALKER_NUMBER = 10;
var interval = 22 * FRAME_RATE;
var cleaning = false;
var transparency = 0;
var walkers = [];
var intervalId1, intervalId2;

function Walker(x, y, index) {
  this.x = x;
  this.y = y;
  this.loc = createVector(random(x), random(y));
  this.noff = createVector(random(10), random(10));
  this.index = index;
  this.moving = true;
  var hue = 111 + this.index * 30;
  var light = 52 + this.index * 4;
  this.c = color('hsl(' + hue +',72%, ' + light + '%)');
}

Walker.prototype.reset = function() {
  this.loc = createVector(this.x, this.y);
  this.index = WALKER_NUMBER - this.index - 1;
}

Walker.prototype.toggle = function() {
  this.moving = !this.moving;
}

Walker.prototype.walk = function (x, y) {
  if (!this.moving) {
    return;
  }
  var maxV = 20;
  var lerpX = map(noise(this.noff.x, this.noff.y), 0, 1, maxV * -1, maxV);
  var lerpY = map(noise(this.noff.y, this.noff.x), 0, 1, maxV * -1, maxV);

  this.loc.add(createVector(lerpX, lerpY));

  var nLerpX = map(noise(this.index), 0, 1, 0, 0.02);
  var nLerpY = map(noise(this.index), 0, 1, 0, 0.02);

  this.noff.add(nLerpX, nLerpY);

  this.loc.x = constrain(this.loc.x, 0, width);
  this.loc.y = constrain(this.loc.y, 0, height);
};

Walker.prototype.mirror = function (time) {
  if (!this.moving ||
      this.loc.x === 0 || this.loc.x === width || this.loc.y === 0 || this.loc.y === height) {
    return;
  }
  noStroke();
  var n = noise(time);

  fill(this.c, map(n, 0, 1, 90, 100));
  var radius = map(n, 0, 1, 1, 2 + this.index * 2.2);
  ellipse(this.loc.x, this.loc.y, radius, radius);
  // ellipse(this.loc.x, height - this.loc.y, radius, radius);
  // ellipse(width - this.loc.x, this.loc.y, radius, radius);
  // ellipse(width - this.loc.x, height - this.loc.y, radius, radius);
};

function pause(frame) {
  clearInterval(intervalId1);
  clearInterval(intervalId2);
  var luckyGirl = Math.floor(random() * WALKER_NUMBER);
  console.log(luckyGirl)
  intervalId1 = setTimeout(function() {
    walkers[luckyGirl].toggle();
  }, 0)

  intervalId2 = setTimeout(function() {
    walkers[luckyGirl].reset();
    walkers[luckyGirl].toggle();
  }, map(noise(frame), 0, 1, 1, 3) * FRAME_RATE)
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(FRAME_RATE);
  background(255);
  for(var i = 0; i < 4; i++) {
    walkers.push(new Walker(width, height, walkers.length - 1));
  }
}

function draw() {
  if (frameCount % interval === 0) {
    cleaning = true;
  }

  if (cleaning) {
    transparency += 0.2;
  }

  if (transparency >= 100) {
    cleaning = false;
    transparency = 0;
  }

  background(255, transparency);

  var ran = random();
  if (ran < 0.2 && walkers.length < WALKER_NUMBER) {
    walkers.push(new Walker(width, height, walkers.length - 1))
  }

  if (ran < 0.002) {
    pause();
  }

  if (transparency < 50) {
    walkers.forEach(function(walker, index) {
      walker.walk();
      walker.mirror(frameCount * 0.1);
    });
  }
}
