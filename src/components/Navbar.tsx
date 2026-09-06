import React from 'react';
import { ShoppingBag, ShieldCheck, MapPin, Search, Compass, Package, ChevronRight, Phone } from 'lucide-react';
import { StoreInfo } from '../types';

interface NavbarProps {
  storeInfo: StoreInfo;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenTracker: () => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  storeInfo,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenTracker,
  isAdmin
}) => {
  const scrollToHome = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('plate-catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWhyUs = () => {
    const el = document.getElementById('why-choose-us-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAbout = () => {
    const el = document.getElementById('policy-requirements-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocation = () => {
    const el = document.getElementById('contact-location-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#fdfcf9]/95 backdrop-blur-md shadow-xs border-b border-emerald-100/70">
      {/* Top policy announcement bar - Soft cream & fresh leaf green */}
      <div className="bg-[#eef8f2] text-emerald-950 text-xs py-1.5 px-4 sm:px-8 border-b border-emerald-200/50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#15803d] text-white uppercase tracking-wider shadow-2xs">
              Direct Factory
            </span>
            <span className="text-emerald-900 text-xs">
              Order at least <strong className="text-[#15803d]">3 days</strong> in advance • Min <strong className="text-[#15803d]">400 plates</strong> • <strong className="text-[#15803d]">20% advance</strong> booking
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <a
              href={storeInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-emerald-800 hover:text-[#15803d] font-medium transition-colors"
              title="Open VD paper plates on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
              <span>Kotturu Mandal, Metturu Bit-2</span>
            </a>
            <a
              href={`https://wa.me/91${storeInfo.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#15803d] hover:text-[#166534] font-semibold transition-colors flex items-center gap-1"
            >
              <span>WhatsApp: 9182879375</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar inspired by Reference Image */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo with Twin Eco Leaves */}
        <div onClick={scrollToHome} className="flex items-center gap-2.5 cursor-pointer select-none">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#14532d] p-2 flex items-center justify-center shadow-sm shadow-emerald-700/20 text-white shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" fill="#bbf7d0" stroke="#ffffff" strokeWidth="1.5" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-[#14532d] tracking-tight font-['Outfit']">
                VD Shops
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-semibold text-[#16a34a] -mt-1 tracking-wide">
              Paper Plates & More • Kotturu
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links (Home, Shop, About, Why Us, Contact) matching reference */}
        <div className="hidden md:flex items-center space-x-7 text-sm font-semibold text-[#14532d]">
          <button
            onClick={scrollToHome}
            className="text-[#15803d] relative py-1 hover:text-[#166534] transition-colors cursor-pointer group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#15803d] rounded-full"></span>
          </button>
          <button
            onClick={scrollToCatalog}
            className="text-slate-700 hover:text-[#15803d] transition-colors cursor-pointer py-1"
          >
            Shop
          </button>
          <button
            onClick={scrollToAbout}
            className="text-slate-700 hover:text-[#15803d] transition-colors cursor-pointer py-1"
          >
            Policies
          </button>
          <button
            onClick={scrollToWhyUs}
            className="text-slate-700 hover:text-[#15803d] transition-colors cursor-pointer py-1"
          >
            Why Us
          </button>
          <button
            onClick={scrollToLocation}
            className="text-slate-700 hover:text-[#15803d] transition-colors cursor-pointer py-1"
          >
            Contact
          </button>
          <button
            onClick={onOpenTracker}
            className="text-slate-700 hover:text-[#15803d] transition-colors cursor-pointer py-1"
          >
            Track Order
          </button>
        </div>

        {/* Action Controls: Search/Catalog, Cart, and Order Now / Admin */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Quick catalog search trigger */}
          <button
            onClick={scrollToCatalog}
            className="w-9 h-9 rounded-full bg-[#f4f9f4] hover:bg-[#e4f3e5] text-[#14532d] flex items-center justify-center transition-colors cursor-pointer border border-emerald-100"
            title="Browse Catalog"
            aria-label="Browse Catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart Icon with Counter Badge */}
          <button
            id="nav-cart-btn"
            onClick={onOpenCart}
            className="relative w-9 h-9 rounded-full bg-[#f4f9f4] hover:bg-[#e4f3e5] text-[#14532d] flex items-center justify-center transition-colors cursor-pointer border border-emerald-100"
            title="View Order Cart"
            aria-label="View Order Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#15803d]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#15803d] text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-scale">
                {cartCount}
              </span>
            )}
          </button>

          {/* Primary CTA - Order Now Pill in Fresh Natural Green */}
          <button
            onClick={onOpenCart}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#15803d] hover:bg-[#166534] text-white shadow-pill-green hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span>Order Now</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
};

