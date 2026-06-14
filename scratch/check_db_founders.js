const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .from('founders')
    .select(`
      name,
      linkedin_url,
      colleges (
        name
      )
    `);

  if (error) {
    console.error("Error fetching founders:", error);
    return;
  }

  console.log('--- FOUNDERS IN DATABASE ---');
  let count = 0;
  for (const f of data) {
    count++;
    console.log(`${count}. College: ${f.colleges ? f.colleges.name : 'Unknown'}`);
    console.log(`   Founder: ${f.name}`);
    console.log(`   LinkedIn: ${f.linkedin_url}`);
  }
  console.log(`\nTotal founders in DB: ${data.length}`);
}

main();
