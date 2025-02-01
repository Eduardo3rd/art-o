let canvas;
let currentPattern = 0;
let resolution = 15;
let complexity = 5;
let colorScheme = 0;
let colors = [];

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    noLoop();
    generateColors();
    initializeSketch();
}

function generateColors() {
    colors = [];
    switch(colorScheme) {
        case 0: // Primary RGB
            colors = [
                color(255, 0, 0),    // Red
                color(0, 255, 0),    // Green
                color(0, 0, 255),    // Blue
                color(0),            // Black
                color(255)           // White
            ];
            break;
        case 1: // Monochromatic
            const baseHue = random(360);
            for(let i = 0; i < 5; i++) {
                colors.push(color(
                    `hsl(${baseHue}, ${map(i, 0, 4, 100, 20)}%, ${map(i, 0, 4, 90, 20)}%)`
                ));
            }
            break;
        case 2: // Complementary
            const hue1 = random(360);
            const hue2 = (hue1 + 180) % 360;
            colors = [
                color(`hsl(${hue1}, 100%, 50%)`),
                color(`hsl(${hue1}, 80%, 70%)`),
                color(`hsl(${hue2}, 100%, 50%)`),
                color(`hsl(${hue2}, 80%, 70%)`),
                color(0)
            ];
            break;
        case 3: // Mathematical
            for(let i = 0; i < 5; i++) {
                const h = (i * 137.5) % 360;  // Golden angle
                const s = map(sin(i * PI/2), -1, 1, 50, 100);
                const l = map(cos(i * PI/2), -1, 1, 30, 70);
                colors.push(color(`hsl(${h}, ${s}%, ${l}%)`));
            }
            break;
    }
    updateColorPalette();
}

function updateColorPalette() {
    const palette = document.getElementById('color-palette');
    palette.innerHTML = '';
    colors.forEach(c => {
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = color(c).toString();
        palette.appendChild(box);
    });
}

function initializeSketch() {
    background(255);
    
    switch(currentPattern) {
        case 0:
            drawGridComposition();
            break;
        case 1:
            drawColorStudy();
            break;
        case 2:
            drawGeometricPattern();
            break;
        case 3:
            drawMathematicalColor();
            break;
    }
}

function drawGridComposition() {
    const cellSize = width / resolution;
    
    for(let x = 0; x < resolution; x++) {
        for(let y = 0; y < resolution; y++) {
            const noiseVal = noise(x * 0.1, y * 0.1) * complexity;
            const colorIndex = floor(map(noiseVal, 0, complexity, 0, colors.length));
            
            fill(colors[colorIndex]);
            noStroke();
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
            
            // Add geometric overlay
            if(random() < 0.3) {
                stroke(colors[(colorIndex + 1) % colors.length]);
                strokeWeight(2);
                const pattern = floor(random(4));
                switch(pattern) {
                    case 0: // Diagonal line
                        line(x * cellSize, y * cellSize, 
                             (x + 1) * cellSize, (y + 1) * cellSize);
                        break;
                    case 1: // Circle
                        circle(x * cellSize + cellSize/2, 
                               y * cellSize + cellSize/2, 
                               cellSize * 0.8);
                        break;
                    case 2: // Cross
                        line(x * cellSize + cellSize/2, y * cellSize, 
                             x * cellSize + cellSize/2, (y + 1) * cellSize);
                        line(x * cellSize, y * cellSize + cellSize/2, 
                             (x + 1) * cellSize, y * cellSize + cellSize/2);
                        break;
                    case 3: // Triangle
                        triangle(x * cellSize, y * cellSize + cellSize,
                                x * cellSize + cellSize/2, y * cellSize,
                                x * cellSize + cellSize, y * cellSize + cellSize);
                        break;
                }
            }
        }
    }
}

function drawColorStudy() {
    const cellSize = width / (resolution/2);
    const patterns = [];
    
    // Generate pattern matrix
    for(let i = 0; i < resolution; i++) {
        patterns.push([]);
        for(let j = 0; j < resolution; j++) {
            patterns[i][j] = floor(random(colors.length));
        }
    }
    
    // Draw large color blocks
    for(let x = 0; x < resolution/2; x++) {
        for(let y = 0; y < resolution/2; y++) {
            const colorIndex = patterns[x][y];
            fill(colors[colorIndex]);
            noStroke();
            rect(x * cellSize, y * cellSize, cellSize, cellSize);
            
            // Add pixel noise
            const pixelSize = cellSize / complexity;
            for(let px = 0; px < complexity; px++) {
                for(let py = 0; py < complexity; py++) {
                    if(random() < 0.2) {
                        fill(colors[(colorIndex + 1) % colors.length]);
                        rect(x * cellSize + px * pixelSize,
                             y * cellSize + py * pixelSize,
                             pixelSize, pixelSize);
                    }
                }
            }
        }
    }
}

function drawGeometricPattern() {
    background(colors[colors.length-1]);
    const size = width / resolution;
    
    for(let x = 0; x < resolution; x++) {
        for(let y = 0; y < resolution; y++) {
            const angle = noise(x * 0.1, y * 0.1) * TWO_PI * complexity;
            const shape = floor(random(3));
            
            push();
            translate(x * size + size/2, y * size + size/2);
            rotate(angle);
            
            const colorIndex = floor(map(noise(x * 0.2, y * 0.2), 0, 1, 0, colors.length));
            fill(colors[colorIndex]);
            stroke(colors[(colorIndex + 1) % colors.length]);
            strokeWeight(2);
            
            switch(shape) {
                case 0: // Rectangle
                    rectMode(CENTER);
                    rect(0, 0, size * 0.8, size * 0.8);
                    break;
                case 1: // Ellipse
                    ellipse(0, 0, size * 0.8, size * 0.8);
                    break;
                case 2: // Triangle
                    const r = size * 0.4;
                    triangle(-r, r, r, r, 0, -r);
                    break;
            }
            pop();
        }
    }
}

function drawMathematicalColor() {
    loadPixels();
    const d = pixelDensity();
    
    for(let x = 0; x < width; x++) {
        for(let y = 0; y < height; y++) {
            const nx = map(x, 0, width, -complexity, complexity);
            const ny = map(y, 0, height, -complexity, complexity);
            
            // Mathematical color selection based on position and trigonometric functions
            const v = sin(nx) * cos(ny) * PI;
            const colorIndex = floor(map(v, -1, 1, 0, colors.length));
            const c = colors[colorIndex];
            
            // Set pixel color
            for (let i = 0; i < d; i++) {
                for (let j = 0; j < d; j++) {
                    const index = 4 * ((y * d + j) * width * d + (x * d + i));
                    pixels[index] = red(c);
                    pixels[index+1] = green(c);
                    pixels[index+2] = blue(c);
                    pixels[index+3] = 255;
                }
            }
        }
    }
    updatePixels();
    
    // Add overlay pattern
    stroke(0);
    strokeWeight(1);
    const spacing = width / resolution;
    for(let i = 0; i <= resolution; i++) {
        const pos = i * spacing;
        const offset = sin(i * TWO_PI / resolution) * complexity * 5;
        line(pos + offset, 0, pos - offset, height);
        line(0, pos + offset, width, pos - offset);
    }
}

function updateParameters() {
    currentPattern = Number(document.getElementById('pattern-select').value);
    resolution = Number(document.getElementById('resolution').value);
    complexity = Number(document.getElementById('complexity').value);
    colorScheme = Number(document.getElementById('color-scheme').value);
    generateColors();
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
                sketchPath: 'sketches/08_kawano/preview.png'
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
