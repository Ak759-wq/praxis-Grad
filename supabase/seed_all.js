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
  console.error('Error: Supabase credentials not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const mockDataPath = path.join(__dirname, '..', 'mockData.js');
const { MOCK_COLLEGES } = require(mockDataPath);

async function main() {
  console.log(`Seeding all ${Object.keys(MOCK_COLLEGES).length} colleges from mockData.js to Supabase...`);
  
  for (const [key, scraped] of Object.entries(MOCK_COLLEGES)) {
    console.log(`Syncing college: "${scraped.name}"...`);
    try {
      const { data: collegeData, error: collegeError } = await supabase
        .from('colleges')
        .upsert({
          name: scraped.name,
          website_url: scraped.website_url,
          image_url: scraped.image_url,
          eligibility: scraped.eligibility,
          location: scraped.location,
          fees: scraped.fees,
          curriculum_summary: scraped.curriculum_summary,
          contact_info: scraped.contact_info,
          degree_partner: scraped.degree_partner,
          tags: scraped.tags,
          year_1_curriculum: scraped.year_1_curriculum || null,
          year_2_curriculum: scraped.year_2_curriculum || null,
          year_3_curriculum: scraped.year_3_curriculum || null,
          year_4_curriculum: scraped.year_4_curriculum || null,
          last_scraped_at: new Date().toISOString()
        }, { onConflict: 'name' })
        .select()
        .single();

      if (collegeError) {
        console.error(`ERROR upserting college "${scraped.name}":`, collegeError.message);
        continue;
      }

      const collegeId = collegeData.id;

      // Clean old sub-records
      await supabase.from('founders').delete().eq('college_id', collegeId);
      await supabase.from('instructors').delete().eq('college_id', collegeId);
      await supabase.from('reviews').delete().eq('college_id', collegeId);

      // Insert Founders
      if (scraped.founders && scraped.founders.length > 0) {
        const foundersToInsert = scraped.founders.map(f => ({
          college_id: collegeId,
          name: f.name,
          background_info: f.background_info,
          linkedin_url: f.linkedin_url
        }));
        const { error: fErr } = await supabase.from('founders').insert(foundersToInsert);
        if (fErr) console.error(`ERROR inserting founders for "${scraped.name}":`, fErr.message);
      }

      // Insert Instructors
      if (scraped.instructors && scraped.instructors.length > 0) {
        const instructorsToInsert = scraped.instructors.map(inst => ({
          college_id: collegeId,
          name: inst.name,
          company_background: inst.company_background
        }));
        const { error: iErr } = await supabase.from('instructors').insert(instructorsToInsert);
        if (iErr) console.error(`ERROR inserting instructors for "${scraped.name}":`, iErr.message);
      }

      // Insert Reviews
      if (scraped.reviews && scraped.reviews.length > 0) {
        const reviewsToInsert = scraped.reviews.map(rev => ({
          college_id: collegeId,
          rating: rev.rating,
          review_text: rev.review_text,
          source_url: rev.source_url || null
        }));
        const { error: rErr } = await supabase.from('reviews').insert(reviewsToInsert);
        if (rErr) console.error(`ERROR inserting reviews for "${scraped.name}":`, rErr.message);
      }

      console.log(`Successfully synced "${scraped.name}"!`);
    } catch (err) {
      console.error(`Unexpected error for "${scraped.name}":`, err.message);
    }
  }
  
  console.log("All colleges seeded successfully!");
}

main();
