let params = {
    complexity: 5,
    organic: 7,
    density: 5
};

let isDrawingComplete = false;

// Class to represent a growing organic form
class OrganicForm {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.points = [{x: x, y: y}];
        this.angle = random(TWO_PI);
        this.stepSize = random(2, 5);
        this.curvature = random(0.1, 0.3);
        this.branches = [];
        this.age = 0;
        this.maxAge = random(50, 150);
    }

    grow() {
        if (this.age >= this.maxAge) return false;
        
        // Add some organic movement
        this.angle += random(-this.curvature, this.curvature);
        
        // Calculate new point
        let newX = this.points[this.points.length-1].x + cos(this.angle) * this.stepSize;
        let newY = this.points[this.points.length-1].y + sin(this.angle) * this.stepSize;
        
        // Add point if within canvas
        if (newX > 0 && newX < width && newY > 0 && newY < height) {
            this.points.push({x: newX, y: newY});
        }

        // Possibly create a branch
        if (random() < 0.03 * (params.complexity / 10)) {
            this.branches.push(new OrganicForm(newX, newY));
        }

        // Grow branches
        for (let i = this.branches.length - 1; i >= 0; i--) {
            if (!this.branches[i].grow()) {
                this.branches.splice(i, 1);
            }
        }

        this.age++;
        return true;
    }

    draw() {
        // Draw main form
        beginShape();
        noFill();
        stroke(0);
        strokeWeight(1.5);
        for (let p of this.points) {
            vertex(p.x, p.y);
        }
        endShape();

        // Draw branches
        for (let branch of this.branches) {
            branch.draw();
        }
    }
}

// Class to manage the composition
class Composition {
    constructor() {
        this.forms = [];
        this.generate();
    }

    generate() {
        this.forms = [];
        let numForms = map(params.density, 1, 10, 3, 12);
        
        // Create main forms with compositional awareness
        for (let i = 0; i < numForms; i++) {
            let x = random(width * 0.1, width * 0.9);
            let y = random(height * 0.1, height * 0.9);
            
            // Ensure forms are well-distributed
            let tooClose = false;
            for (let form of this.forms) {
                let d = dist(x, y, form.x, form.y);
                if (d < 100) {
                    tooClose = true;
                    break;
                }
            }
            
            if (!tooClose) {
                this.forms.push(new OrganicForm(x, y));
            }
        }
    }

    update() {
        for (let i = this.forms.length - 1; i >= 0; i--) {
            if (!this.forms[i].grow()) {
                this.forms.splice(i, 1);
            }
        }
    }

    draw() {
        for (let form of this.forms) {
            form.draw();
        }
    }
}

let composition;

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
                sketchPath: 'sketches/09_aaron/preview.png'
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

let canvas;

function setup() {
    canvas = createCanvas(800, 800);
    canvas.parent('canvas-container');
    background(255);
    composition = new Composition();
}

function draw() {
    composition.update();
    
    // Only draw active forms if the drawing isn't complete
    if (!isDrawingComplete) {
        // Check if all forms are done growing
        let allComplete = true;
        for (let form of composition.forms) {
            if (form.age < form.maxAge) {
                allComplete = false;
                break;
            }
        }
        if (allComplete) {
            isDrawingComplete = true;
        }
    }
    
    // Draw all forms
    composition.draw();
}

function generateNewDrawing() {
    background(255);
    isDrawingComplete = false;
    composition = new Composition();
}

function updateParameters() {
    params.complexity = document.getElementById('complexity').value;
    params.organic = document.getElementById('organic').value;
    params.density = document.getElementById('density').value;
    generateNewDrawing();
}

function keyPressed() {
    if (key === 's' || key === 'S') {
        saveCanvas('preview', 'png');
    }
} 