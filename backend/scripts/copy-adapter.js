const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../../api/index.js');
const targetDir = path.join(__dirname, '../dist/api');
const targetPath = path.join(targetDir, 'index.js');

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read the source file
let content = fs.readFileSync(sourcePath, 'utf8');

// Replace the require path
content = content.replace("require('../backend/dist/app.module')", "require('../app.module')");

// Write the modified file
fs.writeFileSync(targetPath, content);
console.log('Copied and modified adapter to dist/api/index.js');
