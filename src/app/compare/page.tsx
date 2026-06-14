'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, ArrowLeft, Plus, GraduationCap, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_COLLEGES } from '@/lib/mockData';
import ComparisonTable from '@/components/ComparisonTable';
import { College } from '@/components/CollegeCard';

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load all colleges (from DB or mock fallback) to populate the search dropdown
  useEffect(() => {
    async function loadAllColleges() {
      setLoading(true);
      if (!isSupabaseConfigured()) {
        const mockList = Object.values(MOCK_COLLEGES).map((c, i) => ({ ...c, id: `mock-${i}` }));
        setAllColleges(mockList);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('colleges')
          .select('*')
          .order('name', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setAllColleges(data);
        } else {
          setAllColleges(Object.values(MOCK_COLLEGES).map((c, i) => ({ ...c, id: `mock-${i}` })));
        }
      } catch (e) {
        console.warn("DB fetch in compare page failed, loading mock catalogs:", e);
        setAllColleges(Object.values(MOCK_COLLEGES).map((c, i) => ({ ...c, id: `mock-${i}` })));
      } finally {
        setLoading(false);
      }
    }

    loadAllColleges();
  }, []);

  // Hydrate selected colleges from sessionStorage compare bucket
  useEffect(() => {
    async function hydrateBucket() {
      const saved = sessionStorage.getItem('compareBucket');
      if (!saved) {
        setSelectedColleges([]);
        return;
      }

      try {
        const bucketColleges = JSON.parse(saved) as College[];
        if (bucketColleges.length === 0) {
          setSelectedColleges([]);
          return;
        }

        // Fetch related fields (founders, instructors, reviews) for each item in the bucket
        const hydratedList = [];

        for (const item of bucketColleges) {
          // If in mock demo mode or keys are missing, hydrate using mockData directly
          if (item.id.startsWith('mock-') || !isSupabaseConfigured()) {
            const matchVal = Object.values(MOCK_COLLEGES).find(c => c.name === item.name);
            if (matchVal) {
              hydratedList.push({ ...matchVal, id: item.id });
            } else {
              hydratedList.push(item);
            }
            continue;
          }

          try {
            const { data: fullRow } = await supabase.from('colleges').select('*').eq('id', item.id).single();
            const { data: founders } = await supabase.from('founders').select('*').eq('college_id', item.id);
            const { data: instructors } = await supabase.from('instructors').select('*').eq('college_id', item.id);
            const { data: reviews } = await supabase.from('reviews').select('*').eq('college_id', item.id);

            const cleanName = (n: string) => n.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
            const mockMatch = Object.values(MOCK_COLLEGES).find((m: any) => {
              const cleanM = cleanName(m.name);
              const cleanC = cleanName((fullRow || item).name);
              return cleanM === cleanC || cleanM.includes(cleanC) || cleanC.includes(cleanM);
            });

            hydratedList.push({
              ...mockMatch,
              ...(fullRow || item),
              founders: founders || [],
              instructors: instructors || [],
              reviews: reviews || []
            });
          } catch (err) {
            console.error("Hydration error for row", item.id, err);
            hydratedList.push(item);
          }
        }

        setSelectedColleges(hydratedList);
      } catch (err) {
        console.error("Hydrating compare bucket failed:", err);
      }
    }

    if (!loading) {
      hydrateBucket();
    }
  }, [loading]);

  const handleRemove = (id: string) => {
    const updated = selectedColleges.filter(c => c.id !== id);
    setSelectedColleges(updated);
    
    // Save minimal representation (id and name) back to session storage
    const minimal = updated.map(c => ({ id: c.id, name: c.name, location: c.location, fees: c.fees, tags: c.tags, degree_partner: c.degree_partner }));
    sessionStorage.setItem('compareBucket', JSON.stringify(minimal));
  };

  const handleAdd = async (college: College) => {
    if (selectedColleges.some(c => c.id === college.id)) {
      setDropdownOpen(false);
      return;
    }

    if (selectedColleges.length >= 3) {
      alert('You can compare a maximum of 3 colleges side-by-side.');
      setDropdownOpen(false);
      return;
    }

    setLoading(true);
    let fullCollegeData: any = { ...college };

    // Fetch related details if not mock ID and DB is configured
    if (!college.id.startsWith('mock-') && isSupabaseConfigured()) {
      try {
        const { data: founders } = await supabase.from('founders').select('*').eq('college_id', college.id);
        const { data: instructors } = await supabase.from('instructors').select('*').eq('college_id', college.id);
        const { data: reviews } = await supabase.from('reviews').select('*').eq('college_id', college.id);

        const cleanName = (n: string) => n.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
        const mockMatch = Object.values(MOCK_COLLEGES).find((m: any) => {
          const cleanM = cleanName(m.name);
          const cleanC = cleanName(college.name);
          return cleanM === cleanC || cleanM.includes(cleanC) || cleanC.includes(cleanM);
        });

        fullCollegeData = {
          ...mockMatch,
          ...college,
          founders: founders || [],
          instructors: instructors || [],
          reviews: reviews || []
        };
      } catch (err) {
        console.error(err);
      }
    } else {
      // Mock hydration
      const matchVal = Object.values(MOCK_COLLEGES).find(c => c.name === college.name);
      if (matchVal) {
        fullCollegeData = { ...matchVal, id: college.id };
      }
    }

    const updated = [...selectedColleges, fullCollegeData];
    setSelectedColleges(updated);

    const minimal = updated.map(c => ({ id: c.id, name: c.name, location: c.location, fees: c.fees, tags: c.tags, degree_partner: c.degree_partner }));
    sessionStorage.setItem('compareBucket', JSON.stringify(minimal));
    setDropdownOpen(false);
    setLoading(false);
  };

  const availableToSelect = allColleges.filter(
    (ac) => !selectedColleges.some((sc) => sc.id === ac.id)
  );

  return (
    <div className="relative w-full pb-20 pt-10 min-h-screen">
      {/* Grid Backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Glow accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-7xl bg-gradient-to-b from-emerald-600/10 via-violet-600/5 to-transparent blur-[120px]" />
        <div className="absolute top-20 right-1/4 h-[300px] w-[300px] rounded-full bg-emerald-600/5 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-neutral-950/40 px-3.5 py-1.5 text-xs font-bold text-neutral-400 hover:text-white hover:border-white/10 hover:bg-neutral-900/40 transition-all shadow-sm mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Directory</span>
            </Link>
            
            <h1 className="text-3xl font-outfit font-extrabold tracking-tight mb-1.5 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-300">Alternative College </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 font-black">Compare Matrix</span>
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
              Analyze fees, campus specs, leadership pedigrees, and placement networks across B.Tech alternatives.
            </p>
          </div>

          {/* Selector Dropdown Tool */}
          <div className="relative shrink-0">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              disabled={selectedColleges.length >= 3}
              className={`flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition-all border ${
                selectedColleges.length >= 3
                  ? 'bg-neutral-950 border-white/5 text-neutral-600 cursor-not-allowed'
                  : 'bg-neutral-950 border border-white/10 hover:border-emerald-500/40 text-white shadow-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-95'
              }`}
            >
              <Plus className={`h-4 w-4 ${selectedColleges.length >= 3 ? 'text-neutral-600' : 'text-emerald-400'}`} />
              <span>Add College to Compare ({selectedColleges.length}/3)</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/15 bg-neutral-950/90 backdrop-blur-2xl p-2.5 shadow-2xl z-30 max-h-72 overflow-y-auto scrollbar-thin">
                <div className="flex items-center justify-between p-2 border-b border-white/5 mb-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Select College</span>
                  <button onClick={() => setDropdownOpen(false)} className="rounded-lg p-1 hover:bg-white/5 transition-colors">
                    <X className="h-4 w-4 text-neutral-400 hover:text-white" />
                  </button>
                </div>
                {availableToSelect.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic p-4 text-center">No colleges left to add.</p>
                ) : (
                  <div className="space-y-1">
                    {availableToSelect.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleAdd(c)}
                        className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-xs text-neutral-300 hover:text-white font-semibold flex items-center gap-2.5 transition-all"
                      >
                        <GraduationCap className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected quick list tags in view */}
        {selectedColleges.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Active Comparison:</span>
            {selectedColleges.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/5 px-4 py-2 text-xs font-bold text-emerald-300 border border-emerald-500/20 shadow-sm transition-all hover:bg-emerald-500/10"
              >
                <span>{c.name}</span>
                <button onClick={() => handleRemove(c.id)} className="rounded-full p-0.5 hover:bg-emerald-500/20 transition-colors">
                  <X className="h-3.5 w-3.5 text-emerald-400" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Matrix Comparison Matrix Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin border-4 border-emerald-500 border-t-transparent rounded-full" />
            <p className="text-neutral-400 text-sm mt-4 font-semibold">Aligning spec metrics...</p>
          </div>
        ) : (
          <ComparisonTable colleges={selectedColleges} onRemove={handleRemove} />
        )}

      </div>
    </div>
  );
}
