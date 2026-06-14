const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://sjjtvnjkxprvwdzkzuun.supabase.co';
const supabaseKey = 'sb_publishable_bGcz7i7Yhnj5Ch_S6kbyJQ_FQIiHByx';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateNiatBrochure() {
  console.log('Looking for NIAT/NxtWave colleges...');

  // Find NIAT college
  const { data: colleges, error: fetchError } = await supabase
    .from('colleges')
    .select('id, name, brochure_url')
    .ilike('name', '%NxtWave%');

  if (fetchError) {
    console.error('Error fetching colleges:', fetchError);
    return;
  }

  console.log('Found colleges:', colleges);

  if (!colleges || colleges.length === 0) {
    console.log('No NIAT/NxtWave college found in database.');
    return;
  }

  for (const college of colleges) {
    const { error: updateError } = await supabase
      .from('colleges')
      .update({ brochure_url: 'https://www.niatindia.com/niat-download-brochure-2025v4' })
      .eq('id', college.id);

    if (updateError) {
      console.error(`Error updating ${college.name}:`, updateError);
    } else {
      console.log(`✅ Updated brochure URL for: ${college.name}`);
    }
  }
}

updateNiatBrochure().catch(console.error);
