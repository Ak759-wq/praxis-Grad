const fs = require('fs');
const path = require('path');

const tsPath = path.join(__dirname, '../src/lib/mockData.ts');
const jsPath = path.join(__dirname, '../mockData.js');

function updateFile(filePath, isTs) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove campus_tour_url lines
  const tourRegex = isTs 
    ? /^[ \t]*campus_tour_url:\s*"[^"]*",?\r?\n/gm
    : /^[ \t]*"campus_tour_url":\s*"[^"]*",?\r?\n/gm;
  
  content = content.replace(tourRegex, '');

  // 2. Replacements for financingOptions
  const replacements = [
    // Zenith
    {
      target: isTs
        ? 'financingOptions: "Zero-cost EMIs, merit-based scholarships up to 100% backed by ₹100 Crore fund."'
        : '"financingOptions": "Institutional Scholarships & Loans via Eduvanz & Avanse"',
      replacement: isTs
        ? 'financingOptions: "Education loans via Eduvanz and Avanse."'
        : '"financingOptions": "Education loans via Eduvanz and Avanse"'
    },
    // Bosscoder
    {
      target: isTs
        ? 'financingOptions: "0% Interest loans via Propelld, GrayQuest, and Eduvanz"'
        : '"financingOptions": "0% Interest loans via Propelld, GrayQuest, and Eduvanz"',
      replacement: isTs
        ? 'financingOptions: "Education loans via Propelld, GrayQuest, and Eduvanz"'
        : '"financingOptions": "Education loans via Propelld, GrayQuest, and Eduvanz"'
    },
    // Stellar
    {
      target: isTs
        ? 'financingOptions: "Zero-cost EMIs, merit-based scholarships up to 100%, and education loans via Propelld and GrayQuest."'
        : '"financingOptions": "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld"', // Target for Stellar in mockData.js line 778
      replacement: isTs
        ? 'financingOptions: "Education loans via Propelld and GrayQuest"'
        : '"financingOptions": "Education loans via Propelld and GrayQuest"'
    },
    // Scaler
    {
      target: isTs
        ? 'financingOptions: "Custom Education Loans with Propelld & HDFC Credila at 0% EMI."'
        : '"financingOptions": "Custom Education Loans with Propelld & HDFC Credila at 0% EMI"',
      replacement: isTs
        ? 'financingOptions: "Education loans via Propelld and HDFC Credila"'
        : '"financingOptions": "Education loans via Propelld and HDFC Credila"'
    },
    // Polaris
    {
      target: isTs
        ? 'financingOptions: "0% Cost EMI Loans via Propelld, Eduvanz, and GrayQuest. Up to 100% scholarships."'
        : '"financingOptions": "0% Cost EMI Loans via Propelld, Eduvanz, and GrayQuest"',
      replacement: isTs
        ? 'financingOptions: "Education loans via Propelld, Eduvanz, and GrayQuest"'
        : '"financingOptions": "Education loans via Propelld, Eduvanz, and GrayQuest"'
    },
    // Newton
    {
      target: isTs
        ? 'financingOptions: "0% Interest loans via GrayQuest, Propelld, and Avanse Financial. Up to 100% scholarships based on NSAT score."'
        : '"financingOptions": "0% Interest loans via GrayQuest, Propelld, and Avanse Financial"',
      replacement: isTs
        ? 'financingOptions: "Education loans via GrayQuest, Propelld, and Avanse Financial"'
        : '"financingOptions": "Education loans via GrayQuest, Propelld, and Avanse Financial"'
    },
    // Vedam
    {
      target: isTs
        ? 'financingOptions: "Zero Cost EMIs and education loans through partnerships with fintech and banking institutions."'
        : '"financingOptions": "100% Financing & Merit-based EMI plans via GrayQuest and Propelld"',
      replacement: isTs
        ? 'financingOptions: "Education loans via GrayQuest and Propelld"'
        : '"financingOptions": "Education loans via GrayQuest and Propelld"'
    },
    // PW IOI
    {
      target: isTs
        ? 'financingOptions: "Education loan assistance and no-cost EMI schemes from partner financial institutions."'
        : '"financingOptions": "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld"', // Target for PW IOI in mockData.js line 2005
      replacement: isTs
        ? 'financingOptions: "Education loans via GrayQuest, Avanse, and Propelld"'
        : '"financingOptions": "Education loans via GrayQuest, Avanse, and Propelld"'
    },
    // Quad AI
    {
      target: isTs
        ? 'financingOptions: "Zero cost EMI options and education loans with HDFC Credila, Axis Bank, SBI, and Propelld."'
        : '"financingOptions": "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld"', // Target for Quad AI in mockData.js line 2177
      replacement: isTs
        ? 'financingOptions: "Education loans via HDFC Credila, Axis Bank, SBI, and Propelld"'
        : '"financingOptions": "Education loans via HDFC Credila, Axis Bank, SBI, and Propelld"'
    },
    // Veloces
    {
      target: isTs
        ? 'financingOptions: "Written placement agreement refund clause, zero cost EMI plans, and educational loan partnerships."'
        : '"financingOptions": "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld"', // Target for Veloces in mockData.js line 2350
      replacement: isTs
        ? 'financingOptions: "Education loans via partner financial institutions"'
        : '"financingOptions": "Education loans via partner financial institutions"'
    }
  ];

  replacements.forEach(r => {
    // We check content to replace
    // In mockData.js, the keys "Flexible EMI loan schemes via..." are shared across multiple colleges. 
    // If it's JS and allow multiple is needed, we replace them. 
    // To avoid replacing unrelated colleges, let's see. In mockData.js:
    // Stellar, PW IOI, Quad AI, Veloces all have "Flexible EMI loan schemes via GrayQuest, Avanse, and Propelld".
    // That's fine because we actually want to replace all of them with the correct banking partner listing!
    if (content.includes(r.target)) {
      content = content.replace(r.target, r.replacement);
      console.log(`Updated replacement in ${path.basename(filePath)}: ${r.target.slice(0, 30)}`);
    } else {
      console.log(`Warning: target not found in ${path.basename(filePath)}: ${r.target.slice(0, 40)}...`);
    }
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

updateFile(tsPath, true);
updateFile(jsPath, false);
console.log("Mock data files processed!");
