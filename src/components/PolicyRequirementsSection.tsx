import React from 'react';
import { Calendar, Package, CreditCard, Clock, ShieldCheck, ArrowRight, CheckCircle2, Sparkles, Leaf, Award, Truck } from 'lucide-react';
import { StoreInfo } from '../types';

interface PolicyRequirementsSectionProps {
  storeInfo: StoreInfo;
  onOpenOrder: () => void;
}

export const PolicyRequirementsSection: React.FC<PolicyRequirementsSectionProps> = ({
  storeInfo,
  onOpenOrder
}) => {
  return (
    <section id="policy-requirements-section" className="py-14 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-white via-[#f7faf5] to-[#fbf8f1] border-t border-emerald-100/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#eaf6ee] text-[#166534] border border-emerald-200/80 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>FACTORY ORDERING POLICIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#143820] font-['Outfit'] tracking-tight">
            Simple, Transparent <span className="text-[#16a34a]">Booking Standards</span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            To guarantee direct factory rates in Kotturu Mandal and deliver fresh, leak-proof quality for your events, every order follows these 3 simple guidelines.
          </p>
        </div>

        {/* 3 Ordering Policy Cards in 3D Soft Pastel Styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Policy 1: Schedule Requirement (Soft Warm Cream Pastel) */}
          <div className="group rounded-3xl p-7 bg-[#fef9e8] border border-amber-200/80 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider bg-white/90 px-3 py-1 rounded-full border border-amber-200 shadow-2xs">
                  Schedule Policy
                </span>
                <div className="w-11 h-11 rounded-2xl bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                  <Calendar className="w-5 h-5 text-amber-800" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[#143820] font-['Outfit']">
                Order 3 Days in Advance
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Orders <strong className="text-[#143820]">must be placed at least 3 days in advance</strong>. This allows sufficient time for raw paper die calibration, precision hot-press lamination, and fresh batch drying for sturdy, leak-proof durability.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Production Lead Time</span>
              <span className="font-extrabold text-amber-900 bg-amber-200/60 px-3 py-1 rounded-full">≥ 3 Days Prior</span>
            </div>
          </div>

          {/* Policy 2: Minimum Quantity (Soft Mint Green Pastel) */}
          <div className="group rounded-3xl p-7 bg-[#eef8f2] border border-emerald-200/80 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wider bg-white/90 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
                  Batch Quantity
                </span>
                <div className="w-11 h-11 rounded-2xl bg-emerald-200/80 text-emerald-900 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-emerald-800" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[#143820] font-['Outfit']">
                400 Plates Per Order
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                To guarantee direct factory rates starting from <strong className="text-[#143820]">₹0.90/plate</strong>, our minimum booking requirement is <strong className="text-[#143820]">400 plates</strong> total. You can freely mix and match any square, round, or snack plate varieties.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-emerald-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Wholesale Rate</span>
              <span className="font-extrabold text-[#15803d] bg-white/90 px-3 py-1 rounded-full border border-emerald-200">₹0.90 – ₹1.90 / pc</span>
            </div>
          </div>

          {/* Policy 3: Payment Terms (Soft Sky Blue Pastel) */}
          <div className="group rounded-3xl p-7 bg-[#eff6fc] border border-sky-200/80 shadow-card-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-sky-900 uppercase tracking-wider bg-white/90 px-3 py-1 rounded-full border border-sky-200 shadow-2xs">
                  Payment Security
                </span>
                <div className="w-11 h-11 rounded-2xl bg-sky-200/80 text-sky-900 flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5 text-sky-800" />
                </div>
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-[#143820] font-['Outfit']">
                20% Advance Required
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Pay a minimum <strong className="text-[#143820]">20% advance payment</strong> via PhonePe QR scanner or SBI bank transfer to Barri Jayanth. Upload your transaction screenshot to lock machine scheduling and receive official electronic verification.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-sky-200/60 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Confirmation Mode</span>
              <span className="font-extrabold text-sky-950 bg-sky-200/60 px-3 py-1 rounded-full">Screenshot Upload</span>
            </div>
          </div>
        </div>

        {/* 4 Brand Pillars / Trust Strip */}
        <div className="mt-12 bg-white/90 backdrop-blur-xs rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-card-soft grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#eaf6ee] text-[#166534] flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-[#16a34a]" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#143820]">100% Food Safe</h4>
              <p className="text-xs text-slate-500 mt-0.5">Hygienic virgin board with heat-resistant film</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#fef9e8] text-amber-900 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#143820]">Heavy GSM Sturdiness</h4>
              <p className="text-xs text-slate-500 mt-0.5">Rigid rims that hold sambar, biryani & curries</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#eff6fc] text-sky-900 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#143820]">Best Factory Rates</h4>
              <p className="text-xs text-slate-500 mt-0.5">No middleman fees — starting at ₹0.90 per plate</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#f5eef8] text-purple-900 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#143820]">Live Dispatch Track</h4>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status updates with email notification</p>
            </div>
          </div>
        </div>

        {/* Start Booking CTA Button */}
        <div className="mt-10 text-center">
          <button
            id="requirements-book-now-btn"
            onClick={onOpenOrder}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#15803d] hover:bg-[#166534] text-white text-sm sm:text-base font-extrabold shadow-pill-green hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Start Booking with 20% Advance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

