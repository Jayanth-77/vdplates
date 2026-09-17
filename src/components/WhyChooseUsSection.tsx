import React, { useState } from 'react';
import {
  TrendingDown,
  ShieldCheck,
  Leaf,
  Clock,
  Factory,
  Layers,
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  Percent,
  Users,
  UtensilsCrossed
} from 'lucide-react';
import { StoreInfo } from '../types';

interface WhyChooseUsSectionProps {
  storeInfo: StoreInfo;
  onOpenOrder: () => void;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({
  storeInfo,
  onOpenOrder
}) => {
  // Interactive Event Savings Calculator state
  const [eventPlates, setEventPlates] = useState<number>(1000);

  // Approximate average rates for comparison
  const factoryAvgRate = 1.70; // VD Paper Plates direct average
  const retailAvgRate = 2.90;  // Market retail shop average

  const factoryCost = Math.round(eventPlates * factoryAvgRate);
  const retailCost = Math.round(eventPlates * retailAvgRate);
  const totalSavings = retailCost - factoryCost;
  const savingsPercent = Math.round(((retailCost - factoryCost) / retailCost) * 100);

  return (
    <section id="why-choose-us-section" className="py-20 px-4 sm:px-6 bg-[#fcfbf7] border-b border-emerald-100/80 relative overflow-hidden">
      {/* Decorative ambient background blurs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-100/40 via-amber-50/50 to-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-[#15803d] border border-emerald-200 uppercase tracking-widest shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why Choose VD Paper Plates</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#143820] font-['Outfit'] mt-3.5 tracking-tight">
            Direct Factory Advantages & <br className="hidden sm:inline" />
            <span className="text-[#15803d]">Guaranteed Lowest Wholesale Costs</span>
          </h2>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            By manufacturing right here at Kotturu with high-speed automated hydraulic die presses, we cut out all middlemen, stockists, and retail markups to pass maximum savings to your family and catering business.
          </p>
        </div>

        {/* Quick Highlights / Fake Data Proof Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-14">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100/80 shadow-xs text-center hover:border-emerald-300 transition-all">
            <div className="text-2xl sm:text-3xl font-black text-[#15803d] font-['Outfit']">₹0.90</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1">Starting Price</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Zero retail commission</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100/80 shadow-xs text-center hover:border-emerald-300 transition-all">
            <div className="text-2xl sm:text-3xl font-black text-amber-600 font-['Outfit']">40%</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1">Average Savings</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Vs market retail shops</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100/80 shadow-xs text-center hover:border-emerald-300 transition-all">
            <div className="text-2xl sm:text-3xl font-black text-[#14532d] font-['Outfit']">280 GSM</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1">Heavy Board Board</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Anti-sagging strength</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100/80 shadow-xs text-center hover:border-emerald-300 transition-all">
            <div className="text-2xl sm:text-3xl font-black text-[#15803d] font-['Outfit']">45+ Mins</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1">Zero Leakage</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Hot curry & sambar tested</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100/80 shadow-xs text-center hover:border-emerald-300 transition-all">
            <div className="text-2xl sm:text-3xl font-black text-[#14532d] font-['Outfit']">50K+</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1">Plates / Day</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Rapid batch manufacturing</div>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100/80 shadow-xs text-center hover:border-emerald-300 transition-all">
            <div className="text-2xl sm:text-3xl font-black text-[#15803d] font-['Outfit']">99.8%</div>
            <div className="text-[11px] sm:text-xs font-bold text-slate-800 mt-1">On-Time Orders</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Strict 3-day scheduling</div>
          </div>
        </div>

        {/* 6 Key Advantage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Advantage 1: Low Cost / Wholesale */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#15803d] flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Direct Wholesale
                </span>
                <span className="text-xs font-bold text-amber-600">Save 35% - 42%</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#143820] font-['Outfit']">
                Ultra-Low Factory Unit Rates
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                By purchasing straight from our Kotturu factory floor, you bypass distributor cuts, transport markups, and retailer shelf margins. Plates start at just <strong className="text-[#143820]">₹0.90/piece</strong>, saving you thousands on bulk wedding and party orders.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
              <span>Retail Market: ₹1.80 - ₹4.00</span>
              <span className="font-bold text-[#15803d]">VD Factory: ₹0.90 - ₹1.90</span>
            </div>
          </div>

          {/* Advantage 2: Heavy GSM & Zero Leakage */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Strength Tested
                </span>
                <span className="text-xs font-bold text-[#15803d]">Up to 280 GSM</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#143820] font-['Outfit']">
                Heavy GSM & Zero Soggy Leakage
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Made from certified Virgin Food-Grade Duplex Board (140 to 280 GSM) laminated with an impermeable food barrier. Holds steaming Andhra sambar, rasam, hot dal, and biryani for <strong className="text-[#143820]">45+ minutes</strong> without softening or rim collapse.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
              <span>Standard: 100 - 120 GSM</span>
              <span className="font-bold text-[#15803d]">VD Plates: 180 - 280 GSM</span>
            </div>
          </div>

          {/* Advantage 3: 100% Food-Grade Eco Friendly */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#15803d] flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <Leaf className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  100% Food Grade
                </span>
                <span className="text-xs font-bold text-[#15803d]">Odorless & Safe</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#143820] font-['Outfit']">
                Eco-Friendly & Non-Toxic
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Zero harmful chemicals, unbleached virgin pulp, and completely odorless surfaces. Safe for children and sensitive family banquets. 100% biodegradable and composts naturally within 60 to 90 days, replacing plastic pollution.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
              <span>No plastic fumes or taint</span>
              <span className="font-bold text-[#15803d]">100% Safe For Hot Food</span>
            </div>
          </div>

          {/* Advantage 4: High Capacity & Fresh Batches */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#15803d] flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <Factory className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  High Capacity
                </span>
                <span className="text-xs font-bold text-[#15803d]">50,000+ Daily</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#143820] font-['Outfit']">
                Freshly Die-Pressed Batches
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Never receive aged, dusty, or warped plates stored for months in damp distributor warehouses. Every order booked 3 days ahead is freshly die-cut, precision trimmed, and packed into crisp, sanitized 100-piece hygienic shrink wraps.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
              <span>Dust-free sealed packing</span>
              <span className="font-bold text-[#15803d]">Machine Precision Dies</span>
            </div>
          </div>

          {/* Advantage 5: Mix & Match 400 Min */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Flexible Varieties
                </span>
                <span className="text-xs font-bold text-[#15803d]">Combine Any Sizes</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#143820] font-['Outfit']">
                Mix-and-Match in 400 Plates
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Unlike wholesale carton dealers who force you to purchase 2,000 plates of a single type, our 400-plate minimum lets you combine full meals plates, snack plates, and katoris in whatever breakdown fits your occasion perfectly.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
              <span>Square, Round, Snack Dies</span>
              <span className="font-bold text-[#15803d]">Single 400-min Order</span>
            </div>
          </div>

          {/* Advantage 6: Local Trust & Transparent Advance */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#15803d] flex items-center justify-center font-bold mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Direct Accountability
                </span>
                <span className="text-xs font-bold text-[#15803d]">20% Advance Only</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#143820] font-['Outfit']">
                Direct Owner Verification
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                You deal directly with factory owner <strong className="text-[#143820]">Barri Jayanth (+91 9182879375)</strong>. Lock in your batch with just 20% advance via authorized SBI or UPI; pay the remaining 80% only after inspecting your fresh order at delivery handover.
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-medium">
              <span>Verified SBI Kotturu Account</span>
              <span className="font-bold text-[#15803d]">80% On Delivery Handover</span>
            </div>
          </div>
        </div>

        {/* Interactive Cost & Savings Calculator Widget */}
        <div className="bg-gradient-to-br from-[#143820] to-[#0c2615] rounded-3xl p-6 sm:p-10 text-white shadow-2xl border-2 border-[#16a34a]/40 mb-16 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Calculator Description & Interactive Slider */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#16a34a]/30 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                <Percent className="w-3.5 h-3.5 text-emerald-400" />
                <span>Real-Time Wholesale Cost Comparison</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white leading-snug">
                Calculate Your Event Savings With Direct Factory Pricing
              </h3>

              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Adjust your required plate quantity to compare what you would pay at typical retail market stores versus booking directly from VD Paper Plates factory.
              </p>

              {/* Slider Controller */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                  <span className="text-emerald-200">Required Quantity:</span>
                  <span className="text-lg font-black text-amber-300 font-mono">
                    {eventPlates.toLocaleString()} Plates
                  </span>
                </div>

                <input
                  type="range"
                  min="400"
                  max="10000"
                  step="100"
                  value={eventPlates}
                  onChange={(e) => setEventPlates(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-950/80 rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
                />

                <div className="flex flex-wrap items-center justify-between text-[11px] text-emerald-300/80 pt-1">
                  <span>Min 400 pcs</span>
                  <div className="flex gap-2">
                    {[400, 1000, 2500, 5000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setEventPlates(preset)}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          eventPlates === preset
                            ? 'bg-[#22c55e] text-[#0c2615]'
                            : 'bg-white/10 hover:bg-white/20 text-emerald-200'
                        }`}
                      >
                        {preset >= 1000 ? `${preset / 1000}k` : preset}
                      </button>
                    ))}
                  </div>
                  <span>10,000+ pcs</span>
                </div>
              </div>
            </div>

            {/* Right Col: Big Savings Summary Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 text-slate-900 shadow-xl border border-emerald-200/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-b border-slate-100 pb-3">
                  <span>Est. Cost for {eventPlates.toLocaleString()} Plates</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-extrabold text-[11px]">
                    ~{savingsPercent}% Lower
                  </span>
                </div>

                <div className="space-y-3.5 my-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-600">Local Retail Market (@ ~₹{retailAvgRate.toFixed(2)}/pc):</span>
                    <span className="font-bold text-slate-500 line-through">
                      ₹{retailCost.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-extrabold text-[#143820] flex items-center gap-1">
                      <span>VD Factory Rate (@ ~₹{factoryAvgRate.toFixed(2)}/pc):</span>
                    </span>
                    <span className="text-lg font-black text-[#15803d]">
                      ₹{factoryCost.toLocaleString()}
                    </span>
                  </div>

                  {/* Highlight Box */}
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-center">
                    <div className="text-xs text-emerald-800 font-bold">You Save Instantly:</div>
                    <div className="text-2xl sm:text-3xl font-black text-[#15803d] font-['Outfit'] mt-0.5">
                      ₹{totalSavings.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      (Minimum 20% advance to book: ₹{Math.round(factoryCost * 0.20).toLocaleString()})
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenOrder}
                className="w-full py-3 px-5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm shadow-pill-green hover:shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Book at Factory Rates (Min 400)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison: Direct Factory vs Local Market Retail */}
        <div className="bg-white rounded-3xl border border-emerald-100 p-6 sm:p-8 shadow-card-soft">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-black uppercase text-[#15803d] tracking-wider">
              Transparency First
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#143820] font-['Outfit'] mt-1">
              VD Paper Plates vs. Local Retail Stores
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Compare our direct manufacturing quality and wholesale rates side-by-side
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b-2 border-emerald-100">
                  <th className="py-3 px-4 font-bold text-slate-700">Feature / Quality Metric</th>
                  <th className="py-3 px-4 font-extrabold text-[#15803d] bg-emerald-50/70 rounded-t-xl">
                    VD Paper Plates (Factory)
                  </th>
                  <th className="py-3 px-4 font-bold text-slate-500">
                    Local Retail / Middlemen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-800">Unit Price Range</td>
                  <td className="py-3.5 px-4 font-black text-[#15803d] bg-emerald-50/40">
                    ₹0.90 – ₹1.90 / plate (Wholesale)
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    ₹1.80 – ₹4.00 / plate (+40% markup)
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-800">Paperboard Rigidity</td>
                  <td className="py-3.5 px-4 font-black text-[#15803d] bg-emerald-50/40">
                    140 - 280 GSM Heavy Virgin Board
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    100 - 130 GSM Light / Thin Board
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-800">Hot Gravy & Sambar Hold</td>
                  <td className="py-3.5 px-4 font-black text-[#15803d] bg-emerald-50/40">
                    45+ Mins 100% Leakproof Tested
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Sogginess & rim bends in 5–10 mins
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-800">Batch Freshness</td>
                  <td className="py-3.5 px-4 font-black text-[#15803d] bg-emerald-50/40">
                    Freshly die-cut & sealed 3 days ahead
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Old warehouse stock, often dusty/damp
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-800">Variety Flexibility</td>
                  <td className="py-3.5 px-4 font-black text-[#15803d] bg-emerald-50/40">
                    Mix 6 shapes/sizes in 400-min order
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Strict full carton packs of single size
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-slate-800">Payment & Advance Terms</td>
                  <td className="py-3.5 px-4 font-black text-[#15803d] bg-emerald-50/40">
                    20% advance via UPI/SBI, 80% on handover
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    Full 100% upfront cash payment
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
