const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local file not found');
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

const replacementMap = {
  "https://www.linkedin.com/in/rajatgarg21": "https://www.linkedin.com/in/mrgarg-rajat/",
  "https://www.linkedin.com/in/manish-garg-bosscoder": "https://www.linkedin.com/in/manish-garg-24b89399/"
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
  for (const [oldUrl, newUrl] of Object.entries(replacementMap)) {
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
  for (const [oldUrl, newUrl] of Object.entries(replacementMap)) {
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
