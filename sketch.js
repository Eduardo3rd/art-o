// Flow field parameters
const RESOLUTION = 50;
const NUM_PARTICLES = 1000;
const NUM_STEPS = 100;
const NOISE_SCALE = 0.003;
const STROKE_WEIGHT = 1.8;
const ALPHA = 30;

let particles = [];
let colors;

function setup() {
    createCanvas(800, 800);
    background(250, 248, 245);
    
    // Create a warm, earthy color palette
    colors = [
        color(34, 34, 34, ALPHA),    // Dark gray
        color(158, 87, 41, ALPHA),   // Rust
        color(130, 76, 96, ALPHA),   // Muted purple
        color(182, 132, 95, ALPHA),  // Tan
        color(89, 86, 82, ALPHA)     // Warm gray
    ];
    
    // Initialize particles with random positions
    for (let i = 0; i < NUM_PARTICLES; i++) {
        particles.push({
            pos: createVector(random(width), random(height)),
            prev: null,
            color: random(colors),
            stepCount: 0
        });
    }
    
    noFill();
}

function draw() {
    // Draw multiple lines per frame
    for (let i = 0; i < 50; i++) {
        updateAndDrawParticles();
    }
    
    // Stop when all particles have completed their paths
    if (particles.every(p => p.stepCount >= NUM_STEPS)) {
        // Add final touches
        addNoise();
        noLoop();
    }
}

function updateAndDrawParticles() {
    particles.forEach(particle => {
        if (particle.stepCount >= NUM_STEPS) return;
        
        // Store previous position
        particle.prev = particle.pos.copy();
        
        // Calculate direction based on noise field
        let angle = noise(
            particle.pos.x * NOISE_SCALE,
            particle.pos.y * NOISE_SCALE
        ) * TWO_PI * 2;
        
        // Update position
        particle.pos.add(
            cos(angle) * 2,
            sin(angle) * 2
        );
        
        // Draw line segment if we have a previous position
        if (particle.prev) {
            stroke(particle.color);
            strokeWeight(STROKE_WEIGHT);
            
            // Draw curved line segment
            beginShape();
            vertex(particle.prev.x, particle.prev.y);
            
            // Add slight curve to line
            let mid = p5.Vector.lerp(particle.prev, particle.pos, 0.5);
            let offset = createVector(
                random(-2, 2),
                random(-2, 2)
            );
            mid.add(offset);
            
            quadraticVertex(
                mid.x, mid.y,
                particle.pos.x, particle.pos.y
            );
            endShape();
        }
        
        particle.stepCount++;
        
        // Reset particle if it goes off screen
        if (isOffScreen(particle.pos)) {
            particle.pos = createVector(random(width), random(height));
            particle.prev = null;
        }
    });
}

function isOffScreen(pos) {
    return (
        pos.x < 0 ||
        pos.x > width ||
        pos.y < 0 ||
        pos.y > height
    );
}

function addNoise() {
    // Add subtle texture
    loadPixels();
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let index = (x + y * width) * 4;
            let noiseVal = random(-5, 5);
            pixels[index] = pixels[index] + noiseVal;
            pixels[index + 1] = pixels[index + 1] + noiseVal;
            pixels[index + 2] = pixels[index + 2] + noiseVal;
        }
    }
    updatePixels();
} 