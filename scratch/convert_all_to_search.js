const fs = require('fs');
const path = require('path');

function convertFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const newLines = [];

  let currentCollegeName = '';
  let currentFounder = '';
  let inFoundersArray = false;
  let replacedCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if we enter/exit founders array
    if (line.includes('founders:') || line.includes('"founders":')) {
      inFoundersArray = true;
    } else if (inFoundersArray && (line.trim() === '],' || line.trim() === ']' || line.trim() === '],//')) {
      inFoundersArray = false;
    }

    // Match college name (when not in founders or other lists)
    if (!inFoundersArray) {
      const collegeMatch = line.match(/^\s*name:\s*"([^"]+)"/) || line.match(/^\s*"name":\s*"([^"]+)"/);
      if (collegeMatch) {
        currentCollegeName = collegeMatch[1].trim();
      }
    } else {
      // In founders array: match founder name
      const founderMatch = line.match(/^\s*name:\s*"([^"]+)"/) || line.match(/^\s*"name":\s*"([^"]+)"/);
      if (founderMatch) {
        currentFounder = founderMatch[1].trim();
      }

      // Match linkedin_url and replace it
      const linkedinMatch = line.match(/^(\s*linkedin_url:\s*)"([^"]+)"/) || line.match(/^(\s*"linkedin_url":\s*)"([^"]+)"/);
      if (linkedinMatch) {
        const prefix = linkedinMatch[1];
        const oldUrl = linkedinMatch[2];
        
        // Clean college name for better search query
        // E.g. "Scaler School of Technology (SST)" -> "Scaler School of Technology"
        const cleanCollegeName = currentCollegeName.replace(/\s*\(.*?\)\s*/g, '').trim();
        const searchQuery = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(currentFounder + ' ' + cleanCollegeName)}`;
        
        newLines.push(`${prefix}"${searchQuery}",`);
        replacedCount++;
        continue;
      }
    }

    newLines.push(line);
  }

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  console.log(`Successfully converted ${replacedCount} URLs in ${filePath} (College: ${currentCollegeName})`);
}

const tsPath = path.join(__dirname, '..', 'src', 'lib', 'mockData.ts');
const jsPath = path.join(__dirname, '..', 'mockData.js');

console.log('Converting all founder LinkedIn links in mockData files...');
convertFile(tsPath);
convertFile(jsPath);
console.log('Conversion complete!');
