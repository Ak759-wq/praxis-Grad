'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { College } from './CollegeCard';
import { 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  ChevronRight, 
  GraduationCap, 
  MapPin, 
  IndianRupee, 
  Cpu, 
  Laptop, 
  Compass, 
  Award, 
  Check, 
  SlidersHorizontal, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Calendar,
  Layers,
  Users
} from 'lucide-react';

interface MatchmakerQuizProps {
  colleges: College[];
  compareBucket?: College[];
  onCompareToggle?: (college: College) => void;
}

interface MatchResult {
  college: College;
  score: number;
  breakdown: {
    focus: number;
    budget: number;
    delivery: number;
    degree: number;
    laptop: number;
    location: number;
  };
  reasons: string[];
  matchedKeywords: string[];
}

export default function MatchmakerQuiz({ 
  colleges,
  compareBucket = [],
  onCompareToggle
}: MatchmakerQuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    focus: '',
    budget: '',
    delivery: '',
    degree: '',
    laptop: '',
    location: '',
  });

  // Simulated AI loading state
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);

  // Expanded card state for "Why it Matched" breakdown
  const [expandedCollegeId, setExpandedCollegeId] = useState<string | null>(null);

  // User-defined weights for real-time adjustments
  const [weights, setWeights] = useState({
    focus: 1.0,
    budget: 1.0,
    delivery: 1.0,
    degree: 1.0,
    laptop: 1.0,
    location: 1.0,
  });

  // Collapsible configuration block state
  const [showSliders, setShowSliders] = useState(false);

  // Loading logs to simulate AI analysis
  const loadingLogs = [
    "Initializing Matchmaker Core Engine...",
    "Analyzing tuition budget affordability curve...",
    "Scanning syllabus documents for academic modules...",
    "Filtering physical campus housing and remote delivery hubs...",
    "Calculating personalized weight vectors...",
    "Compiling final recommendation alignment score..."
  ];

  const handleSelect = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(prev => prev + 1);
    } else {
      // Step 6 completed, trigger simulated processing transition
      setIsLoadingResults(true);
      setLoadingStage(0);
    }
  };

  // Simulating loading stages
  useEffect(() => {
    if (!isLoadingResults) return;

    if (loadingStage < loadingLogs.length) {
      const timer = setTimeout(() => {
        setLoadingStage(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoadingResults(false);
      setStep(7);
    }
  }, [isLoadingResults, loadingStage]);

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const resetQuiz = () => {
    setAnswers({ focus: '', budget: '', delivery: '', degree: '', laptop: '', location: '' });
    setWeights({ focus: 1.0, budget: 1.0, delivery: 1.0, degree: 1.0, laptop: 1.0, location: 1.0 });
    setStep(1);
    setExpandedCollegeId(null);
    setShowSliders(false);
  };

  // Helper to parse fees from colleges to numeric lakhs
  const parseCollegeFees = (feesStr: string): number => {
    const str = feesStr.toLowerCase();
    const matches = [...str.matchAll(/(\d+\.?\d*)\s*(?:lakh|l)/gi)];
    if (matches.length > 0) {
      const values = matches.map(m => parseFloat(m[1]));
      const sum = values.reduce((a, b) => a + b, 0);
      return sum / values.length;
    }
    // Static fallbacks if regex fails
    if (str.includes('3 lakh')) return 4.5;
    if (str.includes('6.5') || str.includes('8.5')) return 7.5;
    return 15.0; // default average
  };

  // Dynamic Matching Math Engine
  const calculatedResults = useMemo(() => {
    if (step < 7) return [];

    const scored = colleges.map(college => {
      const cName = college.name.toLowerCase();
      const cTags = (college.tags || []).map(t => t.toLowerCase());
      const cLoc = (college.location || '').toLowerCase();
      const cFeeStr = (college.fees || '').toLowerCase();
      const partner = (college.degree_partner || '').toLowerCase();
      const cSummary = (college.curriculum_summary || '').toLowerCase();
      const curricText = [
        college.year_1_curriculum,
        college.year_2_curriculum,
        college.year_3_curriculum,
        college.year_4_curriculum
      ].filter(Boolean).map(c => c!.toLowerCase()).join(' ');

      let sFocus = 0;
      let sBudget = 0;
      let sDelivery = 0;
      let sDegree = 0;
      let sLaptop = 0;
      let sLocation = 0;

      const reasons: string[] = [];
      const matchedKeywords: string[] = [];

      // 1. Academic Focus Scoring (100 pts max)
      if (answers.focus === 'swe') {
        const sweKeywords = ['software', 'programming', 'coding', 'dsa', 'developer', 'fullstack', 'backend', 'frontend', 'dev', 'glain', 'scaler', 'bosscoder', 'kalvium', 'blocks', 'git', 'full-stack'];
        sweKeywords.forEach(kw => {
          if (cName.includes(kw) || cSummary.includes(kw) || cTags.includes(kw) || curricText.includes(kw)) {
            matchedKeywords.push(kw);
          }
        });
        const scoreMultiplier = cName.includes('scaler') || cName.includes('bosscoder') || cTags.includes('competitive coding') || cTags.includes('software engineering') ? 1.2 : 1.0;
        sFocus = Math.min(100, Math.round((matchedKeywords.length * 15 + 40) * scoreMultiplier));
        if (sFocus > 70) reasons.push("Core Software Engineering Track");
      } else if (answers.focus === 'ai') {
        const aiKeywords = ['ai', 'ml', 'machine learning', 'neural', 'llm', 'generative', 'nlp', 'pytorch', 'tensorflow', 'zenith', 'newton', 'polaris', 'deep learning', 'computer vision'];
        aiKeywords.forEach(kw => {
          if (cName.includes(kw) || cSummary.includes(kw) || cTags.includes(kw) || curricText.includes(kw)) {
            matchedKeywords.push(kw);
          }
        });
        const scoreMultiplier = cName.includes('zenith') || cName.includes('newton') || cName.includes('tensor') || cTags.includes('ai-native') || cTags.includes('ai product focus') || cTags.includes('ai-native focus') ? 1.2 : 1.0;
        sFocus = Math.min(100, Math.round((matchedKeywords.length * 15 + 40) * scoreMultiplier));
        if (sFocus > 70) reasons.push("AI-Native Curriculum Focus");
      } else if (answers.focus === 'biz') {
        const bizKeywords = ['business', 'mba', 'startup', 'entrepreneur', 'product management', 'pm', 'venture', 'economics', 'finance', 'marketing', 'masters union', 'growth', 'scaling'];
        bizKeywords.forEach(kw => {
          if (cName.includes(kw) || cSummary.includes(kw) || cTags.includes(kw) || curricText.includes(kw)) {
            matchedKeywords.push(kw);
          }
        });
        const scoreMultiplier = cName.includes('masters') || cTags.includes('embedded mini-mba') || cTags.includes('experiential startup lab') ? 1.2 : 1.0;
        sFocus = Math.min(100, Math.round((matchedKeywords.length * 20 + 35) * scoreMultiplier));
        if (sFocus > 70) reasons.push("Product Management & Tech Business Track");
      }

      // 2. Budget Affordability Scoring (100 pts max)
      const parsedFee = parseCollegeFees(cFeeStr);
      if (answers.budget === 'low') {
        if (parsedFee <= 10.0) {
          sBudget = 100;
          reasons.push("Fits low tuition budget (under ₹10L)");
        } else if (parsedFee <= 15.0) {
          sBudget = Math.round(100 - (parsedFee - 10) * 12);
          reasons.push("Slightly above low budget threshold");
        } else {
          sBudget = Math.max(10, Math.round(40 - (parsedFee - 15) * 4));
        }
      } else if (answers.budget === 'med') {
        if (parsedFee >= 10.0 && parsedFee <= 20.0) {
          sBudget = 100;
          reasons.push("Fits moderate budget (₹10L - ₹20L)");
        } else if (parsedFee < 10.0) {
          sBudget = Math.round(100 - (10.0 - parsedFee) * 4);
          reasons.push("Well below moderate budget");
        } else {
          sBudget = Math.max(10, Math.round(100 - (parsedFee - 20.0) * 10));
        }
      } else if (answers.budget === 'high') {
        if (parsedFee >= 20.0) {
          sBudget = 100;
          reasons.push("Matches premium budget (₹20L+)");
        } else if (parsedFee >= 15.0) {
          sBudget = Math.round(80 + (parsedFee - 15.0) * 4);
          reasons.push("Fits flexible budget");
        } else {
          sBudget = Math.max(30, Math.round(80 - (15.0 - parsedFee) * 5));
        }
      }

      // 3. Delivery Mode Scoring (100 pts max)
      const isOnlineOrHybrid = cTags.includes('byod laptop policy') || cName.includes('100x') || cName.includes('codinggita') || cName.includes('kalvium') || cLoc.includes('remote') || cLoc.includes('online') || cLoc.includes('anywhere');
      if (answers.delivery === 'residential') {
        sDelivery = isOnlineOrHybrid ? 30 : 100;
        if (sDelivery === 100) reasons.push("In-Person Residential Campus");
      } else if (answers.delivery === 'hybrid') {
        sDelivery = isOnlineOrHybrid ? 100 : 50;
        if (sDelivery === 100) reasons.push("Hybrid / Online / Flexible Study");
      }

      // 4. Degree Requirement Scoring (100 pts max)
      const degreeType = (college.degreeType || '').toLowerCase();
      const hasBTech = degreeType.includes('b.tech') || partner.includes('b.tech') || degreeType.includes('b.e.') || partner.includes('b.e.');
      const hasBScBCA = degreeType.includes('b.sc') || degreeType.includes('bca') || partner.includes('b.sc') || partner.includes('bca');
      const isCertification = !hasBTech && !hasBScBCA;

      if (answers.degree === 'btech') {
        sDegree = hasBTech ? 100 : hasBScBCA ? 50 : 20;
        if (hasBTech) reasons.push("Accredited UGC B.Tech Degree");
      } else if (answers.degree === 'bca_bsc') {
        sDegree = hasBScBCA ? 100 : hasBTech ? 60 : 30;
        if (hasBScBCA) reasons.push("Accredited UGC BCA/B.Sc Degree");
      } else if (answers.degree === 'skills') {
        sDegree = isCertification ? 100 : cTags.includes('portfolio hiring approach') ? 80 : 40;
        if (sDegree >= 80) reasons.push("Skills-First Certification Track");
      }

      // 5. Laptop Provision Scoring (100 pts max)
      const providesLaptop = !!college.laptop_provided;
      if (answers.laptop === 'provided') {
        sLaptop = providesLaptop ? 100 : 30;
        if (providesLaptop) reasons.push(`Developer Hardware Included (${college.laptop_provided})`);
      } else if (answers.laptop === 'byod') {
        sLaptop = providesLaptop ? 70 : 100;
        if (sLaptop === 100) reasons.push("BYOD Policy (Lowers overall cost)");
      }

      // 6. Location Match Scoring (100 pts max)
      if (answers.location === 'flexible') {
        sLocation = 100;
        reasons.push("Flexible location alignment");
      } else {
        const cityMap: Record<string, string[]> = {
          bangalore: ['bangalore', 'bengaluru', 'electronic city'],
          ncr: ['ncr', 'gurugram', 'gurgaon', 'noida', 'delhi', 'ghaziabad', 'sonepat', 'haryana'],
          pune: ['pune'],
          hyderabad: ['hyderabad', 'telangana']
        };
        const searchCities = cityMap[answers.location] || [];
        const isMatchedCity = searchCities.some(city => cLoc.includes(city));
        if (isMatchedCity) {
          sLocation = 100;
          reasons.push(`Located in ${answers.location === 'ncr' ? 'Delhi NCR' : answers.location.charAt(0).toUpperCase() + answers.location.slice(1)} tech hub`);
        } else if (isOnlineOrHybrid) {
          sLocation = 75; // online is accessible from anywhere
        } else {
          sLocation = 30;
        }
      }

      // Calculate Weighted Sum
      const totalWeight = weights.focus + weights.budget + weights.delivery + weights.degree + weights.laptop + weights.location;
      const weightedScore = (
        sFocus * weights.focus +
        sBudget * weights.budget +
        sDelivery * weights.delivery +
        sDegree * weights.degree +
        sLaptop * weights.laptop +
        sLocation * weights.location
      ) / (totalWeight > 0 ? totalWeight : 1);

      return {
        college,
        score: Math.min(100, Math.round(weightedScore)),
        breakdown: {
          focus: sFocus,
          budget: sBudget,
          delivery: sDelivery,
          degree: sDegree,
          laptop: sLaptop,
          location: sLocation
        },
        reasons: Array.from(new Set(reasons)),
        matchedKeywords: Array.from(new Set(matchedKeywords))
      };
    });

    // Sort descending and return
    return scored.sort((a, b) => b.score - a.score).slice(0, 4);
  }, [colleges, answers, weights, step]);

  // Real-Time Matching Count Engine
  const liveMatchCount = useMemo(() => {
    let activeWeight = 0;
    if (answers.focus) activeWeight += weights.focus;
    if (answers.budget) activeWeight += weights.budget;
    if (answers.delivery) activeWeight += weights.delivery;
    if (answers.degree) activeWeight += weights.degree;
    if (answers.laptop) activeWeight += weights.laptop;
    if (answers.location) activeWeight += weights.location;

    if (activeWeight === 0) return colleges.length;

    const matched = colleges.filter(college => {
      const cName = college.name.toLowerCase();
      const cTags = (college.tags || []).map(t => t.toLowerCase());
      const cLoc = (college.location || '').toLowerCase();
      const cFeeStr = (college.fees || '').toLowerCase();
      const partner = (college.degree_partner || '').toLowerCase();
      const cSummary = (college.curriculum_summary || '').toLowerCase();
      const curricText = [
        college.year_1_curriculum,
        college.year_2_curriculum,
        college.year_3_curriculum,
        college.year_4_curriculum
      ].filter(Boolean).map(c => c!.toLowerCase()).join(' ');

      let sFocus = 0;
      let sBudget = 0;
      let sDelivery = 0;
      let sDegree = 0;
      let sLaptop = 0;
      let sLocation = 0;

      // 1. Focus
      if (answers.focus === 'swe') {
        const sweKeywords = ['software', 'programming', 'coding', 'dsa', 'developer', 'fullstack', 'backend', 'frontend', 'dev', 'glain', 'scaler', 'bosscoder', 'kalvium', 'blocks', 'git', 'full-stack'];
        const matches = sweKeywords.filter(kw => cName.includes(kw) || cSummary.includes(kw) || cTags.includes(kw) || curricText.includes(kw));
        const scoreMultiplier = cName.includes('scaler') || cName.includes('bosscoder') || cTags.includes('competitive coding') || cTags.includes('software engineering') ? 1.2 : 1.0;
        sFocus = Math.min(100, Math.round((matches.length * 15 + 40) * scoreMultiplier));
      } else if (answers.focus === 'ai') {
        const aiKeywords = ['ai', 'ml', 'machine learning', 'neural', 'llm', 'generative', 'nlp', 'pytorch', 'tensorflow', 'zenith', 'newton', 'polaris', 'deep learning', 'computer vision'];
        const matches = aiKeywords.filter(kw => cName.includes(kw) || cSummary.includes(kw) || cTags.includes(kw) || curricText.includes(kw));
        const scoreMultiplier = cName.includes('zenith') || cName.includes('newton') || cName.includes('tensor') || cTags.includes('ai-native') || cTags.includes('ai product focus') || cTags.includes('ai-native focus') ? 1.2 : 1.0;
        sFocus = Math.min(100, Math.round((matches.length * 15 + 40) * scoreMultiplier));
      } else if (answers.focus === 'biz') {
        const bizKeywords = ['business', 'mba', 'startup', 'entrepreneur', 'product management', 'pm', 'venture', 'economics', 'finance', 'marketing', 'masters union', 'growth', 'scaling'];
        const matches = bizKeywords.filter(kw => cName.includes(kw) || cSummary.includes(kw) || cTags.includes(kw) || curricText.includes(kw));
        const scoreMultiplier = cName.includes('masters') || cTags.includes('embedded mini-mba') || cTags.includes('experiential startup lab') ? 1.2 : 1.0;
        sFocus = Math.min(100, Math.round((matches.length * 20 + 35) * scoreMultiplier));
      }

      // 2. Budget
      if (answers.budget) {
        const parsedFee = parseCollegeFees(cFeeStr);
        if (answers.budget === 'low') {
          if (parsedFee <= 10.0) sBudget = 100;
          else if (parsedFee <= 15.0) sBudget = Math.round(100 - (parsedFee - 10) * 12);
          else sBudget = Math.max(10, Math.round(40 - (parsedFee - 15) * 4));
        } else if (answers.budget === 'med') {
          if (parsedFee >= 10.0 && parsedFee <= 20.0) sBudget = 100;
          else if (parsedFee < 10.0) sBudget = Math.round(100 - (10.0 - parsedFee) * 4);
          else sBudget = Math.max(10, Math.round(100 - (parsedFee - 20.0) * 10));
        } else if (answers.budget === 'high') {
          if (parsedFee >= 20.0) sBudget = 100;
          else if (parsedFee >= 15.0) sBudget = Math.round(80 + (parsedFee - 15.0) * 4);
          else sBudget = Math.max(30, Math.round(80 - (15.0 - parsedFee) * 5));
        }
      }

      // 3. Delivery
      if (answers.delivery) {
        const isOnlineOrHybrid = cTags.includes('byod laptop policy') || cName.includes('100x') || cName.includes('codinggita') || cName.includes('kalvium') || cLoc.includes('remote') || cLoc.includes('online') || cLoc.includes('anywhere');
        if (answers.delivery === 'residential') {
          sDelivery = isOnlineOrHybrid ? 30 : 100;
        } else if (answers.delivery === 'hybrid') {
          sDelivery = isOnlineOrHybrid ? 100 : 50;
        }
      }

      // 4. Degree
      if (answers.degree) {
        const degreeType = (college.degreeType || '').toLowerCase();
        const hasBTech = degreeType.includes('b.tech') || partner.includes('b.tech') || degreeType.includes('b.e.') || partner.includes('b.e.');
        const hasBScBCA = degreeType.includes('b.sc') || degreeType.includes('bca') || partner.includes('b.sc') || partner.includes('bca');
        const isCertification = !hasBTech && !hasBScBCA;

        if (answers.degree === 'btech') {
          sDegree = hasBTech ? 100 : hasBScBCA ? 50 : 20;
        } else if (answers.degree === 'bca_bsc') {
          sDegree = hasBScBCA ? 100 : hasBTech ? 60 : 30;
        } else if (answers.degree === 'skills') {
          sDegree = isCertification ? 100 : cTags.includes('portfolio hiring approach') ? 80 : 40;
        }
      }

      // 5. Laptop
      if (answers.laptop) {
        const providesLaptop = !!college.laptop_provided;
        if (answers.laptop === 'provided') {
          sLaptop = providesLaptop ? 100 : 30;
        } else if (answers.laptop === 'byod') {
          sLaptop = providesLaptop ? 70 : 100;
        }
      }

      // 6. Location
      if (answers.location) {
        if (answers.location === 'flexible') {
          sLocation = 100;
        } else {
          const cityMap: Record<string, string[]> = {
            bangalore: ['bangalore', 'bengaluru', 'electronic city'],
            ncr: ['ncr', 'gurugram', 'gurgaon', 'noida', 'delhi', 'ghaziabad', 'sonepat', 'haryana'],
            pune: ['pune'],
            hyderabad: ['hyderabad', 'telangana']
          };
          const searchCities = cityMap[answers.location] || [];
          const isMatchedCity = searchCities.some(city => cLoc.includes(city));
          const isOnlineOrHybrid = cTags.includes('byod laptop policy') || cName.includes('100x') || cName.includes('codinggita') || cName.includes('kalvium') || cLoc.includes('remote') || cLoc.includes('online') || cLoc.includes('anywhere');
          if (isMatchedCity) {
            sLocation = 100;
          } else if (isOnlineOrHybrid) {
            sLocation = 75;
          } else {
            sLocation = 30;
          }
        }
      }

      const weightedScore = (
        (answers.focus ? sFocus * weights.focus : 0) +
        (answers.budget ? sBudget * weights.budget : 0) +
        (answers.delivery ? sDelivery * weights.delivery : 0) +
        (answers.degree ? sDegree * weights.degree : 0) +
        (answers.laptop ? sLaptop * weights.laptop : 0) +
        (answers.location ? sLocation * weights.location : 0)
      ) / activeWeight;

      return Math.round(weightedScore) >= 60;
    });

    return matched.length;
  }, [colleges, answers, weights]);

  // Stepper icon map
  const renderStepIcon = (index: number) => {
    switch (index) {
      case 1: return <GraduationCap className="h-4 w-4" />;
      case 2: return <IndianRupee className="h-4 w-4" />;
      case 3: return <Compass className="h-4 w-4" />;
      case 4: return <Award className="h-4 w-4" />;
      case 5: return <Laptop className="h-4 w-4" />;
      case 6: return <MapPin className="h-4 w-4" />;
      default: return null;
    }
  };

  const stepLabels = ["Focus", "Budget", "Delivery", "Degree", "Laptop", "Location"];

  return (
    <div className="glass-panel border border-white/5 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden bg-black/40 backdrop-blur-xl animate-fade-in">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-500/10 blur-[90px]" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-emerald-500/5 blur-[90px]" />
      
      {/* ── Visual Stepper Section ── */}
      {step < 7 && !isLoadingResults && (
        <div className="mb-8 select-none">
          <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-violet-400 mb-6">
            <span>AI Matchmaker Wizard</span>
            <span className="bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-full">Step {step} of 6</span>
          </div>

          <div className="relative flex justify-between items-center w-full max-w-2xl mx-auto px-4">
            {/* Background Line */}
            <div className="absolute left-6 right-6 top-[15px] h-[2px] bg-white/5 z-0" />
            {/* Active Progress Line */}
            <div 
              className="absolute left-6 top-[15px] h-[2px] bg-gradient-to-r from-violet-600 to-fuchsia-500 z-0 transition-all duration-500 ease-in-out" 
              style={{ width: `${((step - 1) / 5) * 88}%` }}
            />

            {[1, 2, 3, 4, 5, 6].map((num) => {
              const isActive = num === step;
              const isCompleted = num < step;
              return (
                <div key={num} className="flex flex-col items-center z-10 relative">
                  <button
                    disabled={num > step}
                    onClick={() => setStep(num)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isActive 
                        ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-110 cursor-pointer'
                        : isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-white cursor-pointer hover:bg-emerald-600'
                          : 'bg-neutral-900 border-white/5 text-neutral-500 cursor-not-allowed'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : renderStepIcon(num)}
                  </button>
                  <span className={`text-[9px] font-bold mt-2 tracking-wider ${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-neutral-500'}`}>
                    {stepLabels[num - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Simulated Processing Transition Screen ── */}
      {isLoadingResults && (
        <div className="py-16 flex flex-col items-center justify-center text-center animate-fade-in select-none">
          <div className="relative h-24 w-24 mb-8">
            {/* Outer spinning dash */}
            <div className="absolute inset-0 rounded-full border-4 border-violet-500/10 border-t-violet-500 animate-spin" />
            {/* Inner pulsing glow */}
            <div className="absolute inset-2 rounded-full bg-violet-600/10 border border-violet-500/30 animate-pulse flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-violet-400" />
            </div>
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">Recalculating Match Alignment...</h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm">Please wait while the AI analyzes your custom matching preferences against India's modern colleges.</p>

          <div className="mt-8 bg-neutral-950/80 border border-white/5 rounded-2xl p-4 w-full max-w-md text-left font-mono text-[10.5px] leading-relaxed space-y-1.5 shadow-inner">
            {loadingLogs.map((log, index) => (
              <div 
                key={index} 
                className={`transition-all duration-300 flex items-center gap-2 ${
                  loadingStage > index 
                    ? 'text-emerald-400 font-bold' 
                    : loadingStage === index 
                      ? 'text-violet-400 animate-pulse' 
                      : 'text-neutral-700'
                }`}
              >
                {loadingStage > index ? (
                  <span>✓</span>
                ) : loadingStage === index ? (
                  <span className="inline-block w-1.5 h-1.5 bg-violet-400 rounded-full animate-ping" />
                ) : (
                  <span className="inline-block w-1.5 h-1.5 bg-neutral-800 rounded-full" />
                )}
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 1: Focus ── */}
      {!isLoadingResults && step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-black text-white mb-1.5 flex items-center gap-2 tracking-tight">
            <Sparkles className="h-6 w-6 text-violet-400 animate-pulse" /> What is your primary academic focus?
          </h2>
          <p className="text-xs text-neutral-400 mb-6">Select the engineering or tech track that corresponds to your career dreams.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { id: 'swe', emoji: '💻', title: 'Software Engineering', desc: 'Core computer science, high-performance programming, advanced DSA, and full-stack system architecture.' },
              { id: 'ai', emoji: '🤖', title: 'AI & Machine Learning', desc: 'Focus on neural networks, large language models, deep learning, PyTorch/TensorFlow, and AI product integration.' },
              { id: 'biz', emoji: '📈', title: 'PM & Tech Business', desc: 'Experiential curricula covering tech startups, venture design, product management, and growth marketing.' }
            ].map(opt => {
              const isSelected = answers.focus === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('focus', opt.id)}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-52 group ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.15)] scale-[1.02]'
                      : 'bg-neutral-900/30 border-white/5 text-neutral-300 hover:border-white/10 hover:bg-neutral-800/20'
                  }`}
                >
                  <div>
                    <div className="text-3xl mb-4 bg-white/5 h-12 w-12 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300">{opt.emoji}</div>
                    <p className="text-sm font-bold text-white tracking-wide">{opt.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-2 font-light leading-relaxed">{opt.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="self-end rounded-full bg-violet-500 p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 2: Budget ── */}
      {!isLoadingResults && step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-black text-white mb-1.5 flex items-center gap-2 tracking-tight">
            <IndianRupee className="h-6 w-6 text-violet-400" /> What is your tuition budget limit?
          </h2>
          <p className="text-xs text-neutral-400 mb-6">Select your total 4-year tuition cap (excluding optional hostel and mess charges).</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { id: 'low', tag: 'Affordable', title: 'Under ₹10 Lakhs', desc: 'Includes community-driven schools, regional partners, and placement refund guarantees.' },
              { id: 'med', tag: 'Moderate', title: '₹10L – ₹20 Lakhs', desc: 'Standard range for alternative academies with built-in corporate internship credits.' },
              { id: 'high', tag: 'Premium', title: '₹20 Lakhs+', desc: 'Premium programs offering MAANG bootcamps, global hub tours, and high-spec developer hardware.' }
            ].map(opt => {
              const isSelected = answers.budget === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('budget', opt.id)}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-52 group ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.15)] scale-[1.02]'
                      : 'bg-neutral-900/30 border-white/5 text-neutral-300 hover:border-white/10 hover:bg-neutral-800/20'
                  }`}
                >
                  <div>
                    <span className="text-[9px] uppercase font-bold tracking-widest text-violet-400 bg-violet-400/5 px-2 py-0.5 rounded border border-violet-500/10">{opt.tag}</span>
                    <p className="text-base font-extrabold text-white mt-4">{opt.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-2 font-light leading-relaxed">{opt.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="self-end rounded-full bg-violet-500 p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 3: Delivery Mode ── */}
      {!isLoadingResults && step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-black text-white mb-1.5 flex items-center gap-2 tracking-tight">
            <Compass className="h-6 w-6 text-violet-400" /> Choose your preferred delivery model:
          </h2>
          <p className="text-xs text-neutral-400 mb-6">Select whether you prefer a physical campus cohort or a flexible online/hybrid setup.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { id: 'residential', emoji: '🏫', title: 'Residential Campus Program', desc: 'Fully in-person campus study. Offers full developer hubs, face-to-face peer groups, library access, and live labs.' },
              { id: 'hybrid', emoji: '💻', title: 'Hybrid / Online Cohort', desc: 'Work from anywhere with remote sandboxes, digital developer standups, and online cohort-based peer communities.' }
            ].map(opt => {
              const isSelected = answers.delivery === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('delivery', opt.id)}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-48 group ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.15)] scale-[1.02]'
                      : 'bg-neutral-900/30 border-white/5 text-neutral-300 hover:border-white/10 hover:bg-neutral-800/20'
                  }`}
                >
                  <div>
                    <div className="text-2xl mb-3 bg-white/5 h-10 w-10 rounded-xl flex items-center justify-center border border-white/5">{opt.emoji}</div>
                    <p className="text-sm font-bold text-white">{opt.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-2 font-light leading-relaxed">{opt.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="self-end rounded-full bg-violet-500 p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 4: Degree Affiliation ── */}
      {!isLoadingResults && step === 4 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-black text-white mb-1.5 flex items-center gap-2 tracking-tight">
            <Award className="h-6 w-6 text-violet-400" /> Do you require a university degree affiliation?
          </h2>
          <p className="text-xs text-neutral-400 mb-6">Select your preference for UGC university credentials alongside the coding curriculum.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { id: 'btech', title: 'UGC B.Tech Degree', desc: 'Parallel B.Tech degree in Computer Science offered via UGC-approved state/private universities.' },
              { id: 'bca_bsc', title: 'UGC BCA / B.Sc', desc: 'Three-year B.Sc or BCA pathway (e.g. Scaler partner programs) for corporate accreditation.' },
              { id: 'skills', title: 'Portfolio & Skills Only', desc: 'Focus strictly on development portfolios, GitHub commits, open-source work, and direct hire networks.' }
            ].map(opt => {
              const isSelected = answers.degree === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('degree', opt.id)}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-52 group ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.15)] scale-[1.02]'
                      : 'bg-neutral-900/30 border-white/5 text-neutral-300 hover:border-white/10 hover:bg-neutral-800/20'
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-white">{opt.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-2.5 font-light leading-relaxed">{opt.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="self-end rounded-full bg-violet-500 p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 5: Laptop Policy ── */}
      {!isLoadingResults && step === 5 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-black text-white mb-1.5 flex items-center gap-2 tracking-tight">
            <Laptop className="h-6 w-6 text-violet-400" /> What is your laptop policy preference?
          </h2>
          <p className="text-xs text-neutral-400 mb-6">Determine if you want a developer laptop included in your tuition kit or if you will BYOD.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { id: 'provided', icon: <Cpu className="h-6 w-6 text-violet-400" />, title: 'Hardware Provided by School', desc: 'Get a top-tier machine (MacBook Air/Pro or Lenovo ThinkPad) provided as part of the admissions bundle.' },
              { id: 'byod', icon: <Laptop className="h-6 w-6 text-neutral-500 animate-pulse" />, title: 'BYOD (Bring Your Own)', desc: 'I have a capable workstation and prefer to save money by opting out of hardware packages.' }
            ].map(opt => {
              const isSelected = answers.laptop === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('laptop', opt.id)}
                  className={`p-6 rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-48 group ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.15)] scale-[1.02]'
                      : 'bg-neutral-900/30 border-white/5 text-neutral-300 hover:border-white/10 hover:bg-neutral-800/20'
                  }`}
                >
                  <div>
                    <div className="mb-3 bg-white/5 h-10 w-10 rounded-xl flex items-center justify-center border border-white/5">{opt.icon}</div>
                    <p className="text-sm font-bold text-white">{opt.title}</p>
                    <p className="text-[11px] text-neutral-400 mt-2 font-light leading-relaxed">{opt.desc}</p>
                  </div>
                  {isSelected && (
                    <span className="self-end rounded-full bg-violet-500 p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 6: Location Preference ── */}
      {!isLoadingResults && step === 6 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-black text-white mb-1.5 flex items-center gap-2 tracking-tight">
            <MapPin className="h-6 w-6 text-violet-400" /> What is your primary location preference?
          </h2>
          <p className="text-xs text-neutral-400 mb-6">Select your ideal region. Bangalore, NCR, Pune, and Hyderabad hubs offer high physical industry networking access.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { id: 'bangalore', emoji: '🌴', title: 'Bangalore' },
              { id: 'ncr', emoji: '🏙️', title: 'Delhi NCR' },
              { id: 'pune', emoji: '🏔️', title: 'Pune' },
              { id: 'hyderabad', emoji: '🕌', title: 'Hyderabad' },
              { id: 'flexible', emoji: '🇮🇳', title: 'Flexible / Online' }
            ].map(opt => {
              const isSelected = answers.location === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect('location', opt.id)}
                  className={`p-5 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border-violet-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.15)] scale-[1.02]'
                      : 'bg-neutral-900/30 border-white/5 text-neutral-300 hover:border-white/10 hover:bg-neutral-800/20'
                  }`}
                >
                  <p className="text-3xl bg-white/5 h-12 w-12 rounded-xl flex items-center justify-center border border-white/5 mb-3">{opt.emoji}</p>
                  <p className="text-xs font-bold tracking-wide mt-1">{opt.title}</p>
                  {isSelected && (
                    <span className="mt-3 rounded-full bg-violet-500 p-0.5 text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STEP 7: Recommendation Results ── */}
      {!isLoadingResults && step === 7 && (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center select-none">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Your Custom AI College Match</h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">We analyzed academic fit, financial caps, delivery hubs, and hardware details to compute your matches.</p>
          </div>

          {/* Collapsible Slider Weights Box */}
          <div className="border border-white/5 rounded-2xl bg-neutral-950/60 overflow-hidden">
            <button
              onClick={() => setShowSliders(!showSliders)}
              className="w-full flex items-center justify-between p-4 text-xs font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-violet-400" />
                <span>Adjust Factor Weight Matrix (Fine-Tune AI)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-normal">Modify parameter importance</span>
                {showSliders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>

            {showSliders && (
              <div className="p-5 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs select-none">
                {[
                  { key: 'focus', label: 'Academic Focus Match', desc: 'Keyword alignment with curriculum' },
                  { key: 'budget', label: 'Financial / Budget fit', desc: 'Linear satisfaction curve alignment' },
                  { key: 'delivery', label: 'Campus format (Online vs In-Person)', desc: 'Residential vs hybrid match' },
                  { key: 'degree', label: 'UGC Degree Credentials', desc: 'B.Tech vs B.Sc vs Skills-First pathways' },
                  { key: 'laptop', label: 'Laptop provision policy', desc: 'Hardware package bundle value' },
                  { key: 'location', label: 'Location Tech Hub alignment', desc: 'City-level proximity and ecosystem access' }
                ].map(param => (
                  <div key={param.key} className="space-y-1.5 p-3 rounded-xl bg-white/[0.01] border border-white/5">
                    <div className="flex justify-between font-bold text-[11px]">
                      <span className="text-neutral-300">{param.label}</span>
                      <span className="text-violet-400">{(weights[param.key as keyof typeof weights] * 100).toFixed(0)}% Weight</span>
                    </div>
                    <p className="text-[10px] text-neutral-500">{param.desc}</p>
                    <input
                      type="range"
                      min="0"
                      max="1.5"
                      step="0.1"
                      value={weights[param.key as keyof typeof weights]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setWeights(prev => ({ ...prev, [param.key]: val }));
                      }}
                      className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-violet-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="space-y-4">
            {calculatedResults.map(({ college, score, breakdown, reasons, matchedKeywords }, idx) => {
              const isExpanded = expandedCollegeId === college.id;
              const isInCompare = compareBucket.some(c => c.id === college.id);
              return (
                <div 
                  key={college.id || idx} 
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:border-violet-500/20 hover:bg-white/[0.02] transition-all duration-300 flex flex-col p-5 gap-4 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-neutral-600 font-black text-base">#{idx + 1}</span>
                          <div>
                            <h3 className="text-base font-extrabold text-white leading-tight">{college.name}</h3>
                            <p className="text-[10.5px] text-neutral-400 font-medium mt-0.5">{college.degree_partner || "Independent Academy"}</p>
                          </div>
                        </div>

                        <div className="shrink-0 flex flex-col items-end">
                          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl shadow-sm">
                            {score}% Match
                          </span>
                        </div>
                      </div>

                      {/* Quick specifications */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-neutral-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                          {college.location?.split(',')[0] || "India"}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5 text-neutral-500" />
                          {college.fees?.split('(')[0].trim().substring(0, 25) || "N/A"}
                        </span>
                        {college.laptop_provided && (
                          <span className="flex items-center gap-1 text-sky-400">
                            <Laptop className="h-3.5 w-3.5 text-sky-400/70" />
                            {typeof college.laptop_provided === 'string' ? college.laptop_provided : 'Laptop Provided'}
                          </span>
                        )}
                      </div>

                      {/* Match reasons badges */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {reasons.slice(0, 3).map((reason, rIdx) => (
                          <span key={rIdx} className="px-2 py-0.5 rounded bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 text-[9.5px] font-semibold">
                            ✓ {reason}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Deep-Dive Accordion */}
                  <div className="border-t border-white/5 pt-3">
                    <button
                      onClick={() => setExpandedCollegeId(isExpanded ? null : college.id)}
                      className="w-full flex items-center justify-between text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer py-1.5 select-none"
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Info className="h-3.5 w-3.5 text-violet-400" />
                        <span>AI Match Analysis Breakdown</span>
                      </div>
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-xl bg-neutral-950/70 border border-white/5 space-y-4 animate-fade-in text-xs">
                        
                        {/* 6 Category Matching Meters */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { label: 'Academic Curriculum Fit', val: breakdown.focus },
                            { label: 'Tuition Affordability', val: breakdown.budget },
                            { label: 'Delivery Model Compatibility', val: breakdown.delivery },
                            { label: 'Degree Credentials Alignment', val: breakdown.degree },
                            { label: 'Laptop Policy Match', val: breakdown.laptop },
                            { label: 'Tech Hub Location Proximity', val: breakdown.location }
                          ].map((cat, cIdx) => (
                            <div key={cIdx} className="space-y-1">
                              <div className="flex justify-between text-[10.5px]">
                                <span className="text-neutral-400 font-medium">{cat.label}</span>
                                <span className={`font-bold ${cat.val >= 80 ? 'text-emerald-400' : cat.val >= 50 ? 'text-violet-400' : 'text-neutral-500'}`}>{cat.val}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/5">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    cat.val >= 80 ? 'bg-emerald-400' : cat.val >= 50 ? 'bg-violet-500' : 'bg-neutral-600'
                                  }`}
                                  style={{ width: `${cat.val}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Keyword extraction section */}
                        {matchedKeywords.length > 0 && (
                          <div className="border-t border-white/5 pt-3.5 mt-2">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">Curriculum Keyword Alignment</p>
                            <p className="text-neutral-400 text-[11px] leading-relaxed">
                              This program matches your focus because we found matching curriculum modules in their yearly course catalog:
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {matchedKeywords.map((kw, kwIdx) => (
                                <span key={kwIdx} className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 text-[10px] font-mono font-medium">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Additional Quick Stats */}
                        <div className="border-t border-white/5 pt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-neutral-400">
                          {college.foundingYear && (
                            <div>
                              <span className="text-[9px] uppercase font-bold text-neutral-600 block">Founded</span>
                              <span className="text-[11px] font-semibold text-neutral-200">{college.foundingYear}</span>
                            </div>
                          )}
                          {college.batchSize && (
                            <div>
                              <span className="text-[9px] uppercase font-bold text-neutral-600 block">Batch Size</span>
                              <span className="text-[11px] font-semibold text-neutral-200">{college.batchSize} Students</span>
                            </div>
                          )}
                          {college.seats && (
                            <div>
                              <span className="text-[9px] uppercase font-bold text-neutral-600 block">Available Seats</span>
                              <span className="text-[11px] font-semibold text-neutral-200">{college.seats}</span>
                            </div>
                          )}
                          {college.hiring_partners_count && (
                            <div>
                              <span className="text-[9px] uppercase font-bold text-neutral-600 block">Hiring Partners</span>
                              <span className="text-[11px] font-semibold text-emerald-400">{college.hiring_partners_count}+ Companies</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex justify-end gap-3 border-t border-white/5 pt-3.5">
                    {onCompareToggle && (
                      <button
                        onClick={() => onCompareToggle(college)}
                        className={`px-4 py-2.5 rounded-xl border text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isInCompare
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 animate-fade-in'
                            : 'border-white/10 hover:bg-white/5 text-neutral-300 hover:text-white'
                        }`}
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                        <span>{isInCompare ? 'Compared ✓' : 'Compare'}</span>
                      </button>
                    )}
                    <a
                      href={college.id ? `/college/${college.id}` : `/college/${encodeURIComponent(college.name)}`}
                      className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-[11px] font-extrabold text-neutral-300 hover:text-white transition-all cursor-pointer"
                    >
                      Full Details profile
                    </a>
                    <a
                      href={college.apply_url || college.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-[11px] font-extrabold text-white transition-all cursor-pointer flex items-center gap-1 border border-violet-500/20 shadow-md"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4 select-none">
            <button
              onClick={resetQuiz}
              className="inline-flex items-center gap-2 text-xs text-violet-400 font-extrabold hover:text-violet-300 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retake Matchmaker Quiz
            </button>
          </div>
        </div>
      )}

      {/* ── Navigation Bottom Bar ── */}
      {step < 7 && !isLoadingResults && (
        <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between select-none">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="rounded-xl border border-white/10 hover:bg-white/5 disabled:border-white/5 disabled:bg-transparent disabled:text-neutral-600 px-4 py-2.5 text-xs font-bold text-neutral-300 transition-all cursor-pointer"
          >
            Back
          </button>

          {/* Live Match Counter */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-semibold bg-white/[0.02] border border-white/5 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>✨ {liveMatchCount} {liveMatchCount === 1 ? 'college' : 'colleges'} matching your profile</span>
          </div>

          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !answers.focus) ||
              (step === 2 && !answers.budget) ||
              (step === 3 && !answers.delivery) ||
              (step === 4 && !answers.degree) ||
              (step === 5 && !answers.laptop) ||
              (step === 6 && !answers.location)
            }
            className="flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-neutral-800 disabled:text-neutral-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all border border-violet-500/20 cursor-pointer"
          >
            <span>{step === 6 ? 'Find Matches' : 'Next Step'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
