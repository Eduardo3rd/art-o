function setup() {
  createCanvas(1500, 1500);
  background(0);
  angleMode(DEGREES);	// change the angle mode from radians to degrees
  noLoop();
}

function draw() {  
  //var circles = random(1,10); //number of circles in the piece 
  var scalar = 250;  // set the radius of circle
  var startX = width/2;	// set the x-coordinate for the circle center
  var startY = height/2;	// set the y-coordinate for the circle center
  //var loops = random(1,10);
  stroke(255);
  strokeWeight(1);
  //noFill(); 
  
  increment = random(1,20)

  for (var angle = 0; angle <= 360; angle += increment) {
    var x = startX + scalar * cos(angle);
    var y = startY + scalar * sin(angle);
    arc(x, y, 300, 300, 0, 360);
    }
    
}



