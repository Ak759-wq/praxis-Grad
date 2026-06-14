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

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const { MOCK_COLLEGES } = require('./mockData.js');

async function main() {
  try {
    const { data: dbColleges, error } = await supabase
      .from('colleges')
      .select('id, name');
      
    if (error) throw error;
    
    console.log(`--- DB Colleges Audit (${dbColleges.length} in DB) ---`);
    const cleanName = (n) => n.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
    
    let missingCount = 0;
    for (const c of dbColleges) {
      const mockMatch = Object.values(MOCK_COLLEGES).find((m) => {
        const cleanM = cleanName(m.name);
        const cleanC = cleanName(c.name);
        return cleanM === cleanC || cleanM.includes(cleanC) || cleanC.includes(cleanM);
      });
      
      if (mockMatch) {
        console.log(`- "${c.name}": MATCHED with mock "${mockMatch.name}"`);
      } else {
        console.log(`- "${c.name}": NO MATCH FOUND!`);
        missingCount++;
      }
    }
    console.log(`Summary: ${missingCount} colleges have NO mock match.`);
  } catch (err) {
    console.error(err);
  }
}

main();
