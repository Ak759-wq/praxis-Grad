const path = require('path');
const { MOCK_COLLEGES } = require('../mockData.js');

console.log('--- FOUNDERS AND LINKEDIN LINKS ---');
let totalFounders = 0;
let deadPlaceholders = 0;
let normalLinks = 0;
let searchLinks = 0;

for (const [key, college] of Object.entries(MOCK_COLLEGES)) {
  console.log(`\nCollege: ${college.name}`);
  if (!college.founders || college.founders.length === 0) {
    console.log('  (No founders)');
    continue;
  }
  college.founders.forEach(f => {
    totalFounders++;
    const isSearch = f.linkedin_url.includes('linkedin.com/search');
    const isPlaceholder = f.linkedin_url.includes('linkedin.com/in/your-profile') || f.linkedin_url.includes('example.com') || f.linkedin_url.includes('linkedin.com/in/#') || f.linkedin_url === '#' || !f.linkedin_url || f.linkedin_url.trim() === '';
    
    if (isSearch) searchLinks++;
    else if (isPlaceholder) deadPlaceholders++;
    else normalLinks++;

    console.log(`  - Founder: ${f.name}`);
    console.log(`    LinkedIn: ${f.linkedin_url}`);
  });
}

console.log('\n--- STATISTICS ---');
console.log(`Total Founders: ${totalFounders}`);
console.log(`Normal Links: ${normalLinks}`);
console.log(`Search Fallback Links: ${searchLinks}`);
console.log(`Dead/Placeholder Links: ${deadPlaceholders}`);
