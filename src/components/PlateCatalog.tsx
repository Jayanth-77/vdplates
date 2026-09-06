import React, { useState } from 'react';
import { Plus, Minus, Check, Sparkles, Filter, ShoppingCart, Info, Layers, ChevronRight, CheckCircle2 } from 'lucide-react';
import { PaperPlate, CartItem } from '../types';
import { PlateVisual } from './PlateVisual';

interface PlateCatalogProps {
  plates: PaperPlate[];
  cart: CartItem[];
  onUpdateCartQuantity: (plate: PaperPlate, quantity: number) => void;
  onOpenOrderModal: () => void;
}

// Custom pastel palette assignments per plate code/index
const getCardPastelTheme = (index: number, shape: string) => {
  const palettes = [
    {
      bg: 'bg-[#eef8f2]',
      hoverBg: 'hover:bg-[#e5f4ea]',
      border: 'border-emerald-100/90',
      badgeBg: 'bg-emerald-100/90 text-emerald-900',
      accentGlow: 'from-emerald-100/50 to-transparent'
    },
    {
      bg: 'bg-[#fef9e8]',
      hoverBg: 'hover:bg-[#fef3d5]',
      border: 'border-amber-100/90',
      badgeBg: 'bg-amber-100/90 text-amber-900',
      accentGlow: 'from-amber-100/50 to-transparent'
    },
    {
      bg: 'bg-[#eff6fc]',
      hoverBg: 'hover:bg-[#e4f0fa]',
      border: 'border-sky-100/90',
      badgeBg: 'bg-sky-100/90 text-sky-900',
      accentGlow: 'from-sky-100/50 to-transparent'
    },
    {
      bg: 'bg-[#fdf0f4]',
      hoverBg: 'hover:bg-[#fde4ec]',
      border: 'border-rose-100/90',
      badgeBg: 'bg-rose-100/90 text-rose-900',
      accentGlow: 'from-rose-100/50 to-transparent'
    },
    {
      bg: 'bg-[#edf8f1]',
      hoverBg: 'hover:bg-[#e2f3e8]',
      border: 'border-emerald-100/90',
      badgeBg: 'bg-emerald-100/90 text-emerald-900',
      accentGlow: 'from-emerald-100/50 to-transparent'
    },
    {
      bg: 'bg-[#f3f5f8]',
      hoverBg: 'hover:bg-[#e9ecf2]',
      border: 'border-slate-200/90',
      badgeBg: 'bg-slate-200/80 text-slate-800',
      accentGlow: 'from-slate-100/50 to-transparent'
    }
  ];
  return palettes[index % palettes.length];
};

export const PlateCatalog: React.FC<PlateCatalogProps> = ({
  plates,
  cart,
  onUpdateCartQuantity,
  onOpenOrderModal
}) => {
  const [selectedShape, setSelectedShape] = useState<'all' | 'Square' | 'Round'>('all');
  const [selectedPlateForQuickView, setSelectedPlateForQuickView] = useState<PaperPlate | null>(null);

  const filteredPlates = plates.filter(plate => {
    if (selectedShape === 'all') return true;
    return plate.shape === selectedShape;
  });

  const getQuantityInCart = (plateId: string) => {
    const item = cart.find(c => c.plate.id === plateId);
    return item ? item.quantity : 0;
  };

  const totalCartPlates = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartAmount = cart.reduce((sum, item) => sum + item.quantity * item.plate.price, 0);
  const minAdvanceRequired = Math.round(totalCartAmount * 0.2 * 100) / 100;

  return (
    <section id="plate-catalog-section" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Header matching Reference Image style */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <span className="text-xs font-black text-[#16a34a] uppercase tracking-widest inline-block mb-1.5">
          OUR PRODUCTS
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#143820] tracking-tight font-['Outfit']">
          Choose Your <span className="text-[#16a34a]">Perfect Plate</span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          We offer 6 distinct types of heavy-duty paper plates to suit all your dining, catering, and event needs.
        </p>

        {/* Shape Filter Pills in Soft Green Theme */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedShape('all')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedShape === 'all'
                ? 'bg-[#15803d] text-white shadow-pill-green scale-105'
                : 'bg-[#f0f6f1] text-[#14532d] hover:bg-[#e4efe5] border border-emerald-100'
            }`}
          >
            All Plates ({plates.length})
          </button>
          <button
            onClick={() => setSelectedShape('Square')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedShape === 'Square'
                ? 'bg-[#15803d] text-white shadow-pill-green scale-105'
                : 'bg-[#f0f6f1] text-[#14532d] hover:bg-[#e4efe5] border border-emerald-100'
            }`}
          >
            Square Plates
          </button>
          <button
            onClick={() => setSelectedShape('Round')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedShape === 'Round'
                ? 'bg-[#15803d] text-white shadow-pill-green scale-105'
                : 'bg-[#f0f6f1] text-[#14532d] hover:bg-[#e4efe5] border border-emerald-100'
            }`}
          >
            Round Plates
          </button>
        </div>
      </div>

      {/* Grid of 3D Floating Product Cards matching Reference Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPlates.map((plate, idx) => {
          const qty = getQuantityInCart(plate.id);
          const isSelected = qty > 0;
          const theme = getCardPastelTheme(idx, plate.shape);

          return (
            <div
              key={plate.id}
              className={`group relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border ${theme.bg} ${theme.hoverBg} ${theme.border} ${
                isSelected
                  ? 'ring-3 ring-[#16a34a] shadow-xl scale-[1.02]'
                  : 'shadow-card-soft hover:shadow-card-hover hover:-translate-y-2'
              }`}
            >
              <div>
                {/* Top Badge & Dimension */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${theme.badgeBg}`}>
                    {plate.badge || plate.shape}
                  </span>

                  <span className="text-xs font-bold text-slate-500 bg-white/70 backdrop-blur-2xs px-2.5 py-1 rounded-full border border-black/5">
                    {plate.size}
                  </span>
                </div>

                {/* 3D Floating Plate Stage with Soft Shadow */}
                <div
                  onClick={() => setSelectedPlateForQuickView(plate)}
                  className="relative aspect-square max-w-[240px] mx-auto mb-5 flex items-center justify-center cursor-pointer select-none"
                  title="Click to view details"
                >
                  {/* Subtle Background Radial Glow */}
                  <div className="absolute inset-2 rounded-full bg-white/70 shadow-inner opacity-80" />

                  {/* 3D Plate Visual with Scale on Hover */}
                  <div className="relative z-10 w-full h-full p-3 flex items-center justify-center transition-transform duration-500 ease-out group-hover:scale-108 group-hover:-translate-y-1">
                    <PlateVisual
                      code={plate.code}
                      shape={plate.shape}
                      name={plate.name}
                      imageFileName={plate.imageFileName}
                      customImageUrl={plate.imageUrl}
                      className="w-full h-full drop-shadow-xl"
                    />
                  </div>

                  {/* Soft 3D Floor Shadow */}
                  <div className="absolute bottom-2 left-10 right-10 h-6 bg-emerald-950/15 rounded-full blur-md transition-all duration-300 group-hover:scale-90 group-hover:opacity-70 pointer-events-none" />
                </div>

                {/* Product Name & Short Description matching Reference */}
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-extrabold text-[#143820] text-lg sm:text-xl font-['Outfit'] tracking-tight group-hover:text-[#15803d] transition-colors leading-snug">
                    {plate.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {plate.description}
                  </p>
                </div>

                {/* Price & Specs row */}
                <div className="mt-4 pt-3 border-t border-black/5 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black text-[#143820] font-['Outfit']">
                      ₹{plate.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 ml-1">/ plate</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#16a34a] bg-white/80 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    Heavy Duty Board
                  </span>
                </div>
              </div>

              {/* Action Buttons: Order Now Pill Button matching Reference */}
              <div className="mt-5 pt-2">
                {qty === 0 ? (
                  <div className="flex items-center gap-2">
                    <button
                      id={`add-min-btn-${plate.id}`}
                      onClick={() => onUpdateCartQuantity(plate, 400)}
                      className="flex-1 py-3 px-5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white text-xs sm:text-sm font-bold shadow-pill-green hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Order Now</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      id={`add-custom-btn-${plate.id}`}
                      onClick={() => onUpdateCartQuantity(plate, 100)}
                      className="py-3 px-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#14532d] text-xs font-bold border border-emerald-200 transition-colors shadow-2xs cursor-pointer"
                      title="Add 100 plates"
                    >
                      +100
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Active Stepper Pill in Fresh Green */}
                    <div className="flex items-center justify-between gap-2 bg-white/95 p-1.5 rounded-full border border-emerald-200 shadow-xs">
                      <button
                        id={`decrease-qty-${plate.id}`}
                        onClick={() => onUpdateCartQuantity(plate, Math.max(0, qty - 50))}
                        className="w-9 h-9 rounded-full bg-[#f4f9f4] hover:bg-[#e4f3e5] text-[#14532d] flex items-center justify-center font-bold transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="text-center px-2">
                        <span className="text-sm font-black text-[#143820] font-['Outfit'] block">
                          {qty} plates
                        </span>
                        <span className="text-[11px] text-[#16a34a] block font-bold -mt-0.5">
                          ₹{(qty * plate.price).toFixed(2)}
                        </span>
                      </div>

                      <button
                        id={`increase-qty-${plate.id}`}
                        onClick={() => onUpdateCartQuantity(plate, qty + 50)}
                        className="w-9 h-9 rounded-full bg-[#15803d] hover:bg-[#166534] text-white flex items-center justify-center font-bold transition-colors cursor-pointer shadow-xs"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick batch presets */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 pt-0.5">
                      <span className="font-medium">Presets:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateCartQuantity(plate, 200)}
                          className="px-2 py-0.5 rounded-full bg-white/80 hover:bg-white text-[#14532d] font-bold border border-emerald-100"
                        >
                          200
                        </button>
                        <button
                          onClick={() => onUpdateCartQuantity(plate, 400)}
                          className="px-2 py-0.5 rounded-full bg-white/80 hover:bg-white text-[#14532d] font-bold border border-emerald-100"
                        >
                          400
                        </button>
                        <button
                          onClick={() => onUpdateCartQuantity(plate, 1000)}
                          className="px-2 py-0.5 rounded-full bg-white/80 hover:bg-white text-[#14532d] font-bold border border-emerald-100"
                        >
                          1000
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar when items are selected */}
      {totalCartPlates > 0 && (
        <div className="fixed bottom-5 left-4 right-4 max-w-3xl mx-auto z-40 bg-[#143820] text-white p-4 rounded-3xl sm:rounded-full shadow-2xl border-2 border-[#16a34a] flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3.5 pl-2">
            <div className="w-11 h-11 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {totalCartPlates} Plates in Cart
                </span>
                {totalCartPlates >= 400 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#22c55e] text-[#052e16] uppercase">
                    Min 400 Met ✓
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                    Need {400 - totalCartPlates} more
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-200">
                Total: <strong className="text-white">₹{totalCartAmount.toFixed(2)}</strong> • 20% Min Advance: <strong className="text-amber-300">₹{minAdvanceRequired.toFixed(2)}</strong>
              </p>
            </div>
          </div>

          <button
            id="floating-checkout-btn"
            onClick={onOpenOrderModal}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-[#052e16] hover:text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>{totalCartPlates >= 400 ? 'Proceed to Advance Booking' : 'Review & Add Plates'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Detail Quickview Modal */}
      {selectedPlateForQuickView && (
        <div className="fixed inset-0 z-50 bg-[#0d2818]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fcfbf9] max-w-md w-full rounded-3xl shadow-2xl overflow-hidden border border-emerald-200 animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-[#16a34a] uppercase tracking-wider">
                  {selectedPlateForQuickView.code}
                </span>
                <h3 className="font-extrabold text-[#143820] text-xl font-['Outfit']">
                  {selectedPlateForQuickView.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPlateForQuickView(null)}
                className="w-8 h-8 rounded-full bg-[#eef8f2] text-slate-600 hover:text-black flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8 bg-gradient-to-b from-[#eef8f2] to-[#fcfbf9] flex items-center justify-center border-b border-emerald-100">
              <div className="w-60 h-60">
                <PlateVisual
                  code={selectedPlateForQuickView.code}
                  shape={selectedPlateForQuickView.shape}
                  name={selectedPlateForQuickView.name}
                  imageFileName={selectedPlateForQuickView.imageFileName}
                  customImageUrl={selectedPlateForQuickView.imageUrl}
                  className="w-full h-full drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-600">Rate per plate:</span>
                <span className="text-2xl font-black text-[#143820] font-['Outfit']">
                  ₹{selectedPlateForQuickView.price.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedPlateForQuickView.description}
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-2xs">
                <div>
                  <span className="text-slate-400 block">Shape & Dimensions</span>
                  <span className="font-bold text-[#143820]">
                    {selectedPlateForQuickView.shape} ({selectedPlateForQuickView.size})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pattern Design</span>
                  <span className="font-bold text-[#143820]">
                    {selectedPlateForQuickView.pattern}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    onUpdateCartQuantity(selectedPlateForQuickView, 400);
                    setSelectedPlateForQuickView(null);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm shadow-pill-green transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add 400 Plates (₹{(selectedPlateForQuickView.price * 400).toFixed(0)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

