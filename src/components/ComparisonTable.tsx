'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trash2, Shield, ArrowRight, BookOpen, User, Star, IndianRupee } from 'lucide-react';
import { College } from './CollegeCard';

interface Founder {
  name: string;
  background_info?: string;
  linkedin_url?: string;
}

interface Instructor {
  name: string;
  company_background?: string;
}

interface Review {
  rating: number;
  review_text?: string;
  source_url?: string;
}

interface CollegeWithRelations extends College {
  founders?: Founder[];
  instructors?: Instructor[];
  reviews?: Review[];
}

interface ComparisonTableProps {
  colleges: CollegeWithRelations[];
  onRemove: (id: string) => void;
}

export default function ComparisonTable({ colleges, onRemove }: ComparisonTableProps) {
  if (colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl bg-neutral-950/20 border border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-emerald-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
        
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-white/10 flex items-center justify-center mb-6 relative shadow-inner">
          <Shield className="h-8 w-8 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-neutral-950"></span>
          </span>
        </div>
        
        <h3 className="text-white font-bold text-lg tracking-tight font-outfit">No Institutions Selected</h3>
        <p className="text-neutral-500 text-sm max-w-sm mt-2 leading-relaxed">
          Choose 2 to 3 alternative tech schools from the dropdown at the top right to compare their curriculum, fees, faculty, and specs side-by-side.
        </p>
      </div>
    );
  }

  // Helper to aggregate rating
  const getRatingString = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 'No reviews yet';
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const avg = (sum / reviews.length).toFixed(1);
    return `${avg} ★ (${reviews.length} reviews)`;
  };

  const rows = [
    {
      section: 'Quick Specs',
      items: [
        { label: 'Campus Location', value: (c: CollegeWithRelations) => c.location || 'Not Specified' },
        { label: 'Academic Fees', value: (c: CollegeWithRelations) => c.fees || 'Not Specified', highlight: true },
        { label: 'Admission Eligibility', value: (c: CollegeWithRelations) => c.eligibility || 'Open Admission' },
        { label: 'Degree Partner', value: (c: CollegeWithRelations) => c.degree_partner || 'Independent Certification' },
        { label: 'Founding Year', value: (c: CollegeWithRelations) => c.foundingYear ? `${c.foundingYear}` : '—' },
        { label: 'Batch Size', value: (c: CollegeWithRelations) => c.batchSize ? `${c.batchSize} Seats / Batch` : (c.seats || '—') },
        { 
          label: 'Contact Info', 
          value: (c: CollegeWithRelations) => (
            <span className="text-xs text-neutral-400 font-mono break-all selection:bg-violet-500/30">
              {c.contact_info || 'Not Available'}
            </span>
          ) 
        },
        {
          label: 'Official Website',
          value: (c: CollegeWithRelations) => (
            <a 
              href={c.website_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-bold text-violet-400 hover:text-violet-300 hover:underline inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Visit Portal</span>
              <ArrowRight className="h-3 w-3" />
            </a>
          )
        }
      ]
    },
    {
      section: 'Entrance Exams & Timelines',
      items: [
        { 
          label: 'Entrance Exam Name & Pattern', 
          value: (c: CollegeWithRelations) => c.entranceExam?.pattern 
            ? `${c.entranceExam.pattern} (${c.entranceExam.level || 'Institute Level'})` 
            : 'Direct Admission / No Exam required' 
        },
        { 
          label: 'Exam Syllabus Focus', 
          value: (c: CollegeWithRelations) => c.entranceExam?.syllabus || '—' 
        },
        { 
          label: 'Exam Registration Fee', 
          value: (c: CollegeWithRelations) => c.applicationFee || '—' 
        },
        { 
          label: 'Exam Timeline / Cycles', 
          value: (c: CollegeWithRelations) => c.examDates || '—' 
        },
        {
          label: 'Fast-Track Admissions',
          value: (c: CollegeWithRelations) => c.fastTrackDetails || (c.fastTrack ? 'Direct admissions options available' : '—')
        }
      ]
    },
    {
      section: 'Academics & Operations',
      items: [
        {
          label: 'Curriculum Core',
          value: (c: CollegeWithRelations) => (
            <div className="text-xs text-neutral-300 leading-relaxed font-medium flex items-start gap-1.5">
              <BookOpen className="h-4 w-4 text-violet-400 shrink-0 mt-0.5" />
              <span>{c.curriculum_summary || 'General Applied Computer Science'}</span>
            </div>
          )
        },
        {
          label: 'Year 1 Syllabus',
          value: (c: CollegeWithRelations) => c.year_1_curriculum || '—'
        },
        {
          label: 'Year 2 Syllabus',
          value: (c: CollegeWithRelations) => c.year_2_curriculum || '—'
        },
        {
          label: 'Year 3 Syllabus',
          value: (c: CollegeWithRelations) => c.year_3_curriculum || '—'
        },
        {
          label: 'Year 4 Syllabus',
          value: (c: CollegeWithRelations) => c.year_4_curriculum || '—'
        },
        {
          label: 'Key Tag Highlights',
          value: (c: CollegeWithRelations) => (
            <div className="flex flex-wrap gap-1.5">
              {c.tags?.map((tag, idx) => (
                <span key={idx} className="tag-badge bg-white/5 border border-white/10 text-[9px] font-bold text-neutral-400 rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )
        },
      ]
    },
    {
      section: 'Human Capital',
      items: [
        {
          label: 'Founders & Leadership',
          value: (c: CollegeWithRelations) => (
            <div className="space-y-3.5">
              {c.founders && c.founders.length > 0 ? (
                c.founders.map((f, idx) => (
                  <div key={idx} className="text-xs border-l border-white/10 pl-3 py-0.5">
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>{f.name}</span>
                      {f.linkedin_url && f.linkedin_url !== 'none' && (
                        <a 
                          href={f.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center text-neutral-500 hover:text-violet-400 transition-colors duration-200 ml-1.5"
                          title="LinkedIn Profile"
                        >
                          <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                    <div className="text-neutral-400 text-[11px] leading-snug mt-1">{f.background_info || 'Technology Entrepreneur'}</div>
                  </div>
                ))
              ) : (
                <span className="text-xs text-neutral-600 italic">Not Scraped</span>
              )}
            </div>
          )
        },
        {
          label: 'Key Mentors & Faculty',
          value: (c: CollegeWithRelations) => (
            <div className="space-y-2">
              {c.instructors && c.instructors.length > 0 ? (
                c.instructors.map((inst, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300 leading-snug">
                    <User className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white font-semibold">{inst.name}</strong>
                      {inst.company_background && (
                        <span className="text-neutral-500 text-[11px]"> ({inst.company_background})</span>
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <span className="text-xs text-neutral-600 italic">Not Scraped</span>
              )}
            </div>
          )
        },
      ]
    },
    {
      section: 'External Ratings',
      items: [
        {
          label: 'Rating Summary',
          value: (c: CollegeWithRelations) => (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-sm font-bold text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{getRatingString(c.reviews)}</span>
              </div>
              {c.reviews && c.reviews.length > 0 && (
                <p className="text-[11px] text-neutral-400 leading-relaxed italic border-t border-white/5 pt-1.5">
                  "{c.reviews[0].review_text}"
                </p>
              )}
            </div>
          )
        }
      ]
    }
  ];

  return (
    <div className="w-full overflow-x-auto bg-neutral-950/20 border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-md">
      <table className="w-full border-collapse text-left min-w-[800px]">
        {/* Table Columns Header */}
        <thead>
          <tr className="border-b border-white/10 bg-neutral-950/40">
            <th className="p-6 text-xs font-bold text-neutral-400 w-1/4 select-none uppercase tracking-widest pl-6">Comparison Parameter</th>
            {colleges.map((c) => (
              <th key={c.id} className="p-6 w-1/4 border-l border-white/5 bg-neutral-950/30">
                <div className="flex flex-col justify-between h-full min-h-[110px]">
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight leading-snug">{c.name}</h4>
                    <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-semibold block mt-1">
                      {c.location?.split(',')[0]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <Link
                      href={`/college/${c.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 px-3.5 py-1.5 text-[11px] font-bold text-neutral-200 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                    >
                      <span>View Details</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                    <button
                      onClick={() => onRemove(c.id)}
                      className="rounded-full bg-red-500/5 hover:bg-red-500/15 p-2 text-red-400/80 hover:text-red-400 border border-red-500/10 hover:border-red-500/35 transition-all duration-300 active:scale-95"
                      title="Remove College"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </th>
            ))}
            {/* If less than 3 colleges, fill with blanks */}
            {Array.from({ length: Math.max(0, 3 - colleges.length) }).map((_, idx) => (
              <th key={`empty-header-${idx}`} className="p-6 text-center text-xs font-medium text-neutral-600 border-l border-white/5 w-1/4 bg-neutral-950/10 border-dashed border-white/5">
                <div className="flex flex-col items-center justify-center py-6 select-none opacity-60">
                  <div className="h-8 w-8 rounded-full border border-dashed border-neutral-700 flex items-center justify-center text-neutral-600 mb-2 font-bold text-sm">+</div>
                  <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Empty Slot</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((section, secIdx) => (
            <React.Fragment key={secIdx}>
              {/* Section Separator */}
              <tr className="bg-neutral-950/50 border-b border-white/5">
                <td colSpan={4} className="p-3 text-[10px] font-bold uppercase tracking-widest text-violet-400 pl-6 border-b border-white/5">
                  {section.section}
                </td>
              </tr>
              {section.items.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-5 text-xs font-bold text-neutral-400 pl-6 border-b border-white/5">{row.label}</td>
                  {colleges.map((c) => {
                    const value = row.value(c);
                    const isHighlight = 'highlight' in row && row.highlight;
                    return (
                      <td
                        key={c.id}
                        className={`p-5 text-xs border-l border-b border-white/5 ${
                          isHighlight ? 'font-bold text-emerald-300 bg-emerald-500/5' : 'text-neutral-200'
                        }`}
                      >
                        {typeof value === 'string' && isHighlight ? (
                          <span className="flex items-center gap-1">
                            <IndianRupee className="h-3.5 w-3.5 text-emerald-400" />
                            {value.replace('₹', '')}
                          </span>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                  {/* Padding cells */}
                  {Array.from({ length: Math.max(0, 3 - colleges.length) }).map((_, idx) => (
                    <td key={`empty-cell-${idx}`} className="p-5 border-l border-b border-white/5 bg-neutral-950/10 text-neutral-600 text-xs italic text-center select-none">
                      —
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
