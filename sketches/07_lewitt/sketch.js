let canvas;
let gridSize = 10;
let spacing = 5;
let lineWeight = 2;
let currentDrawing = 0;

const instructions = [
    "A wall divided vertically into fifteen equal parts, each with a different line direction, separated by white lines.",
    "Vertical lines, not straight, not touching, uniformly dispersed with maximum density, covering the entire surface of the wall.",
    "A square is divided horizontally and vertically into four equal parts, each with lines in a different direction.",
    "The first drafter draws a not straight line. The second drafter draws a line following the first line. (Repeat)",
    "Four drafters draw cascading lines: black, then red, yellow, and blue, each following the previous line's path.",
    "Wall Drawing #122: All combinations of two lines crossing, placed at random, using four colors for one hour each day.",
    "Wall Drawing #85: Four horizontal parts with increasing divisions (4,6,8,10), each with lines in different directions.",
    "Wall Drawing #51: All architectural points connected by straight lines.",
    "Wall Drawing #273: Lines from corners, sides, and center to random points on a grid.",
    "Wall Drawing #146: Two-part combinations of blue arcs from corners and sides with various line types."
];

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    strokeWeight(lineWeight);
    noLoop();
    updateInstruction();
    initializeSketch();
}

function updateInstruction() {
    const instructionDiv = document.getElementById('instruction');
    instructionDiv.textContent = instructions[currentDrawing];
}

function initializeSketch() {
    background(255);
    
    switch(currentDrawing) {
        case 0:
            drawWallDrawing11();
            break;
        case 1:
            drawWallDrawing46();
            break;
        case 2:
            drawWallDrawing56();
            break;
        case 3:
            drawWallDrawing797();
            break;
        case 4:
            drawColorCascade();
            break;
        case 5:
            drawWallDrawing122();
            break;
        case 6:
            drawWallDrawing85();
            break;
        case 7:
            drawWallDrawing51();
            break;
        case 8:
            drawWallDrawing273();
            break;
        case 9:
            drawWallDrawing146();
            break;
    }
}

function drawWallDrawing11() {
    const sectionWidth = width / 15;
    
    for (let i = 0; i < 15; i++) {
        const x = i * sectionWidth;
        const angle = map(i, 0, 14, -PI/3, PI/3);
        
        // Draw white separator lines
        stroke(255);
        strokeWeight(2);
        line(x, 0, x, height);
        
        // Draw angled lines
        stroke(0);
        strokeWeight(lineWeight);
        const spacing = map(this.spacing, 1, 10, 10, 30);
        
        for (let y = -height; y < height * 2; y += spacing) {
            const x1 = x;
            const x2 = x + sectionWidth;
            const y1 = y;
            const y2 = y + sectionWidth * tan(angle);
            line(x1, y1, x2, y2);
        }
    }
}

function drawWallDrawing46() {
    const density = map(spacing, 1, 10, 5, 20);
    const numLines = width / density;
    
    for (let i = 0; i < numLines; i++) {
        const x = map(i, 0, numLines, 0, width);
        const controlPoints = [];
        
        // Generate control points for curved line
        for (let y = 0; y < height; y += height/4) {
            const offset = random(-30, 30);
            controlPoints.push({x: x + offset, y: y});
        }
        
        // Draw curved line
        beginShape();
        noFill();
        curveVertex(controlPoints[0].x, controlPoints[0].y);
        for (let point of controlPoints) {
            curveVertex(point.x, point.y);
        }
        curveVertex(controlPoints[controlPoints.length-1].x, controlPoints[controlPoints.length-1].y);
        endShape();
    }
}

function drawWallDrawing56() {
    const cellSize = width / 2;
    
    // Draw grid
    stroke(200);
    line(width/2, 0, width/2, height);
    line(0, height/2, width, height/2);
    
    stroke(0);
    const spacing = map(this.spacing, 1, 10, 10, 30);
    
    // Top-left: vertical lines
    for (let x = 0; x < width/2; x += spacing) {
        line(x, 0, x, height/2);
    }
    
    // Top-right: horizontal lines
    for (let y = 0; y < height/2; y += spacing) {
        line(width/2, y, width, y);
    }
    
    // Bottom-left: diagonal lines (/)
    for (let i = -height; i < width; i += spacing) {
        line(max(0, i), max(height/2, height/2 + i), 
             min(width/2, i + height/2), min(height, height/2 + i));
    }
    
    // Bottom-right: diagonal lines (\)
    for (let i = 0; i < width + height; i += spacing) {
        line(min(width, width/2 + i), max(height/2, height - i),
             max(width/2, width - i), min(height, height/2 + i));
    }
}

function drawWallDrawing797() {
    const numLines = 50;
    let prevPoints = [];
    
    // Generate first line
    for (let i = 0; i < width; i += width/numLines) {
        prevPoints.push({
            x: i,
            y: height/2 + random(-50, 50)
        });
    }
    
    // Draw multiple following lines
    const numFollowers = map(spacing, 1, 10, 3, 15);
    
    for (let j = 0; j < numFollowers; j++) {
        let newPoints = [];
        
        beginShape();
        noFill();
        curveVertex(prevPoints[0].x, prevPoints[0].y);
        
        for (let i = 0; i < prevPoints.length; i++) {
            const point = prevPoints[i];
            const offset = random(-10, 10);
            const newY = point.y + offset;
            
            curveVertex(point.x, point.y);
            newPoints.push({x: point.x, y: newY});
        }
        
        curveVertex(prevPoints[prevPoints.length-1].x, prevPoints[prevPoints.length-1].y);
        endShape();
        
        prevPoints = newPoints;
    }
}

function drawColorCascade() {
    const colors = [
        color(0),      // black
        color(255, 0, 0),  // red
        color(255, 255, 0),  // yellow
        color(0, 0, 255)   // blue
    ];
    
    const numPoints = 50;
    let prevPoints = [];
    
    // Generate first line points
    for (let i = 0; i < width; i += width/numPoints) {
        prevPoints.push({
            x: i,
            y: 100 + random(-20, 20)  // Start near top with some variation
        });
    }
    
    // Number of cascading sets
    const numSets = floor((height - 100) / (spacing * 20));
    
    for (let set = 0; set < numSets; set++) {
        let setPoints = prevPoints;
        
        // Draw four lines (one for each drafter) in each set
        for (let drafter = 0; drafter < 4; drafter++) {
            stroke(colors[drafter]);
            strokeWeight(lineWeight);
            noFill();
            
            beginShape();
            curveVertex(setPoints[0].x, setPoints[0].y);
            
            for (let p of setPoints) {
                curveVertex(p.x, p.y);
            }
            
            curveVertex(setPoints[setPoints.length-1].x, setPoints[setPoints.length-1].y);
            endShape();
            
            // Generate points for next line
            let nextPoints = [];
            for (let i = 0; i < setPoints.length; i++) {
                nextPoints.push({
                    x: setPoints[i].x,
                    y: setPoints[i].y + random(5, 15)  // Slight downward shift with variation
                });
            }
            setPoints = nextPoints;
        }
        
        // Move down for next set
        prevPoints = setPoints.map(p => ({
            x: p.x,
            y: p.y + spacing * 10
        }));
    }
}

function drawWallDrawing122() {
    const colors = [
        color(255, 255, 0),  // yellow
        color(0),            // black
        color(255, 0, 0),    // red
        color(0, 0, 255)     // blue
    ];
    
    const numLines = map(spacing, 1, 10, 20, 100);
    
    // Simulate four days of drawing
    for (let day = 0; day < 4; day++) {
        stroke(colors[day]);
        strokeWeight(lineWeight);
        
        // Draw crossing lines for each "hour"
        for (let hour = 0; hour < numLines; hour++) {
            // First line
            let x1 = random(width);
            let y1 = random(height);
            let x2 = random(width);
            let y2 = random(height);
            line(x1, y1, x2, y2);
            
            // Crossing line
            let x3 = random(width);
            let y3 = random(height);
            let x4 = random(width);
            let y4 = random(height);
            line(x3, y3, x4, y4);
        }
    }
}

function drawWallDrawing85() {
    const rows = [4, 6, 8, 10];  // Number of divisions in each row
    const rowHeight = height / 4;
    
    for (let row = 0; row < 4; row++) {
        const numDivisions = rows[row];
        const divisionWidth = width / numDivisions;
        
        for (let div = 0; div < numDivisions; div++) {
            const x = div * divisionWidth;
            const y = row * rowHeight;
            const angle = map(div, 0, numDivisions, 0, TWO_PI);
            
            stroke(0);
            strokeWeight(lineWeight);
            
            // Draw lines in different directions for each division
            const lineSpacing = map(spacing, 1, 10, 5, 15);
            for (let offset = 0; offset < rowHeight + divisionWidth; offset += lineSpacing) {
                const x1 = x + offset * cos(angle);
                const y1 = y + offset * sin(angle);
                const x2 = x + divisionWidth;
                const y2 = y + rowHeight;
                line(x1, y1, x2, y2);
            }
        }
    }
}

function drawWallDrawing51() {
    const points = [];
    const numPoints = map(gridSize, 4, 20, 10, 50);
    
    // Generate architectural points
    for (let i = 0; i < numPoints; i++) {
        points.push({
            x: random(width),
            y: random(height)
        });
    }
    
    // Add corner points
    points.push({x: 0, y: 0});
    points.push({x: width, y: 0});
    points.push({x: 0, y: height});
    points.push({x: width, y: height});
    
    stroke(0);
    strokeWeight(lineWeight);
    
    // Connect all points
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            line(points[i].x, points[i].y, points[j].x, points[j].y);
        }
    }
}

function drawWallDrawing273() {
    const gridSpacing = map(spacing, 1, 10, 20, 60);
    const points = [];
    
    // Create grid points
    for (let x = 0; x < width; x += gridSpacing) {
        for (let y = 0; y < height; y += gridSpacing) {
            if (random() < 0.3) {  // Only select some grid points
                points.push({x, y});
            }
        }
    }
    
    stroke(0);
    strokeWeight(lineWeight);
    
    // Define key points
    const keyPoints = [
        {x: 0, y: 0},             // top-left
        {x: width, y: 0},         // top-right
        {x: 0, y: height},        // bottom-left
        {x: width, y: height},    // bottom-right
        {x: width/2, y: height/2} // center
    ];
    
    // Draw lines from key points to random grid points
    for (let keyPoint of keyPoints) {
        for (let point of points) {
            line(keyPoint.x, keyPoint.y, point.x, point.y);
        }
    }
}

function drawWallDrawing146() {
    stroke(0, 0, 255);  // blue
    strokeWeight(lineWeight);
    noFill();
    
    const cornerPoints = [
        {x: 0, y: 0},
        {x: width, y: 0},
        {x: width, y: height},
        {x: 0, y: height}
    ];
    
    const numCombinations = map(spacing, 1, 10, 5, 15);
    
    // Draw combinations of arcs and lines
    for (let i = 0; i < numCombinations; i++) {
        // Draw arc
        const start = random(cornerPoints);
        const radius = random(100, 400);
        arc(start.x, start.y, radius * 2, radius * 2, random(TWO_PI), random(TWO_PI));
        
        // Draw various line types
        const lineType = floor(random(3));
        const x1 = random(width);
        const y1 = random(height);
        const x2 = random(width);
        const y2 = random(height);
        
        switch(lineType) {
            case 0:  // straight line
                line(x1, y1, x2, y2);
                break;
            case 1:  // not straight line
                beginShape();
                curveVertex(x1, y1);
                curveVertex(x1, y1);
                curveVertex(random(width), random(height));
                curveVertex(x2, y2);
                curveVertex(x2, y2);
                endShape();
                break;
            case 2:  // broken line
                const segments = 5;
                let prevX = x1;
                let prevY = y1;
                for (let j = 1; j <= segments; j++) {
                    const nextX = lerp(x1, x2, j/segments) + random(-20, 20);
                    const nextY = lerp(y1, y2, j/segments) + random(-20, 20);
                    line(prevX, prevY, nextX, nextY);
                    prevX = nextX;
                    prevY = nextY;
                }
                break;
        }
    }
}

function updateParameters() {
    currentDrawing = Number(document.getElementById('instruction-select').value);
    gridSize = Number(document.getElementById('grid').value);
    spacing = Number(document.getElementById('spacing').value);
    lineWeight = Number(document.getElementById('weight').value);
    strokeWeight(lineWeight);
    updateInstruction();
    refreshSketch();
}

function refreshSketch() {
    initializeSketch();
}

async function updateGallery() {
    const updateButton = document.getElementById('update-gallery-button');
    updateButton.textContent = 'Saving...';
    updateButton.style.background = '#FFA500';
    
    const imageData = canvas.elt.toDataURL('image/png');
    
    try {
        const response = await fetch('/save-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageData,
                sketchPath: 'sketches/07_lewitt/preview.png'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            updateButton.textContent = 'Gallery Updated!';
            updateButton.style.background = '#45a049';
            setTimeout(() => {
                updateButton.textContent = 'Update Gallery';
                updateButton.style.background = '#2196F3';
            }, 2000);
        } else {
            throw new Error('Server indicated failure');
        }
    } catch (error) {
        console.error('Failed to update gallery:', error);
        updateButton.textContent = 'Error! Check Console';
        updateButton.style.background = '#ff0000';
        setTimeout(() => {
            updateButton.textContent = 'Update Gallery';
            updateButton.style.background = '#2196F3';
        }, 3000);
    }
} 