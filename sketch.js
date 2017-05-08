function Walker(x, y) {
	this.loc = createVector(x, y);
	this.noff = createVector(random(10), random(10));
}

Walker.prototype.walk = function (x, y) {
	var maxV = 20;
	var lerpX = map(noise(this.noff.x, this.noff.y), 0, 1, maxV * -1, maxV);
	var lerpY = map(noise(this.noff.y, this.noff.x), 0, 1, maxV * -1, maxV);

	this.loc.add(createVector(lerpX, lerpY));

	var nLerpX = map(noise(this.loc.y), 0, 1, 0, 0.02);
	var nLerpY = map(noise(this.loc.x), 0, 1, 0, 0.02);

	this.noff.add(nLerpX, nLerpY);

	this.loc.x = constrain(this.loc.x, 0, width);
	this.loc.y = constrain(this.loc.y, 0, height);
};

Walker.prototype.mirror = function (time) {
	if (this.loc.x === 0 || this.loc.x === width || this.loc.y === 0 || this.loc.y === height) {
	  return;
	}
	noStroke();
	var n = noise(time);
	fill(206, 33, 89, map(n, 0, 1, 80, 100));
	var radius = map(n, 0, 1, 1, 4);
	ellipse(this.loc.x, this.loc.y, radius, radius);
	ellipse(this.loc.x, height - this.loc.y, radius, radius);
	ellipse(width - this.loc.x, this.loc.y, radius, radius);
	ellipse(width - this.loc.x, height - this.loc.y, radius, radius);
};

var FRAME_RATE = 80;
var interval = 40 * FRAME_RATE;
var cleaning = false;
var transparency = 0;
var walker, intervalId;

function mySetup() {
  walker = new Walker(random() * width, random() * height);
}

function pause(frame) {
  clearInterval(intervalId);
  intervalId = setTimeout(function() {
    noLoop();
  }, 0)

  intervalId = setTimeout(function() {
    loop();
    mySetup();
  }, map(noise(frame), 0, 1, 0.5, 2) * FRAME_RATE)
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(FRAME_RATE);
  background(255);
  mySetup();
}

function draw() {
  if (frameCount % interval === 0) {
    cleaning = true;
  }

  if (cleaning) {
    transparency += 0.2;
  }

  if (transparency >= 100) {
    transparency = 0;
    cleaning = false;
  }

  background(255, transparency);

  if (random() < 0.0015) {
    pause(frameCount);
  }

  if (transparency < 40) {
    walker.walk();
    walker.mirror(frameCount * 0.1);
  }
}
