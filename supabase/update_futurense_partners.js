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
  console.log('Updating database Futurense partners...');
  
  const { data, error } = await supabase
    .from('colleges')
    .update({
      degree_partner: "Lovely Professional University (LPU) & S-VYASA University",
      fees: "₹16 Lakhs (Total 4-Year B.Tech Tuition at LPU/S-VYASA campus) + Hostel & Mess extra (~₹1.2 - 2 Lakhs/year).",
      tags: ["AI-Native B.Tech", "LPU & S-VYASA Partner", "IIT/IIM PG Pathways", "Raghav Gupta Founded"]
    })
    .eq('name', 'Futurense School of AI')
    .select();
    
  if (error) {
    console.error(`Error updating Futurense: ${error.message}`);
  } else if (data && data.length > 0) {
    console.log(`Successfully updated Futurense School of AI row in DB!`);
    console.log(data);
  } else {
    console.log(`No rows matched 'Futurense School of AI' in colleges table.`);
  }
}

async function main() {
  await updateDb();
  console.log('Database sync complete!');
}

main();
