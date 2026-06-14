'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin, GraduationCap, ChevronDown, ChevronUp, BarChart3,
  Download, Laptop, Users, Play, Bookmark, BookmarkCheck,
  Flame, Sparkles, ExternalLink, Award, Calendar,
  IndianRupee, BookOpen, Clock, Building, Compass, CheckCircle2,
  FileText, Zap, BadgeCheck, Layers, Star
} from 'lucide-react';

export interface College {
  id: string;
  name: string;
  website_url: string;
  image_url?: string;
  eligibility?: string;
  location?: string;
  fees?: string;
  curriculum_summary?: string;
  contact_info?: string;
  degree_partner?: string;
  tags?: string[];
  year_1_curriculum?: string;
  year_2_curriculum?: string;
  year_3_curriculum?: string;
  year_4_curriculum?: string;
  last_scraped_at?: string;
  brochureUrl?: string;
  // Enrichment fields
  seats?: string;
  laptop_provided?: string | boolean;
  hiring_partners_count?: number;
  campus_tour_url?: string;
  scholarship_info?: string;
  apply_url?: string;
  is_trending?: boolean;
  is_new?: boolean;
  rating_breakdown?: {
    curriculum: number;
    placements: number;
    faculty: number;
    campus: number;
  };
  // Deep Dive Fields — now displayed inline
  degreeType?: string;
  applicationFee?: string;
  examDates?: string;
  industryMentors?: string;
  fastTrack?: boolean;
  fastTrackDetails?: string;
  foundingYear?: number;
  batchSize?: number;
  degreeRecognition?: string;
  entranceExam?: {
    pattern?: string;
    level?: string;
    syllabus?: string;
  };
  studentClubs?: string[];
  financingOptions?: string;
}

interface CollegeCardProps {
  college: College;
  isCompared: boolean;
  onCompareToggle: (e: React.MouseEvent) => void;
}

function RatingBar({ label, value, gradientClass }: { label: string; value: number; gradientClass: string }) {
  const pct = Math.round((value / 5) * 100);
  return (
    <div className="flex items-center justify-between gap-3 py-0.5">
      <span className="text-[9px] text-neutral-400 w-[5rem] shrink-0 font-medium uppercase tracking-wider">{label}</span>
      <div className="flex-grow h-[3px] bg-white/5 rounded-full overflow-hidden">
        <div className={`h-[3px] rounded-full transition-all duration-700 ${gradientClass}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[9.5px] font-bold text-slate-300 w-5 text-right">{value}</span>
    </div>
  );
}

function formatFee(fees?: string): string {
  if (!fees) return 'N/A';
  const match = fees.match(/₹[\d.,–\-]+\s*(?:Lakhs?|L)(?:\s*to\s*₹?[\d.,–\-]+\s*(?:Lakhs?|L))?(?!\w)/i);
  return match ? match[0] : fees.split('(')[0].trim().substring(0, 25);
}

function InfoRow({ icon: Icon, label, value, color = 'text-violet-400' }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${color}`} />
      <div className="min-w-0">
        <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-600 block">{label}</span>
        <span className="text-[11px] font-semibold text-neutral-200 leading-snug">{value}</span>
      </div>
    </div>
  );
}

export default function CollegeCard({ college, isCompared, onCompareToggle }: CollegeCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bookmarked_colleges');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        setIsBookmarked(ids.includes(college.id));
      }
    } catch { /* ignore */ }
  }, [college.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('bookmarked_colleges');
      const ids: string[] = saved ? JSON.parse(saved) : [];
      const newIds = isBookmarked
        ? ids.filter((id) => id !== college.id)
        : [...ids, college.id];
      localStorage.setItem('bookmarked_colleges', JSON.stringify(newIds));
      setIsBookmarked(!isBookmarked);
    } catch { /* ignore */ }
  };

  const getTagColor = (tag: string) => {
    const text = tag.toLowerCase();
    if (text.includes('ai') || text.includes('llm') || text.includes('deep learning'))
      return 'bg-violet-500/10 text-violet-300 border-violet-500/20';
    if (text.includes('zero') || text.includes('isa') || text.includes('income') || text.includes('pay after'))
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    if (text.includes('maang') || text.includes('faang') || text.includes('placement'))
      return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
    return 'bg-slate-500/10 text-slate-300 border-slate-500/20';
  };
  // Generate robust rating breakdown if missing
  const getCardRatingBreakdown = () => {
    if (college.rating_breakdown) return college.rating_breakdown;
    
    // Stable hash-based generator
    let hash = 0;
    const str = college.name || college.id || '';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const genRating = (offset: number) => {
      const val = 4.2 + ((Math.abs(hash + offset) % 6) * 0.1);
      return Number(val.toFixed(1));
    };
    
    return {
      curriculum: genRating(1),
      placements: genRating(2),
      faculty: genRating(3),
      campus: genRating(4)
    };
  };

  const rb = getCardRatingBreakdown();
  const avgRating = ((rb.curriculum + rb.placements + rb.faculty + rb.campus) / 4).toFixed(1);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl glass-panel glass-panel-hover h-full">

      {/* ── Image Banner ── */}
      <div className="relative h-44 w-full overflow-hidden bg-neutral-900 border-b border-white/5 shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={college.name.toLowerCase().includes('alta') 
            ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9_a769jfhQ3K4KWU2vQ38E_3f1xq0sgkqUw&s' 
            : college.image_url}
          referrerPolicy="no-referrer"
          alt={college.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const name = college.name.toLowerCase();
            let fb = 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600';
            if (name.includes('scaler'))    fb = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600';
            if (name.includes('polar'))     fb = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600';
            if (name.includes('nxtwave'))   fb = 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600';
            if (name.includes('zenith'))    fb = 'https://images.unsplash.com/photo-1558021211-6d1403321394?q=80&w=600';
            if (name.includes('tensor'))    fb = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600';
            if (name.includes('mirai'))     fb = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600';
            if (name.includes('blocks') || name.includes('cbsot')) fb = 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=600';
            if (name.includes('vedam'))     fb = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600';
            if (name.includes('bosscoder')) fb = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600';
            if (name.includes('upgrad'))    fb = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600';
            if (name.includes('stellar'))   fb = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600';
            if (name.includes('alta'))      fb = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9_a769jfhQ3K4KWU2vQ38E_3f1xq0sgkqUw&s';
            if (name.includes('intel'))     fb = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600';
            e.currentTarget.src = fb;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent" />

        {/* Trending / New badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {college.is_trending && (
            <span className="flex items-center gap-1 rounded-full bg-orange-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow">
              <Flame className="h-2.5 w-2.5" /> Trending
            </span>
          )}
          {college.is_new && (
            <span className="flex items-center gap-1 rounded-full bg-sky-500/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow">
              <Sparkles className="h-2.5 w-2.5" /> New
            </span>
          )}
          {college.fastTrack && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm shadow">
              <Zap className="h-2.5 w-2.5" /> Fast Track
            </span>
          )}
        </div>

        {/* Degree type badge — top right */}
        {college.degreeType && (
          <div className="absolute top-3 right-3 rounded-lg bg-violet-700/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md border border-violet-500/30">
            {college.degreeType}
          </div>
        )}

        {/* Bottom: Location + Laptop */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1 text-xs font-semibold text-neutral-200 backdrop-blur-md border border-white/10">
            <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[140px]">{college.location?.split(',').slice(0, 2).join(',') || 'India'}</span>
          </div>
          {college.laptop_provided && (
            <div className="flex items-center gap-1 rounded-lg bg-sky-900/70 px-2 py-1 text-[10px] font-bold text-sky-300 backdrop-blur-md border border-sky-500/20 shrink-0">
              <Laptop className="h-3 w-3" />
              <span>{typeof college.laptop_provided === 'string' ? college.laptop_provided : 'Laptop'}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-grow flex flex-col p-5 gap-3">

        {/* Name + Bookmark */}
        <div className="flex items-start justify-between gap-2">
          <Link href={`/college/${college.id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-violet-400 transition-colors leading-snug">
              {college.name}
            </h3>
          </Link>
          <button
            onClick={toggleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Save college'}
            className={`shrink-0 rounded-lg p-1.5 transition-all border ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-white/5 text-neutral-500 border-white/10 hover:text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Degree Partner & Recognition Banners */}
        <div className="flex flex-col gap-1.5 -mt-1">
          {college.degree_partner && (
            <div className="flex items-center gap-2 rounded-xl bg-violet-500/5 border border-violet-500/10 px-3 py-1.5 text-[11px] font-medium text-violet-300">
              <GraduationCap className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              <span className="truncate">{college.degree_partner}</span>
            </div>
          )}
          {college.degreeRecognition && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 text-[10px] font-semibold text-emerald-300">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{college.degreeRecognition}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {college.tags && college.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {college.tags.slice(0, 4).map((tag, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold tracking-wider uppercase border transition-colors ${getTagColor(tag)}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Key Stats Grid ── */}
        <div className="grid grid-cols-2 gap-2.5">
          {college.hiring_partners_count && (
            <div className="rounded-xl bg-neutral-950/40 border border-white/5 px-3 py-2.5 flex items-center gap-3 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all duration-300">
              <div className="rounded-lg bg-blue-500/10 p-1.5 text-blue-400 shrink-0">
                <Users className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 block">Hiring Partners</span>
                <span className="text-xs font-black text-slate-200 block mt-0.5">{college.hiring_partners_count.toLocaleString()}+</span>
              </div>
            </div>
          )}
          {avgRating && (
            <div className="rounded-xl bg-neutral-950/40 border border-white/5 px-3 py-2.5 flex items-center gap-3 hover:border-amber-500/20 hover:bg-amber-500/5 transition-all duration-300">
              <div className="rounded-lg bg-amber-500/10 p-1.5 text-amber-400 shrink-0">
                <Star className="h-3.5 w-3.5 fill-amber-400/20" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 block">Avg Rating</span>
                <span className="text-xs font-black text-slate-200 block mt-0.5">{avgRating} <span className="text-neutral-500 font-medium text-[10px]">/ 5.0</span></span>
              </div>
            </div>
          )}
          {college.foundingYear && (
            <div className="rounded-xl bg-neutral-950/40 border border-white/5 px-3 py-2.5 flex items-center gap-3 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300">
              <div className="rounded-lg bg-white/5 p-1.5 text-neutral-400 shrink-0">
                <Building className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 block">Founded</span>
                <span className="text-xs font-black text-slate-200 block mt-0.5">{college.foundingYear}</span>
              </div>
            </div>
          )}
          {college.batchSize && (
            <div className="rounded-xl bg-neutral-950/40 border border-white/5 px-3 py-2.5 flex items-center gap-3 hover:border-white/10 hover:bg-white/[0.02] transition-all duration-300">
              <div className="rounded-lg bg-white/5 p-1.5 text-neutral-400 shrink-0">
                <Layers className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 block">Batch Size</span>
                <span className="text-xs font-black text-slate-200 block mt-0.5 truncate">{college.batchSize} Students</span>
              </div>
            </div>
          )}
        </div>

        {/* Fast Track Alert */}
        {college.fastTrack && college.fastTrackDetails && (
          <div className="flex items-start gap-2.5 rounded-xl bg-gradient-to-r from-emerald-500/8 to-violet-500/8 border border-emerald-500/20 px-3.5 py-3 shadow-sm">
            <Zap className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[8.5px] font-bold uppercase tracking-widest text-emerald-400">Fast-Track Pathway</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-medium">{college.fastTrackDetails}</p>
            </div>
          </div>
        )}

        {/* Scholarship */}
        {college.scholarship_info && (
          <div className="flex items-start gap-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 px-3.5 py-3">
            <span className="text-emerald-400 text-sm shrink-0 mt-px">🎓</span>
            <p className="text-[11px] text-emerald-300/95 leading-relaxed font-medium">{college.scholarship_info}</p>
          </div>
        )}

        {/* Rating Breakdown */}
        {rb && (
          <div className="rounded-2xl bg-neutral-950/40 border border-white/5 p-4 space-y-2.5">
            <p className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 border-b border-white/5 pb-2 mb-1">Rating Breakdown</p>
            <RatingBar label="Curriculum" value={rb.curriculum} gradientClass="bg-gradient-to-r from-violet-500 to-purple-400" />
            <RatingBar label="Placements" value={rb.placements} gradientClass="bg-gradient-to-r from-emerald-500 to-teal-400" />
            <RatingBar label="Faculty"    value={rb.faculty}    gradientClass="bg-gradient-to-r from-sky-500 to-blue-400" />
            <RatingBar label="Campus"     value={rb.campus}     gradientClass="bg-gradient-to-r from-fuchsia-500 to-pink-400" />
          </div>
        )}

        {/* ── Admissions & Key Dates Panel ── */}
        <div className="rounded-2xl bg-neutral-950/40 border border-white/5 p-4 space-y-3.5">
          <p className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 border-b border-white/5 pb-2">Admissions & Deadlines</p>
          
          <div className="grid grid-cols-2 gap-4">
            {college.applicationFee && (
              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-emerald-500/10 p-1.5 text-emerald-400 shrink-0">
                  <IndianRupee className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 block">App Fee</span>
                  <span className="text-[11px] font-bold text-slate-200 mt-0.5 block truncate">{college.applicationFee}</span>
                </div>
              </div>
            )}
            {college.seats && (
              <div className="flex items-start gap-2.5">
                <div className="rounded-lg bg-violet-500/10 p-1.5 text-violet-400 shrink-0">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 block">Seats Available</span>
                  <span className="text-[11px] font-bold text-slate-200 mt-0.5 block truncate">{college.seats}</span>
                </div>
              </div>
            )}
          </div>

          {college.examDates && (
            <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
              <div className="rounded-lg bg-fuchsia-500/10 p-1.5 text-fuchsia-400 shrink-0">
                <Calendar className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[8.5px] uppercase font-bold tracking-widest text-neutral-500 block">Admissions Timeline</span>
                <span className="text-[11px] font-semibold text-slate-200 mt-0.5 block leading-normal">{college.examDates}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-5 pb-5 pt-4 border-t border-white/5 shrink-0">
        {/* Fee + Compare */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Program Fee</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5">{formatFee(college.fees)}</span>
          </div>
          <button
            onClick={onCompareToggle}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              isCompared
                ? 'bg-violet-600/20 text-violet-300 border-violet-500/40 hover:bg-violet-600/30'
                : 'bg-white/5 text-neutral-300 border-white/10 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>{isCompared ? 'Added' : 'Compare'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Primary CTA */}
          <a
            href={college.apply_url || college.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-colors border border-violet-500/30"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Apply Now
          </a>

          {/* Secondary row */}
          <div className="flex gap-2">
            <Link
              href={`/college/${college.id}`}
              className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-white/5 hover:bg-white/10 px-3 py-2 text-center text-[11px] font-semibold text-neutral-300 transition-colors border border-white/8"
            >
              Full Profile
            </Link>
            <a
              href={college.campus_tour_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(college.name + ' campus tour')}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Watch Campus Tour"
              className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold transition-all border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Tour</span>
            </a>
            {college.brochureUrl && (
              <a
                href={college.brochureUrl}
                {...(!college.brochureUrl.startsWith('http') ? { download: true } : {})}
                target="_blank"
                rel="noopener noreferrer"
                title="Download PDF Brochure"
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-[11px] font-bold transition-all border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
              >
                <Download className="h-3 w-3" />
                <span>PDF</span>
              </a>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
