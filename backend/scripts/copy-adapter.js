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
const apiDir = path.join(__dirname, '../../api');
const backendDistDir = path.join(__dirname, '../dist');

// Create directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Read the source file
let content = fs.readFileSync(sourcePath, 'utf8');

// Replace the require path to use relative path from api (no subfolder)
content = content.replace("require('../backend/dist/app.module')", "require('./app.module')");

// Write the modified file to api/index.js (overwrite the original)
fs.writeFileSync(sourcePath, content);
console.log('Modified api/index.js to use ./app.module');

// Copy the entire dist folder contents directly to api folder (no subfolder)
const entries = fs.readdirSync(backendDistDir, { withFileTypes: true });
for (const entry of entries) {
  const srcPath = path.join(backendDistDir, entry.name);
  const destPath = path.join(apiDir, entry.name);
  
  if (entry.isDirectory()) {
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
    }
    copyDir(srcPath, destPath);
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
}
console.log('Copied dist folder contents to api folder');
