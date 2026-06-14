'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, MapPin, IndianRupee, GraduationCap, Globe, 
  Mail, ShieldAlert, Award, Star, BookOpen, Users, Compass, 
  ExternalLink, Calendar, Download, CheckCircle2, FileText, Zap,
  MessageSquare, Clock, Laptop, Play, BookmarkCheck, ArrowRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { MOCK_COLLEGES } from '@/lib/mockData';

interface Founder {
  id?: string;
  name: string;
  background_info?: string;
  linkedin_url?: string;
}

interface Instructor {
  id?: string;
  name: string;
  company_background?: string;
}

interface Review {
  id?: string;
  rating: number;
  review_text: string;
  source_url?: string;
}

interface CollegeFull {
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
  founders?: Founder[];
  instructors?: Instructor[];
  reviews?: Review[];
  // Shifted deep dive fields
  industryMentors?: string;
  financingOptions?: string;
  entranceExam?: {
    pattern?: string;
    level?: string;
    syllabus?: string;
  };
  studentClubs?: string[];
  rating_breakdown?: {
    curriculum: number;
    placements: number;
    faculty: number;
    campus: number;
  };
  examDates?: string;
  applicationFee?: string;
  fastTrackDetails?: string;
  apply_url?: string;
  campus_tour_url?: string;
}

const parseFee = (feeStr: string) => {
  if (!feeStr) return { main: 'TBD', details: '' };
  
  // Find the first index of '('
  const parenIdx = feeStr.indexOf('(');
  if (parenIdx !== -1) {
    let main = feeStr.substring(0, parenIdx).trim();
    let details = feeStr.substring(parenIdx).trim();
    
    // If the details is completely wrapped in parentheses, strip them
    if (details.startsWith('(') && details.endsWith(')')) {
      details = details.substring(1, details.length - 1).trim();
    }
    
    // Strip all ₹ from main
    main = main.replace(/₹/g, '').trim();
    return { main, details };
  }
  
  let main = feeStr.trim().replace(/₹/g, '');
  return { main, details: '' };
};

export default function CollegeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [college, setCollege] = useState<CollegeFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'founders' | 'faculty'>('curriculum');
  const [isDemo, setIsDemo] = useState(false);

  // Scholarship Estimator State
  const [scoreType, setScoreType] = useState<'jee' | 'board'>('jee');
  const [scoreVal, setScoreVal] = useState(90);

  useEffect(() => {
    async function loadCollegeDetails() {
      if (!id) return;
      setLoading(true);

      // Handle mock / demo fallback IDs
      if (String(id).startsWith('mock-') || !isSupabaseConfigured()) {
        const mockIdx = parseInt(String(id).replace('mock-', ''), 10);
        const mockValues = Object.values(MOCK_COLLEGES);
        const match = mockValues[isNaN(mockIdx) ? 0 : mockIdx % mockValues.length];
        
        if (match) {
          setCollege({ ...match, id: String(id) });
          setIsDemo(true);
        }
        setLoading(false);
        return;
      }

      try {
        // Query college row
        const { data: collegeData, error: colError } = await supabase
          .from('colleges')
          .select('*')
          .eq('id', id)
          .single();

        if (colError) throw colError;

        if (collegeData) {
          // Query related founders, instructors, and reviews
          const { data: founders } = await supabase.from('founders').select('*').eq('college_id', id);
          const { data: instructors } = await supabase.from('instructors').select('*').eq('college_id', id);
          const { data: reviews } = await supabase.from('reviews').select('*').eq('college_id', id);

          const cleanName = (n: string) => n.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim();
          const mockMatch = Object.values(MOCK_COLLEGES).find((m: any) => {
            const cleanM = cleanName(m.name);
            const cleanC = cleanName(collegeData.name);
            return cleanM === cleanC || cleanM.includes(cleanC) || cleanC.includes(cleanM);
          });

          setCollege({
            ...mockMatch,
            ...collegeData,
            founders: founders || [],
            instructors: instructors || [],
            reviews: reviews || []
          });
          setIsDemo(false);
        }
      } catch (err: any) {
        console.warn("DB error, trying mock fallback matching by name:", err.message);
        const match = Object.values(MOCK_COLLEGES).find(c => c.name.toLowerCase().includes(String(id).toLowerCase()));
        if (match) {
          setCollege({ ...match, id: String(id) });
          setIsDemo(true);
        } else {
          setCollege(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadCollegeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 min-h-[60vh]">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin border-4 border-violet-500 border-t-transparent rounded-full" />
          <div className="absolute h-10 w-10 animate-ping border-2 border-emerald-500/20 rounded-full" />
        </div>
        <p className="text-neutral-400 text-sm mt-6 font-semibold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-emerald-400">
          Decrypting College Profile...
        </p>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="mx-auto max-w-xl text-center py-20 px-4">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">College Record Not Found</h2>
        <p className="text-neutral-400 text-sm mb-6 font-light">
          The requested institution could not be located in our active index files or Supabase tables.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 px-6 py-3 text-xs font-bold text-white transition-all shadow-lg shadow-violet-900/20 hover:scale-105 duration-200">
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Directory</span>
        </Link>
      </div>
    );
  }

  // Calculate stats robustly with fallback options
  const getPageAvgRating = () => {
    if (college.reviews && college.reviews.length > 0) {
      return (college.reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / college.reviews.length).toFixed(1);
    }
    const rb = college.rating_breakdown;
    if (rb) {
      return ((rb.curriculum + rb.placements + rb.faculty + rb.campus) / 4).toFixed(1);
    }
    // Stable hash-based rating fallback
    let hash = 0;
    const str = college.name || college.id || '';
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const min = 4.2;
    const max = 4.7;
    const val = min + (Math.abs(hash) % 100) * (max - min) / 100;
    return val.toFixed(1);
  };

  const avgRating = getPageAvgRating();

  // Competitor Helper
  const getCompetitors = () => {
    const cName = college.name.toLowerCase();
    const entries = Object.entries(MOCK_COLLEGES);
    let names: string[] = [];
    if (cName.includes('scaler')) {
      names = ['Newton School of Technology (NST)', 'Polaris School of Technology (PST)'];
    } else if (cName.includes('newton')) {
      names = ['Scaler School of Technology (SST)', 'Polaris School of Technology (PST)'];
    } else if (cName.includes('polaris')) {
      names = ['Scaler School of Technology (SST)', 'Newton School of Technology (NST)'];
    } else if (cName.includes('zenith')) {
      names = ['Newton School of Technology (NST)', 'Tensor School of CS and AI'];
    } else if (cName.includes('tensor')) {
      names = ['Zenith School of AI', 'Newton School of Technology (NST)'];
    } else if (cName.includes('vedam')) {
      names = ['Veloces Campus', 'Physics Wallah Institute of Innovation (PW IOI)'];
    } else if (cName.includes('pw') || cName.includes('physics wallah')) {
      names = ['Scaler School of Technology (SST)', 'Vedam School of Technology'];
    } else {
      names = ['Scaler School of Technology (SST)', 'Newton School of Technology (NST)'];
    }
    return entries
      .filter(([key, val]) => names.includes(val.name))
      .map(([key, val]) => ({ ...val, id: key }));
  };

  // Timeline Step Generator
  const getAdmissionsSteps = () => {
    const exam = college.entranceExam?.pattern || 'Online Screening Aptitude Test';
    const dates = college.examDates || 'Ongoing through July 2026';
    const fee = college.applicationFee || '₹1,000';
    const bypass = college.fastTrackDetails || '';

    return [
      {
        title: 'Step 1: Application Form',
        desc: `Fill online registration form and pay application fee of <strong>${fee}</strong> before deadlines.`,
        icon: '📝'
      },
      {
        title: `Step 2: Take Entrance Exam`,
        desc: `Appear for the screening evaluation. Pattern: <strong>${exam}</strong>. Dates: <strong>${dates}</strong>.`,
        icon: '⏱️'
      },
      ...(bypass ? [{
        title: 'JEE / SAT Fast-Track Bypass',
        desc: `Bypass threshold: <strong>${bypass}</strong> (Skip test stage and go straight to personal interview).`,
        icon: '⚡'
      }] : []),
      {
        title: 'Step 3: 1:1 Personal Interview',
        desc: 'Evaluation interview with software experts, academics, or founding consortium members.',
        icon: '👥'
      },
      {
        title: 'Step 4: Admission Offer',
        desc: 'Receive confirmation and merit-based scholarship allocations within 7 working days.',
        icon: '🎉'
      }
    ];
  };

  // Scholarship Calculator Calculation
  const calculateScholarship = () => {
    let feeLakhs = 18;
    const fStr = (college.fees || '').toLowerCase();
    const feeMatch = fStr.match(/₹?(\d+\.?\d*)\s*(?:lakhs?|l)/i);
    if (feeMatch) {
      feeLakhs = parseFloat(feeMatch[1]);
    }

    let discountPct = 0;
    if (scoreType === 'jee') {
      if (scoreVal >= 98) discountPct = 25;
      else if (scoreVal >= 95) discountPct = 15;
      else if (scoreVal >= 90) discountPct = 8;
    } else {
      if (scoreVal >= 95) discountPct = 20;
      else if (scoreVal >= 90) discountPct = 12;
      else if (scoreVal >= 85) discountPct = 5;
    }

    if (college.name.includes('Zenith') && discountPct > 0) discountPct += 5;
    if (college.name.includes('CodingGita')) discountPct = Math.min(discountPct, 10);

    const discountAmount = (feeLakhs * (discountPct / 100));
    const revisedTuition = feeLakhs - discountAmount;
    
    const P = revisedTuition * 100000;
    const R = (9.5 / 12) / 100;
    const N = 5 * 12;
    const emi = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);

    return {
      discountPct,
      savingsLakhs: discountAmount.toFixed(1),
      revisedLakhs: revisedTuition.toFixed(1),
      monthlyEmi: Math.round(emi)
    };
  };

  const est = calculateScholarship();

  const triggerChatbotQuery = (queryText: string) => {
    const event = new CustomEvent('trigger-chatbot-query', { detail: queryText });
    window.dispatchEvent(event);
  };

  const getClubTheme = (clubName: string) => {
    const name = clubName.toLowerCase();
    
    // Women in Tech
    if (name.includes('women') || name.includes('female')) {
      return {
        icon: '👩‍💻',
        bg: 'from-pink-500/10 to-rose-500/10',
        border: 'border-pink-500/20 group-hover:border-pink-500/40',
        text: 'text-pink-400 group-hover:text-pink-300'
      };
    }
    
    // AI/ML
    if (
      name.includes('ai') || 
      name.includes('ml') || 
      name.includes('net') || 
      name.includes('model') || 
      name.includes('neural') || 
      name.includes('deep learning') || 
      name.includes('generative') || 
      name.includes('sentient') || 
      name.includes('tensor')
    ) {
      return {
        icon: '🧠',
        bg: 'from-violet-500/10 to-purple-500/10',
        border: 'border-violet-500/20 group-hover:border-violet-500/40',
        text: 'text-violet-400 group-hover:text-violet-300'
      };
    }
    
    // Robotics/Drones
    if (name.includes('robot') || name.includes('drone') || name.includes('droid') || name.includes('hardware')) {
      return {
        icon: '🤖',
        bg: 'from-rose-500/10 to-red-500/10',
        border: 'border-rose-500/20 group-hover:border-rose-500/40',
        text: 'text-rose-400 group-hover:text-rose-300'
      };
    }
    
    // Code/Developer
    if (
      name.includes('code') || 
      name.includes('dev') || 
      name.includes('hacks') || 
      name.includes('program') || 
      name.includes('software') || 
      name.includes('git') || 
      name.includes('open source') || 
      name.includes('contributor') || 
      name.includes('algo')
    ) {
      return {
        icon: '💻',
        bg: 'from-blue-500/10 to-cyan-500/10',
        border: 'border-blue-500/20 group-hover:border-blue-500/40',
        text: 'text-blue-400 group-hover:text-blue-300'
      };
    }
    
    // Entrepreneurship/Startups
    if (
      name.includes('entrepreneur') || 
      name.includes('startup') || 
      name.includes('e-cell') || 
      name.includes('venture') || 
      name.includes('business') || 
      name.includes('incubator') || 
      name.includes('scale') || 
      name.includes('product') || 
      name.includes('placement')
    ) {
      return {
        icon: '🚀',
        bg: 'from-amber-500/10 to-orange-500/10',
        border: 'border-amber-500/20 group-hover:border-amber-500/40',
        text: 'text-amber-400 group-hover:text-amber-300'
      };
    }
    
    // Sports/Fitness
    if (name.includes('sports') || name.includes('fitness') || name.includes('athletic') || name.includes('recreation') || name.includes('wellness') || name.includes('physical')) {
      return {
        icon: '⚽',
        bg: 'from-emerald-500/10 to-green-500/10',
        border: 'border-emerald-500/20 group-hover:border-emerald-500/40',
        text: 'text-emerald-400 group-hover:text-emerald-300'
      };
    }
    
    // Media/Content
    if (
      name.includes('media') || 
      name.includes('content') || 
      name.includes('creator') || 
      name.includes('photo') || 
      name.includes('video') || 
      name.includes('design') || 
      name.includes('creative') || 
      name.includes('arts')
    ) {
      return {
        icon: '📸',
        bg: 'from-cyan-500/10 to-sky-500/10',
        border: 'border-cyan-500/20 group-hover:border-cyan-500/40',
        text: 'text-cyan-400 group-hover:text-cyan-300'
      };
    }
    
    // Orators/Debating
    if (
      name.includes('orator') || 
      name.includes('debate') || 
      name.includes('debating') || 
      name.includes('connect') || 
      name.includes('comm') || 
      name.includes('speak') || 
      name.includes('talk') || 
      name.includes('drama')
    ) {
      return {
        icon: '🎙️',
        bg: 'from-orange-500/10 to-amber-500/10',
        border: 'border-orange-500/20 group-hover:border-orange-500/40',
        text: 'text-orange-400 group-hover:text-orange-300'
      };
    }
    
    // Consulting/Finance
    if (
      name.includes('consult') || 
      name.includes('finance') || 
      name.includes('invest') || 
      name.includes('trading') || 
      name.includes('analyt') || 
      name.includes('market') || 
      name.includes('strategy') || 
      name.includes('management') || 
      name.includes('capital')
    ) {
      return {
        icon: '📊',
        bg: 'from-teal-500/10 to-emerald-500/10',
        border: 'border-teal-500/20 group-hover:border-teal-500/40',
        text: 'text-teal-400 group-hover:text-teal-300'
      };
    }
    
    // Cultural/Arts/Drama
    if (
      name.includes('cultural') || 
      name.includes('performing') || 
      name.includes('dance') || 
      name.includes('music') || 
      name.includes('band') || 
      name.includes('vibe') || 
      name.includes('society') || 
      name.includes('club') || 
      name.includes('association') || 
      name.includes('partner')
    ) {
      return {
        icon: '🎭',
        bg: 'from-fuchsia-500/10 to-pink-500/10',
        border: 'border-fuchsia-500/20 group-hover:border-fuchsia-500/40',
        text: 'text-fuchsia-400 group-hover:text-fuchsia-300'
      };
    }
    
    // Default
    return {
      icon: '🎪',
      bg: 'from-neutral-500/10 to-neutral-400/10',
      border: 'border-neutral-500/20 group-hover:border-neutral-500/40',
      text: 'text-neutral-300 group-hover:text-white'
    };
  };

  return (
    <div className="w-full pb-20 bg-[#030303] text-slate-100">
      
      {/* College Banner Hero (Immersive Cinematic Frame) */}
      <section className="relative w-full overflow-hidden border-b border-white/10 bg-neutral-950 py-16 sm:py-24">
        {/* Background Grid Pattern & Radial Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Blurred Background Image */}
        <div className="absolute inset-0 -z-10 opacity-20 blur-md transition-all duration-700 hover:scale-105">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={college.image_url} 
            alt="" 
            className="w-full h-full object-cover"
            onError={(e) => {
              const name = college.name.toLowerCase();
              let fallback = 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600';
              if (name.includes('scaler')) fallback = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600';
              if (name.includes('polar')) fallback = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600';
              if (name.includes('nxtwave')) fallback = 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=600';
              if (name.includes('zenith')) fallback = 'https://images.unsplash.com/photo-1558021211-6d1403321394?q=80&w=600';
              if (name.includes('tensor')) fallback = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600';
              if (name.includes('mirai')) fallback = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600';
              if (name.includes('blocks') || name.includes('cbsot')) fallback = 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=600';
              if (name.includes('vedam')) fallback = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600';
              if (name.includes('bosscoder')) fallback = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600';
              if (name.includes('upgrad')) fallback = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600';
              if (name.includes('stellar')) fallback = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600';
              if (name.includes('alta')) fallback = 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=600';
              if (name.includes('intel')) fallback = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600';
              e.currentTarget.src = fallback;
            }}
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>
 
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-neutral-300 hover:text-white transition-all backdrop-blur-md mb-8 hover:-translate-x-1 duration-200"
          >
            <ArrowLeft className="h-4 w-4 text-violet-400" />
            <span>Back to Index</span>
          </Link>
  
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2.5">
                <span className="tag-badge bg-violet-600/10 text-violet-300 border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                  {college.degree_partner ? 'Affiliated B.Tech' : 'Direct Certificate'}
                </span>
                {isDemo && (
                  <span className="tag-badge bg-amber-600/10 text-amber-300 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    Verified Seed
                  </span>
                )}
                {college.fastTrackDetails && (
                  <span className="tag-badge bg-emerald-600/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    ⚡ Fast-Track / Waiver
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
                  {college.name}
                </span>
              </h1>
  
              <div className="flex flex-wrap items-center gap-y-3 gap-x-8 text-sm text-neutral-300 pt-1">
                <div className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-xl px-3.5 py-1.5 backdrop-blur-sm">
                  <MapPin className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  <span className="font-medium">{college.location}</span>
                </div>
                {college.degree_partner && (
                  <div className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-xl px-3.5 py-1.5 backdrop-blur-sm">
                    <GraduationCap className="h-4.5 w-4.5 text-violet-400 shrink-0" />
                    <span>Degree Partner: <strong className="text-white font-semibold">{college.degree_partner}</strong></span>
                  </div>
                )}
              </div>
            </div>
  
            <div className="flex flex-wrap items-center gap-4 shrink-0 w-full lg:w-auto">
              <a
                href={college.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-emerald-500 hover:from-violet-500 hover:to-emerald-400 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-violet-900/10 hover:shadow-violet-900/30 transition-all hover:scale-105 active:scale-95 duration-200 border border-white/10"
              >
                <span>Visit College Website</span>
                <Globe className="h-4.5 w-4.5" />
              </a>
  
              {college.brochureUrl && (
                <a
                  href={college.brochureUrl}
                  {...(!college.brochureUrl.startsWith('http') ? { download: true } : {})}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 duration-200 backdrop-blur-sm border ${
                    (college.name.toLowerCase().includes('anantam') || college.name.toLowerCase().includes('codinggita') || college.name.toLowerCase().includes('gita'))
                      ? 'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                      : 'border-white/10 bg-white/5 hover:bg-white/10 text-slate-200'
                  }`}
                  title={(college.name.toLowerCase().includes('anantam') || college.name.toLowerCase().includes('codinggita') || college.name.toLowerCase().includes('gita')) ? "Download Student Agreement" : "Download PDF Brochure"}
                >
                  <span>{(college.name.toLowerCase().includes('anantam') || college.name.toLowerCase().includes('codinggita') || college.name.toLowerCase().includes('gita')) ? "Download Student Agreement" : "Download Brochure"}</span>
                  <Download className={`h-4.5 w-4.5 ${
                    (college.name.toLowerCase().includes('anantam') || college.name.toLowerCase().includes('codinggita') || college.name.toLowerCase().includes('gita'))
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`} />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
  
      {/* Main Grid Content */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Columns (Tabs Switcher Area) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tab switch control (Segmented Control Layout) */}
            <div className="border border-white/10 rounded-2xl overflow-hidden shadow-2xl bg-neutral-900/30 backdrop-blur-md">
              <div className="flex flex-nowrap overflow-x-auto scrollbar-none border-b border-white/10 p-1.5 gap-1.5 bg-neutral-950/40">
                {[
                  { id: 'curriculum', label: 'Curriculum Core', icon: BookOpen },
                  { id: 'founders', label: 'Founders & Leadership', icon: Users },
                  { id: 'faculty', label: 'Industry Mentors', icon: Award },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 shrink-0 flex items-center justify-center gap-2.5 py-3.5 px-3 text-xs sm:text-sm font-bold transition-all rounded-xl border outline-none ${
                        isActive
                          ? 'bg-neutral-950 border-white/10 text-white shadow-xl shadow-black/40'
                          : 'bg-transparent border-transparent text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`h-4 w-4 transition-transform ${isActive ? 'text-violet-400 scale-110' : 'text-neutral-500'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
  
              {/* Tab Content body */}
              <div className="p-6 sm:p-8 bg-neutral-900/20">
                
                {/* 1. CURRICULUM */}
                {activeTab === 'curriculum' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <Compass className="h-5.5 w-5.5 text-violet-400" />
                      <span>Program Outline & Methodology</span>
                    </h3>
                    
                    <div className="border-l border-white/10 pl-4 py-1 space-y-4">
                      {college.curriculum_summary?.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx} className="text-sm text-neutral-300 leading-relaxed font-light">
                          {para}
                        </p>
                      ))}
                    </div>
                    
                    {/* Premium Year-Wise Curriculum Roadmap */}
                    <div className="mt-10 space-y-6">
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-neutral-400 mb-6 flex items-center gap-2">
                        <FileText className="h-4.5 w-4.5 text-emerald-400" />
                        <span>Syllabus Breakdown</span>
                      </h4>
                      
                      <div className="grid grid-cols-1 gap-5">
                        {college.year_1_curriculum && (
                          <div className="group relative p-5 rounded-2xl border border-violet-500/10 bg-gradient-to-br from-violet-600/5 to-transparent hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-violet-900/10">
                            <div className="flex items-center gap-3">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/10 border border-violet-500/20 text-xs font-black text-violet-400">01</span>
                              <h4 className="text-xs font-black text-violet-400 uppercase tracking-widest">Year 1 Syllabus</h4>
                            </div>
                            <p className="text-xs text-neutral-300 mt-3 leading-relaxed font-light">
                              {college.year_1_curriculum}
                            </p>
                          </div>
                        )}
                        
                        {college.year_2_curriculum && (
                          <div className="group relative p-5 rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-emerald-600/5 to-transparent hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-emerald-900/10">
                            <div className="flex items-center gap-3">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/10 border border-emerald-500/20 text-xs font-black text-emerald-400">02</span>
                              <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest">Year 2 Syllabus</h4>
                            </div>
                            <p className="text-xs text-neutral-300 mt-3 leading-relaxed font-light">
                              {college.year_2_curriculum}
                            </p>
                          </div>
                        )}
                        
                        {college.year_3_curriculum && (
                          <div className="group relative p-5 rounded-2xl border border-blue-500/10 bg-gradient-to-br from-blue-600/5 to-transparent hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-blue-900/10">
                            <div className="flex items-center gap-3">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-xs font-black text-blue-400">03</span>
                              <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest">Year 3 Syllabus</h4>
                            </div>
                            <p className="text-xs text-neutral-300 mt-3 leading-relaxed font-light">
                              {college.year_3_curriculum}
                            </p>
                          </div>
                        )}
                        
                        {college.year_4_curriculum && (
                          <div className="group relative p-5 rounded-2xl border border-amber-500/10 bg-gradient-to-br from-amber-600/5 to-transparent hover:border-amber-500/30 transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-amber-900/10">
                            <div className="flex items-center gap-3">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600/10 border border-amber-500/20 text-xs font-black text-amber-400">04</span>
                              <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">Year 4 Syllabus</h4>
                            </div>
                            <p className="text-xs text-neutral-300 mt-3 leading-relaxed font-light">
                              {college.year_4_curriculum}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
  
                {/* 2. FOUNDERS */}
                {activeTab === 'founders' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <Users className="h-5.5 w-5.5 text-violet-400" />
                      <span>College Leadership & Directors</span>
                    </h3>
                    
                    {college.founders && college.founders.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {college.founders.map((f, idx) => (
                          <div key={idx} className="group rounded-2xl border border-white/5 bg-neutral-900/30 p-5 flex flex-col justify-between hover:border-white/10 transition-all duration-300 hover:shadow-xl">
                            <div>
                              <h4 className="font-extrabold text-white text-base group-hover:text-violet-400 transition-colors">{f.name}</h4>
                              <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed font-light">
                                {f.background_info || "Educational pioneer and technology industry executive."}
                              </p>
                            </div>
                            
                            {f.linkedin_url && f.linkedin_url !== 'none' ? (
                              <a
                                href={f.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-white transition-all hover:translate-x-1 duration-200"
                              >
                                <svg className="h-4 w-4 shrink-0 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span>Connect on LinkedIn</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            ) : (
                              <span className="mt-5 inline-flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                                <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
                                No active LinkedIn presence
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-400 italic">Leadership information not indexed yet.</p>
                    )}
                  </div>
                )}
  
                {/* 3. FACULTY / MENTORS */}
                {activeTab === 'faculty' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                      <Award className="h-5.5 w-5.5 text-violet-400" />
                      <span>Instructors & Mentoring Lineup</span>
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                      Students are trained directly by active tech developers and senior leaders from global tier-1 firms rather than pure academic lecturers.
                    </p>
  
                    {college.instructors && college.instructors.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {college.instructors.map((inst, idx) => (
                          <div key={idx} className="group rounded-2xl border border-white/5 bg-neutral-900/30 p-4.5 flex items-center gap-4 hover:border-white/10 transition-all duration-300">
                            <div className="h-11 w-11 shrink-0 rounded-xl bg-gradient-to-tr from-violet-600/20 to-emerald-500/20 border border-violet-500/30 flex items-center justify-center text-white font-extrabold text-base uppercase">
                              {inst.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-extrabold text-white text-sm truncate">{inst.name}</h4>
                              <span className="inline-block text-[10px] font-extrabold text-emerald-400 uppercase tracking-wide mt-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 max-w-full truncate">
                                {inst.company_background || 'FAANG Practitioner'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-400 italic">Mentorship lineup not indexed yet.</p>
                    )}
  
                    {/* Industry Mentors Overview Alert Card */}
                    {college.industryMentors && (
                      <div className="mt-8 border-t border-white/5 pt-6">
                        <h4 className="text-sm font-extrabold text-white mb-3.5 flex items-center gap-2.5 uppercase tracking-wider">
                          <Award className="h-4.5 w-4.5 text-amber-400" />
                          <span>Industry Mentors Overview</span>
                        </h4>
                        <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 px-5 py-4">
                           <p className="text-xs text-amber-200 font-semibold leading-relaxed">{college.industryMentors}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
 
            {/* Visual Admissions Step-by-Step Roadmap */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl bg-neutral-900/30 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Calendar className="h-5.5 w-5.5 text-violet-400" />
                <span>Admissions Process & Roadmap</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {getAdmissionsSteps().map((step, idx) => (
                  <div key={idx} className="group relative p-5 rounded-2xl border border-white/5 bg-neutral-900/40 flex gap-4 overflow-hidden hover:border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl">
                    <span className="absolute right-4 bottom-2 text-7xl font-black text-white/[0.02] select-none pointer-events-none group-hover:text-white/[0.04] transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-3xl shrink-0 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">{step.icon}</span>
                    <div className="space-y-1 z-10">
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">{step.title}</h4>
                      <p className="text-xs text-neutral-400 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: step.desc }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Student Clubs visual layout */}
            {college.studentClubs && college.studentClubs.length > 0 && (
              <div className="glass-panel border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl bg-neutral-900/30 backdrop-blur-md space-y-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2.5">
                  <Compass className="h-5.5 w-5.5 text-violet-400" />
                  <span>Campus Life & Student Clubs</span>
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-light">
                  Participate in student-run societies, technical chapters, and interest groups to build your network.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
                  {college.studentClubs.map((club, idx) => {
                    const theme = getClubTheme(club);
                    return (
                      <div
                        key={idx}
                        className={`group p-4 rounded-2xl border ${theme.border} bg-gradient-to-br ${theme.bg} hover:scale-105 transition-all duration-300 flex items-center gap-3.5 shadow-lg backdrop-blur-sm`}
                      >
                        <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{theme.icon}</span>
                        <span className={`text-xs font-bold ${theme.text} transition-colors truncate`}>{club}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
 
            {/* Quick AI Advisor Prompts */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl bg-neutral-900/30 backdrop-blur-md space-y-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-violet-400" />
                <span>Ask our AI Advisor about {college.name.split(' (')[0]}</span>
              </h3>
              <p className="text-xs text-neutral-500 font-light">Click any of the questions below to trigger the Advisor Bot instantly.</p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {[
                  `What are the fees for ${college.name.split(' (')[0]}?`,
                  `Who founded ${college.name.split(' (')[0]}?`,
                  `What laptop is provided by ${college.name.split(' (')[0]}?`,
                  `Is there a placement guarantee for ${college.name.split(' (')[0]}?`
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => triggerChatbotQuery(prompt)}
                    className="tag-badge bg-white/5 hover:bg-violet-600/10 border border-white/10 hover:border-violet-500/30 text-xs text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer shadow-sm hover:shadow-violet-950/20 active:scale-95"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
  
          {/* Right Column (Sidebar Specs & Reviews) */}
          <div className="space-y-8">
            
            {/* Quick specifications */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl bg-neutral-900/30 backdrop-blur-md space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-white/10 pb-3 flex items-center gap-2">
                <BookmarkCheck className="h-4.5 w-4.5 text-violet-400" />
                <span>Program Specifications</span>
              </h3>
              
              <div className="space-y-4 text-sm">
                {(() => {
                  const { main, details } = parseFee(college.fees || '');
                  return (
                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-extrabold">Total Academic Fee</span>
                      <span className="flex items-center text-xl font-black text-emerald-400">
                        <IndianRupee className="h-5 w-5 shrink-0 mr-1 text-emerald-400" />
                        <span>{main}</span>
                      </span>
                      {details && (
                        <p className="text-[11px] text-neutral-400 leading-relaxed font-normal border-t border-white/5 pt-2 mt-1">
                          {details}
                        </p>
                      )}
                    </div>
                  );
                })()}
                
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-extrabold">Eligibility Requirements</span>
                  <span className="text-slate-200 font-medium block mt-1.5 leading-relaxed text-xs">{college.eligibility || '12th Pass'}</span>
                </div>
  
                {college.contact_info && (
                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-extrabold">Admissions Office</span>
                    <span className="flex items-center gap-2 text-slate-200 font-semibold mt-2 text-xs">
                      <Mail className="h-4 w-4 text-violet-400 shrink-0" />
                      <a href={`mailto:${college.contact_info}`} className="hover:underline hover:text-violet-300 transition-colors truncate">{college.contact_info}</a>
                    </span>
                  </div>
                )}
  
                {/* Financing Options - Glowing Active Banner */}
                {college.financingOptions && (
                  <div className="border-t border-white/10 pt-4.5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block font-extrabold mb-2">Financing & EMI Options</span>
                    <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 shadow-lg shadow-emerald-950/20">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-emerald-300 leading-relaxed">{college.financingOptions}</span>
                    </div>
                  </div>
                )}
  

              </div>
            </div>
 
            {/* Scholarship Estimator Widget */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl bg-neutral-900/30 backdrop-blur-md space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-white/10 pb-3 flex items-center gap-2">
                <Zap className="h-4.5 w-4.5 text-amber-400" />
                <span>Scholarship Estimator</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-xl">
                  <button
                    onClick={() => { setScoreType('jee'); setScoreVal(90); }}
                    className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold border transition-all ${
                      scoreType === 'jee'
                        ? 'bg-neutral-900 border-white/10 text-white shadow-xl'
                        : 'bg-transparent border-transparent text-neutral-500 hover:text-white'
                    }`}
                  >
                    JEE Main
                  </button>
                  <button
                    onClick={() => { setScoreType('board'); setScoreVal(85); }}
                    className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold border transition-all ${
                      scoreType === 'board'
                        ? 'bg-neutral-900 border-white/10 text-white shadow-xl'
                        : 'bg-transparent border-transparent text-neutral-500 hover:text-white'
                    }`}
                  >
                    12th Board
                  </button>
                </div>
 
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-neutral-300">
                    <span>{scoreType === 'jee' ? 'JEE Percentile' : '12th Marks (%)'}</span>
                    <span className="text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">{scoreVal}%</span>
                  </div>
                  <input
                    type="range"
                    min={scoreType === 'jee' ? 80 : 70}
                    max="100"
                    value={scoreVal}
                    onChange={(e) => setScoreVal(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-white/5"
                  />
                </div>
 
                <div className="pt-4 border-t border-white/10 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-medium">Estimated Waiver:</span>
                    <span className="font-extrabold text-emerald-400">{est.discountPct}% Discount</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400 font-medium">Fee Saved:</span>
                    <span className="font-bold text-neutral-200">₹{est.savingsLakhs} Lakhs</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-neutral-400 font-medium">Revised Fee:</span>
                    <span className="font-extrabold text-white text-sm">₹{est.revisedLakhs} Lakhs</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-relaxed italic text-center px-2 pt-1">
                    * Disclaimer: This scholarship amount is estimated based on baseline criteria and may or may not be awarded by the respective college.
                  </p>
                </div>
              </div>
            </div>
  
            {/* Shifted Admissions & Entrance Exam */}
            {college.entranceExam && (college.entranceExam.pattern || college.entranceExam.level || college.entranceExam.syllabus) && (
              <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl bg-neutral-900/30 backdrop-blur-md space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-white/10 pb-3 flex items-center gap-2">
                  <Clock className="h-4.5 w-4.5 text-violet-400" />
                  <span>Admissions & Entrance Exam</span>
                </h3>
                <div className="space-y-4 text-xs">
                  {college.entranceExam.level && (
                    <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5">
                      <span className="text-[10px] uppercase text-neutral-500 block font-bold">Exam Level</span>
                      <span className="text-xs font-extrabold text-violet-300 block mt-1">{college.entranceExam.level}</span>
                    </div>
                  )}
                  {college.entranceExam.pattern && (
                    <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5">
                      <span className="text-[10px] uppercase text-neutral-500 block font-bold">Exam Pattern</span>
                      <span className="text-xs text-neutral-200 leading-relaxed block mt-1">{college.entranceExam.pattern}</span>
                    </div>
                  )}
                  {college.entranceExam.syllabus && (
                    <div className="p-3 rounded-xl bg-white/[0.01] border border-white/5">
                      <span className="text-[10px] uppercase text-neutral-500 block font-bold">Syllabus Overview</span>
                      <span className="text-xs text-neutral-300 leading-relaxed block mt-1">{college.entranceExam.syllabus}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
  
            {/* Student Reviews Timeline */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 shadow-2xl bg-neutral-900/30 backdrop-blur-md space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">
                  Student Reviews
                </h3>
                
                {avgRating && (
                  <div className="flex items-center gap-1 rounded bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-400 border border-amber-500/20 shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{avgRating} ★</span>
                  </div>
                )}
              </div>
  
              {college.reviews && college.reviews.length > 0 ? (
                <div className="space-y-4.5 max-h-[300px] overflow-y-auto pr-1">
                  {college.reviews.map((rev, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/5 bg-neutral-950/40 p-4 space-y-3 shadow-inner hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, starIdx) => (
                            <Star
                               key={starIdx}
                               className={`h-3.5 w-3.5 ${
                                 starIdx < Math.floor(rev.rating)
                                   ? 'text-amber-400 fill-current'
                                   : 'text-neutral-700'
                               }`}
                            />
                          ))}
                        </div>
                        {rev.source_url && (
                          <a
                            href={rev.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
                          >
                            <span>Source Link</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-neutral-300 font-light leading-relaxed italic">
                        &ldquo;{rev.review_text}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-neutral-400 italic">No external student reviews synced yet.</p>
              )}
            </div>
          </div>
        </div>
 
        {/* Similar Competitors Comparison Widget */}
        {getCompetitors().length > 0 && (
          <div className="mt-16 pt-10 border-t border-white/10">
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="h-6 w-6 text-violet-400" />
              <span>Compare with Direct Competitors</span>
            </h3>
            <p className="text-xs text-neutral-400 mb-8 font-light">Explore side-by-side alternatives offering similar tech specializations.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Subject College */}
              <div className="relative p-6 rounded-2xl border border-violet-500/40 bg-gradient-to-b from-violet-600/10 to-transparent space-y-5 shadow-2xl">
                <span className="absolute -top-3 left-6 rounded bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border border-violet-400/30">
                  Current View
                </span>
                
                <div>
                  <h4 className="font-extrabold text-white text-base mt-2">{college.name}</h4>
                </div>
                <div className="space-y-3 text-xs font-semibold text-neutral-300 border-t border-white/5 pt-4">
                  <p className="flex items-center gap-2">
                    <span className="text-neutral-500">📍 Location:</span>
                    <span>{college.location?.split(',')[0]}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-neutral-500">💸 Tuition Cost:</span>
                    <span className="text-emerald-400 font-bold">{college.fees?.split('(')[0].trim()}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-neutral-500 shrink-0">🎓 Affiliation:</span>
                    <span>{college.degree_partner || 'Direct Portfolio Certificate'}</span>
                  </p>
                </div>
              </div>
 
              {/* Competitors List */}
              {getCompetitors().map((comp, idx) => (
                <div key={comp.id || idx} className="group p-6 rounded-2xl border border-white/5 bg-neutral-900/10 hover:border-white/15 hover:bg-neutral-900/20 space-y-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl">
                  <div>
                    <span className="rounded bg-neutral-800 text-neutral-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border border-white/5">
                      Alternative Option
                    </span>
                    <h4 className="font-extrabold text-white text-base mt-4 group-hover:text-violet-400 transition-colors">{comp.name}</h4>
                    
                    <div className="space-y-3 text-xs font-semibold text-neutral-400 border-t border-white/5 pt-4 mt-4">
                      <p className="flex items-center gap-2">
                        <span className="text-neutral-500">📍 Location:</span>
                        <span className="text-slate-300">{comp.location?.split(',')[0]}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-neutral-500">💸 Tuition Cost:</span>
                        <span className="text-emerald-500 font-bold">{comp.fees?.split('(')[0].trim()}</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-neutral-500 shrink-0">🎓 Affiliation:</span>
                        <span className="text-slate-300">{comp.degree_partner || 'Direct Portfolio Certificate'}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-5 border-t border-white/5 flex gap-2">
                    <a
                      href={comp.apply_url || comp.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all border border-white/10 flex items-center justify-center gap-1.5 active:scale-95 duration-200"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
  
    </div>
  );
}
