let canvas;
let img;
let processedImg;
let thresholdImg;
let circles = [];
let circleSize = 4;
let density = 5;
let threshold = 128;

function createReadableGraphics(w, h) {
    const g = createGraphics(w, h);
    g.drawingContext.willReadFrequently = true;
    return g;
}

function createReadableImage(w, h) {
    const img = createImage(w, h);
    img.drawingContext.willReadFrequently = true;
    return img;
}

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    drawingContext.willReadFrequently = true;
    background(255);
    noLoop();
    
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', handleImageUpload);
    
    const thresholdSlider = document.getElementById('threshold');
    thresholdSlider.addEventListener('input', function() {
        threshold = Number(this.value);
        processImage();
    });
    
    stroke(0);
    noFill();
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        loadImage(e.target.result, 
            function(loadedImg) {
                img = loadedImg;
                processImage();
            }
        );
    };
    reader.readAsDataURL(file);
}

function processImage() {
    if (!img) return;
    
    // Resize image to fit canvas while maintaining aspect ratio
    const scale = Math.min(width / img.width, height / img.height);
    const newWidth = Math.floor(img.width * scale);
    const newHeight = Math.floor(img.height * scale);
    const startX = Math.floor((width - newWidth) / 2);
    const startY = Math.floor((height - newHeight) / 2);

    background(255);
    
    // Create or update image buffers
    if (!processedImg || processedImg.width !== newWidth || processedImg.height !== newHeight) {
        processedImg = createReadableGraphics(newWidth, newHeight);
    }
    
    // Process image
    processedImg.clear();
    processedImg.image(img, 0, 0, newWidth, newHeight);
    processedImg.filter(GRAY);
    processedImg.loadPixels();
    
    // Create thresholded version
    thresholdImg = createReadableImage(newWidth, newHeight);
    thresholdImg.copy(processedImg, 0, 0, newWidth, newHeight, 0, 0, newWidth, newHeight);
    thresholdImg.loadPixels();
    
    // Apply threshold
    for (let i = 0; i < thresholdImg.pixels.length; i += 4) {
        const brightness = thresholdImg.pixels[i];
        const val = brightness < threshold ? brightness : 255;
        thresholdImg.pixels[i] = val;
        thresholdImg.pixels[i + 1] = val;
        thresholdImg.pixels[i + 2] = val;
        thresholdImg.pixels[i + 3] = 255;
    }
    thresholdImg.updatePixels();
    
    // Generate circles
    circles = [];
    const step = Math.floor(map(density, 1, 10, 4, 12));
    
    // Edge detection
    let edgeImg = createReadableImage(newWidth, newHeight);
    edgeImg.copy(thresholdImg, 0, 0, newWidth, newHeight, 0, 0, newWidth, newHeight);
    edgeImg.filter(BLUR, 1);
    edgeImg.loadPixels();
    thresholdImg.loadPixels();
    
    for (let y = 1; y < thresholdImg.height-1; y += step) {
        for (let x = 1; x < thresholdImg.width-1; x += step) {
            const i = 4 * (y * thresholdImg.width + x);
            const brightness = thresholdImg.pixels[i];
            
            // Edge detection
            const top = edgeImg.pixels[4 * ((y-1) * thresholdImg.width + x)];
            const bottom = edgeImg.pixels[4 * ((y+1) * thresholdImg.width + x)];
            const left = edgeImg.pixels[4 * (y * thresholdImg.width + (x-1))];
            const right = edgeImg.pixels[4 * (y * thresholdImg.width + (x+1))];
            
            const edgeStrength = Math.abs(top - bottom) + Math.abs(left - right);
            
            if (brightness < threshold) {
                let size = map(brightness, 0, threshold, circleSize * 2, circleSize * 0.5);
                size *= map(edgeStrength, 0, 255, 1, 1.5);
                
                circles.push({
                    x: startX + x,
                    y: startY + y,
                    size: size,
                    brightness: brightness
                });
            }
        }
    }
    
    loop();
    drawCircles();
}

function updateParameters() {
    circleSize = Number(document.getElementById('circle-size').value);
    density = Number(document.getElementById('density').value);
    threshold = Number(document.getElementById('threshold').value);
    
    if (img) {
        processImage();
    }
}

function refreshSketch() {
    if (img) {
        processImage();
    }
}

function drawCircles() {
    background(255);
    
    // Set drawing style for circles
    stroke(0);
    noFill();
    
    // Calculate mouse influence for interactivity
    let mouseXNorm = constrain(mouseX, 0, width);
    let mouseYNorm = constrain(mouseY, 0, height);
    
    // Calculate influence radius squared (avoid square root calculations)
    const influenceRadiusSq = 100 * 100;
    
    // Pre-calculate center for depth effect
    const centerX = width/2;
    const centerY = height/2;
    const maxDistSq = (width/2) * (width/2);
    
    // Batch similar stroke weights to reduce stroke() calls
    let currentStrokeWeight = -1;
    
    for (let circle of circles) {
        // Only process circles near the mouse
        const dx = mouseXNorm - circle.x;
        const dy = mouseYNorm - circle.y;
        const distSq = dx * dx + dy * dy;
        
        // Calculate influence only if within radius
        let influence = 1;
        if (distSq < influenceRadiusSq) {
            influence = map(Math.sqrt(distSq), 0, 100, 1.5, 1);
            influence = constrain(influence, 1, 1.5);
        }
        
        // Simplified depth calculation using squared distance
        const dxCenter = circle.x - centerX;
        const dyCenter = circle.y - centerY;
        const distFromCenterSq = dxCenter * dxCenter + dyCenter * dyCenter;
        const depthInfluence = map(distFromCenterSq, 0, maxDistSq, 1.2, 0.8);
        
        // Apply all influences to circle size
        const finalSize = circle.size * influence * depthInfluence;
        
        // Batch stroke weight changes
        const strokeW = map(circle.brightness, 0, threshold, 2, 0.5);
        if (strokeW !== currentStrokeWeight) {
            strokeWeight(strokeW);
            currentStrokeWeight = strokeW;
        }
        
        ellipse(circle.x, circle.y, finalSize, finalSize);
    }
}

function mouseMoved() {
    // Only redraw if we're in the final circle rendering step
    if (debugStep === 5) {
        // Add debouncing to prevent too frequent updates
        if (!mouseMoved.timeout) {
            mouseMoved.timeout = setTimeout(() => {
                drawCircles();
                mouseMoved.timeout = null;
            }, 16); // Approximately 60fps
        }
    }
    return false;
}

function keyPressed() {
    if (key === ' ' && img) {
        debugStep = debugStep % 5 + 1;
        // Stop animation loop when leaving circle rendering
        if (debugStep !== 5) {
            noLoop();
        }
        processImage();
    }
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
                sketchPath: 'sketches/05_circlize/preview.png'
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