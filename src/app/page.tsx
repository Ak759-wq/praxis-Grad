'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, RefreshCw, BarChart3, ArrowRight, ShieldCheck, HelpCircle, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_COLLEGES } from '@/lib/mockData';
import CollegeCard, { College } from '@/components/CollegeCard';
import MatchmakerQuiz from '@/components/MatchmakerQuiz';
import ROICalculator from '@/components/ROICalculator';
import LaptopShowcase from '@/components/LaptopShowcase';
import ExamCalendar from '@/components/ExamCalendar';
import { Compass, GraduationCap, Landmark, Laptop, Calendar } from 'lucide-react';

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'explore' | 'quiz' | 'roi' | 'laptop' | 'exams'>('explore');

  // Comparison Bucket State (stores college IDs)
  const [compareBucket, setCompareBucket] = useState<College[]>([]);

  // Unique lists of tags from the colleges to dynamically populate our filters
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // Fetch from Supabase
  useEffect(() => {
    async function loadColleges() {
      setLoading(true);
      setErrorMessage('');

      if (!isSupabaseConfigured()) {
        // Falling back to local data directly
        setColleges(Object.values(MOCK_COLLEGES).map((c, i) => ({ ...c, id: `mock-${i}` })));
        setAvailableTags(Array.from(new Set(Object.values(MOCK_COLLEGES).flatMap(c => c.tags || []))));
        setIsDemoMode(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .order('name', { ascending: true });

        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          // Connected to Supabase but database is empty. Force demo mode with instructions.
          setColleges(Object.values(MOCK_COLLEGES).map((c, i) => ({ ...c, id: `mock-${i}` })));
          setAvailableTags(Array.from(new Set(Object.values(MOCK_COLLEGES).flatMap(c => c.tags || []))));
          setIsDemoMode(true);
          setErrorMessage('Database table exists but is empty. Click "Scraper Pipeline" to run a sync and seed real records!');
        } else {
          const cleanName = (n: string) => n.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
          const mergedData = data.map((c: any) => {
            const mockMatch = Object.values(MOCK_COLLEGES).find((m: any) => {
              const cleanM = cleanName(m.name);
              const cleanC = cleanName(c.name);
              return cleanM === cleanC || cleanM.includes(cleanC) || cleanC.includes(cleanM);
            });
            return {
              ...mockMatch,
              ...c
            };


          });
          setColleges(mergedData);
          setAvailableTags(Array.from(new Set(data.flatMap(c => c.tags || []))));
          setIsDemoMode(false);
        }
      } catch (err: any) {
        console.warn('Database connection failed. Loading fallback catalog:', err.message);
        // Robust fallback to keep app fully functional
        setColleges(Object.values(MOCK_COLLEGES).map((c, i) => ({ ...c, id: `mock-${i}` })));
        setAvailableTags(Array.from(new Set(Object.values(MOCK_COLLEGES).flatMap(c => c.tags || []))));
        setIsDemoMode(true);
      } finally {
        setLoading(false);
      }
    }

    loadColleges();
  }, []);

  // Sync bucket with sessionStorage to make it cross-page persistent
  useEffect(() => {
    const savedBucket = sessionStorage.getItem('compareBucket');
    if (savedBucket) {
      try {
        setCompareBucket(JSON.parse(savedBucket));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleCompareToggle = (college: College) => {
    let updatedBucket = [...compareBucket];
    const index = updatedBucket.findIndex(c => c.id === college.id);

    if (index > -1) {
      updatedBucket.splice(index, 1);
    } else {
      if (updatedBucket.length >= 3) {
        alert('You can compare up to 3 colleges at once! Please remove a college to add a new one.');
        return;
      }
      updatedBucket.push(college);
    }

    setCompareBucket(updatedBucket);
    sessionStorage.setItem('compareBucket', JSON.stringify(updatedBucket));
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Filter Logic (searches name, location, degree_partner, tags, and curriculum)
  const filteredColleges = colleges.filter((c) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      (c.location && c.location.toLowerCase().includes(query)) ||
      (c.degree_partner && c.degree_partner.toLowerCase().includes(query)) ||
      (c.curriculum_summary && c.curriculum_summary.toLowerCase().includes(query));

    return matchesSearch;
  });

  return (
    <div className="relative w-full pb-24">
      {/* Background grid and radial glow layers */}
      <div className="absolute top-0 left-0 right-0 h-[650px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-violet-600/10 rounded-full blur-[110px]" />
        <div className="absolute top-20 right-1/4 w-[350px] h-[350px] bg-fuchsia-600/10 rounded-full blur-[110px]" />
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-24 pb-12 text-center sm:px-6 lg:px-8 z-10 select-none">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-semibold text-neutral-300 backdrop-blur-md mb-8 hover:border-violet-500/25 hover:bg-violet-500/5 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <ShieldCheck className="h-4 w-4 text-emerald-400 animate-pulse" />
          <span>Curated Index of {colleges.length || 26} B.Tech Alternatives</span>
        </div>
        
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-7xl max-w-5xl mx-auto leading-[1.05]">
          Find the Perfect <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(168,85,247,0.15)]">New-Age Tech College</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-xs sm:text-sm md:text-base text-neutral-400 font-light leading-relaxed tracking-wide">
          Skip rote-learning. Compare modern alternative colleges in India offering product-engineering curricula, 1-on-1 industry mentorship, and FAANG lineups.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2 rounded-full bg-white hover:bg-neutral-200 text-black px-6 py-3.5 text-xs font-black tracking-wide transition-all shadow-[0_8px_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="h-4 w-4 text-black" />
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className="flex items-center gap-2 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-white px-6 py-3.5 text-xs font-bold tracking-wide transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <GraduationCap className="h-4 w-4 text-neutral-400" />
            <span>AI Matchmaker Quiz</span>
          </button>
        </div>

        {/* Demo/Local Notice Box */}
        {isDemoMode && (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-yellow-500/15 bg-yellow-500/[0.02] p-4 text-left backdrop-blur-md flex items-start gap-3 shadow-md">
            <HelpCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-yellow-300">Demo Fallback Mode Active</p>
              <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
                {errorMessage || "The application is currently displaying its catalog using our offline pre-scraped model. Connect Supabase keys in a .env.local file to initialize your custom cloud database!"}
              </p>
              <Link href="/admin" className="text-[11px] text-violet-400 font-bold hover:underline flex items-center gap-0.5 mt-2">
                <span>Configure Keys & Setup DB</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Interactive Tabs Menu */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-2 mb-10 select-none">
        <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-1.5 p-1.5 rounded-full bg-neutral-950/40 border border-white/10 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Compass className={`h-4 w-4 transition-transform duration-300 ${activeTab === 'explore' ? 'scale-110 text-violet-400' : 'text-neutral-500'}`} />
            <span>Explore Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <GraduationCap className={`h-4.5 w-4.5 transition-transform duration-300 ${activeTab === 'quiz' ? 'scale-110 text-violet-400' : 'text-neutral-500'}`} />
            <span>AI Matchmaker</span>
          </button>
          <button
            onClick={() => setActiveTab('roi')}
            className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'roi'
                ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Landmark className={`h-4 w-4 transition-transform duration-300 ${activeTab === 'roi' ? 'scale-110 text-violet-400' : 'text-neutral-500'}`} />
            <span>ROI Calculator</span>
          </button>
          <button
            onClick={() => setActiveTab('laptop')}
            className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'laptop'
                ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Laptop className={`h-4 w-4 transition-transform duration-300 ${activeTab === 'laptop' ? 'scale-110 text-violet-400' : 'text-neutral-500'}`} />
            <span>Laptop Specs</span>
          </button>
          <button
            onClick={() => setActiveTab('exams')}
            className={`flex-1 shrink-0 flex items-center justify-center gap-2 px-4 py-3 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
              activeTab === 'exams'
                ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            <Calendar className={`h-4 w-4 transition-transform duration-300 ${activeTab === 'exams' ? 'scale-110 text-violet-400' : 'text-neutral-500'}`} />
            <span>Entrance Calendar</span>
          </button>
        </div>
      </section>

      {activeTab === 'explore' && (
        <>
          {/* Search Bar */}
          <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-4 mb-6">
            <div className="relative w-full group">
              <Search className={`absolute top-4 left-5 h-4.5 w-4.5 transition-colors duration-300 ${searchQuery ? 'text-violet-400' : 'text-neutral-500 group-hover:text-neutral-400'}`} />
              <input
                type="text"
                placeholder="Search by college name, city, degree partner, curriculum..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/10 bg-neutral-950/40 backdrop-blur-xl py-3.5 pl-13 pr-12 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-all duration-500 focus:border-violet-500/40 focus:bg-neutral-950/70 focus:shadow-[0_0_30px_rgba(139,92,246,0.12)] focus:ring-1 focus:ring-violet-500/25"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute top-3 right-4 p-1 rounded-full text-neutral-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>

          {/* College Cards Grid */}
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="h-10 w-10 animate-spin text-violet-400" />
                <p className="text-neutral-400 text-sm mt-4 font-semibold">Loading Colleges Directory...</p>
              </div>
            ) : filteredColleges.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-white/5 rounded-2xl bg-neutral-900/35">
                <p className="text-neutral-400 font-medium">No colleges match your search parameters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTags([]);
                  }}
                  className="mt-4 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-xs font-bold text-white transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredColleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isCompared={compareBucket.some((c) => c.id === college.id)}
                    onCompareToggle={() => handleCompareToggle(college)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === 'quiz' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
          <MatchmakerQuiz 
            colleges={colleges} 
            compareBucket={compareBucket} 
            onCompareToggle={handleCompareToggle} 
          />
        </section>
      )}

      {activeTab === 'roi' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
          <ROICalculator />
        </section>
      )}

      {activeTab === 'laptop' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
          <LaptopShowcase colleges={colleges} />
        </section>
      )}

      {activeTab === 'exams' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
          <ExamCalendar colleges={colleges} />
        </section>
      )}

      {/* Floating Comparison Drawer Cart */}
      {compareBucket.length > 0 && (
        <div className="fixed bottom-6 left-1/2 z-40 w-[90%] max-w-xl -translate-x-1/2 rounded-2xl border border-white/10 bg-black/90 p-4 shadow-2xl backdrop-blur-md animate-bounce-in flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Compare Colleges Bucket</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {compareBucket.length} of 3 schools selected
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCompareBucket([]);
                sessionStorage.removeItem('compareBucket');
              }}
              className="rounded-xl border border-white/10 hover:bg-white/5 px-3 py-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
            >
              Clear
            </button>
            <Link
              href="/compare"
              className="rounded-xl bg-gradient-to-r from-violet-600 to-emerald-600 hover:from-violet-700 hover:to-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-lg transition-colors border border-violet-500/20 flex items-center gap-1.5"
            >
              <span>Compare Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
