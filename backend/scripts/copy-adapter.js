const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const sourcePath = path.join(__dirname, '../../api/index.js');
const targetDir = path.join(__dirname, '../dist/api');
const targetPath = path.join(targetDir, 'index.js');
const apiDistDir = path.join(__dirname, '../../api/dist');

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read the source file
let content = fs.readFileSync(sourcePath, 'utf8');

// Replace the require path to use relative path from api/dist
content = content.replace("require('../backend/dist/app.module')", "require('./dist/app.module')");

// Write the modified file to api/index.js (overwrite the original)
fs.writeFileSync(sourcePath, content);
console.log('Modified api/index.js to use ./dist/app.module');

// Copy the entire dist folder to api/dist
if (fs.existsSync(apiDistDir)) {
  fs.rmSync(apiDistDir, { recursive: true, force: true });
}
execSync('cp -r dist ../api/dist', { cwd: __dirname + '/..' });
console.log('Copied dist folder to api/dist');
