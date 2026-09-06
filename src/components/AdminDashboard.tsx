import React, { useState } from 'react';
import {
  ShieldCheck, X, Plus, Edit2, Trash2, Eye, CheckCircle,
  Clock, CheckCircle2, Phone, Mail, FileText, Image as ImageIcon,
  DollarSign, Package, Lock, Unlock, Upload, MessageCircle,
  Ban, AlertTriangle
} from 'lucide-react';
import { PaperPlate, CustomerOrder, StoreInfo } from '../types';
import { PlateVisual } from './PlateVisual';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  plates: PaperPlate[];
  orders: CustomerOrder[];
  storeInfo: StoreInfo;
  onAddPlate: (newPlate: Partial<PaperPlate>) => void;
  onUpdatePlate: (id: string, updatedPlate: Partial<PaperPlate>) => void;
  onDeletePlate: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: CustomerOrder['status'], notes?: string, cancellationReason?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  plates,
  orders,
  storeInfo,
  onAddPlate,
  onUpdatePlate,
  onDeletePlate,
  onUpdateOrderStatus
}) => {
  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Active sub-tab: 'orders' | 'plates'
  const [activeTab, setActiveTab] = useState<'orders' | 'plates'>('orders');

  // Modal for adding/editing a plate
  const [isAddPlateModalOpen, setIsAddPlateModalOpen] = useState(false);
  const [editingPlate, setEditingPlate] = useState<PaperPlate | null>(null);

  // New plate form state
  const [plateForm, setPlateForm] = useState({
    name: '',
    code: '',
    price: 1.90,
    shape: 'Square' as 'Square' | 'Round',
    size: '11" Standard',
    pattern: 'Custom Design',
    description: '',
    badge: 'New',
    imageUrl: '',
    inStock: true
  });

  // Modal for inspecting customer payment screenshot
  const [viewingScreenshotOrder, setViewingScreenshotOrder] = useState<CustomerOrder | null>(null);

  // Cancellation modal state
  const [cancellingOrder, setCancellingOrder] = useState<CustomerOrder | null>(null);
  const [cancellationReasonText, setCancellationReasonText] = useState('');
  const [cancellationError, setCancellationError] = useState('');

  // Orders status filter
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'active' | 'cancelled'>('all');

  // Test email state
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setTestEmailResult(null);
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Jayanth (Test Order Verification)',
          phoneNumber: '9182879375'
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setTestEmailResult({
          success: true,
          message: `Test email dispatched to ${data.recipient}! (${data.result?.method || 'Delivered'})`
        });
      } else {
        setTestEmailResult({
          success: false,
          message: data.error || 'Failed to dispatch test email.'
        });
      }
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err?.message || 'Error connecting to test email endpoint.'
      });
    } finally {
      setIsSendingTestEmail(false);
    }
  };

  if (!isOpen) return null;

  const handleConfirmCancellation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;
    if (!cancellationReasonText.trim()) {
      setCancellationError('Please specify the reason why you are cancelling this order.');
      return;
    }
    onUpdateOrderStatus(cancellingOrder.id, 'Cancelled', undefined, cancellationReasonText.trim());
    setCancellingOrder(null);
    setCancellationReasonText('');
    setCancellationError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'vdadmin' || passcode === '1234') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. Use demo passcode: admin123');
    }
  };

  const handleOpenAddPlate = () => {
    setEditingPlate(null);
    setPlateForm({
      name: '',
      code: `plate${plates.length + 1}`,
      price: 1.90,
      shape: 'Square',
      size: '11" x 11"',
      pattern: 'Custom Design',
      description: 'High quality disposable paper plate by VD PAPER PLATES.',
      badge: 'New',
      imageUrl: '',
      inStock: true
    });
    setIsAddPlateModalOpen(true);
  };

  const handleOpenEditPlate = (plate: PaperPlate) => {
    setEditingPlate(plate);
    setPlateForm({
      name: plate.name,
      code: plate.code,
      price: plate.price,
      shape: plate.shape,
      size: plate.size,
      pattern: plate.pattern,
      description: plate.description,
      badge: plate.badge || '',
      imageUrl: plate.imageUrl || '',
      inStock: plate.inStock
    });
    setIsAddPlateModalOpen(true);
  };

  const handleSavePlate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateForm.name.trim()) return;

    if (editingPlate) {
      onUpdatePlate(editingPlate.id, plateForm);
    } else {
      onAddPlate(plateForm);
    }
    setIsAddPlateModalOpen(false);
  };

  const handlePlateImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPlateForm(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // Stats calculation
  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalAdvanceCollected = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + (o.advanceAmountPaid || 0), 0);
  const totalPlatesInQueue = orders
    .filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPlates, 0);
  const totalCancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'pending') return order.status === 'Pending Verification';
    if (orderFilter === 'active') return order.status === 'Advance Confirmed' || order.status === 'In Production' || order.status === 'Dispatched';
    if (orderFilter === 'cancelled') return order.status === 'Cancelled';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between shrink-0 border-b-2 border-amber-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold font-['Outfit'] text-white">
                  VD PAPER PLATES Admin Dashboard
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                  Staff Only
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage paper plate products, review bank transfer screenshots, confirm orders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTHENTICATION GATE */}
        {!isAuthenticated ? (
          <div className="p-8 max-w-md mx-auto text-center space-y-4 my-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Admin Access Required
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Please enter your administrator passcode to access order verifications and product inventory.
            </p>

            <form onSubmit={handleLogin} className="space-y-3 pt-2">
              <input
                type="password"
                placeholder="Enter passcode (Hint: admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-center text-sm font-mono focus:bg-white focus:outline-amber-500"
              />

              {authError && (
                <p className="text-xs text-red-600 font-semibold">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xs transition-colors cursor-pointer"
              >
                Unlock Dashboard
              </button>

              <div className="text-[11px] text-slate-400">
                Default Demo Passcode: <strong className="text-slate-700">admin123</strong>
              </div>
            </form>
          </div>
        ) : (
          /* MAIN ADMIN VIEW */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* KPI summary strip */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 block font-medium">Total Orders</span>
                <span className="text-lg font-bold text-slate-900 font-['Outfit']">{orders.length}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 block font-medium">Plates in Production</span>
                <span className="text-lg font-bold text-amber-700 font-['Outfit']">{totalPlatesInQueue}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 block font-medium">20% Advance Booked</span>
                <span className="text-lg font-bold text-slate-900 font-['Outfit']">₹{totalAdvanceCollected.toFixed(0)}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 block font-medium">Cancelled Orders</span>
                <span className={`text-lg font-bold font-['Outfit'] ${totalCancelledOrders > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {totalCancelledOrders}
                </span>
              </div>
            </div>

            {/* Navigation tabs */}
            <div className="px-5 py-2.5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Customer Bookings ({orders.length})
                </button>
                <button
                  onClick={() => setActiveTab('plates')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'plates'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Plates Inventory & Prices ({plates.length})
                </button>
              </div>

              {activeTab === 'plates' && (
                <button
                  onClick={handleOpenAddPlate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Paper Plate
                </button>
              )}
            </div>

            {/* Tab content area */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* TAB 1: ORDERS & PAYMENT SCREENSHOT VERIFICATION */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {/* Order Status Filter Chips */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                      <button
                        type="button"
                        onClick={() => setOrderFilter('all')}
                        className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                          orderFilter === 'all'
                            ? 'bg-white text-slate-900 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All ({orders.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderFilter('pending')}
                        className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                          orderFilter === 'pending'
                            ? 'bg-white text-amber-900 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Pending ({orders.filter(o => o.status === 'Pending Verification').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderFilter('active')}
                        className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                          orderFilter === 'active'
                            ? 'bg-white text-blue-900 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        In Progress ({orders.filter(o => ['Advance Confirmed', 'In Production', 'Dispatched'].includes(o.status)).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderFilter('cancelled')}
                        className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                          orderFilter === 'cancelled'
                            ? 'bg-white text-rose-700 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Cancelled ({totalCancelledOrders})
                      </button>
                    </div>

                    <span className="text-xs text-slate-500">
                      Showing {filteredOrders.length} of {orders.length} bookings
                    </span>
                  </div>

                  {/* Email Delivery Diagnostics & Live Test Trigger */}
                  <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-200">
                          Owner Email Notifications: <span className="text-amber-400 font-mono">barrijayanth@gmail.com</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Automatic email dispatch active on every new booking with item lists and advance payment proof.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleSendTestEmail}
                        disabled={isSendingTestEmail}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {isSendingTestEmail ? 'Sending Test Email...' : 'Send Test Email'}
                      </button>
                    </div>
                  </div>

                  {testEmailResult && (
                    <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                      testEmailResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{testEmailResult.message}</span>
                    </div>
                  )}

                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      {orderFilter === 'cancelled'
                        ? 'No cancelled orders.'
                        : orderFilter === 'pending'
                        ? 'No pending orders awaiting advance payment verification.'
                        : 'No customer orders match this filter.'}
                    </div>
                  ) : (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className={`rounded-xl border p-4 shadow-2xs space-y-3 transition-all ${
                          order.status === 'Cancelled'
                            ? 'bg-slate-50/70 border-rose-200 opacity-90'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        {/* Order header */}
                        <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-slate-900">
                                #{order.orderNumber}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  order.status === 'Advance Confirmed'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : order.status === 'Pending Verification'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : order.status === 'In Production'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                    : order.status === 'Dispatched'
                                    ? 'bg-purple-100 text-purple-900 border border-purple-200'
                                    : order.status === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : order.status === 'Cancelled'
                                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Customer: <strong>{order.customerName}</strong> • Phone: {order.phoneNumber}
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate-500 block">
                              Event Delivery Date
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              📅 {order.eventDate}
                            </span>
                          </div>
                        </div>

                        {/* Items breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-700 block mb-1">
                              Ordered Varieties ({order.totalPlates} plates total):
                            </span>
                            <ul className="space-y-0.5 text-slate-600">
                              {order.items.map((item, idx) => (
                                <li key={idx} className="flex justify-between">
                                  <span>{item.plateName}</span>
                                  <strong className="text-slate-900 font-mono">
                                    {item.quantity} pcs (₹{item.subtotal.toFixed(0)})
                                  </strong>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-3 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Total Value:</span>
                              <strong className="text-slate-900 font-mono">₹{order.totalAmount.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">20% Advance Required:</span>
                              <strong className="text-amber-800 font-mono font-bold">₹{order.advanceAmountRequired.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Advance Paid Recorded:</span>
                              <strong className="text-amber-700 font-mono font-bold">₹{order.advanceAmountPaid.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Balance on Delivery:</span>
                              <strong className="text-slate-700 font-mono">₹{order.balanceOnDelivery.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                              <span>Ref / UTR:</span>
                              <span className="font-mono text-slate-800">{order.transactionReference}</span>
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                              <span>Owner Alert:</span>
                              <span className="text-emerald-700 font-medium flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {order.ownerNotificationSentTo || 'barrijayanth@gmail.com'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Cancellation Notice Banner & Reason Box if Cancelled */}
                        {order.status === 'Cancelled' && (
                          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs space-y-1.5 animate-in fade-in">
                            <div className="flex flex-wrap items-center justify-between text-rose-800 font-bold gap-1">
                              <span className="flex items-center gap-1.5">
                                <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                Order Cancelled by Admin
                              </span>
                              {order.cancelledAt && (
                                <span className="text-[11px] text-rose-600 font-normal">
                                  {new Date(order.cancelledAt).toLocaleDateString()} at {new Date(order.cancelledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-800 pl-5">
                              <span className="font-semibold text-rose-950">Reason for Cancellation:</span>{' '}
                              {order.cancellationReason || 'No reason provided.'}
                            </div>
                          </div>
                        )}

                        {/* Payment Screenshot & Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2">
                            {order.paymentScreenshot ? (
                              <button
                                onClick={() => setViewingScreenshotOrder(order)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors cursor-pointer"
                              >
                                <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                                Inspect Payment Screenshot
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                No screenshot attached
                              </span>
                            )}

                            <a
                              href={`tel:${order.phoneNumber}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors cursor-pointer"
                            >
                              <Phone className="w-3 h-3" />
                              Call
                            </a>

                            <a
                              href={`https://wa.me/91${order.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                                `Hello ${order.customerName}! This is Barri Jayanth from VD PAPER PLATES regarding your Order #${order.orderNumber} for ${order.totalPlates} plates on ${order.eventDate}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              WhatsApp
                            </a>
                          </div>

                          {/* Status workflow controller & Cancel button */}
                          <div className="flex items-center gap-1.5">
                            {/* Cancel Button: Available for active/pending orders */}
                            {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setCancellingOrder(order);
                                  setCancellationReasonText('');
                                  setCancellationError('');
                                }}
                                className="px-2.5 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                                title="Cancel this order and record reason"
                              >
                                <Ban className="w-3.5 h-3.5 text-rose-600" />
                                Cancel Order
                              </button>
                            )}

                            {order.status === 'Pending Verification' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'Advance Confirmed', 'Verified by manager. Advance received in SBI account.')}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve 20% Advance
                              </button>
                            )}

                            {order.status === 'Advance Confirmed' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'In Production')}
                                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                              >
                                Move to Production
                              </button>
                            )}

                            {order.status === 'In Production' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'Dispatched')}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                              >
                                Mark as Dispatched
                              </button>
                            )}

                            {order.status === 'Dispatched' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                              >
                                Mark as Delivered
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: PLATES CATALOG & INVENTORY */}
              {activeTab === 'plates' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plates.map((plate) => (
                    <div
                      key={plate.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between shadow-2xs hover:border-slate-300 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                            {plate.code}
                          </span>
                          <span className="text-xs text-slate-500">
                            {plate.shape} • {plate.size}
                          </span>
                        </div>

                        {/* Preview */}
                        <div className="w-full h-36 my-3 flex items-center justify-center bg-slate-50 rounded-lg p-2 border border-slate-100">
                          <PlateVisual
                            code={plate.code}
                            shape={plate.shape}
                            name={plate.name}
                            imageFileName={plate.imageFileName}
                            customImageUrl={plate.imageUrl}
                            className="w-full h-full max-h-32"
                          />
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">{plate.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-amber-800 font-extrabold text-base font-['Outfit']">
                            ₹{plate.price.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {plate.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditPlate(plate)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => onDeletePlate(plate.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete plate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT PLATE FORM */}
        {isAddPlateModalOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
                  {editingPlate ? `Edit Plate (${editingPlate.code})` : 'Add New Paper Plate Variety'}
                </h3>
                <button
                  onClick={() => setIsAddPlateModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSavePlate} className="space-y-3 mt-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Plate Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Silver Banquet Plate"
                      value={plateForm.name}
                      onChange={(e) => setPlateForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900 focus:outline-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Code / ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. plate7"
                      value={plateForm.code}
                      onChange={(e) => setPlateForm(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900 font-mono focus:outline-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      step="0.05"
                      required
                      value={plateForm.price}
                      onChange={(e) => setPlateForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900 font-mono font-bold focus:outline-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Shape</label>
                    <select
                      value={plateForm.shape}
                      onChange={(e) => setPlateForm(prev => ({ ...prev, shape: e.target.value as 'Square' | 'Round' }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900 focus:outline-amber-500"
                    >
                      <option value="Square">Square</option>
                      <option value="Round">Round</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Size / Dimension</label>
                    <input
                      type="text"
                      placeholder='11" x 11"'
                      value={plateForm.size}
                      onChange={(e) => setPlateForm(prev => ({ ...prev, size: e.target.value }))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900 focus:outline-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pattern & Texture</label>
                  <input
                    type="text"
                    placeholder="e.g. Deep Green Leaf / Gold Foil"
                    value={plateForm.pattern}
                    onChange={(e) => setPlateForm(prev => ({ ...prev, pattern: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900 focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={plateForm.description}
                    onChange={(e) => setPlateForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white text-slate-900 focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Plate Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePlateImageUpload}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddPlateModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Save Paper Plate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: INSPECT CUSTOMER PAYMENT SCREENSHOT */}
        {viewingScreenshotOrder && (
          <div className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs text-slate-500 block">Bank Transfer Verification</span>
                  <h4 className="font-bold text-slate-900 text-sm font-['Outfit']">
                    Order #{viewingScreenshotOrder.orderNumber} • {viewingScreenshotOrder.customerName}
                  </h4>
                </div>
                <button
                  onClick={() => setViewingScreenshotOrder(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="my-4 bg-slate-900 p-2 rounded-xl max-h-96 overflow-auto flex items-center justify-center">
                {viewingScreenshotOrder.paymentScreenshot ? (
                  <img
                    src={viewingScreenshotOrder.paymentScreenshot}
                    alt="Payment Transfer Proof"
                    className="max-h-80 w-auto object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <p className="text-xs text-slate-400">No screenshot data found.</p>
                )}
              </div>

              <div className="space-y-1 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex justify-between">
                  <span>Customer Phone:</span>
                  <strong className="text-slate-900">{viewingScreenshotOrder.phoneNumber}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Customer Email:</span>
                  <strong className="text-slate-900">{viewingScreenshotOrder.email}</strong>
                </div>
                <div className="flex justify-between">
                  <span>UTR Reference:</span>
                  <strong className="font-mono text-amber-800">{viewingScreenshotOrder.transactionReference}</strong>
                </div>
                <div className="flex justify-between">
                  <span>20% Advance Amount:</span>
                  <strong className="font-mono text-amber-700 font-bold">₹{viewingScreenshotOrder.advanceAmountPaid.toFixed(2)}</strong>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setViewingScreenshotOrder(null)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
                {viewingScreenshotOrder.status === 'Pending Verification' && (
                  <button
                    onClick={() => {
                      onUpdateOrderStatus(viewingScreenshotOrder.id, 'Advance Confirmed', 'Screenshot verified by admin.');
                      setViewingScreenshotOrder(null);
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve 20% Advance Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* MODAL: CANCEL ORDER WITH MANDATORY REASON BOX */}
        {cancellingOrder && (
          <div className="fixed inset-0 z-60 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
              {/* Header */}
              <div className="bg-rose-700 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-800 text-rose-200 flex items-center justify-center">
                    <Ban className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base font-['Outfit'] text-white">
                      Cancel Customer Order
                    </h3>
                    <p className="text-xs text-rose-100">
                      Order #{cancellingOrder.orderNumber} • {cancellingOrder.customerName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCancellingOrder(null);
                    setCancellationReasonText('');
                    setCancellationError('');
                  }}
                  className="w-7 h-7 rounded bg-rose-800 hover:bg-rose-900 text-rose-200 flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleConfirmCancellation} className="p-5 space-y-4">
                {/* Order Summary Snapshot */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Customer:</span>
                    <span className="font-semibold text-slate-900">
                      {cancellingOrder.customerName} ({cancellingOrder.phoneNumber})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Event Date:</span>
                    <span className="font-bold text-amber-800">
                      📅 {cancellingOrder.eventDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Plates & Value:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {cancellingOrder.totalPlates} plates (₹{cancellingOrder.totalAmount.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">20% Advance Recorded:</span>
                    <span className="font-mono text-amber-700 font-bold">
                      ₹{cancellingOrder.advanceAmountPaid.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Reason Selection & Input Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Quick Reason Selection:
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {[
                      '20% advance not received / invalid UTR reference',
                      'Factory capacity fully booked for requested date',
                      'Customer requested cancellation via phone/WhatsApp',
                      'Order booked less than 3 days manufacturing lead time',
                      'Delivery address outside Kotturu serviceable area'
                    ].map((reasonOption, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setCancellationReasonText(reasonOption);
                          setCancellationError('');
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors cursor-pointer text-left ${
                          cancellationReasonText === reasonOption
                            ? 'bg-rose-50 border-rose-400 text-rose-800 font-semibold shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {reasonOption}
                      </button>
                    ))}
                  </div>

                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Cancellation Reason <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={cancellationReasonText}
                    onChange={(e) => {
                      setCancellationReasonText(e.target.value);
                      if (e.target.value.trim()) setCancellationError('');
                    }}
                    placeholder="Enter reason why this order is cancelled (stored in order history and visible in order tracker)..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-rose-500 placeholder:text-slate-400"
                    required
                  />
                  {cancellationError && (
                    <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {cancellationError}
                    </p>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setCancellingOrder(null);
                      setCancellationReasonText('');
                      setCancellationError('');
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Keep Order (Back)
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
