'use client';

import React, { useState } from 'react';
import { IndianRupee, HelpCircle, AlertCircle, TrendingUp, Calendar, Landmark, Check } from 'lucide-react';

export default function ROICalculator() {
  const [totalFees, setTotalFees] = useState(18); // In Lakhs
  const [expectedSalary, setExpectedSalary] = useState(15); // In Lakhs per Annum (LPA)
  const [hasLoan, setHasLoan] = useState(false);
  const [loanTenure, setLoanTenure] = useState(5); // In Years
  const [interestRate, setInterestRate] = useState(9.5); // % p.a.

  // Calculators
  const totalCostRs = totalFees * 100000;
  const lpaRs = expectedSalary * 100000;
  const monthlySalaryRs = Math.round(lpaRs / 12);

  // 1. Payback Period (saving 50% of monthly salary)
  const monthlySavingsRs = monthlySalaryRs * 0.5;
  const paybackMonths = monthlySavingsRs > 0 ? Math.ceil(totalCostRs / monthlySavingsRs) : 0;
  const paybackYears = (paybackMonths / 12).toFixed(1);

  // 2. Loan EMI (P * R * (1+R)^N / ((1+R)^N - 1))
  const P = totalCostRs;
  const monthlyRate = (interestRate / 12) / 100;
  const N = loanTenure * 12;
  const emi = P * monthlyRate * Math.pow(1 + monthlyRate, N) / (Math.pow(1 + monthlyRate, N) - 1);
  const monthlyEmiRs = Math.round(emi);

  return (
    <div className="glass-panel border border-white/5 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-2xl bg-black/40 grid grid-cols-1 md:grid-cols-12 gap-8 relative overflow-hidden">
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-emerald-600/5 blur-[80px]" />

      {/* Sliders Area */}
      <div className="md:col-span-7 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-400" /> ROI & Tuition Cost Calculator
          </h2>
          <p className="text-xs text-neutral-400">Estimate the real financial return of a B.Tech alternative program.</p>
        </div>

        {/* Cost Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-neutral-300">Total Program Cost (Tuition + Residential)</span>
            <span className="font-extrabold text-emerald-400 text-sm">₹{totalFees} Lakhs</span>
          </div>
          <input
            type="range"
            min="3"
            max="55"
            step="0.5"
            value={totalFees}
            onChange={(e) => setTotalFees(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-emerald-500 border border-white/5"
          />
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>₹3L</span>
            <span>₹25L</span>
            <span>₹55L</span>
          </div>
        </div>

        {/* Expected Salary Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-neutral-300">Target Average Starting Salary (LPA)</span>
            <span className="font-extrabold text-violet-400 text-sm">₹{expectedSalary} LPA</span>
          </div>
          <input
            type="range"
            min="5"
            max="35"
            step="0.5"
            value={expectedSalary}
            onChange={(e) => setExpectedSalary(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-violet-500 border border-white/5"
          />
          <div className="flex justify-between text-[10px] text-neutral-500">
            <span>₹5 LPA</span>
            <span>₹20 LPA</span>
            <span>₹35 LPA</span>
          </div>
        </div>

        {/* Student Loan Highlighted Selector Card */}
        <div className="pt-4 border-t border-white/5 space-y-4 select-none">
          <div 
            onClick={() => setHasLoan(!hasLoan)}
            className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
              hasLoan 
                ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] text-white scale-[1.01]' 
                : 'bg-neutral-950/40 border-white/5 hover:border-white/10 text-neutral-300 hover:bg-neutral-950/60'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                hasLoan 
                  ? 'bg-emerald-500 border-emerald-400 text-white' 
                  : 'bg-neutral-900 border-white/20'
              }`}>
                {hasLoan && <Check className="h-3.5 w-3.5" />}
              </div>
              <div>
                <p className="text-xs font-bold tracking-wide">Model Student Loan Options</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Calculate EMI and monthly debt burden</p>
              </div>
            </div>
          </div>

          {hasLoan && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in p-4 rounded-xl border border-white/5 bg-white/[0.01]">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                  <Landmark className="h-3 w-3" /> Interest Rate (% p.a.)
                </label>
                <input
                  type="number"
                  min="6"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 9.5)}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Tenure (Years)
                </label>
                <select
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 px-2.5 py-1.5 text-xs text-white outline-none focus:border-emerald-500/50"
                >
                  {Array.from({ length: 16 }, (_, i) => i + 5).map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} Years
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Output Metrics Grid (Spacing fix: stacked and centered nicely with a header) */}
      <div className="md:col-span-5 flex flex-col justify-start p-6 rounded-2xl bg-white/[0.02] border border-white/5 gap-6 h-full min-h-[280px]">
        <div className="border-b border-white/5 pb-3 select-none">
          <span className="text-[9px] uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">Financial Forecast</span>
        </div>
        
        {/* Metric 1: Monthly income */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 select-none">Gross Monthly Salary</p>
          <p className="text-2xl font-black text-white">₹{monthlySalaryRs.toLocaleString('en-IN')}</p>
        </div>

        {/* Metric 2: Payback period */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 select-none">
            <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Realistic Payback Period</p>
            <span className="group relative cursor-pointer text-neutral-600 hover:text-neutral-400">
              <HelpCircle className="h-3.5 w-3.5" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 w-48 p-2 rounded-lg bg-neutral-900 border border-white/10 text-[9px] text-neutral-400 font-light leading-normal hidden group-hover:block z-50">
                Calculated assuming you allocate 50% of your starting net monthly income to recover tuition costs.
              </span>
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {paybackYears} Years <span className="text-xs text-neutral-500 font-normal">({paybackMonths} Months)</span>
          </p>
        </div>

        {/* Loan EMI display (Pushed to bottom of stretch container) */}
        {hasLoan && (
          <div className="mt-auto pt-4 border-t border-white/5 space-y-1 bg-emerald-500/5 -mx-6 -mb-6 p-6 rounded-b-2xl border-emerald-500/10">
            <p className="text-[9px] uppercase font-extrabold tracking-wider text-emerald-400">Estimated Monthly EMI</p>
            <p className="text-lg font-black text-white">₹{monthlyEmiRs.toLocaleString('en-IN')}</p>
            <p className="text-[9px] text-neutral-500">Compound interest loan modeled over {loanTenure} years.</p>
          </div>
        )}

      </div>
    </div>
  );
}
