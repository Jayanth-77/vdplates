import React, { useState } from 'react';
import { Search, X, Package, CheckCircle2, Clock, Truck, Home, AlertCircle, Ban, Phone, MessageCircle } from 'lucide-react';
import { CustomerOrder } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CustomerOrder[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<CustomerOrder | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.phoneNumber.includes(query) ||
        o.email.toLowerCase().includes(query)
    );

    setSearchedOrder(match || null);
    setHasSearched(true);
  };

  const getStatusStepIndex = (status: CustomerOrder['status']) => {
    switch (status) {
      case 'Pending Verification': return 0;
      case 'Advance Confirmed': return 1;
      case 'In Production': return 2;
      case 'Dispatched': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const steps = [
    { title: 'Booking Received', desc: 'Screenshot submitted' },
    { title: '20% Advance Confirmed', desc: 'Payment verified' },
    { title: 'In Production', desc: 'Batch manufacturing & packing' },
    { title: 'Dispatched', desc: 'Out for transport/pickup' },
    { title: 'Delivered', desc: 'Remaining balance cleared' }
  ];

  const currentStep = searchedOrder ? getStatusStepIndex(searchedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#06170c]/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#0e2e1a] text-white p-5 sm:p-6 flex items-center justify-between border-b-2 border-[#22c55e]">
          <div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">
              VD PAPER PLATES
            </span>
            <h3 className="text-xl font-black font-['Outfit'] text-white mt-0.5">
              Track Your Booking Status
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#184527] hover:bg-[#205732] text-emerald-200 flex items-center justify-center cursor-pointer transition-colors"
            title="Close tracker"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5 bg-[#fbfdfb]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Order # or 10-digit Phone Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-3 bg-white border-2 border-emerald-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-emerald-500 shadow-2xs font-medium"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-2xl bg-[#15803d] hover:bg-[#166534] text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-pill-green hover:scale-105 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Track</span>
            </button>
          </form>

          {hasSearched && !searchedOrder && (
            <div className="p-5 bg-amber-50/80 rounded-2xl border border-amber-200 text-center text-xs text-amber-950 space-y-1">
              <AlertCircle className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <div className="font-bold text-sm text-amber-900">No Booking Found</div>
              <p>No order found matching "{searchTerm}". Please verify your order ID or reach out to Barri Jayanth on WhatsApp at <strong>9182879375</strong>.</p>
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-4 pt-1">
              <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-card-soft">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Order ID:</span>
                  <span className="font-mono font-black text-[#143820] text-sm">#{searchedOrder.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-slate-500 font-medium">Customer Name:</span>
                  <span className="font-bold text-slate-900">{searchedOrder.customerName}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-slate-500 font-medium">Scheduled Event Date:</span>
                  <span className="font-black text-[#15803d] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    📅 {searchedOrder.eventDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-slate-500 font-medium">Total Plates:</span>
                  <span className="font-bold text-slate-900">{searchedOrder.totalPlates} Plates</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1.5">
                  <span className="text-slate-500 font-medium">20% Advance Status:</span>
                  <span className="font-extrabold text-[#15803d]">₹{searchedOrder.advanceAmountPaid.toFixed(2)} Paid</span>
                </div>
              </div>

              {/* Status or Cancellation Notice */}
              {searchedOrder.status === 'Cancelled' ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                    <Ban className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>This Order has been Cancelled by Factory Admin</span>
                  </div>

                  <div className="bg-white/90 p-3.5 rounded-xl border border-rose-200 text-xs space-y-1">
                    <div className="text-slate-500 font-medium">Cancellation Reason:</div>
                    <div className="text-slate-900 font-semibold">
                      {searchedOrder.cancellationReason || 'Order could not be fulfilled.'}
                    </div>
                    {searchedOrder.cancelledAt && (
                      <div className="text-[11px] text-slate-400 pt-1">
                        Cancelled on {new Date(searchedOrder.cancelledAt).toLocaleDateString()} at {new Date(searchedOrder.cancelledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-slate-600 pt-1">
                    If you have questions regarding advance refund or re-scheduling, please contact the factory owner directly:
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href="tel:9182879375"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Call Owner (9182879375)
                    </a>
                    <a
                      href={`https://wa.me/919182879375?text=${encodeURIComponent(
                        `Hello Barri Jayanth, my Order #${searchedOrder.orderNumber} was cancelled. I would like to check on my refund / re-booking.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16a34a] text-white text-xs font-semibold hover:bg-[#15803d] transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Inquiry
                    </a>
                  </div>
                </div>
              ) : (
                /* Step indicator */
                <div className="space-y-3 py-2 bg-white p-4 rounded-2xl border border-emerald-100">
                  <h4 className="text-xs font-black text-[#143820] uppercase tracking-wider">
                    Manufacturing & Dispatch Progression
                  </h4>

                  <div className="space-y-2">
                    {steps.map((step, idx) => {
                      const isDone = idx <= currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
                            isCurrent
                              ? 'bg-emerald-50/90 border-2 border-emerald-400 shadow-2xs'
                              : isDone
                              ? 'bg-emerald-50/40 border border-emerald-200/60'
                              : 'bg-slate-50 border border-slate-100 opacity-70'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black mt-0.5 ${
                              isDone
                                ? 'bg-gradient-to-br from-[#22c55e] to-[#15803d] text-white shadow-xs'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>

                          <div>
                            <div className={`text-xs font-extrabold ${isCurrent ? 'text-[#143820]' : isDone ? 'text-emerald-950' : 'text-slate-700'}`}>
                              {step.title}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
