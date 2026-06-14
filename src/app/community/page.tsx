'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle, Send, ChevronDown, ChevronUp, ThumbsUp,
  Clock, User, Sparkles, Search, AlertCircle, Loader2,
  BookOpen, HelpCircle, Zap, TrendingUp, Info
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/* ─── Types ────────────────────────────────────────────────────── */
interface Answer {
  id: string;
  question_id: string;
  body: string;
  author: string;
  upvotes: number;
  created_at: string;
}

interface Question {
  id: string;
  title: string;
  body: string;
  author: string;
  upvotes: number;
  tag: string;
  created_at: string;
  answers?: Answer[];
  answers_count?: number;
}

/* ─── Helpers ───────────────────────────────────────────────────── */
const TAGS = ['Admissions', 'Fees & Finance', 'Curriculum', 'Placements', 'Campus Life', 'Comparison', 'General'];

const TAG_COLORS: Record<string, string> = {
  'Admissions':    'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Fees & Finance':'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Curriculum':    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Placements':    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Campus Life':   'bg-pink-500/10 text-pink-400 border-pink-500/20',
  'Comparison':    'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'General':       'bg-slate-500/10 text-slate-400 border-white/10',
};

function timeAgo(ts: string): string {
  const secs = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const colors = [
    'from-violet-600/90 to-indigo-600/90 ring-violet-500/30',
    'from-emerald-600/90 to-teal-600/90 ring-emerald-500/30',
    'from-amber-500/90 to-orange-600/90 ring-amber-500/30',
    'from-blue-600/90 to-sky-600/90 ring-blue-500/30',
    'from-pink-600/90 to-rose-600/90 ring-pink-500/30'
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  const sz = size === 'sm' ? 'h-8 w-8 text-[10px]' : size === 'lg' ? 'h-12 w-12 text-sm' : 'h-10 w-10 text-xs';
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${color} ring-2 ring-offset-2 ring-offset-neutral-950 flex items-center justify-center font-bold text-white shrink-0 shadow-lg`}>
      {initials}
    </div>
  );
}

/* ─── Answer Card ───────────────────────────────────────────────── */
function AnswerCard({ answer, onUpvote }: { answer: Answer; onUpvote: (id: string) => void }) {
  const [upvoted, setUpvoted] = useState(false);
  const handleUpvote = () => {
    onUpvote(answer.id);
    setUpvoted(true);
  };
  return (
    <div className="flex gap-4 group transition-all duration-300">
      <div className="flex flex-col items-center">
        <Avatar name={answer.author} size="sm" />
        <div className="w-[1px] flex-1 bg-gradient-to-b from-white/10 to-transparent my-1 group-last:hidden" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="rounded-2xl bg-neutral-900/40 border border-white/5 px-5 py-4 hover:border-white/10 hover:bg-neutral-900/60 transition-all duration-300">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-white/90">{answer.author}</span>
            <span className="text-[10px] text-neutral-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />{timeAgo(answer.created_at)}
            </span>
          </div>
          <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{answer.body}</p>
        </div>
        <button
          onClick={handleUpvote}
          disabled={upvoted}
          className={`mt-2 ml-1 flex items-center gap-1.5 text-[11px] font-semibold transition-all ${
            upvoted 
              ? 'text-emerald-400 cursor-default' 
              : 'text-neutral-500 hover:text-violet-400 active:scale-95'
          }`}
        >
          <ThumbsUp className={`h-3 w-3 ${upvoted ? 'fill-emerald-400/20' : ''}`} />
          {answer.upvotes > 0 && <span>{answer.upvotes}</span>}
          <span>{upvoted ? 'Upvoted' : 'Helpful'}</span>
        </button>
      </div>
    </div>
  );
}

/* ─── Question Card ─────────────────────────────────────────────── */
function QuestionCard({
  question, onUpvote, onAnswerUpvote
}: {
  question: Question;
  onUpvote: (id: string) => void;
  onAnswerUpvote: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localAnswers, setLocalAnswers] = useState<Answer[]>(question.answers || []);
  const [upvoted, setUpvoted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleReply = async () => {
    if (!replyBody.trim()) return;
    const author = replyAuthor.trim() || 'Anonymous Student';
    setSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('community_answers')
          .insert({ question_id: question.id, body: replyBody.trim(), author, upvotes: 0 })
          .select()
          .single();
        if (!error && data) setLocalAnswers(prev => [...prev, data as Answer]);
      } else {
        // Demo mode fallback
        const mock: Answer = {
          id: crypto.randomUUID(),
          question_id: question.id,
          body: replyBody.trim(),
          author,
          upvotes: 0,
          created_at: new Date().toISOString(),
        };
        setLocalAnswers(prev => [...prev, mock]);
      }
      setReplyBody('');
      setReplyAuthor('');
      setReplyOpen(false);
      setExpanded(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvoteClick = () => {
    if (upvoted) return;
    onUpvote(question.id);
    setUpvoted(true);
  };

  const answerCount = localAnswers.length;

  return (
    <div className="rounded-2xl bg-neutral-950/20 border border-white/5 hover:border-violet-500/20 hover:bg-neutral-950/40 hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.15)] overflow-hidden transition-all duration-300">
      {/* Question Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar name={question.author} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-white">{question.author}</span>
              <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full border uppercase ${TAG_COLORS[question.tag] || TAG_COLORS['General']}`}>
                {question.tag}
              </span>
              <span className="text-[10px] text-neutral-500 flex items-center gap-1 ml-auto">
                <Clock className="h-3 w-3" />{timeAgo(question.created_at)}
              </span>
            </div>
            <h3 className="text-base font-bold text-white leading-snug tracking-tight hover:text-violet-300 transition-colors duration-200">{question.title}</h3>
            {question.body && (
              <p className="text-sm text-neutral-400 mt-2.5 leading-relaxed">{question.body}</p>
            )}
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-4 mt-5 pt-4 border-t border-white/5">
          <button
            onClick={handleUpvoteClick}
            disabled={upvoted}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold border transition-all ${
              upvoted 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-white/[0.02] text-neutral-400 border-white/5 hover:text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/20 active:scale-95'
            }`}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${upvoted ? 'fill-emerald-400/20' : ''}`} />
            <span>{question.upvotes + (upvoted ? 1 : 0)}</span>
            <span className="text-neutral-500">{upvoted ? 'Upvoted' : 'Upvote'}</span>
          </button>

          <button
            onClick={() => { setReplyOpen(!replyOpen); if (!replyOpen) setTimeout(() => textareaRef.current?.focus(), 100); }}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold border transition-all ${
              replyOpen 
                ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' 
                : 'bg-white/[0.02] text-neutral-400 border-white/5 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20 active:scale-95'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>Reply</span>
          </button>

          {answerCount > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-auto flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold bg-white/[0.02] hover:bg-white/5 border border-white/5 text-neutral-300 hover:text-white transition-all active:scale-95"
            >
              <MessageCircle className="h-3.5 w-3.5 text-violet-400 fill-violet-400/10" />
              <span className="text-violet-300 font-extrabold">{answerCount}</span>
              <span>{answerCount === 1 ? 'Answer' : 'Answers'}</span>
              {expanded ? <ChevronUp className="h-4 w-4 text-neutral-500" /> : <ChevronDown className="h-4 w-4 text-neutral-500" />}
            </button>
          )}
        </div>
      </div>

      {/* Reply Box */}
      {replyOpen && (
        <div className="px-6 pb-6 border-t border-white/5 bg-neutral-900/20">
          <div className="flex gap-4 mt-5">
            <Avatar name={replyAuthor || 'You'} size="sm" />
            <div className="flex-1 space-y-3">
              <input
                type="text"
                value={replyAuthor}
                onChange={e => setReplyAuthor(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full rounded-xl bg-neutral-950/40 border border-white/10 px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500/40 focus:bg-neutral-900/40 focus:ring-1 focus:ring-violet-500/20 transition-all"
              />
              <textarea
                ref={textareaRef}
                rows={3}
                value={replyBody}
                onChange={e => setReplyBody(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full rounded-xl bg-neutral-950/40 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-violet-500/40 focus:bg-neutral-900/40 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleReply(); }}
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-600 font-medium">Ctrl+Enter to submit</span>
                <div className="flex gap-2.5">
                  <button onClick={() => setReplyOpen(false)} className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/5 transition-all">Cancel</button>
                  <button
                    onClick={handleReply}
                    disabled={submitting || !replyBody.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white transition-all active:scale-[0.98] shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20"
                  >
                    {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    <span>Post Answer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Answers Feed */}
      {expanded && answerCount > 0 && (
        <div className="px-6 pb-6 border-t border-white/5 space-y-4 bg-neutral-900/10">
          <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 pt-4">
            Discussion Thread ({answerCount})
          </p>
          <div className="space-y-4 pl-1">
            {localAnswers.map(ans => (
              <AnswerCard key={ans.id} answer={ans} onUpvote={onAnswerUpvote} />
            ))}
          </div>
        </div>
      )}

      {/* No answers yet prompt */}
      {expanded && answerCount === 0 && (
        <div className="px-6 pb-6 pt-5 border-t border-white/5 text-center text-xs font-medium text-neutral-500 bg-neutral-900/10">
          No answers yet — be the first to help!
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function CommunityPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [isDemo, setIsDemo] = useState(false);
  const [dbError, setDbError] = useState('');

  // New question form state
  const [formTitle, setFormTitle] = useState('');
  const [formBody, setFormBody] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formTag, setFormTag] = useState(TAGS[0]);
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  /* ── Load questions ── */
  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setDbError('');
    if (!isSupabaseConfigured()) {
      setIsDemo(true);
      setQuestions(DEMO_QUESTIONS);
      setLoading(false);
      return;
    }
    try {
      const { data: qData, error: qErr } = await supabase
        .from('community_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (qErr) throw qErr;

      const { data: aData } = await supabase
        .from('community_answers')
        .select('*')
        .order('created_at', { ascending: true });

      const answersMap: Record<string, Answer[]> = {};
      (aData || []).forEach((a: Answer) => {
        if (!answersMap[a.question_id]) answersMap[a.question_id] = [];
        answersMap[a.question_id].push(a);
      });

      const merged = (qData || []).map((q: Question) => ({
        ...q,
        answers: answersMap[q.id] || [],
        answers_count: (answersMap[q.id] || []).length,
      }));
      setQuestions(merged);
    } catch (err: any) {
      // Tables likely don't exist yet — show setup banner
      setDbError(err.message || 'Database error');
      setIsDemo(true);
      setQuestions(DEMO_QUESTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  /* ── Real-time subscription ── */
  useEffect(() => {
    if (!isSupabaseConfigured() || isDemo) return;
    const channel = supabase
      .channel('community_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_questions' }, loadQuestions)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_answers' }, loadQuestions)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isDemo, loadQuestions]);

  /* ── Post question ── */
  const handlePostQuestion = async () => {
    if (!formTitle.trim()) return;
    const author = formAuthor.trim() || 'Anonymous Student';
    setPosting(true);
    try {
      const newQ: Omit<Question, 'id' | 'created_at'> = {
        title: formTitle.trim(),
        body: formBody.trim(),
        author,
        tag: formTag,
        upvotes: 0,
      };
      if (isSupabaseConfigured() && !isDemo) {
        const { data, error } = await supabase
          .from('community_questions')
          .insert(newQ)
          .select()
          .single();
        if (error) throw error;
        setQuestions(prev => [{ ...data, answers: [], answers_count: 0 }, ...prev]);
      } else {
        const mock: Question = {
          ...newQ,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          answers: [],
          answers_count: 0,
        };
        setQuestions(prev => [mock, ...prev]);
      }
      setFormTitle('');
      setFormBody('');
      setFormAuthor('');
      setFormTag(TAGS[0]);
      setPostSuccess(true);
      setTimeout(() => setPostSuccess(false), 3000);
    } catch (err: any) {
      alert('Could not post: ' + err.message);
    } finally {
      setPosting(false);
    }
  };

  /* ── Upvote handlers ── */
  const handleUpvoteQuestion = async (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q));
    if (isSupabaseConfigured() && !isDemo) {
      const q = questions.find(x => x.id === id);
      if (q) await supabase.from('community_questions').update({ upvotes: q.upvotes + 1 }).eq('id', id);
    }
  };

  const handleUpvoteAnswer = async (id: string) => {
    setQuestions(prev => prev.map(q => ({
      ...q,
      answers: (q.answers || []).map(a => a.id === id ? { ...a, upvotes: a.upvotes + 1 } : a)
    })));
    if (isSupabaseConfigured() && !isDemo) {
      const ans = questions.flatMap(q => q.answers || []).find(a => a.id === id);
      if (ans) await supabase.from('community_answers').update({ upvotes: ans.upvotes + 1 }).eq('id', id);
    }
  };

  /* ── Filtering ── */
  const filtered = questions.filter(q => {
    const matchTag = filterTag === 'All' || q.tag === filterTag;
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.body?.toLowerCase().includes(search.toLowerCase());
    return matchTag && matchSearch;
  });

  return (
    <div className="min-h-screen w-full pb-24">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/5 py-16 bg-neutral-950/40">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        
        {/* Glowing gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute -bottom-20 right-1/4 h-[300px] w-[300px] rounded-full bg-fuchsia-600/8 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-emerald-600/5 blur-[90px]" />
        </div>
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-950/60 px-4 py-1.5 text-[11px] font-medium text-neutral-300 backdrop-blur-xl mb-6 shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            Student Q&A Hub
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-neutral-100 to-neutral-300">Ask. Answer. </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 font-black">Connect.</span>
          </h1>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A peer-driven Q&A space where students help each other navigate admissions, fees, curriculum, placements, and everything in between.
          </p>

          {/* Stats Box */}
          <div className="inline-flex flex-wrap justify-center items-center gap-x-8 gap-y-3 px-6 py-3.5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md mt-8 shadow-inner">
            {[
              { icon: MessageCircle, label: 'Questions', value: questions.length.toString() },
              { icon: TrendingUp, label: 'Answers', value: questions.reduce((s, q) => s + (q.answers?.length || 0), 0).toString() },
              { icon: Zap, label: 'Real-time Updates', value: 'Active' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 text-xs">
                <Icon className="h-4 w-4 text-violet-400" />
                <span className="font-extrabold text-white">{value}</span>
                <span className="text-neutral-500 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-10 space-y-8">

        {/* ── DB Setup Banner ── */}
        {dbError && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500" />
            <div className="flex gap-4">
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1 min-w-0">
                <p className="text-sm font-bold text-amber-300">Database connection active — schema setup required</p>
                <p className="text-xs text-neutral-400">To enable persistent cloud storage, run the following SQL script inside your Supabase SQL Editor:</p>
                <pre className="text-[10px] bg-black/50 border border-white/5 rounded-xl p-4 text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48 scrollbar-thin">{SETUP_SQL}</pre>
              </div>
            </div>
          </div>
        )}

        {isDemo && !dbError && (
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 px-5 py-3.5 flex items-center gap-3 text-xs text-sky-300 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-sky-500" />
            <Info className="h-4 w-4 shrink-0 text-sky-400" />
            <span><strong>Offline Demo Mode</strong> — Database configuration missing. Changes will be local-only and reset on reload. Configure Supabase credentials to enable cloud syncing.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 items-start">
          {/* ── Left: Feed ── */}
          <div className="space-y-6">
            {/* Search + Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search questions by keyword or topic..."
                  className="w-full rounded-full bg-neutral-900/40 backdrop-blur-xl border border-white/10 pl-11 pr-5 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 focus:bg-neutral-900/60 transition-all duration-300"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {['All', ...TAGS].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border ${
                      filterTag === tag
                        ? 'bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 text-white border-violet-500/30 shadow-lg shadow-violet-500/5 font-semibold'
                        : 'bg-neutral-950/40 text-neutral-400 border border-white/5 hover:text-white hover:border-white/10 hover:bg-neutral-900/40'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-neutral-500 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                <p className="text-sm font-semibold tracking-tight">Syncing discussion feed...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 rounded-3xl bg-neutral-950/20 border border-white/5 text-center relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-violet-500/5 to-transparent blur-3xl pointer-events-none rounded-full" />
                
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-white/10 flex items-center justify-center mb-6 relative shadow-inner">
                  <MessageCircle className="h-8 w-8 text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]" />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-violet-500 border-2 border-neutral-950"></span>
                  </span>
                </div>
                
                <h4 className="text-white font-bold text-lg tracking-tight font-outfit">Silence in the Hub</h4>
                <p className="text-neutral-500 text-sm max-w-sm mt-2 leading-relaxed">
                  {search 
                    ? "No discussions match your filter parameters. Try expanding your search criteria or resetting filters." 
                    : "There are currently no discussions in this channel. Ask a question on the right side to start the conversation!"}
                </p>
                
                {search && (
                  <button 
                    onClick={() => { setSearch(''); setFilterTag('All'); }} 
                    className="mt-6 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-white transition-all active:scale-95"
                  >
                    Reset Filters & Search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {filtered.map(q => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    onUpvote={handleUpvoteQuestion}
                    onAnswerUpvote={handleUpvoteAnswer}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Post Form ── */}
          <div className="sticky top-24 space-y-5">
            <div className="rounded-2xl bg-neutral-950/30 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              {/* Card Accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-500" />
              
              {/* Form Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/5 bg-neutral-950/40">
                <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-violet-400" />
                  Post a Question
                </h2>
                <p className="text-xs text-neutral-500 mt-1">Ask the community — someone will answer</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Author */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-neutral-500" /> Your Name
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={e => setFormAuthor(e.target.value)}
                    placeholder="e.g. Aryan K. (optional)"
                    className="w-full rounded-xl bg-neutral-950/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 focus:bg-neutral-900/60 transition-all duration-300"
                  />
                </div>

                {/* Topic */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-neutral-500" /> Topic
                  </label>
                  <div className="relative">
                    <select
                      value={formTag}
                      onChange={e => setFormTag(e.target.value)}
                      className="w-full rounded-xl bg-neutral-950/60 border border-white/10 px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 appearance-none cursor-pointer focus:bg-neutral-900/60 transition-all duration-300"
                    >
                      {TAGS.map(t => <option key={t} value={t} className="bg-neutral-950 text-white">{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>

                {/* Question Title */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5 flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-neutral-500" /> Question *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="e.g. What is the NSET passing score?"
                    className="w-full rounded-xl bg-neutral-950/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 focus:bg-neutral-900/60 transition-all duration-300"
                    onKeyDown={e => { if (e.key === 'Enter' && formTitle.trim()) document.getElementById('form-body-txt')?.focus(); }}
                  />
                </div>

                {/* Details */}
                <div>
                  <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-1.5">Details (optional)</label>
                  <textarea
                    id="form-body-txt"
                    rows={4}
                    value={formBody}
                    onChange={e => setFormBody(e.target.value)}
                    placeholder="Add more context about your question..."
                    className="w-full rounded-xl bg-neutral-950/60 border border-white/10 px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 focus:bg-neutral-900/60 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handlePostQuestion}
                  disabled={posting || !formTitle.trim()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:opacity-95 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-500/10 hover:shadow-violet-500/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed border border-white/10"
                >
                  {posting ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Posting…</>
                  ) : postSuccess ? (
                    <><Sparkles className="h-4 w-4" /> Posted! ✓</>
                  ) : (
                    <><Send className="h-4 w-4" /> Post Question</>
                  )}
                </button>

                {postSuccess && (
                  <p className="text-center text-xs text-emerald-400 font-bold animate-pulse mt-2">
                    ✓ Question posted successfully!
                  </p>
                )}
              </div>
            </div>

            {/* Tips Card */}
            <div className="rounded-2xl border border-white/5 bg-neutral-950/20 p-5 space-y-3 shadow-inner hover:border-white/10 transition-colors duration-300">
              <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Community Guidelines</p>
              {[
                'Be specific — good questions get higher-quality responses.',
                'Search existing threads before posting to avoid duplicates.',
                'Upvote answers that you find helpful or accurate.',
                'You can choose to ask your question anonymously.',
              ].map((tip, i) => (
                <div key={i} className="flex gap-2.5 text-xs text-neutral-400 leading-relaxed">
                  <span className="text-violet-400 font-bold shrink-0">{i + 1}.</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SQL Setup ─────────────────────────────────────────────────── */
const SETUP_SQL = `-- Run this in your Supabase SQL Editor
create table if not exists community_questions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text default '',
  author      text not null default 'Anonymous',
  tag         text not null default 'General',
  upvotes     integer not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists community_answers (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references community_questions(id) on delete cascade,
  body        text not null,
  author      text not null default 'Anonymous',
  upvotes     integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (allow public read/write for now)
alter table community_questions enable row level security;
alter table community_answers   enable row level security;

create policy "Public read questions"  on community_questions for select using (true);
create policy "Public insert questions" on community_questions for insert with check (true);
create policy "Public update questions" on community_questions for update using (true);

create policy "Public read answers"   on community_answers for select using (true);
create policy "Public insert answers" on community_answers for insert with check (true);
create policy "Public update answers" on community_answers for update using (true);

-- Enable Realtime
alter publication supabase_realtime add table community_questions;
alter publication supabase_realtime add table community_answers;`;

/* ─── Demo questions for offline/demo mode ──────────────────────── */
const DEMO_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'Is Scaler SST worth ₹23 Lakhs compared to a private engineering college?',
    body: 'I got a seat at BITS Hyderabad and also cleared the NSET for Scaler. BITS is ₹20L total. Scaler is ₹23L. Which one gives better ROI?',
    author: 'Rohan Mehta',
    tag: 'Comparison',
    upvotes: 42,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    answers: [
      {
        id: 'a1', question_id: '1',
        body: 'BITS brand is unmatched in traditional hiring. Scaler wins on product/startup roles. Depends on your goal — FAANG = Scaler, core/PSU = BITS.',
        author: 'Priya Sharma', upvotes: 18, created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'a2', question_id: '1',
        body: 'I\'m a Scaler student. The 1-year paid internship alone returns ₹8-15L, so effective net cost is much lower than it looks.',
        author: 'SST Student 2025', upvotes: 31, created_at: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
  },
  {
    id: '2',
    title: 'What exactly is the PAT exam pattern for Polaris School of Technology?',
    body: '',
    author: 'Ananya Singh',
    tag: 'Admissions',
    upvotes: 27,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    answers: [
      {
        id: 'a3', question_id: '2',
        body: 'PAT is 60 mins online — Logical Reasoning, Quantitative Aptitude, and Basic Coding Logic (MCQ format). 90+ JEE percentile bypasses it entirely.',
        author: 'Admissions Team', upvotes: 24, created_at: new Date(Date.now() - 43200000).toISOString(),
      },
    ],
  },
  {
    id: '3',
    title: 'Can I get an education loan for Newton School of Technology?',
    body: 'My family can afford ~₹5L upfront. Is the rest financeable through Propelld or similar?',
    author: 'Karthik R.',
    tag: 'Fees & Finance',
    upvotes: 19,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    answers: [
      {
        id: 'a4', question_id: '3',
        body: 'Yes! NST has tie-ups with GrayQuest, Propelld, and Avanse for education loans and EMI plans. Apply directly on the NST admissions page.',
        author: 'Finance Helper', upvotes: 11, created_at: new Date(Date.now() - 100000000).toISOString(),
      },
    ],
  },
  {
    id: '4',
    title: 'How is the placement record at Kalvium?',
    body: 'I see they partner with real companies during the program. Does that convert to PPOs?',
    author: 'Dev P.',
    tag: 'Placements',
    upvotes: 14,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    answers: [],
  },
];
