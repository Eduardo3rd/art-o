let canvas;
let gridPoints = [];
let selectedPoints = [];
let gridSize;
let cells;

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    initializeSketch();
}

function initializeSketch() {
    // Reset arrays
    gridPoints = [];
    selectedPoints = [];
    
    // Set black background
    background(0);
    
    // Find a grid size that divides evenly into canvas width
    do {
        gridSize = floor(random(20, 100));
    } while (width % gridSize !== 0);
    
    cells = floor(width / gridSize);
    console.log('Grid size:', gridSize, 'Cells:', cells);
    
    // Create grid points
    for (let i = 0; i <= cells; i++) {
        for (let j = 0; j <= cells; j++) {
            let x = i * gridSize;
            let y = j * gridSize;
            gridPoints.push({ x, y });
        }
    }
    
    // Draw circles at grid points (75% probability)
    stroke(255);
    noFill();
    for (let point of gridPoints) {
        if (random() > 0.25) {
            let weight = random(1, 10);
            let radius = random(10, 20);
            strokeWeight(weight);
            circle(point.x, point.y, radius * 2);
            selectedPoints.push(point);
        }
    }
    
    // Draw connecting lines
    stroke(255);
    strokeWeight(2);
    beginShape();
    noFill();
    for (let i = 0; i < selectedPoints.length; i++) {
        let point = random(selectedPoints);
        vertex(point.x, point.y);
    }
    endShape();
    
    // Draw final large red circle
    stroke(255, 0, 0);
    let finalX = random(width * 0.3, width * 0.9);
    let finalY = random(height * 0.3, height * 0.9);
    let finalRadius = random(50, 200);
    let finalWeight = random(5, 30);
    strokeWeight(finalWeight);
    circle(finalX, finalY, finalRadius * 2);
    
    noLoop();
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
                sketchPath: 'sketches/02_attention/preview.png'
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