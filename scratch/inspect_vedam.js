const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local from the workspace
const envPath = path.join(__dirname, '..', '.env.local');
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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  const { data: instructors, error: iError } = await supabase
    .from('instructors')
    .select('*, colleges(name)')
    .ilike('name', '%ankur%');

  if (iError) {
    console.error("Error fetching instructors:", iError);
  } else {
    console.log("Instructors matching 'Ankur':", instructors);
  }

  // Also query colleges to check if his name is anywhere in the fields
  const { data: colleges, error: cError } = await supabase
    .from('colleges')
    .select('*');

  if (cError) {
    console.error("Error fetching colleges:", cError);
  } else {
    const matchingColleges = colleges.filter(c => {
      return JSON.stringify(c).toLowerCase().includes('ankur');
    });
    console.log("Colleges with text matching 'Ankur':", matchingColleges.map(c => ({ id: c.id, name: c.name })));
  }
}

main();
