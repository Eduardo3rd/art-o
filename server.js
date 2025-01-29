const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Serve static files from the root directory
app.use(express.static('./'));
app.use(express.json({limit: '10mb'}));

// Endpoint to save preview image
app.post('/save-preview', (req, res) => {
    const { imageData, sketchPath } = req.body;
    
    // Remove the data URL prefix to get just the base64 data
    const base64Data = imageData.replace(/^data:image\/png;base64,/, "");
    
    // Ensure the directory exists
    const dir = path.dirname(sketchPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    
    // Save the file
    fs.writeFileSync(sketchPath, base64Data, 'base64');
    res.json({ success: true });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 