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

// Import mockData.js
const mockDataPath = path.join(__dirname, '..', 'mockData.js');
const { MOCK_COLLEGES } = require(mockDataPath);

const scraped = MOCK_COLLEGES['CodeAnantam'];
if (!scraped) {
  console.error('Error: CodeAnantam data not found in mockData.js');
  process.exit(1);
}

async function main() {
  console.log('Upserting CodeAnantam to database...');
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
      throw new Error(`Failed to upsert college: ${collegeError.message}`);
    }

    const collegeId = collegeData.id;
    console.log(`Successfully upserted college. ID: ${collegeId}`);

    // Refresh related tables
    console.log('Clearing old sub-records...');
    await supabase.from('founders').delete().eq('college_id', collegeId);
    await supabase.from('instructors').delete().eq('college_id', collegeId);
    await supabase.from('reviews').delete().eq('college_id', collegeId);

    // Insert Founders
    if (scraped.founders && scraped.founders.length > 0) {
      console.log(`Inserting ${scraped.founders.length} founders...`);
      const foundersToInsert = scraped.founders.map(f => ({
        college_id: collegeId,
        name: f.name,
        background_info: f.background_info,
        linkedin_url: f.linkedin_url
      }));
      const { error: fErr } = await supabase.from('founders').insert(foundersToInsert);
      if (fErr) throw new Error(`Failed to insert founders: ${fErr.message}`);
    }

    // Insert Instructors
    if (scraped.instructors && scraped.instructors.length > 0) {
      console.log(`Inserting ${scraped.instructors.length} instructors...`);
      const instructorsToInsert = scraped.instructors.map(inst => ({
        college_id: collegeId,
        name: inst.name,
        company_background: inst.company_background
      }));
      const { error: iErr } = await supabase.from('instructors').insert(instructorsToInsert);
      if (iErr) throw new Error(`Failed to insert instructors: ${iErr.message}`);
    }

    // Insert Reviews
    if (scraped.reviews && scraped.reviews.length > 0) {
      console.log(`Inserting ${scraped.reviews.length} reviews...`);
      const reviewsToInsert = scraped.reviews.map(rev => ({
        college_id: collegeId,
        rating: rev.rating,
        review_text: rev.review_text,
        source_url: rev.source_url || null
      }));
      const { error: rErr } = await supabase.from('reviews').insert(reviewsToInsert);
      if (rErr) throw new Error(`Failed to insert reviews: ${rErr.message}`);
    }

    console.log('CodeAnantam seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
}

main();
