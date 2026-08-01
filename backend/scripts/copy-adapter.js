const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const sourcePath = path.join(__dirname, '../../api/index.js');
const targetDir = path.join(__dirname, '../dist/api');
const targetPath = path.join(targetDir, 'index.js');
const apiDistDir = path.join(__dirname, '../../api/dist');
const backendDistDir = path.join(__dirname, '../dist');

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

// Copy the entire dist folder to api/dist using Node.js
if (fs.existsSync(apiDistDir)) {
  fs.rmSync(apiDistDir, { recursive: true, force: true });
}
copyDir(backendDistDir, apiDistDir);
console.log('Copied dist folder to api/dist');
