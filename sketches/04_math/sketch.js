let canvas;

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    angleMode(RADIANS);
    initializeSketch();
}

function initializeSketch() {
    background(0);
    stroke(255);  // Solid white, no translucency
    strokeWeight(0.3);  // Keep the fine lines
    noFill();
    
    const numWaves = floor(random(2, 4));
    
    for (let wave = 0; wave < numWaves; wave++) {
        const waveType = random(1);  // Now just determines sin/cos
        const period = random(2, 6);
        const amplitude = random(100, 300);
        const phaseShift = random(TWO_PI);
        const verticalOffset = height/2 + random(-200, 200);
        const radius = random(20, 40);  // Moved outside the x loop - constant for each wave
        
        // Draw circles along the wave
        for (let x = 0; x < width; x += 2) {
            let y;
            const t = (x/width * period * TWO_PI) + phaseShift;
            
            if (waveType < 0.5) {
                y = sin(t) * amplitude + verticalOffset;
            } else {
                y = cos(t) * amplitude + verticalOffset;
            }
            
            circle(x, y, radius);
        }
    }
    
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
    
    const imageData = canvas.elt.toDataURL('image/png');
    
    try {
        const response = await fetch('/save-preview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageData,
                sketchPath: 'sketches/04_math/preview.png'
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