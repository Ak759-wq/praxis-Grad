'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Database, RefreshCw, Terminal, CheckCircle2, AlertCircle, 
  Copy, Check, ArrowRight, ShieldAlert, Sparkles, HelpCircle, LogOut
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const [isConfigured, setIsConfigured] = useState(false);
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [triggerMode, setTriggerMode] = useState<'normal' | 'mock'>('normal');

  useEffect(() => {
    setIsConfigured(isSupabaseConfigured());
  }, []);

  const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional Web Scraper Configuration (Firecrawl API)
# Get a key at https://firecrawl.dev to enable live AI LLM scraping
FIRECRAWL_API_KEY=fc-3fbc...`;

  const sqlSchema = `-- Praxis Grad SQL Schema Setup
-- 1. Create colleges table
CREATE TABLE colleges (
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
    last_scraped_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create founders table
CREATE TABLE founders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    background_info TEXT,
    linkedin_url TEXT,
    CONSTRAINT founders_college_name_unique UNIQUE (college_id, name)
);

-- 3. Create instructors table
CREATE TABLE instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company_background TEXT,
    CONSTRAINT instructors_college_name_unique UNIQUE (college_id, name)
);

-- 4. Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    rating NUMERIC(3, 2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    review_text TEXT NOT NULL,
    source_url TEXT,
    CONSTRAINT reviews_college_text_unique UNIQUE (college_id, review_text)
);`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunPipeline = async (mode: 'normal' | 'mock') => {
    setRunning(true);
    setTriggerMode(mode);
    setLogs([`[${new Date().toLocaleTimeString()}] Triggering ingestion request handler...`]);
    setResults([]);

    try {
      const url = `/api/scrape-colleges${mode === 'mock' ? '?mock=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setLogs(prev => [...prev, ...data.logs, `\n[SUCCESS] Pipeline executed successfully.`]);
        setResults(data.results || []);
      } else {
        setLogs(prev => [...prev, `\n[ERROR] Pipeline failed: ${data.message || data.error}`]);
        if (data.details) {
          setLogs(prev => [...prev, `Details: ${data.details}`]);
        }
      }
    } catch (e: any) {
      setLogs(prev => [...prev, `\n[CRITICAL ERROR] Failed to contact scraping API endpoint: ${e.message}`]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="relative w-full pb-20 pt-10">
      {/* Background neon style glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-full max-w-7xl -translate-x-1/2 bg-gradient-to-b from-violet-600/10 to-transparent blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <Database className="h-7 w-7 text-violet-400" />
              <span>Scraper & Seeding <span className="text-gradient-primary">Control Dashboard</span></span>
            </h1>
            <p className="text-neutral-400 text-sm mt-1.5 font-medium">
              Deploy the SQL schema in Supabase, hook up credentials, trigger AI scraper extractions, and inspect synchronization logs in real-time.
            </p>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/admin-auth', { method: 'DELETE' });
              router.push('/admin/login');
            }}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-900 hover:bg-rose-950/40 hover:border-rose-500/30 px-4 py-2 text-xs font-bold text-neutral-400 hover:text-rose-400 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Pipeline Run Console & Logs) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Control Panel */}
            <div className="glass-panel border border-white/5 rounded-2xl p-6 bg-black/40 shadow-xl space-y-6">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-400 border-b border-white/5 pb-2.5">
                Ingestion Pipeline Controls
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
                <div>
                  <p className="text-xs text-neutral-400 max-w-md font-medium leading-relaxed">
                    Trigger the ingestion controller to iterate through college websites, run Firecrawl AI schema scrapers, and update Supabase with high-fidelity records automatically.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={() => handleRunPipeline('normal')}
                    disabled={running}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:from-neutral-800 disabled:to-neutral-900 disabled:text-neutral-600 disabled:border-white/5 disabled:cursor-not-allowed border border-white/10 px-5 py-3 text-xs font-bold text-white shadow-xl transition-all"
                  >
                    {running && triggerMode === 'normal' ? (
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-4.5 w-4.5" />
                    )}
                    <span>Run AI / Supabase Sync</span>
                  </button>

                  <button
                    onClick={() => handleRunPipeline('mock')}
                    disabled={running}
                    className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 px-5 py-2.5 text-xs font-bold text-neutral-300 transition-colors"
                  >
                    {running && triggerMode === 'mock' ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4 text-violet-400" />
                    )}
                    <span>Run Ingestion (Force Seed Fallback)</span>
                  </button>
                </div>
              </div>

              {/* Status Banner */}
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-neutral-950/80 border-white/10">
                <div className={`h-3 w-3 rounded-full shrink-0 ${running ? 'bg-amber-400 animate-ping' : isConfigured ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div className="text-xs">
                  <span className="font-bold text-neutral-300">Supabase Connection State: </span>
                  <span className={running ? 'text-amber-400 font-medium' : isConfigured ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {running ? 'Ingestion Synchronizing...' : isConfigured ? 'Connected & Live' : 'Keys Missing (Offline Sandbox)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Terminal Logs Output Box */}
            <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden shadow-2xl bg-neutral-950/90 flex flex-col h-[350px]">
              <div className="bg-neutral-900 border-b border-white/5 py-2 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-bold uppercase tracking-wider">
                  <Terminal className="h-4 w-4 text-violet-400" />
                  <span>Pipeline Shell Log Console</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80 block" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 block" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 block" />
                </div>
              </div>
              
              <div className="p-4 flex-grow overflow-y-auto font-mono text-[11px] leading-relaxed text-neutral-300 bg-neutral-950 space-y-1.5 scrollbar-thin">
                {logs.length === 0 ? (
                  <p className="text-neutral-600 italic">Console idle. Ready for instruction execution. Click "Run AI / Supabase Sync" above to begin.</p>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className={
                      log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' :
                      log.includes('[ERROR]') || log.includes('[CRITICAL ERROR]') ? 'text-rose-400 font-bold' :
                      log.includes('Processing:') ? 'text-violet-300 font-semibold mt-1.5' :
                      'text-neutral-400 font-light'
                    }>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Results Ingestion Summary Table */}
            {results.length > 0 && (
              <div className="glass-panel border border-white/5 rounded-2xl p-5 bg-black/40 shadow-xl space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">Sync Execution Inventory</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {results.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/80 border border-white/5 text-xs">
                      <span className="font-bold text-white truncate">{r.name}</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                        r.success 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {r.success ? 'Synced' : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Instructions & Guides) */}
          <div className="space-y-6">
            
            {/* Environment Key Setup */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 bg-black/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-emerald-400" />
                  <span>Local Key Configuration</span>
                </h3>
                
                <button
                  onClick={() => copyToClipboard(envTemplate, setCopiedEnv)}
                  className="rounded-lg hover:bg-white/5 p-1.5 text-neutral-400 hover:text-white transition-colors"
                  title="Copy Environment Template"
                >
                  {copiedEnv ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="text-xs leading-relaxed space-y-3 text-neutral-300">
                <p className="font-light">
                  To transition this directory out of sandbox mock state and run live operations, create a new local environment file:
                </p>
                <div className="rounded-lg bg-neutral-950/80 border border-white/5 p-2 font-mono text-[10px] text-violet-300">
                  praxis-grad/.env.local
                </div>
                <p className="font-light">
                  Fill in the credentials extracted from your Supabase Dashboard project API keys page:
                </p>
                <pre className="rounded-lg bg-neutral-950 p-2.5 font-mono text-[9px] leading-tight text-neutral-400 overflow-x-auto select-all">
                  {envTemplate}
                </pre>
              </div>
            </div>

            {/* SQL Table Creation Code */}
            <div className="glass-panel border border-white/5 rounded-2xl p-5 bg-black/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-violet-400" />
                  <span>Supabase SQL Schema Code</span>
                </h3>
                
                <button
                  onClick={() => copyToClipboard(sqlSchema, setCopiedSql)}
                  className="rounded-lg hover:bg-white/5 p-1.5 text-neutral-400 hover:text-white transition-colors"
                  title="Copy SQL Schema"
                >
                  {copiedSql ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="text-xs leading-relaxed space-y-3.5 text-neutral-300">
                <p className="font-light">
                  Execute this code structure inside your **Supabase SQL Editor** console to initialize foreign relations and tables perfectly:
                </p>
                <pre className="rounded-lg bg-neutral-950 p-2.5 font-mono text-[9px] leading-tight text-neutral-500 overflow-y-auto max-h-40 scrollbar-thin select-all">
                  {sqlSchema}
                </pre>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
