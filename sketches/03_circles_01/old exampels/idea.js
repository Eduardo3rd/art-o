function setup() {
  //set the canvas size in pixels 
  createCanvas(750, 750);
  //set the background color to black 
  background(0);
  //only draw the piece one time 
  noLoop();
}

function draw() {  
  //set the stroke color to white 
  stroke(255);
  //set the stroke width to 1 pixel 
  strokeWeight(1);
  //make all shapes outlines only 
  noFill(); 
  
  //set the constants for the sin wave plot: 
  //y = (ScaleFactor)*sin(x/(CanvasWidth/Period)*(180deg)*CanvasHeight)+(CanvasHeight + OffsetFromMiddle) 

  //draw in the middle of the canvas
  offset = height/2
  //set the number of periods in the sin wave 
  period = random(1,5)
  //set the step size between circles 
  step = period/50
  //set the scale factor for the sin wave 
  Yscale = random()

  //initial x and y values for drawing the first circle 
  startX = 0 
  startY = height/2
  
  //for loop to draw all of the mega circles 
  for (var i = 0; i <= 1; i += step) {
    
    //set the radius of the mega circle 
    scalar = random(10,50);  
    //set the number of circles in the mega circle. smaller numbers mean more circles 
    increment = random(0.01,0.05)*2*PI
    //set the diameter of the circles in the mega circle 
    dia = random(10,50)
    
    //for loop to draw all of the circles in this mega circle 
    for (var angle = 0; angle <= (2*PI); angle += increment) {
      //set the x and y cords for the circle 
      var x = startX + scalar * cos(angle);
      var y = startY + scalar * sin(angle);
      //draw the circle 
      arc(x, y, dia, dia, 0, 2*PI);
      }
    
    //update the cords for the next mega circle 
    startX = startX + width * step
    startY = Yscale*(sin(startX/(width/period)*PI)*height)+(offset) 
  }
  
}


