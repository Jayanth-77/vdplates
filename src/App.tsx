import React, { useState, useEffect } from 'react';
import {
  Sparkles, ShoppingBag, Phone, MapPin, Calendar, AlertTriangle,
  Package, ShieldCheck, CheckCircle2, ChevronRight, MessageSquare, ArrowUp, X
} from 'lucide-react';
import { PaperPlate, CartItem, CustomerOrder, StoreInfo } from './types';
import { STORE_INFO, INITIAL_PLATES } from './data/initialPlates';
import { Navbar } from './components/Navbar';
import { HeroNoticeBanner } from './components/HeroNoticeBanner';
import { PlateCatalog } from './components/PlateCatalog';
import { OrderBookingModal } from './components/OrderBookingModal';
import { AICustomerBot } from './components/AICustomerBot';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { LocationAndContactSection } from './components/LocationAndContactSection';
import { PolicyRequirementsSection } from './components/PolicyRequirementsSection';

export default function App() {
  const [plates, setPlates] = useState<PaperPlate[]>(INITIAL_PLATES);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(STORE_INFO);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Modals & Triggers
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Fetch live products and orders from server API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await fetch('/api/products');
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (Array.isArray(prodData) && prodData.length > 0) {
            setPlates(prodData);
          }
        }
      } catch (err) {
        console.warn('Using initial plates catalog fallback:', err);
      }

      try {
        const ordRes = await fetch('/api/orders');
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (Array.isArray(ordData)) {
            setOrders(ordData);
          }
        }
      } catch (err) {
        console.warn('Orders fetch note:', err);
      }
    };

    fetchData();
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleUpdateCartQuantity = (plate: PaperPlate, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.plate.id !== plate.id);
      }
      const existingIndex = prev.findIndex((item) => item.plate.id === plate.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      }
      return [...prev, { plate, quantity }];
    });
  };

  const handleOrderSuccess = (createdOrder: CustomerOrder) => {
    setOrders((prev) => [createdOrder, ...prev]);
    setCart([]);
    setShowNotification(`Order #${createdOrder.orderNumber} placed! Email notification sent to barrijayanth@gmail.com.`);
    setTimeout(() => setShowNotification(null), 7000);
  };

  // Admin plate operations
  const handleAddPlate = async (newPlateData: Partial<PaperPlate>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlateData)
      });
      if (res.ok) {
        const saved = await res.json();
        setPlates((prev) => [...prev, saved]);
        setShowNotification(`New plate "${saved.name}" added successfully.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePlate = async (id: string, updatedData: Partial<PaperPlate>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const saved = await res.json();
        setPlates((prev) => prev.map((p) => (p.id === id ? saved : p)));
        setShowNotification('Paper plate updated successfully.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeletePlate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPlates((prev) => prev.filter((p) => p.id !== id));
        setShowNotification('Paper plate removed.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: CustomerOrder['status'],
    notes?: string,
    cancellationReason?: string
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes, cancellationReason })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
        setShowNotification(
          newStatus === 'Cancelled'
            ? `Order #${updated.orderNumber} has been cancelled.`
            : `Order #${updated.orderNumber} status updated to: ${newStatus}`
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('plate-catalog-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navigation */}
      <Navbar
        storeInfo={storeInfo}
        cartCount={totalCartCount}
        onOpenCart={() => setIsOrderModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        isAdmin={false}
      />

      {/* Global Notification Toast with upward remove symbol */}
      {showNotification && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-[#0c2615]/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#22c55e] flex items-center gap-3.5 text-xs sm:text-sm animate-in fade-in slide-in-from-top-4 max-w-[92vw] sm:max-w-xl">
          <div className="w-7 h-7 rounded-full bg-[#16a34a]/30 border border-[#22c55e]/50 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
          </div>
          <span className="font-semibold text-white flex-1 leading-snug">{showNotification}</span>
          <button
            id="dismiss-global-notification-btn"
            type="button"
            onClick={() => setShowNotification(null)}
            className="p-1.5 rounded-full text-emerald-300 hover:text-white hover:bg-emerald-800/80 transition-all cursor-pointer shrink-0 ml-1 border border-emerald-600/40"
            title="Remove notification"
            aria-label="Remove notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Top Intro & Factory Contact Strip */}
        <HeroNoticeBanner
          storeInfo={storeInfo}
          onScrollToCatalog={scrollToCatalog}
          onOpenOrder={() => setIsOrderModalOpen(true)}
        />

        {/* Plates Catalog & Price List (Moved Upwards Right Below Hero) */}
        <PlateCatalog
          plates={plates}
          cart={cart}
          onUpdateCartQuantity={handleUpdateCartQuantity}
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
        />

        {/* Schedule Requirement, Minimum Quantity & Payment Terms (At the Bottom of Product Catalog) */}
        <PolicyRequirementsSection
          storeInfo={storeInfo}
          onOpenOrder={() => setIsOrderModalOpen(true)}
        />

        {/* Policy Verification & Manufacturing Lead Time Section */}
        <section className="bg-gradient-to-b from-[#f5faf6] to-[#ecf5ee] py-16 px-4 sm:px-6 border-y border-emerald-100 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-[#15803d] border border-emerald-200 uppercase tracking-widest">
                Direct Factory Production
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#143820] font-['Outfit'] mt-2.5">
                How Ordering at VD PAPER PLATES Works
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Direct manufacturing guarantees high quality and the lowest wholesale rates in Kotturu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white font-black text-base flex items-center justify-center mb-4 shadow-md">
                  1
                </div>
                <h3 className="font-extrabold text-[#143820] text-base font-['Outfit']">Choose Your Plates</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Select from our 6 signature plates or custom shapes. Combine varieties to meet the <strong className="text-[#143820]">400 plates minimum</strong>.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white font-black text-base flex items-center justify-center mb-4 shadow-md">
                  2
                </div>
                <h3 className="font-extrabold text-[#143820] text-base font-['Outfit']">Schedule 3+ Days Early</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Orders <strong className="text-[#143820]">must be placed at least 3 days in advance</strong>. This allows machine die calibration, laminating, and fresh batch drying.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white font-black text-base flex items-center justify-center mb-4 shadow-md">
                  3
                </div>
                <h3 className="font-extrabold text-[#143820] text-base font-['Outfit']">Transfer 20% Advance</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Pay <strong className="text-[#143820]">minimum 20% advance</strong> to our authorized SBI Kotturu account or UPI ID. Upload the screenshot for manual verification.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-card-soft hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white font-black text-base flex items-center justify-center mb-4 shadow-md">
                  4
                </div>
                <h3 className="font-extrabold text-[#143820] text-base font-['Outfit']">Confirmation & Delivery</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Receive your official email confirmation receipt. Pickup at Kotturu or receive local bulk delivery with remaining balance on handover.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Location, Contact Numbers & Bank Details */}
        <LocationAndContactSection
          storeInfo={storeInfo}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </main>

      {/* The Single Official AI Customer Assistant Trigger */}
      <button
        id="floating-ai-agent-trigger"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 z-40 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#14532d] to-[#16a34a] hover:from-[#166534] hover:to-[#22c55e] text-white shadow-pill-green border border-emerald-400/40 flex items-center gap-2.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
        title="Open VD AI Customer Assistant"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
        </span>
        <Sparkles className="w-4 h-4 text-emerald-200" />
        <span>VD AI Assistant</span>
      </button>

      {/* MODALS */}
      {/* 1. Order Booking & 20% Manual Advance Payment Flow */}
      <OrderBookingModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        storeInfo={storeInfo}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 2. Gemini AI Customer Support Chatbot */}
      <AICustomerBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        storeInfo={storeInfo}
      />

      {/* 3. Admin Dashboard for Inventory & Payment Screenshot Review */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        plates={plates}
        orders={orders}
        storeInfo={storeInfo}
        onAddPlate={handleAddPlate}
        onUpdatePlate={handleUpdatePlate}
        onDeletePlate={handleDeletePlate}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* 4. Customer Order Tracking */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
      />
    </div>
  );
}
