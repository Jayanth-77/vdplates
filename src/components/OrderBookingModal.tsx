import React, { useState, useRef, useEffect } from 'react';
import {
  X, Calendar, AlertCircle, CheckCircle2, Upload, FileText,
  Copy, Phone, ShieldAlert, ArrowRight, Printer, MessageCircle, CreditCard,
  QrCode, ExternalLink, Mail, Building2, Check
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { CartItem, CustomerOrder, StoreInfo } from '../types';

interface OrderBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  storeInfo: StoreInfo;
  onOrderSuccess: (order: CustomerOrder) => void;
}

export const OrderBookingModal: React.FC<OrderBookingModalProps> = ({
  isOpen,
  onClose,
  cart,
  storeInfo,
  onOrderSuccess
}) => {
  // Step 1: Review & Details, Step 2: Payment Transfer & Screenshot, Step 3: Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityOrTown, setCityOrTown] = useState('Kotturu Mandal');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');

  // 3 Days advance date calculation
  const getMinDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  };

  const [eventDate, setEventDate] = useState(getMinDateString());
  const [advancePercent, setAdvancePercent] = useState<number>(20);
  const [paymentMethod, setPaymentMethod] = useState<'UPI Transfer' | 'Bank Transfer'>('UPI Transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && step === 3) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // confetti fallback
      }
    }
  }, [step, isOpen]);

  if (!isOpen) return null;

  const totalPlates = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.plate.price, 0);
  const advanceRequired = Math.round((totalAmount * (advancePercent / 100)) * 100) / 100;
  const balanceOnDelivery = Math.round((totalAmount - advanceRequired) * 100) / 100;

  // Validate 3 days notice
  const checkDateNoticeValid = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Screenshot file size is too large (max 8MB). Please choose a compressed image.');
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const handleProceedToPayment = () => {
    setErrorMessage('');
    if (totalPlates < 400) {
      setErrorMessage(`Minimum order is 400 plates. You currently have ${totalPlates} plates. Please add more to proceed.`);
      return;
    }
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit contact phone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address for receiving your order confirmation.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Please provide your delivery/pickup street address.');
      return;
    }
    if (!checkDateNoticeValid(eventDate)) {
      setErrorMessage('Notice: Orders must be booked at least 3 days in advance. Please select a date at least 3 days from today.');
      return;
    }

    setStep(2);
  };

  const handleFinalSubmitOrder = async () => {
    setErrorMessage('');
    if (!screenshotBase64 && !transactionRef.trim()) {
      setErrorMessage('Please provide your transaction reference/UTR number or upload the payment transfer screenshot.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName,
        phoneNumber,
        alternatePhone,
        email,
        address,
        cityOrTown,
        landmark,
        eventDate,
        items: cart.map(c => ({
          plateId: c.plate.id,
          plateName: c.plate.name,
          code: c.plate.code,
          unitPrice: c.plate.price,
          quantity: c.quantity,
          subtotal: c.quantity * c.plate.price
        })),
        advancePercentage: advancePercent,
        paymentMethod,
        transactionReference: transactionRef || 'SCREENSHOT_ATTACHED',
        paymentScreenshot: screenshotBase64,
        notes
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit order');
      }

      const createdOrder: CustomerOrder = await response.json();
      setCompletedOrder(createdOrder);
      onOrderSuccess(createdOrder);
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error booking order. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06170c]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Top Header with Eco-Friendly Forest Green & Leaf Green accent */}
        <div className="bg-[#0e2e1a] text-white p-5 sm:p-6 flex items-center justify-between border-b-2 border-[#22c55e]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#22c55e] text-[#052e16] uppercase tracking-wider">
                Direct Booking
              </span>
              <span className="text-xs text-emerald-200">Step {step} of 3</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1 font-['Outfit'] text-white">
              {step === 1 && 'Order Details & Event Schedule'}
              {step === 2 && 'Manual 20% Advance Payment & Screenshot'}
              {step === 3 && 'Booking Confirmed! Email Dispatched'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#184527] hover:bg-[#205732] text-emerald-200 flex items-center justify-center transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 bg-red-50 border-b border-red-200 flex items-start gap-2.5 text-xs sm:text-sm text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: REVIEW ITEMS & CUSTOMER DETAILS */}
        {step === 1 && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Cart summary */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-200">
                <span>Selected Plates</span>
                <span>Qty × Rate</span>
              </div>
              <div className="divide-y divide-slate-200/80 mt-2 max-h-40 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.plate.id} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-slate-900">{item.plate.name}</span>
                      <span className="text-slate-500 text-xs block">
                        ({item.plate.code.toUpperCase()} • ₹{item.plate.price.toFixed(2)} / pc)
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">
                        {item.quantity} pcs
                      </span>
                      <span className="text-amber-700 font-bold block text-xs">
                        ₹{(item.quantity * item.plate.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total plates validation bar */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-600">Total Plates: </span>
                  <strong className={totalPlates >= 400 ? 'text-amber-700' : 'text-red-600'}>
                    {totalPlates} / 400 min
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Total Order Value:</span>
                  <span className="text-lg font-black text-slate-950 font-['Outfit']">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {totalPlates < 400 && (
                <div className="mt-2 text-[11px] font-semibold text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-300">
                  ⚠️ Minimum order is 400 plates. Please adjust plate quantities in the catalog to proceed.
                </div>
              )}
            </div>

            {/* Mandatory Policy 1: 3 Days in Advance Date Picker */}
            <div className="bg-emerald-50/80 border-2 border-emerald-300 p-4 sm:p-5 rounded-2xl shadow-2xs">
              <label className="text-xs font-black text-[#143820] uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#15803d]" />
                Required Event / Delivery Date (Must be ≥ 3 Days in Advance)
              </label>
              <p className="text-xs text-[#166534] mt-1">
                Our manufacturing and packing requires <strong className="font-black">at least 3 days advance notice</strong> for die set & drying.
              </p>
              <input
                id="booking-event-date-input"
                type="date"
                min={getMinDateString()}
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mt-2.5 w-full px-4 py-3 bg-white border-2 border-emerald-200 rounded-xl text-slate-900 font-bold text-sm focus:outline-emerald-500 shadow-2xs"
              />
            </div>

            {/* Customer Contact Details */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Customer & Delivery Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="booking-name-input"
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Primary Phone Number *
                  </label>
                  <input
                    id="booking-phone-input"
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Email Address * (for Confirmation Receipt)
                  </label>
                  <input
                    id="booking-email-input"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Alternate Phone / WhatsApp
                  </label>
                  <input
                    id="booking-alt-phone-input"
                    type="tel"
                    placeholder="Optional backup number"
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Delivery / Pickup Street Address *
                </label>
                <textarea
                  id="booking-address-input"
                  rows={2}
                  placeholder="Street, door no, village/town, nearby landmark in Kotturu or surrounding mandals"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-amber-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                id="booking-next-to-payment-btn"
                onClick={handleProceedToPayment}
                disabled={totalPlates < 400}
                className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm shadow-pill-green flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  totalPlates >= 400
                    ? 'bg-[#15803d] hover:bg-[#166534] text-white hover:scale-102 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Proceed to 20% Advance Payment Transfer
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SCANNER & BANK DETAILS 20% ADVANCE PAYMENT & SCREENSHOT UPLOAD */}
        {step === 2 && (
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Calculation Card */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Order Payment Split
                </span>
                <span className="text-xs text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Minimum 20% Advance Rule
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Total Order</span>
                  <span className="text-base font-extrabold text-slate-900 font-['Outfit']">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border-2 border-amber-500 shadow-2xs">
                  <span className="text-[11px] text-amber-800 font-bold block">
                    Advance to Pay ({advancePercent}%)
                  </span>
                  <span className="text-base font-black text-amber-700 font-['Outfit']">
                    ₹{advanceRequired.toFixed(2)}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Pay on Delivery</span>
                  <span className="text-base font-bold text-slate-700 font-['Outfit']">
                    ₹{balanceOnDelivery.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Advance percentage selector */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-700 font-medium">Select Advance %:</span>
                <div className="flex items-center gap-1">
                  {[20, 30, 50, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setAdvancePercent(pct)}
                      className={`px-2.5 py-1 rounded font-bold text-xs transition-colors cursor-pointer ${
                        advancePercent === pct
                          ? 'bg-amber-500 text-slate-950 shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* PhonePe QR Code Scanner & Bank Details Card */}
            <div className="bg-slate-950 text-white p-5 rounded-2xl space-y-5 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5f259f] flex items-center justify-center font-bold text-sm text-white">
                    पे
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Scan & Pay via PhonePe / Any UPI
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Transfer directly to Barri Jayanth (Owner Account)
                    </div>
                  </div>
                </div>
                <span className="text-[11px] bg-slate-800 text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                  Amount: ₹{advanceRequired.toFixed(2)}
                </span>
              </div>

              {/* Visual Scanner Layout: QR Code + Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
                {/* QR Scanner Display */}
                <div className="flex flex-col items-center bg-white text-slate-900 p-4 rounded-xl border-2 border-purple-500 shadow-md">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#5f259f] text-white flex items-center justify-center text-[10px] font-bold">
                      पे
                    </span>
                    <span className="font-extrabold text-sm tracking-tight text-[#5f259f]">
                      PhonePe
                    </span>
                    <span className="text-[9px] font-bold bg-purple-100 text-[#5f259f] px-1.5 py-0.5 rounded tracking-wider">
                      ACCEPTED HERE
                    </span>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <QRCodeSVG
                      value={`upi://pay?pa=barrijayanth@ybl&pn=BARRI%20JAYANTH&am=${advanceRequired.toFixed(2)}&cu=INR`}
                      size={160}
                      level="H"
                    />
                  </div>

                  <div className="mt-2 text-center">
                    <span className="text-xs font-black tracking-wider text-slate-900 block font-['Outfit']">
                      BARRI JAYANTH
                    </span>
                    <span className="text-[11px] text-purple-700 font-mono font-bold block">
                      UPI: barrijayanth@ybl
                    </span>
                  </div>

                  {/* Mobile direct UPI trigger button */}
                  <a
                    href={`upi://pay?pa=barrijayanth@ybl&pn=BARRI%20JAYANTH&am=${advanceRequired.toFixed(2)}&cu=INR`}
                    className="mt-2 w-full py-1.5 px-3 bg-[#5f259f] hover:bg-[#4d1d82] text-white rounded-lg text-center text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Pay ₹{advanceRequired.toFixed(2)} in UPI App</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Bank Account Credentials */}
                <div className="space-y-2.5 text-xs">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider pb-1">
                    Or Direct Bank Account Transfer:
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Account Holder Name</span>
                      <span className="font-bold text-slate-100 uppercase">{storeInfo.accountName}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Bank Name & Branch</span>
                      <span className="font-semibold text-slate-200">{storeInfo.bankName}, {storeInfo.branch}</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Account Number</span>
                      <span className="font-mono font-bold text-amber-400 text-sm tracking-wide">
                        {storeInfo.accountNumber}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(storeInfo.accountNumber, 'acc')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copy Account Number"
                    >
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">IFSC Code</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {storeInfo.ifscCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(storeInfo.ifscCode, 'ifsc')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copy IFSC Code"
                    >
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">UPI ID</span>
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {storeInfo.upiId}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(storeInfo.upiId, 'upi')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                      title="Copy UPI ID"
                    >
                      <Copy className="w-3 h-3 text-amber-400" />
                      <span>Copy</span>
                    </button>
                  </div>

                  {copiedField && (
                    <div className="text-center text-[11px] text-amber-400 bg-slate-800/80 py-1 rounded border border-amber-400/30">
                      Copied {copiedField.toUpperCase()} to clipboard!
                    </div>
                  )}
                </div>
              </div>

              {/* Automatic Email Notification Notice */}
              <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  Immediate payment notification will be automatically delivered to factory owner at <strong className="text-slate-200">{storeInfo.ownerEmail}</strong>.
                </span>
              </div>
            </div>

            {/* Step 2: Upload Payment Screenshot (Mandatory User Requirement) */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wide">
                Upload Payment Screenshot *
              </label>
              <p className="text-xs text-slate-500">
                After scanning the QR code or transferring <strong>₹{advanceRequired.toFixed(2)}</strong> to Barri Jayanth, take a screenshot of your successful transaction and upload it below.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                  screenshotBase64
                    ? 'border-amber-500 bg-amber-50/40'
                    : 'border-slate-300 hover:border-amber-500 bg-slate-50 hover:bg-slate-100/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />

                {screenshotBase64 ? (
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={screenshotBase64}
                      alt="Payment receipt preview"
                      className="max-h-36 max-w-xs object-contain rounded-lg border border-amber-300 shadow-2xs"
                    />
                    <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-amber-600" />
                      <span>{screenshotFileName || 'Screenshot attached'}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 underline">
                      Click to change image
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-3">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <span className="text-xs font-bold text-slate-800">
                      Click to Browse or Drag Screenshot Here
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WEBP (Max 8MB)
                    </span>
                  </div>
                )}
              </div>

              {/* UTR / Transaction reference input */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Transaction Reference / UTR Number (Optional but recommended)
                </label>
                <input
                  id="booking-utr-input"
                  type="text"
                  placeholder="e.g. 482910394821 or UPI Ref ID"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-amber-500"
                />
              </div>
            </div>

            {/* Back & Confirm button */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
              >
                ← Back
              </button>

              <button
                id="booking-submit-final-btn"
                type="button"
                onClick={handleFinalSubmitOrder}
                disabled={isSubmitting || (!screenshotBase64 && !transactionRef.trim())}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-sm shadow-pill-green flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  screenshotBase64 || transactionRef.trim()
                    ? 'bg-[#15803d] hover:bg-[#166534] text-white hover:scale-102 active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Confirming Booking...' : 'Submit 20% Advance & Confirm Order'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS & RECEIPT CONFIRMATION */}
        {step === 3 && completedOrder && (
          <div className="p-6 space-y-5 text-center max-h-[75vh] overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#15803d] mx-auto flex items-center justify-center border-2 border-emerald-300 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-black text-[#15803d] uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Booking Request Registered
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#143820] mt-2 font-['Outfit']">
                Order #{completedOrder.orderNumber}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Thank you, <strong className="text-slate-900">{completedOrder.customerName}</strong>! Your paper plates booking has been recorded.
              </p>
            </div>

            {/* Dual Email Notification confirmation card */}
            <div className="space-y-2 text-left">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-950">
                    Owner Notification Sent to: {storeInfo.ownerEmail}
                  </div>
                  <div className="text-[11px] text-emerald-800">
                    Immediate notification containing payment proof, customer phone ({completedOrder.phoneNumber}), and order list has been delivered to Barri Jayanth.
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Customer Receipt Sent to: {completedOrder.email}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    An official electronic copy of your order breakdown, 20% advance verification slip, and delivery instructions has been sent to your email.
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Event Delivery Date:</span>
                <span className="font-bold text-slate-900">{completedOrder.eventDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Total Plates:</span>
                <span className="font-bold text-slate-900">{completedOrder.totalPlates} Plates</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Total Bill:</span>
                <span className="font-bold text-slate-900">₹{completedOrder.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">20% Advance Recorded:</span>
                <span className="font-bold text-amber-700">₹{completedOrder.advanceAmountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Balance on Delivery:</span>
                <span className="font-bold text-slate-700">₹{completedOrder.balanceOnDelivery.toFixed(2)}</span>
              </div>
            </div>

            {/* Action buttons: WhatsApp to 9182879375 ONLY / Send Email / Print Receipt */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <a
                href={`https://wa.me/91${storeInfo.whatsappNumber}?text=${encodeURIComponent(
                  `Hello Barri Jayanth (VD PAPER PLATES)! I have transferred the 20% advance of ₹${completedOrder.advanceAmountPaid} for Order #${completedOrder.orderNumber} (${completedOrder.totalPlates} plates on ${completedOrder.eventDate}). Please verify payment screenshot.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 py-2.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-white shrink-0" />
                <span>Notify Owner WhatsApp</span>
              </a>

              <a
                href={`mailto:${storeInfo.ownerEmail}?subject=${encodeURIComponent(
                  `New Order Booking #${completedOrder.orderNumber} (₹${completedOrder.totalAmount}) - VD PAPER PLATES`
                )}&body=${encodeURIComponent(
                  `Order #${completedOrder.orderNumber}\nCustomer: ${completedOrder.customerName}\nPhone: ${completedOrder.phoneNumber}\nEvent Date: ${completedOrder.eventDate}\nTotal Plates: ${completedOrder.totalPlates}\nTotal Amount: ₹${completedOrder.totalAmount}\n20% Advance Paid: ₹${completedOrder.advanceAmountPaid}\nBalance on Delivery: ₹${completedOrder.balanceOnDelivery}\nPayment UTR: ${completedOrder.transactionReference}\nDelivery Address: ${completedOrder.address}, ${completedOrder.cityOrTown}`
                )}`}
                className="w-full sm:flex-1 py-2.5 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Email Owner Directly</span>
              </a>

              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              >
                <Printer className="w-4 h-4 shrink-0" />
                Print
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs cursor-pointer shadow-pill-green transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
