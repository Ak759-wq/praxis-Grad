'use client';

import React from 'react';
import { College } from './CollegeCard';
import { 
  Laptop, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  Monitor, 
  Terminal, 
  Battery, 
  HardDrive, 
  Sparkles, 
  Layers,
  Zap
} from 'lucide-react';

interface LaptopShowcaseProps {
  colleges?: College[]; // Maintained to prevent breaking parent component imports
}

export default function LaptopShowcase({ colleges }: LaptopShowcaseProps) {
  return (
    <div className="space-y-8">
      {/* Dynamic Header Banner */}
      <div className="glass-panel border border-violet-500/20 bg-gradient-to-r from-violet-950/20 via-neutral-900/40 to-emerald-950/25 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full -mr-24 -mt-24 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/5 blur-[120px] rounded-full -ml-24 -mb-24 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-stretch gap-8">
          <div className="max-w-2xl flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-300">
                <Cpu className="h-3.5 w-3.5" /> 2026 Developer Hardware Checklist
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Why Developer Laptop Specs Matter
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light font-sans">
                Modern software engineering is resource-heavy. Running a local React server, a hot-reloading backend, containerized database instances (Docker), compiling code, and indexing files in IDEs simultaneously will choke standard consumer machines. Choosing the right workstation prevents performance bottlenecks and ensures compiling efficiency.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4">
              <ShieldAlert className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-400">Critical Resource Baseline Warning</p>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Compiles, simulator builds, and package dependency indexes require high read/write speeds and multi-threading. <strong>16GB RAM and 512GB SSD</strong> is the absolute minimum baseline for developers in 2026.
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 shrink-0 bg-neutral-950/60 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between gap-4">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/10 blur-2xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-[9.5px] uppercase font-black tracking-widest text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Target Dev Baseline
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[8.5px] uppercase font-bold tracking-wider text-neutral-500">Memory</span>
                <p className="text-xs font-bold text-white">16GB RAM</p>
                <p className="text-[9.5px] text-neutral-400 leading-none">DDR5 / Unified</p>
              </div>
              <div className="space-y-1">
                <span className="text-[8.5px] uppercase font-bold tracking-wider text-neutral-500">Storage</span>
                <p className="text-xs font-bold text-white">512GB SSD</p>
                <p className="text-[9.5px] text-neutral-400 leading-none">PCIe NVMe Min</p>
              </div>
              <div className="space-y-1 border-t border-white/5 pt-2">
                <span className="text-[8.5px] uppercase font-bold tracking-wider text-neutral-500">Processor</span>
                <p className="text-xs font-bold text-white">6+ Cores</p>
                <p className="text-[9.5px] text-neutral-400 leading-none">i5 / Ryzen 5 / Apple M</p>
              </div>
              <div className="space-y-1 border-t border-white/5 pt-2">
                <span className="text-[8.5px] uppercase font-bold tracking-wider text-neutral-500">Platform</span>
                <p className="text-xs font-bold text-white">Unix Friendly</p>
                <p className="text-[9.5px] text-neutral-400 leading-none">macOS / WSL2 / Linux</p>
              </div>
            </div>

            <div className="text-[9.5px] text-neutral-400 text-center bg-white/5 rounded-lg py-1.5 border border-white/5 font-sans">
              Verified for 2026 Dev Stack
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Category Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Apple MacBook Category */}
        <div className="group relative rounded-3xl border border-white/5 bg-gradient-to-br from-violet-950/15 via-neutral-900/40 to-fuchsia-950/10 hover:border-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/5 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden">
          {/* Top ambient glow bubble */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/5 blur-[60px]" />
          
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-violet-400">Option 01 / Apple Silicon</span>
                <h3 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-violet-400" /> Apple MacBook Series
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-snug">The gold standard for developer efficiency, Unix compliance, and stellar battery life.</p>
              </div>
              <span className="rounded-lg px-2.5 py-1 text-[10px] font-black bg-violet-500/10 text-violet-300 border border-violet-500/20">
                macOS Native
              </span>
            </div>

            {/* Hardware Specifications List */}
            <div className="space-y-4 border-y border-white/5 py-5">
              {/* CPU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-violet-400" /> Processor (CPU)
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-violet-300">Min:</span> Apple M4 or M5 chip (8-core CPU / 10-core GPU)</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> M4/M5 Pro or Max (for advanced virtualization and faster compiling)</p>
                </div>
              </div>

              {/* RAM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-violet-400" /> Memory (RAM)
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-violet-300">Min:</span> 16GB Unified Memory</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> 24GB or 32GB+ Unified Memory (highly recommended for running local LLMs and multi-docker architecture)</p>
                </div>
              </div>

              {/* Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-violet-400" /> Storage (SSD)
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-violet-300">Min:</span> 512GB PCIe SSD</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> 1TB or 2TB SSD (node_modules, caches, and local packages expand very quickly)</p>
                </div>
              </div>

              {/* GPU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-violet-400" /> Graphics (GPU)
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-neutral-200">Integrated 10-core GPU or higher with Hardware-accelerated Ray Tracing</p>
                  <p className="text-[11px] text-neutral-400">Shared unified bandwidth allows GPU to access system RAM instantly, ideal for lightweight ML tasks.</p>
                </div>
              </div>

              {/* Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-violet-400" /> Display specs
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-violet-300">Min:</span> 13.6" Liquid Retina (500 nits, P3 Wide Color)</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> 14.2" or 16.2" Liquid Retina XDR (120Hz ProMotion, 1000 nits sustained)</p>
                </div>
              </div>

              {/* Battery & Power */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Battery className="h-3.5 w-3.5 text-violet-400" /> Battery life
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-neutral-200">Up to 18–22 hours real-world coding runtime</p>
                  <p className="text-[11px] text-neutral-400">Excellent standby efficiency; runs at 100% capacity even when unplugged.</p>
                </div>
              </div>
            </div>

            {/* Recommended Workloads */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Recommended For:</h4>
              <div className="flex flex-wrap gap-1.5">
                {['iOS / macOS Native Apps (Xcode)', 'Full-Stack Web Dev (Node.js, Next.js)', 'Docker & Microservices', 'Local LLMs & AI Prototyping'].map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300 font-medium border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="rounded-2xl bg-violet-950/15 border border-violet-500/15 p-4 space-y-1 relative">
              <Zap className="absolute top-4 right-4 h-4 w-4 text-violet-400 animate-pulse" />
              <p className="text-[10.5px] font-black uppercase text-violet-300 tracking-wider">Pro Developer Advice</p>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-light">
                MacBook memory and SSD storage are unified and soldered directly onto the system board, making hardware upgrades after purchase impossible. <strong>Always choose the 16GB RAM + 512GB SSD model as the minimum</strong>. 8GB models suffer from system paging bottlenecks that will degrade SSD lifetime.
              </p>
            </div>
          </div>
        </div>

        {/* Windows & Linux Category */}
        <div className="group relative rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-950/15 via-neutral-900/40 to-cyan-950/10 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden">
          {/* Top ambient glow bubble */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-emerald-500/5 blur-[60px]" />
          
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Option 02 / Intel & AMD x86_64</span>
                <h3 className="text-xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                  <Terminal className="h-5 w-5 text-emerald-400" /> Windows & Linux Workstations
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-snug">Unmatched hardware flexibility, dedicated graphics power, and native Linux configuration.</p>
              </div>
              <span className="rounded-lg px-2.5 py-1 text-[10px] font-black bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                WSL2 Enabled
              </span>
            </div>

            {/* Hardware Specifications List */}
            <div className="space-y-4 border-y border-white/5 py-5">
              {/* CPU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-emerald-400" /> Processor (CPU)
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-emerald-300">Min:</span> Intel Core i5 (13th Gen) or AMD Ryzen 5 (7000 Series) – Min 10 Cores / 12 Threads</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> Intel Core i7 (14th Gen) or AMD Ryzen 7 (8000 Series) – 14+ Cores / 20+ Threads</p>
                </div>
              </div>

              {/* RAM */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-emerald-400" /> Memory (RAM)
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-emerald-300">Min:</span> 16GB DDR5 RAM (Dual-channel configuration)</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> 32GB or 64GB DDR5 RAM (highly recommended for running multiple heavy JVMs, Android Emulators, or VMs)</p>
                </div>
              </div>

              {/* Storage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <HardDrive className="h-3.5 w-3.5 text-emerald-400" /> Storage (SSD)
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-emerald-300">Min:</span> 512GB M.2 NVMe PCIe Gen4 SSD (speeds ≥ 3500MB/s)</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> 1TB or 2TB NVMe PCIe Gen4/Gen5 SSD (speeds ≥ 7000MB/s)</p>
                </div>
              </div>

              {/* GPU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Graphics (GPU)
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-emerald-300">Min:</span> Integrated Intel Iris Xe or AMD Radeon Graphics</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> Dedicated NVIDIA GeForce RTX 4050/4060/4070 (6GB/8GB VRAM) for CUDA-accelerated ML and graphics</p>
                </div>
              </div>

              {/* Display */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Monitor className="h-3.5 w-3.5 text-emerald-400" /> Display specs
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-white"><span className="font-bold text-emerald-300">Min:</span> 14.0" or 15.6" IPS FHD (1920x1080), 300 nits, anti-glare</p>
                  <p className="text-[11px] text-neutral-400"><span className="font-medium text-neutral-300">Optimal:</span> 14" to 16" OLED or IPS QHD/4K (120Hz+, 100% sRGB or DCI-P3, 400+ nits)</p>
                </div>
              </div>

              {/* Battery & Power */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-white/5 pt-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-1.5">
                  <Battery className="h-3.5 w-3.5 text-emerald-400" /> Battery life
                </span>
                <div className="sm:col-span-2 space-y-1">
                  <p className="text-xs text-neutral-200">6–10 hours coding battery life (Varies widely by hardware model)</p>
                  <p className="text-[11px] text-neutral-400">Requires 100W+ Type-C Power Delivery (PD) charger for fast-charging on the move.</p>
                </div>
              </div>
            </div>

            {/* Recommended Workloads */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Recommended For:</h4>
              <div className="flex flex-wrap gap-1.5">
                {['Enterprise Java & C# .NET Platforms', 'Game Dev (Unity, Unreal Engine 5)', 'Android Apps (Android Studio)', 'CUDA GPU Machine Learning / AI'].map((tag, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300 font-medium border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Pro Tip Box */}
            <div className="rounded-2xl bg-emerald-950/15 border border-emerald-500/15 p-4 space-y-1 relative">
              <Zap className="absolute top-4 right-4 h-4 w-4 text-emerald-400 animate-pulse" />
              <p className="text-[10.5px] font-black uppercase text-emerald-300 tracking-wider">Pro Developer Advice</p>
              <p className="text-[11px] text-neutral-300 leading-relaxed font-light">
                Windows laptop modules are often expandable. When buying, ensure the laptop supports upgradable SODIMM slots for RAM and has a secondary M.2 SSD slot. To ensure seamless Linux scripting compatibility, always set up **WSL2 (Windows Subsystem for Linux)** with an Ubuntu distribution.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
