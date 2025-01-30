let canvas;
let density = 5;
let lineLength = 20;
let margin = 40;
let angle = 0;

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    strokeWeight(1);
    noLoop();
    initializeSketch();
}

function initializeSketch() {
    background(255);
    
    // Calculate number of lines based on density
    const numLines = map(density, 1, 10, 500, 2000);
    
    // Draw border
    noFill();
    stroke(0);
    rect(margin, margin, width - 2*margin, height - 2*margin);
    
    // Draw lines
    for (let i = 0; i < numLines; i++) {
        // Random position within margins
        const x = random(margin + lineLength, width - margin - lineLength);
        const y = random(margin + lineLength, height - margin - lineLength);
        
        // Random angle with slight variations
        const lineAngle = random(-PI/6, PI/6) + angle;
        
        // Calculate end points
        const x2 = x + cos(lineAngle) * lineLength;
        const y2 = y + sin(lineAngle) * lineLength;
        
        // Draw line
        stroke(0);
        line(x, y, x2, y2);
    }
}

function updateParameters() {
    density = Number(document.getElementById('density').value);
    lineLength = map(Number(document.getElementById('scale').value), 1, 10, 10, 30);
    angle = map(Number(document.getElementById('complexity').value), 1, 10, -PI/2, PI/2);
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
                sketchPath: 'sketches/06_history/preview.png'
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