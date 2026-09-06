import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Copy, Check, Navigation, CreditCard, Building, MessageCircle, Mail, QrCode, ExternalLink, Leaf, ShieldCheck, Heart } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { StoreInfo } from '../types';

interface LocationAndContactSectionProps {
  storeInfo: StoreInfo;
}

export const LocationAndContactSection: React.FC<LocationAndContactSectionProps> = ({ storeInfo }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section id="contact-location-section" className="bg-[#0b2414] text-slate-100 py-16 sm:py-20 px-4 sm:px-8 border-t border-emerald-900/60 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Shop Location & Directions (Left 6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#174627] text-emerald-300 border border-emerald-600/40 mb-3 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                Factory & Retail Location
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight font-['Outfit'] text-white">
                Visit Our Factory <span className="text-[#22c55e]">& Direct Desk</span>
              </h2>
              <p className="mt-2 text-sm text-emerald-100/70 leading-relaxed font-normal">
                Direct manufacturing workshop located in Kotturu Mandal. We supply caterers, event organizers, wholesalers, and family celebrations across Andhra Pradesh.
              </p>
            </div>

            {/* Address Card in Deep Green */}
            <div className="bg-[#12361e]/90 rounded-3xl p-6 sm:p-7 border border-emerald-700/50 shadow-xl space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1d502d] text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-600/40 shadow-xs">
                  <MapPin className="w-6 h-6 text-[#22c55e]" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    Factory Address
                  </h3>
                  <p className="text-lg font-extrabold text-white mt-0.5">
                    {storeInfo.location}
                  </p>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    {storeInfo.district}
                  </p>
                  <p className="text-xs text-emerald-300/80 mt-1">
                    Landmark: Right opposite Road 4, Metturu Bit-2, near Kotturu main junction.
                  </p>
                </div>
              </div>

              {/* Action: Open in Maps / Directions */}
              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <a
                  href={storeInfo.googleMapsUrl || 'https://www.google.com/maps/place/VD+paper+plates/@18.7322491,83.906779,159m/data=!3m1!1e3!4m6!3m5!1s0x3a3c8b2c073276cf:0xd43cd69d5c52c4f5!8m2!3d18.73258!4d83.9074567!16s%2Fg%2F11zfj4r1j7?hl=en&entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#22c55e] hover:bg-[#16a34a] text-[#052e16] hover:text-white text-xs font-bold transition-all cursor-pointer shadow-pill-green hover:scale-105 active:scale-95"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=18.73258,83.9074567`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#184427] hover:bg-[#1f5632] text-white text-xs font-semibold border border-emerald-700/60 transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Driving Directions</span>
                </a>

                <button
                  type="button"
                  onClick={() => copyToClipboard(storeInfo.googleMapsUrl || 'https://www.google.com/maps/place/VD+paper+plates/@18.7322491,83.906779,159m/data=!3m1!1e3!4m6!3m5!1s0x3a3c8b2c073276cf:0xd43cd69d5c52c4f5!8m2!3d18.73258!4d83.9074567!16s%2Fg%2F11zfj4r1j7?hl=en&entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D', 'maps')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#0e2e1a] hover:bg-[#12361e] text-emerald-200 text-xs font-medium border border-emerald-800 transition-colors cursor-pointer"
                >
                  {copiedKey === 'maps' ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'maps' ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              {/* Embedded Google Map View with Rounded Frame */}
              <div className="mt-4 rounded-2xl overflow-hidden border border-emerald-700/60 bg-[#06170d] shadow-inner">
                <div className="bg-[#0b2414] px-4 py-2.5 border-b border-emerald-800/80 flex items-center justify-between text-xs text-emerald-200/80">
                  <span className="flex items-center gap-2 text-emerald-300 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                    Live Satellite & Road Map • VD paper plates
                  </span>
                  <span className="text-[11px] text-emerald-400/60 font-mono">18.73258° N, 83.90745° E</span>
                </div>
                <iframe
                  title="VD paper plates Google Maps Location"
                  src="https://maps.google.com/maps?q=18.73258,83.9074567&hl=en&z=17&output=embed"
                  className="w-full h-56 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Support Phone Numbers */}
            <div className="bg-[#12361e]/90 rounded-3xl p-6 border border-emerald-700/50 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
                <Phone className="w-4 h-4 text-[#22c55e]" />
                Customer Support & Booking Hotlines
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Number 1: WhatsApp & Direct Call */}
                <div className="bg-[#0c2615] p-4 rounded-2xl border border-emerald-600/40 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] text-emerald-300 font-black bg-emerald-900/90 px-2 py-0.5 rounded-full border border-emerald-500/40 uppercase">
                        WhatsApp & Call
                      </span>
                    </div>
                    <a
                      href="tel:9182879375"
                      className="text-lg font-black text-white hover:text-emerald-300 font-mono transition-colors block"
                    >
                      9182879375
                    </a>
                    <span className="text-[10px] text-emerald-200/60">Primary Contact (Barri Jayanth)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`https://wa.me/919182879375?text=${encodeURIComponent(
                        'Hello Barri Jayanth (VD PAPER PLATES), I would like to inquire about ordering paper plates.'
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-[#16a34a] hover:bg-[#15803d] text-white transition-all cursor-pointer shadow-sm hover:scale-105"
                      title="Chat on WhatsApp (9182879375)"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Number 2: Direct Call Only (NO WhatsApp) */}
                <div className="bg-[#0c2615] p-4 rounded-2xl border border-emerald-800/80 flex items-center justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] text-slate-300 font-bold bg-slate-800/90 px-2 py-0.5 rounded-full border border-slate-700 uppercase">
                        Direct Call Only (No WhatsApp)
                      </span>
                    </div>
                    <a
                      href="tel:7382468841"
                      className="text-lg font-black text-amber-300 hover:text-white font-mono transition-colors block"
                    >
                      7382468841
                    </a>
                    <span className="text-[10px] text-emerald-200/60">Shop Support Desk</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href="tel:7382468841"
                      className="p-3 rounded-full bg-[#1e4a2b] text-amber-300 hover:bg-[#22c55e] hover:text-black transition-all hover:scale-105"
                      title="Call directly (7382468841)"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Owner Email info */}
              <div className="pt-2 text-xs text-emerald-200/80 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>Owner Notification Email: <strong className="text-white font-semibold">{storeInfo.ownerEmail}</strong></span>
              </div>
            </div>
          </div>

          {/* Bank Account Details & PhonePe QR Scanner (Right 6 cols) */}
          <div className="lg:col-span-6 bg-[#12361e]/90 rounded-3xl p-6 sm:p-7 border border-emerald-700/50 shadow-xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-[#174627] text-emerald-300 border border-emerald-600/40 mb-3 uppercase tracking-wider">
                <CreditCard className="w-3.5 h-3.5 text-[#22c55e]" />
                Owner Bank Details & PhonePe QR Scanner
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                20% Advance <span className="text-[#22c55e]">Payment Instructions</span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-emerald-100/70 leading-relaxed font-normal">
                To confirm your booking, scan the PhonePe QR code or transfer to Barri Jayanth's State Bank of India account. Details and payment screenshots are delivered directly to the owner's email and Admin Dashboard.
              </p>
            </div>

            {/* QR Scanner + Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center bg-[#0a2012] p-5 rounded-2xl border border-emerald-700/60">
              {/* PhonePe QR Code Scanner Card in Crisp White */}
              <div className="bg-white text-slate-900 p-4 rounded-2xl flex flex-col items-center text-center shadow-lg">
                <div className="flex items-center gap-1 text-[#5f259f] font-black text-xs mb-2">
                  <span className="w-4 h-4 rounded-full bg-[#5f259f] text-white flex items-center justify-center text-[9px] font-bold">
                    पे
                  </span>
                  <span>PhonePe ACCEPTED HERE</span>
                </div>
                <div className="p-2 bg-white border-2 border-slate-200 rounded-xl">
                  <QRCodeSVG
                    value="upi://pay?pa=barrijayanth@ybl&pn=BARRI%20JAYANTH&cu=INR"
                    size={140}
                    level="H"
                  />
                </div>
                <span className="text-xs font-black text-slate-900 mt-2 font-['Outfit']">
                  BARRI JAYANTH
                </span>
                <span className="text-[11px] font-mono font-bold text-purple-700 mt-0.5">
                  barrijayanth@ybl
                </span>
              </div>

              {/* Bank Details Table */}
              <div className="space-y-2.5 text-xs divide-y divide-emerald-900/80">
                <div className="pb-2">
                  <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Account Holder:</span>
                  <strong className="text-white text-xs uppercase font-extrabold">{storeInfo.accountName}</strong>
                </div>

                <div className="py-2">
                  <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Bank & Branch:</span>
                  <span className="text-emerald-100 font-medium">{storeInfo.bankName}, {storeInfo.branch}</span>
                </div>

                <div className="py-2 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">Account Number:</span>
                    <strong className="font-mono text-amber-300 text-sm font-bold">{storeInfo.accountNumber}</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(storeInfo.accountNumber, 'acc')}
                    className="p-1.5 rounded-lg bg-[#184427] hover:bg-[#205732] text-emerald-200 cursor-pointer transition-colors"
                    title="Copy Account Number"
                  >
                    {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="py-2 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">IFSC Code:</span>
                    <strong className="font-mono text-amber-300 text-sm font-bold">{storeInfo.ifscCode}</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(storeInfo.ifscCode, 'ifsc')}
                    className="p-1.5 rounded-lg bg-[#184427] hover:bg-[#205732] text-emerald-200 cursor-pointer transition-colors"
                    title="Copy IFSC"
                  >
                    {copiedKey === 'ifsc' ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-emerald-300/70 block uppercase font-bold">UPI ID:</span>
                    <strong className="font-mono text-amber-300 text-sm font-bold">{storeInfo.upiId}</strong>
                  </div>
                  <button
                    onClick={() => copyToClipboard(storeInfo.upiId, 'upi')}
                    className="p-1.5 rounded-lg bg-[#184427] hover:bg-[#205732] text-emerald-200 cursor-pointer transition-colors"
                    title="Copy UPI"
                  >
                    {copiedKey === 'upi' ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Step Notice Reminder in Forest Green Card */}
            <div className="bg-[#091d10] p-5 rounded-2xl border border-emerald-800/80 text-xs space-y-2">
              <div className="font-black text-emerald-300 flex items-center gap-1.5 uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                Steps for 100% Guaranteed Confirmation:
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-emerald-100/80 leading-relaxed pl-1">
                <li>Submit your order with at least <strong>3 days advance notice</strong> (minimum 400 plates).</li>
                <li>Scan the PhonePe QR code or transfer <strong>20% advance</strong> to the account above.</li>
                <li>Upload your <strong>payment screenshot</strong> in the booking modal or WhatsApp to <strong>{storeInfo.whatsappNumber}</strong>.</li>
                <li>Owner (<strong>{storeInfo.ownerEmail}</strong>) & you receive verified confirmation.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar matching Reference Image */}
        <div className="mt-16 pt-8 border-t border-emerald-800/70 flex flex-col md:flex-row items-center justify-between text-xs text-emerald-300/70 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#16a34a] flex items-center justify-center text-white">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <p className="font-medium text-emerald-200">
              © {new Date().getFullYear()} <strong className="text-white font-bold">VD PAPER PLATES</strong> • Kotturu Mandal. Premium Eco-Friendly Tableware.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-emerald-300/80">
            <span>WhatsApp: <strong className="text-white">9182879375</strong></span>
            <span>•</span>
            <span>Call: <strong className="text-white">7382468841</strong></span>
            <span>•</span>
            <span>Metturu Bit-2 Road 4 Opposite</span>
          </div>
        </div>
      </div>
    </section>
  );
};

