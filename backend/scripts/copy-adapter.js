const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../../api/index.js');
const targetDir = path.join(__dirname, '../dist/api');
const targetPath = path.join(targetDir, 'index.js');

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy file
fs.copyFileSync(sourcePath, targetPath);
console.log('Copied adapter to dist/api/index.js');
