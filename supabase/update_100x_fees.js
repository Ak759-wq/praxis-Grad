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

async function updateDb() {
  console.log('Updating database 100x School fees...');
  
  const { data, error } = await supabase
    .from('colleges')
    .update({
      fees: "₹22.8 Lakhs (Tuition: ₹50K joining fee + ₹22.75L tuition over 4 years) + ₹6.8 Lakhs hostel & mess (Years 1–3) = Total approx. ₹29.6 Lakhs all-inclusive. Optional BITS/IITM parallel degree costs ₹3–4 Lakhs extra. Source: 100xschool.in/admissions."
    })
    .eq('name', '100x School')
    .select();
    
  if (error) {
    console.error(`Error updating 100x School: ${error.message}`);
  } else if (data && data.length > 0) {
    console.log(`Successfully updated 100x School row in DB!`);
    console.log(data);
  } else {
    console.log(`No rows matched '100x School' in colleges table.`);
  }
}

async function main() {
  await updateDb();
  console.log('Database sync complete!');
}

main();
