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
  // 1. Fetch one college from Supabase to check the columns
  const { data, error } = await supabase.from('colleges').select('*').limit(1);
  if (error) {
    console.error("Error fetching college:", error);
  } else if (data && data.length > 0) {
    console.log("Database college columns:", Object.keys(data[0]));
    console.log("Sample college from DB:", data[0]);
  } else {
    console.log("No data returned from DB");
  }

  // 2. Load mockData.js or ts
  const mockDataTs = fs.readFileSync('src/lib/mockData.ts', 'utf8');
  // Find all keys in MOCK_COLLEGES
  const matches = mockDataTs.match(/"[^"]+":\s*\{/g) || [];
  console.log("Mock college keys in mockData.ts:", matches.map(m => m.replace(/":\s*\{/, '').replace(/"/g, '')));
}

main();
