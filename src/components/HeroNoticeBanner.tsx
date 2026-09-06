import React from 'react';
import {
  Package, MapPin, Phone, MessageCircle, ExternalLink, ChevronRight,
  ShieldCheck, Leaf, Sparkles, CheckCircle2, Play, Award
} from 'lucide-react';
import { StoreInfo } from '../types';

interface HeroNoticeBannerProps {
  storeInfo: StoreInfo;
  onScrollToCatalog: () => void;
  onOpenOrder: () => void;
}

export const HeroNoticeBanner: React.FC<HeroNoticeBannerProps> = ({
  storeInfo,
  onScrollToCatalog,
  onOpenOrder
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf8f1] via-[#f7f4ea] to-[#f4f8f3] pt-6 sm:pt-10 pb-16 lg:pb-24 border-b border-emerald-100/60">
      {/* Background Soft Glows & Botanical Accents */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Value Props, CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#eaf6ee] text-[#166534] border border-emerald-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" />
              <span className="tracking-wide">🌱 Fresh • Eco Friendly • Affordable</span>
            </div>

            {/* Main Attractive Hero Heading */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-[#143820] tracking-tight font-['Outfit'] leading-[1.12]">
                Premium Paper Plates <br />
                <span className="text-[#16a34a] inline-block">for Every Occasion</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-700 max-w-xl font-normal leading-relaxed pt-1">
                From family functions to grand celebrations, we bring you high-quality paper plates at the <strong className="font-bold text-[#143820]">best prices</strong> — manufactured directly in Kotturu and delivered to your doorstep!
              </p>
            </div>

            {/* 3 Key Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 text-xs sm:text-sm font-semibold text-[#14532d]">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Eco Friendly</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Sturdy & Durable</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>Best Prices</span>
              </div>
            </div>

            {/* Action Buttons: Order Now & Watch / Catalog */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                id="hero-order-now-btn"
                onClick={onOpenOrder}
                className="group px-7 py-3.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white text-sm sm:text-base font-bold shadow-pill-green hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2.5"
              >
                <span>Order Now</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onScrollToCatalog}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-[#f3faf4] text-[#14532d] border-2 border-emerald-200/80 text-sm sm:text-base font-bold shadow-2xs hover:border-emerald-400 transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-[#15803d] text-[#15803d]" />
                <span>View Plates & Rates</span>
              </button>
            </div>

            {/* Direct Factory Location & Hotlines Notice */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <a
                href={storeInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-emerald-900 border border-emerald-200/70 font-medium transition-all shadow-2xs"
              >
                <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
                <span>Kotturu Mandal, Metturu Bit-2 Road 4</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={`https://wa.me/91${storeInfo.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold transition-all shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp: 9182879375</span>
              </a>

              <a
                href={`tel:${storeInfo.callOnlyNumber || '7382468841'}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 hover:bg-white text-slate-700 border border-slate-200 font-bold transition-all shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-[#15803d]" />
                <span>Call: 7382468841</span>
              </a>
            </div>
          </div>

          {/* Right Column: 3D Paper Plate Presentation matching Reference Image */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Playful Floating Hand-drawn Badge */}
            <div className="absolute -top-4 right-2 sm:right-6 z-20 bg-white/95 backdrop-blur-xs px-4 py-2 rounded-2xl shadow-lg border border-amber-200/80 -rotate-3 animate-float-reverse">
              <div className="text-[13px] font-extrabold text-[#143820] leading-tight flex items-center gap-1.5">
                <span>Perfect for Marriages, Parties, Events & More!</span>
                <span className="text-amber-500 text-base">✨</span>
              </div>
              <div className="text-[10px] text-[#16a34a] font-bold mt-0.5">
                • 100% Food Grade • Heavy GSM Board
              </div>
            </div>

            {/* Main 3D Plate Stage Showcase */}
            <div className="relative w-full max-w-[460px] aspect-[4/3.7] flex items-center justify-center">
              {/* Wooden Banquet Tabletop Surface Base */}
              <div className="absolute bottom-2 left-4 right-4 h-24 bg-gradient-to-t from-[#c59a68] via-[#e2be92] to-[#eed7b5] rounded-3xl opacity-90 shadow-2xl border-t border-[#f7e7ce]" />
              {/* Table Wood Plank Lines */}
              <div className="absolute bottom-2 left-6 right-6 h-20 opacity-20 pointer-events-none flex flex-col justify-between py-2">
                <div className="w-full h-px bg-[#7c5022]" />
                <div className="w-full h-px bg-[#7c5022]" />
                <div className="w-full h-px bg-[#7c5022]" />
              </div>

              {/* Natural Lush Botanical Banana & Tropical Leaves */}
              {/* Back Left Large Monstera Leaf */}
              <div className="absolute -top-6 -left-6 w-36 h-36 opacity-85 pointer-events-none animate-leaf-sway z-0">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-md">
                  <path d="M50 10 C30 10 10 30 10 60 C10 80 30 90 50 95 C70 90 90 80 90 60 C90 30 70 10 50 10 Z" fill="#2d7a3a" />
                  <path d="M50 15 L50 90" stroke="#1b5224" strokeWidth="2" />
                  <path d="M50 30 Q30 35 20 40" stroke="#1b5224" strokeWidth="1.5" />
                  <path d="M50 30 Q70 35 80 40" stroke="#1b5224" strokeWidth="1.5" />
                  <path d="M50 50 Q25 55 15 62" stroke="#1b5224" strokeWidth="1.5" />
                  <path d="M50 50 Q75 55 85 62" stroke="#1b5224" strokeWidth="1.5" />
                  <circle cx="30" cy="45" r="4" fill="#f7f4ea" />
                  <circle cx="70" cy="45" r="4" fill="#f7f4ea" />
                  <circle cx="28" cy="65" r="5" fill="#f7f4ea" />
                  <circle cx="72" cy="65" r="5" fill="#f7f4ea" />
                </svg>
              </div>

              {/* Back Right Fresh Palm / Banana Leaf */}
              <div className="absolute -top-2 right-2 w-32 h-44 opacity-85 pointer-events-none animate-float-slow z-0 rotate-12">
                <svg viewBox="0 0 80 120" fill="none" className="w-full h-full drop-shadow-md">
                  <path d="M40 5 C15 30 10 70 20 110 C30 115 50 115 60 110 C70 70 65 30 40 5 Z" fill="#3aa64c" />
                  <path d="M40 5 L40 112" stroke="#20692d" strokeWidth="2.5" />
                  <path d="M40 25 Q20 30 12 40" stroke="#20692d" strokeWidth="1.5" />
                  <path d="M40 25 Q60 30 68 40" stroke="#20692d" strokeWidth="1.5" />
                  <path d="M40 50 Q18 58 14 70" stroke="#20692d" strokeWidth="1.5" />
                  <path d="M40 50 Q62 58 66 70" stroke="#20692d" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Stacked Paper Plates Base in 3D Perspective (Front Right) */}
              <div className="absolute bottom-7 right-3 sm:right-6 z-10 flex flex-col items-center">
                {/* 3D Stacked Rim Layers */}
                <div className="relative w-44 sm:w-52 h-20 flex items-center justify-center">
                  {/* Bottom Shadow on Wood */}
                  <div className="absolute bottom-0 w-44 h-8 bg-[#523315]/40 rounded-full blur-md" />

                  {/* Multiple stacked plate edges */}
                  <div className="absolute bottom-2 w-42 h-10 bg-[#e4cfb4] rounded-[50%] border-b-2 border-[#b89b77] shadow-sm" />
                  <div className="absolute bottom-3 w-43 h-10 bg-[#f1e5d3] rounded-[50%] border-b-2 border-[#c2aa8a] shadow-sm" />
                  <div className="absolute bottom-4.5 w-44 h-10 bg-[#faf4eb] rounded-[50%] border-b-2 border-[#d6c4aa] shadow-sm" />
                  <div className="absolute bottom-6 w-44 sm:w-50 h-10 bg-white rounded-[50%] border-b border-amber-200 shadow-md flex items-center justify-center overflow-hidden">
                    {/* Golden Sunburst rim pattern on top stack plate */}
                    <div className="w-full h-full border-4 border-amber-300/80 rounded-[50%] flex items-center justify-center bg-gradient-to-r from-[#fff8e8] via-white to-[#fff5df]">
                      <span className="text-[9px] font-extrabold text-amber-800/80 tracking-widest uppercase">
                        Buffet Stack
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Foreground Hero Plate: Large Vibrant Tropical Green Leaf Plate */}
              <div className="absolute top-2 sm:top-0 left-4 sm:left-6 z-15 w-56 sm:w-64 aspect-square animate-float-slow cursor-pointer" onClick={onScrollToCatalog}>
                {/* Floating Realistic Soft Drop Shadow */}
                <div className="absolute -bottom-4 left-8 right-8 h-10 bg-emerald-950/20 rounded-full blur-xl transform scale-95" />

                {/* Main 3D Leaf Pattern Plate */}
                <div className="relative w-full h-full rounded-full p-2.5 bg-gradient-to-br from-[#d4f2cf] via-[#a8e29e] to-[#71c565] shadow-2xl border-4 border-[#e9fae6] flex items-center justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
                  {/* Embossed Fluted Paper Rim */}
                  <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-[#448b37]/40 pointer-events-none" />

                  {/* Leaf Patterned Inner Bowl */}
                  <div className="w-full h-full rounded-full bg-[#8bd378] overflow-hidden relative flex items-center justify-center shadow-inner">
                    {/* Natural Monstera Leaf Motifs */}
                    <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
                      <rect width="200" height="200" fill="#a4df92" />
                      {/* Leaf 1 */}
                      <path d="M100 20 C60 10 30 50 45 95 C55 120 100 155 100 160 C100 155 145 120 155 95 C170 50 140 10 100 20 Z" fill="#69b852" />
                      <path d="M100 25 L100 155" stroke="#3d812a" strokeWidth="3" />
                      <path d="M100 50 Q65 45 50 60" stroke="#3d812a" strokeWidth="2.5" fill="none" />
                      <path d="M100 50 Q135 45 150 60" stroke="#3d812a" strokeWidth="2.5" fill="none" />
                      <path d="M100 80 Q60 75 48 95" stroke="#3d812a" strokeWidth="2.5" fill="none" />
                      <path d="M100 80 Q140 75 152 95" stroke="#3d812a" strokeWidth="2.5" fill="none" />
                      <path d="M100 110 Q70 108 58 125" stroke="#3d812a" strokeWidth="2" fill="none" />
                      <path d="M100 110 Q130 108 142 125" stroke="#3d812a" strokeWidth="2" fill="none" />
                      {/* Leaf 2 Accent */}
                      <path d="M30 140 C10 110 30 80 60 90 C80 100 90 135 90 140 C90 135 70 160 50 160 C30 160 20 150 30 140 Z" fill="#52a739" />
                      {/* Leaf 3 Accent */}
                      <path d="M170 140 C190 110 170 80 140 90 C120 100 110 135 110 140 C110 135 130 160 150 160 C170 160 180 150 170 140 Z" fill="#52a739" />
                    </svg>

                    {/* Glossy Paper Coating Sheen Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none" />
                    <div className="absolute top-2 left-6 w-20 h-10 bg-white/40 rounded-full blur-sm transform -rotate-45 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Natural Bottom Fresh Leaves in Foreground */}
              <div className="absolute -bottom-2 -left-2 z-20 w-24 h-24 pointer-events-none">
                <svg viewBox="0 0 60 60" fill="none" className="w-full h-full drop-shadow-md">
                  <path d="M10 50 C15 30 30 15 50 10 C45 30 30 45 10 50 Z" fill="#1f7a33" />
                  <path d="M10 50 L48 12" stroke="#124f20" strokeWidth="1.5" />
                </svg>
              </div>

              {/* Visual Carousel Indicators */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                <span className="w-6 h-2 rounded-full bg-[#15803d]" />
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
                <span className="w-2 h-2 rounded-full bg-emerald-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

