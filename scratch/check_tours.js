const { MOCK_COLLEGES } = require('../mockData.js');

console.log("--- MOCK COLLEGES CAMPUS TOUR URLS ---");
for (const [key, college] of Object.entries(MOCK_COLLEGES)) {
  console.log(`- "${college.name}": ${college.campus_tour_url || 'UNDEFINED'}`);
}
