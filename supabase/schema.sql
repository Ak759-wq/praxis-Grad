-- NextGenTechSchools Supabase Schema Definition
-- Run this in your Supabase SQL Editor to initialize the database tables.

-- 1. Create colleges table
CREATE TABLE IF NOT EXISTS colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    website_url TEXT NOT NULL,
    image_url TEXT,
    eligibility TEXT,
    location TEXT,
    fees TEXT,
    curriculum_summary TEXT,
    contact_info TEXT,
    degree_partner TEXT,
    tags TEXT[] DEFAULT '{}',
    year_1_curriculum TEXT,
    year_2_curriculum TEXT,
    year_3_curriculum TEXT,
    year_4_curriculum TEXT,
    last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create founders table
CREATE TABLE IF NOT EXISTS founders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    background_info TEXT,
    linkedin_url TEXT,
    CONSTRAINT founders_college_name_unique UNIQUE (college_id, name)
);

-- 3. Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company_background TEXT,
    CONSTRAINT instructors_college_name_unique UNIQUE (college_id, name)
);

-- 4. Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    rating NUMERIC(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    review_text TEXT NOT NULL,
    source_url TEXT,
    CONSTRAINT reviews_college_text_unique UNIQUE (college_id, review_text)
);

-- Enable Row Level Security (RLS)
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe re-run)
DROP POLICY IF EXISTS "Allow public read access on colleges" ON colleges;
DROP POLICY IF EXISTS "Allow public read access on founders" ON founders;
DROP POLICY IF EXISTS "Allow public read access on instructors" ON instructors;
DROP POLICY IF EXISTS "Allow public read access on reviews" ON reviews;

DROP POLICY IF EXISTS "Allow public write on colleges" ON colleges;
DROP POLICY IF EXISTS "Allow public write on founders" ON founders;
DROP POLICY IF EXISTS "Allow public write on instructors" ON instructors;
DROP POLICY IF EXISTS "Allow public write on reviews" ON reviews;

-- Create Select Policies
CREATE POLICY "Allow public read access on colleges" ON colleges FOR SELECT USING (true);
CREATE POLICY "Allow public read access on founders" ON founders FOR SELECT USING (true);
CREATE POLICY "Allow public read access on instructors" ON instructors FOR SELECT USING (true);
CREATE POLICY "Allow public read access on reviews" ON reviews FOR SELECT USING (true);

-- Create Write Policies (allowing public write for local and API operations during testing)
CREATE POLICY "Allow public write on colleges" ON colleges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write on founders" ON founders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write on instructors" ON instructors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public write on reviews" ON reviews FOR ALL USING (true) WITH CHECK (true);
