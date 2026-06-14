import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ChatBot from '@/components/ChatBot';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Praxis Grad | Compare New-Age B.Tech Colleges & Academies',
  description: 'The ultimate comparison matrix and full-stack directory for alternative, modern B.Tech alternative technology colleges in India (Scaler, Newton, Polaris, etc.). Analyze curriculum, placement records, fees, and FAANG mentors.',
  keywords: ['B.Tech Alternatives', 'Scaler School of Technology', 'Newton School of Technology', 'Polaris School of Technology', 'Coding Bootcamps India', 'B.Tech CS and AI'],
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#030303] text-slate-100 selection:bg-violet-600/30 selection:text-violet-200">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        
        {/* Floating Global Chatbot Widget */}
        <ChatBot />
        
        {/* Futuristic Minimal Footer */}
        <footer className="w-full py-8 border-t border-white/5 bg-black/40 text-center text-xs text-neutral-500 font-medium">
          <div className="max-w-7xl mx-auto px-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 Praxis Grad. Built for alternative B.Tech colleges evaluation.</p>
              <div className="flex gap-4">
                <a href="/admin" className="hover:text-violet-400 transition-colors">Admin Sync Console</a>
                <span className="text-white/10">|</span>
                <a href="/compare" className="hover:text-emerald-400 transition-colors">College Comparison</a>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/30 text-left max-w-2xl mx-auto leading-relaxed select-none shadow-[0_0_20px_rgba(245,158,11,0.03)] transition-all duration-300 relative overflow-hidden backdrop-blur-md">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 to-amber-600 animate-pulse" />
              <div className="flex items-start gap-3 pl-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-neutral-300 font-medium leading-relaxed">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500 font-extrabold uppercase tracking-wider text-[9.5px] mr-2">Disclaimer Notice:</span>
                  Brochures are the property of their respective colleges and are provided for informational purposes. If any institution wishes content to be removed, please <a href="mailto:contact@praxisgrad.com" className="text-amber-400 hover:text-amber-300 underline underline-offset-2 font-semibold transition-colors">contact us</a>.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
