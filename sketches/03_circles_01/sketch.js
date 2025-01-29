let canvas;
let numLayers = 2;

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    angleMode(DEGREES);
    initializeSketch();
}

function initializeSketch() {
    // Set black background
    background(0);
    
    // Set drawing style
    stroke(255, 255, 255, 80);
    strokeWeight(1);
    noFill();
    
    // Draw multiple layers of patterns
    for (let layer = 0; layer < numLayers; layer++) {
        drawSpirographLayer(
            width/2,  // center x
            height/2, // center y
            250 + layer * 50,  // Increased spacing between layers
            random(0.3, 0.8),  // Reduced scale factor range
            random(2, 4)       // Reduced rotation factor range
        );
    }
    
    noLoop();
}

function drawSpirographLayer(centerX, centerY, radius, scaleFactor, rotationFactor) {
    let points = 90;
    let angleStep = 360 / points;
    
    // Draw multiple orbiting circles
    for (let angle = 0; angle < 360; angle += angleStep * 2) {
        let orbitX = centerX + cos(angle) * radius;
        let orbitY = centerY + sin(angle) * radius;
        
        // Draw a circle at each orbit point
        beginShape();
        for (let a = 0; a < 360; a += 8) {
            let r = radius * scaleFactor * sin(a * rotationFactor);
            let x = orbitX + cos(a) * r;
            let y = orbitY + sin(a) * r;
            curveVertex(x, y);
        }
        endShape(CLOSE);
    }
}

function draw() {
    // Static piece, no animation needed
}

// Function to refresh the sketch
function refreshSketch() {
    initializeSketch();
}

// Function to update the gallery preview
async function updateGallery() {
    const updateButton = document.getElementById('update-gallery-button');
    updateButton.textContent = 'Saving...';
    updateButton.style.background = '#FFA500';
    
    // Get the canvas data using the underlying HTML canvas element
    const imageData = canvas.elt.toDataURL('image/png');
    
    try {
        const response = await fetch('/save-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageData,
                sketchPath: 'sketches/03_circles_01/preview.png'
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