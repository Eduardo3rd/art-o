function setup() {
  createCanvas(1000, 1000);
  background(255);
  angleMode(DEGREES);	// change the angle mode from radians to degrees
  noLoop();
}

function draw() {  
  var circles = random(1,10); //number of circles in the piece 
  var scalar = random(1,1200);  // set the radius of circle
  var startX = random(0,1000);	// set the x-coordinate for the circle center
  var startY = random(0,1000);	// set the y-coordinate for the circle center
  //var loops = random(1,10);
  
  

  for (var angle = 0; angle <= 360; angle += 10) {
    var x = startX + scalar * cos(angle);
    var y = startY + scalar * sin(angle);
    for (var loops = 0; loops <= circles; loops +=1){
      rect(x+loops*50, y+loops*50 ,55, 55, 20);
      
    }
    noFill(); 
    }
}



