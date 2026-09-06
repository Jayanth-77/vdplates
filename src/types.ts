export interface PaperPlate {
  id: string;
  name: string;
  code: string;
  price: number;
  shape: 'Square' | 'Round';
  pattern: string;
  description: string;
  imageFileName: string;
  imageUrl?: string;
  inStock: boolean;
  size: string;
  badge?: string;
}

export interface CartItem {
  plate: PaperPlate;
  quantity: number;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phoneNumber: string;
  alternatePhone?: string;
  email: string;
  address: string;
  cityOrTown: string;
  landmark?: string;
  eventDate: string; // must be >= 3 days away
  orderDate: string;
  items: {
    plateId: string;
    plateName: string;
    code: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
  }[];
  totalPlates: number; // minimum 400
  totalAmount: number;
  advancePercentage: number; // minimum 20%
  advanceAmountRequired: number;
  advanceAmountPaid: number;
  balanceOnDelivery: number;
  paymentMethod: 'Bank Transfer' | 'UPI Transfer';
  transactionReference: string;
  paymentScreenshot?: string; // base64 data url
  status: 'Pending Verification' | 'Advance Confirmed' | 'In Production' | 'Dispatched' | 'Delivered' | 'Cancelled';
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  confirmationSentAt?: string;
  ownerNotificationSentTo?: string; // barrijayanth@gmail.com
  ownerNotifiedAt?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface StoreInfo {
  businessName: string;
  accountName: string;
  bankName: string;
  branch: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
  contactNumbers: string[];
  whatsappNumber: string;
  callOnlyNumber?: string;
  ownerEmail: string;
  location: string;
  district: string;
  googleMapsUrl: string;
  minPlates: number;
  minDaysInAdvance: number;
  minAdvancePercent: number;
}
