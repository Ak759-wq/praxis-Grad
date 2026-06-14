const fs = require('fs');
const path = require('path');

const excludeDirs = ['.git', '.next', 'node_modules', '.vercel'];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!excludeDirs.includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

const query = 'Ankur';
const matches = [];

walkDir('C:/Users/WIN/OneDrive/ak', (filePath) => {
  if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.json') || filePath.endsWith('.html') || filePath.endsWith('.css')) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.toLowerCase().includes(query.toLowerCase())) {
        matches.push(filePath);
      }
    } catch (e) {
      // ignore
    }
  }
});

console.log("Files matching 'Ankur':", matches);
