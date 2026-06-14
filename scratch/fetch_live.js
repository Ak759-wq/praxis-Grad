const https = require('https');

const url = 'https://nextgen-tech-schools.vercel.app/college/df1c9124-4b89-4cbc-a2d7-43587edcf0a5';

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Response status code:", res.statusCode);
    console.log("Does page contain 'Ankur'?", data.toLowerCase().includes('ankur'));
    console.log("Does page contain 'Piyush'?", data.toLowerCase().includes('piyush'));
    
    // Find where "Ankur" matches in the text to see context if any
    const regex = /.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?ankur.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?.?/gi;
    let match;
    while ((match = regex.exec(data)) !== null) {
      console.log("Match context:", match[0]);
    }
  });
}).on('error', (err) => {
  console.error("Error fetching live page:", err.message);
});
