const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found at', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[match[1].trim()] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const urlMap = {
  "https://www.linkedin.com/in/anshumansingh": "https://www.linkedin.com/in/anshuman-singh-06b20822",
  "https://www.linkedin.com/in/abhimanyusaxena": "https://www.linkedin.com/in/abhimanyu-saxena-21223932",
  "https://www.linkedin.com/in/mukul-rustagi": "https://www.linkedin.com/in/mukul-rustagi-45462316",
  "https://www.linkedin.com/in/bhaswat-agarwal": "https://www.linkedin.com/in/bhaswat-agarwal-24a03715",
  "https://www.linkedin.com/in/nishant-chandra-1b459446": "https://www.linkedin.com/in/nishant-chandra-b2238495",
  "https://www.linkedin.com/in/siddharth-maheshwari-5b5ab422": "https://www.linkedin.com/in/siddharth-maheshwari-79659b8b",
  "https://www.linkedin.com/in/shankaran-chettur-257a6211": "https://www.linkedin.com/in/shankaranchettur",
  "https://www.linkedin.com/in/kalpesh-sheth-75211910": "https://www.linkedin.com/in/kalpesh-sheth-752843a",
  "https://www.linkedin.com/in/vivekanand-vivek-a48842b0": "https://www.linkedin.com/in/vivekanand-vivek-7a4ab388",
  "https://www.linkedin.com/in/anoop-garg-44a77b31": "https://www.linkedin.com/in/anoop-garg-26462744",
  "https://www.linkedin.com/in/raghav-gupta-futurense": "https://www.linkedin.com/in/raghavgupta01",
  "https://www.linkedin.com/in/pratham-mittal": "https://www.linkedin.com/in/prathammittal",
  "https://www.linkedin.com/in/arun-goyat": "https://www.linkedin.com/in/arungoyat",
  "https://www.linkedin.com/in/venkataraghulan-v": "https://www.linkedin.com/in/venkataraghulan"
};

const tsPath = path.join(__dirname, '..', 'src', 'lib', 'mockData.ts');
const jsPath = path.join(__dirname, '..', 'mockData.js');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let replacedCount = 0;
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    // Escape regex characters
    const escapedOld = oldUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedOld, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, newUrl);
      replacedCount++;
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${replacedCount} URLs in ${filePath}`);
}

async function updateDb() {
  console.log('Updating database founder LinkedIn links...');
  let dbUpdates = 0;
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    const { data, error } = await supabase
      .from('founders')
      .update({ linkedin_url: newUrl })
      .eq('linkedin_url', oldUrl)
      .select();
      
    if (error) {
      console.error(`Error updating URL ${oldUrl}: ${error.message}`);
    } else if (data && data.length > 0) {
      console.log(`Updated ${data.length} founder row(s) for URL: ${oldUrl} -> ${newUrl}`);
      dbUpdates += data.length;
    }
  }
  console.log(`Database updates complete. Total rows updated: ${dbUpdates}`);
}

async function main() {
  updateFile(tsPath);
  updateFile(jsPath);
  await updateDb();
  console.log('LinkedIn URL updates completed successfully!');
}

main();
