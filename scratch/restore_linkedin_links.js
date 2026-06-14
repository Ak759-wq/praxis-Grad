const fs = require('fs');
const path = require('path');

const directUrls = {
  // Bosscoder
  "Rajat Garg": "https://www.linkedin.com/in/mrrajatgarg/",
  "Manish Garg": "https://www.linkedin.com/in/manish-kumar-garg/",
  
  // Zenith
  "Avinash Pandit": "https://www.linkedin.com/in/avinash-pandit-07282017/",
  "Vivekanand Vivek": "https://www.linkedin.com/in/vivekanand-vivek-7a4ab388",
  "Anoop Garg": "https://www.linkedin.com/in/anoopgarg123/",
  
  // Mirai
  "Arpit Sarda": "https://www.linkedin.com/in/arpitsarda/",
  "Varun Kohli": "https://www.linkedin.com/in/kohli12/",
  "Kartik Mathur": "https://www.linkedin.com/in/kartik-mathur/",
  
  // Alta / Sunstone / Vedam
  "Ashish Munjal": "https://www.linkedin.com/in/ashishmunjal",
  "Harshit Agarwal": "https://www.linkedin.com/in/harshit-agarwal-99312418/",
  "Navdeep Sandhu": "https://www.linkedin.com/in/navdeep-sandhu-0603ab92/",
  "Piyush Nangru": "https://www.linkedin.com/in/piyushnangru/",
  "Nishant Chahar": "https://www.linkedin.com/in/nishantchahar",
  "Subhesh Kumar": "https://www.linkedin.com/in/subheshkumar",
  
  // NxtWave
  "Rahul Attuluri": "https://www.linkedin.com/in/rahulattuluri",
  "Sashank Gujjula": "https://www.linkedin.com/in/sashankreddy/",
  "Anupam Pedarla": "https://www.linkedin.com/in/anupampedarla/",
  
  // Intellipaat
  "Diwakar Chittora": "https://www.linkedin.com/in/diwakarchittora",
  "Shilpi Jain": "https://www.linkedin.com/in/shilpi-jain-intellipaat",
  
  // Coding Blocks
  
  // UpGrad
  "Ronnie Screwvala": "https://www.linkedin.com/in/ronniescrewvala",
  "Mayank Kumar": "https://www.linkedin.com/in/mayank-kumar-5573243/",
  "Phalgun Kompalli": "https://www.linkedin.com/in/phalgun-kompalli-2a37083a/",
  
  // Scaler
  "Anshuman Singh": "https://www.linkedin.com/in/anshumansingh26/",
  "Abhimanyu Saxena": "https://www.linkedin.com/in/abhimanyusaxena/",
  
  // Tensor
  "Manas Kumar Verma": "https://www.linkedin.com/in/thenextmkv/",
  
  // Polaris
  "Mukul Rustagi": "https://www.linkedin.com/in/mukul-rustagi-45462316",
  "Bhaswat Agarwal": "https://www.linkedin.com/in/bhaswat-agarwal-24a03715",
  
  // Newton
  "Nishant Chandra": "https://www.linkedin.com/in/nishant-chandra-1b459446/",
  "Siddharth Maheshwari": "https://www.linkedin.com/in/maheshwarisiddharth/",
  
  // Masters' Union
  "Pratham Mittal": "https://www.linkedin.com/in/prathammittal",
  
  // Futurense
  "Raghav Gupta": "https://www.linkedin.com/in/raghavgupta01",
  
  // Kalvium
  "Rajesh Kumar B": "https://www.linkedin.com/in/rajeshkumarb",
  "Venkataraghulan V": "https://www.linkedin.com/in/venkataraghulan",
  "Anil Gulecha": "https://www.linkedin.com/in/anilgulecha",
  
  // 100x School
  "Harkirat Singh": "https://www.linkedin.com/in/kirat-li",
  
  // Physics Wallah
  "Alakh Pandey": "https://www.linkedin.com/in/alakh-pandey-4baaa8227/",
  "Prateek Maheshwari": "https://www.linkedin.com/in/prateek-maheshwari-615962a7/",
  
  // CodeQuotient
  "Arun Goyat": "https://www.linkedin.com/in/arun-goyat/",
  
  // Quad AI
  "Sourav Kumar": "https://www.linkedin.com/in/sourav-kumar-9a7087a8/",
  
  // CodingGita
  "Patel Neel Maheshkumar": "https://www.linkedin.com/in/patel-neel-mahesh",
  
  // Veloces
  "Shankaran Chettur": "https://www.linkedin.com/in/shankaran-chettur-34342514/",
  
  // Leapstart
  "SAIKRISHNA J.": "https://www.linkedin.com/in/saikrishnajavvaji/",
  
  // CodeAnantam (No active LinkedIn account)
  "Rishirajsinh Pushpendrasinh Rathod": "none"
};

function processFile(filePath) {
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
  let directReplaced = 0;
  let searchReplaced = 0;

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
        let targetUrl = '';
        
        if (directUrls[currentFounder]) {
          targetUrl = directUrls[currentFounder];
          directReplaced++;
        } else {
          // If no direct URL verified, keep or generate search query
          const cleanCollegeName = currentCollegeName.replace(/\s*\(.*?\)\s*/g, '').trim();
          targetUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(currentFounder + ' ' + cleanCollegeName)}`;
          searchReplaced++;
        }
        
        newLines.push(`${prefix}"${targetUrl}",`);
        continue;
      }
    }

    newLines.push(line);
  }

  fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  console.log(`Updated ${filePath}: Direct URLs = ${directReplaced}, Search Fallbacks = ${searchReplaced}`);
}

const tsPath = path.join(__dirname, '..', 'src', 'lib', 'mockData.ts');
const jsPath = path.join(__dirname, '..', 'mockData.js');

console.log('Restoring verified founder LinkedIn URLs and applying Bosscoder overrides...');
processFile(tsPath);
processFile(jsPath);
console.log('Done!');
