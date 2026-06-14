'use client';

import React, { useState } from 'react';
import { College } from './CollegeCard';
import { 
  Calendar, 
  Search, 
  ArrowUpRight, 
  Clock, 
  HelpCircle, 
  BadgeCheck, 
  BookOpen, 
  Info, 
  Zap, 
  Sparkles, 
  Filter, 
  Award,
  Wallet
} from 'lucide-react';

interface ExamCalendarProps {
  colleges: College[];
}

export default function ExamCalendar({ colleges }: ExamCalendarProps) {
  const [query, setQuery] = useState('');
  const [activeTabMap, setActiveTabMap] = useState<Record<string, 'pattern' | 'syllabus'>>({});
  const [filterType, setFilterType] = useState<'all' | 'btech' | 'bypass' | 'low_fee'>('all');

  const handleToggleTab = (collegeId: string, tab: 'pattern' | 'syllabus') => {
    setActiveTabMap(prev => ({ ...prev, [collegeId]: tab }));
  };

  const examsList = colleges
    .map(college => {
      const examName = college.entranceExam?.pattern 
        ? college.name.replace(/School of Technology|Institute of Advanced Technology|School of AI/i, '').trim() + ' Entrance Exam'
        : college.name.replace(/School of Technology|Institute of Advanced Technology|School of AI/i, '').trim() + ' Admissions';

      const parsedFeeStr = college.applicationFee || '₹1,000';
      // extract digits to check if under 1000
      const feeNumMatch = parsedFeeStr.match(/₹?([\d,]+)/);
      const feeVal = feeNumMatch ? parseInt(feeNumMatch[1].replace(/,/g, '')) : 1000;

      return {
        college,
        examName,
        fee: parsedFeeStr,
        feeValue: feeVal,
        dates: college.examDates || 'Ongoing through July 2026',
        pattern: college.entranceExam?.pattern || 'Online Aptitude & Logical Evaluation (60 mins MCQ)',
        syllabus: college.entranceExam?.syllabus || 'Quantitative Aptitude, General Reasoning, and Computing Logic',
        fastTrack: college.fastTrackDetails || '',
        hasBypass: !!college.fastTrack
      };
    })
    .filter(item => {
      // 1. Text Search Filter
      const q = query.toLowerCase();
      const matchesSearch = 
        item.college.name.toLowerCase().includes(q) ||
        item.examName.toLowerCase().includes(q) ||
        item.pattern.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      // 2. Chip Category Filter
      if (filterType === 'btech') {
        const degree = (item.college.degreeType || '').toLowerCase();
        return degree.includes('b.tech') || degree.includes('btech') || (item.college.degree_partner || '').toLowerCase().includes('b.tech');
      }
      if (filterType === 'bypass') {
        return item.hasBypass;
      }
      if (filterType === 'low_fee') {
        return item.feeValue <= 1000;
      }

      return true;
    });

  // Assign stable decorative gradients based on college names to categorize visual layout
  const getGradientStyles = (name: string) => {
    const text = name.toLowerCase();
    
    // Violet / Fuchsia Theme: For AI, ML, Business, & High-End Tech Academies
    if (
      text.includes('zenith') || 
      text.includes('polaris') || 
      text.includes('scaler') || 
      text.includes('newton') || 
      text.includes('masters') ||
      text.includes('quad') ||
      text.includes('tensor')
    ) {
      return {
        cardClass: 'bg-gradient-to-br from-violet-950/15 via-neutral-900/40 to-fuchsia-950/10 hover:border-violet-500/30 hover:shadow-violet-500/5',
        badgeClass: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
        activeTabClass: 'bg-violet-500/10 text-violet-200 border border-violet-500/20',
        datesIconClass: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
        textThemeClass: 'text-violet-400',
        accentBorder: 'border-l-violet-500/60'
      };
    }
    
    // Emerald / Teal Theme: For Core Coding Academies and Systems Engineering Programs
    if (
      text.includes('100x') || 
      text.includes('bosscoder') || 
      text.includes('blocks') || 
      text.includes('cbsot') ||
      text.includes('kalvium') || 
      text.includes('codeanantam') || 
      text.includes('quotient')
    ) {
      return {
        cardClass: 'bg-gradient-to-br from-emerald-950/15 via-neutral-900/40 to-cyan-950/10 hover:border-emerald-500/30 hover:shadow-emerald-500/5',
        badgeClass: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        activeTabClass: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20',
        datesIconClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        textThemeClass: 'text-emerald-400',
        accentBorder: 'border-l-emerald-500/60'
      };
    }
    
    // Rose / Amber Theme: For Innovative, Community, and Accelerated Programs
    return {
      cardClass: 'bg-gradient-to-br from-rose-950/15 via-neutral-900/40 to-amber-950/10 hover:border-rose-500/30 hover:shadow-rose-500/5',
      badgeClass: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      activeTabClass: 'bg-rose-500/10 text-rose-200 border border-rose-500/20',
      datesIconClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      textThemeClass: 'text-rose-400',
      accentBorder: 'border-l-rose-500/60'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="glass-panel border border-violet-500/20 bg-gradient-to-r from-violet-950/20 via-black/40 to-emerald-950/10 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-violet-600/10 blur-[90px] pointer-events-none" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-emerald-600/5 blur-[90px] pointer-events-none" />
        
        <div className="space-y-1 relative z-10">
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Calendar className="h-6 w-6 text-violet-400" /> Admissions & Exam Calendar
          </h2>
          <p className="text-xs text-neutral-400 max-w-xl font-light">
            Track key application cycles, registration fees, testing patterns, and fast-track test waivers for India's leading alternative tech colleges.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="relative max-w-md w-full shrink-0 z-10">
          <Search className="absolute top-3.5 left-4 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search exams, patterns or colleges..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-neutral-950/80 pl-11 pr-4 py-3.5 text-xs text-white placeholder-neutral-500 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap gap-2 items-center bg-neutral-950/30 p-2 border border-white/5 rounded-2xl select-none">
        <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400 px-2 flex items-center gap-1.5 shrink-0">
          <Filter className="h-3 w-3 text-neutral-500" /> Quick Filters:
        </span>
        {[
          { id: 'all', label: 'All Admissions' },
          { id: 'btech', label: 'B.Tech Programs Only' },
          { id: 'bypass', label: 'Fast-Track / Exam Bypass' },
          { id: 'low_fee', label: 'Affordable Fee (≤ ₹1,000)' }
        ].map(chip => (
          <button
            key={chip.id}
            onClick={() => setFilterType(chip.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === chip.id
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-600/20'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Grid of Exams */}
      {examsList.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/5 rounded-3xl bg-neutral-900/20">
          <Sparkles className="h-8 w-8 text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-400 font-bold text-sm">No exam entries match your filters.</p>
          <button
            onClick={() => {
              setQuery('');
              setFilterType('all');
            }}
            className="mt-4 rounded-xl bg-violet-600 hover:bg-violet-700 px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examsList.map((item, idx) => {
            const styles = getGradientStyles(item.college.name);
            const activeTab = activeTabMap[item.college.id] || 'pattern';
            
            return (
              <div 
                key={item.college.id || idx} 
                className={`rounded-3xl border border-white/5 border-l-[3px] ${styles.accentBorder} ${styles.cardClass} hover:shadow-2xl hover:scale-[1.01] hover:shadow-violet-500/2 transition-all duration-300 flex flex-col justify-between gap-5 p-5 relative overflow-hidden`}
              >
                {/* Background ambient bubble */}
                <div className="pointer-events-none absolute -right-10 -bottom-10 h-24 w-24 rounded-full bg-white/[0.01]" />

                <div className="space-y-4">
                  {/* Top line: Header & Badge */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className={`text-[10px] uppercase font-black tracking-widest ${styles.textThemeClass}`}>{item.college.name}</span>
                      <h3 className="text-base font-black text-white tracking-tight mt-0.5">{item.examName}</h3>
                    </div>
                    <span className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[9.5px] font-black shrink-0 border ${styles.badgeClass}`}>
                      <Wallet className="h-3 w-3 opacity-80" />
                      <span>{item.fee}</span>
                    </span>
                  </div>

                  {/* Dates Banner with dynamic coloring */}
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/50 border border-white/5 shadow-inner">
                    <div className={`h-9 w-9 rounded-xl ${styles.datesIconClass} flex items-center justify-center shrink-0`}>
                      <Clock className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider text-neutral-500 leading-none">Cycles & Deadlines</p>
                      <p className="text-xs font-bold text-white mt-1.5 leading-snug">{item.dates}</p>
                    </div>
                  </div>

                  {/* Tabs Switcher: Pattern vs Syllabus */}
                  <div className="space-y-3">
                    <div className="flex bg-neutral-950/60 p-1 rounded-xl border border-white/5 gap-1 select-none w-fit">
                      <button
                        onClick={() => handleToggleTab(item.college.id, 'pattern')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          activeTab === 'pattern'
                            ? styles.activeTabClass
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Info className="h-3 w-3" />
                        <span>Exam Pattern</span>
                      </button>
                      <button
                        onClick={() => handleToggleTab(item.college.id, 'syllabus')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          activeTab === 'syllabus'
                            ? styles.activeTabClass
                            : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>Exam Syllabus</span>
                      </button>
                    </div>

                    {/* Tab contents */}
                    <div className="rounded-2xl bg-neutral-950/40 p-4 border border-white/5 text-[11px] leading-relaxed text-neutral-300 font-light min-h-[72px] flex flex-col justify-center">
                      {activeTab === 'pattern' ? (
                        <div>
                          <p className="mt-0.5 font-medium leading-relaxed">{item.pattern}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="mt-0.5 font-medium leading-relaxed">{item.syllabus}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fast Track details banner */}
                  {item.fastTrack && (
                    <div className="flex items-start gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border border-amber-500/10 p-3.5 shadow-md">
                      <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-widest text-amber-400 leading-none">Fast-Track Waiver Active</p>
                        <p className="text-[11px] text-neutral-300 font-medium leading-snug">
                          {item.fastTrack}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer details row */}
                <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-neutral-500" />
                    {item.college.degreeType || 'B.Tech/CSE'}
                  </span>
                  <a
                    href={item.college.apply_url || item.college.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-[10.5px] ${styles.textThemeClass} font-black flex items-center gap-0.5 group hover:underline`}
                  >
                    <span>Register for Exam</span>
                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
