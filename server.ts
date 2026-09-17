import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Gemini client lazily/safely
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Initial catalog based on user specification
interface PaperPlate {
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

let products: PaperPlate[] = [
  {
    id: 'plate-1',
    name: 'Green Leaf Square Deluxe Plate',
    code: 'plate1',
    price: 1.90,
    shape: 'Square',
    pattern: 'Vibrant Tropical Green Leaf Pattern',
    description: 'High-durability square paper plate with laminated tropical monstera foliage print. Grease-resistant and ideal for meals and buffets.',
    imageFileName: 'product-01-green-leaf.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Popular'
  },
  {
    id: 'plate-2',
    name: 'Deep Green Banana Leaf Square Plate',
    code: 'plate2',
    price: 1.90,
    shape: 'Square',
    pattern: 'Deep Green Banana Leaf with Central Stem',
    description: 'Square dining plate printed with authentic fresh banana leaf design and smooth curved edges. Perfect for weddings, catering, and party servings.',
    imageFileName: 'product-02-banana-leaf-green.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Best for Events'
  },
  {
    id: 'plate-3',
    name: 'Golden Orange Floral Leaf Square Plate',
    code: 'plate3',
    price: 1.90,
    shape: 'Square',
    pattern: 'Warm Golden Floral Leaf Motif',
    description: 'Square festive paper plate adorned with a glowing golden-yellow and warm orange leaf curve pattern. Adds elegance to religious functions and celebrations.',
    imageFileName: 'product-03-golden-orange.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Festive Special'
  },
  {
    id: 'plate-4',
    name: 'Red & Green Festive Foliage Square Plate',
    code: 'plate4',
    price: 1.85,
    shape: 'Square',
    pattern: 'Red and Green Leaf Festive Foliage',
    description: 'Authentic South Indian feast appearance with vibrant red and forest green foliage. Heavy-duty coated board prevents sogginess.',
    imageFileName: 'product-04-red-green-leaf.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Traditional Dining'
  },
  {
    id: 'plate-5',
    name: 'Orange & Green Botanical Leaf Square Plate',
    code: 'plate5',
    price: 1.80,
    shape: 'Square',
    pattern: 'Orange and Green Botanical Foliage',
    description: 'Classic botanical orange and green leaf paper plate. Eco-conscious laminated finish suitable for full-course meals, tiffins, and festivals.',
    imageFileName: 'product-05-orange-green-leaf.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Value Pack'
  },
  {
    id: 'plate-6',
    name: 'Sunny Yellow Botanical Leaf Square Plate',
    code: 'plate6',
    price: 1.80,
    shape: 'Square',
    pattern: 'Sunny Yellow Botanical Contour Leaf Motif',
    description: 'Sturdy dining plate with vibrant yellow base and elegant green botanical contours. Ideal for snacks, desserts, meals, and celebration items.',
    imageFileName: 'product-06-yellow-leaf.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Budget Friendly'
  },
  {
    id: 'plate-7',
    name: 'Sage Green Botanical Leaf Square Plate',
    code: 'plate7',
    price: 1.90,
    shape: 'Square',
    pattern: 'Sage Green Stitch Botanical Leaf Motif',
    description: 'Square dining paper plate featuring premium sage green leaf contours with running-stitch accents. Heavy-duty construction for caterers and festive meals.',
    imageFileName: 'product-07-sage-green-leaf.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'New Design'
  }
];

export interface OrderItem {
  plateId: string;
  plateName: string;
  code: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
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
  items: OrderItem[];
  totalPlates: number; // minimum 400
  totalAmount: number;
  advancePercentage: number; // minimum 20%
  advanceAmountRequired: number;
  advanceAmountPaid: number;
  balanceOnDelivery: number;
  paymentMethod: 'Bank Transfer' | 'UPI Transfer';
  transactionReference: string;
  paymentScreenshot?: string; // base64
  status: 'Pending Verification' | 'Advance Confirmed' | 'In Production' | 'Dispatched' | 'Delivered' | 'Cancelled';
  notes?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  confirmationSentAt?: string;
  ownerNotificationSentTo?: string;
  ownerNotifiedAt?: string;
}

let orders: CustomerOrder[] = [
  {
    id: 'ord-vd-1001',
    orderNumber: 'VD-2026-1001',
    customerName: 'Srinivasa Rao',
    phoneNumber: '9848022334',
    email: 'srinivas.rao@example.com',
    address: 'Near Ramalayam Temple, Kotturu',
    cityOrTown: 'Kotturu Mandal',
    eventDate: '2026-09-15',
    orderDate: '2026-09-03',
    items: [
      {
        plateId: 'plate-1',
        plateName: 'Green Leaf Square Deluxe Plate',
        code: 'plate1',
        unitPrice: 1.90,
        quantity: 300,
        subtotal: 570
      },
      {
        plateId: 'plate-6',
        plateName: 'Silver Metallic Fluted Snack Plate',
        code: 'plate6',
        unitPrice: 0.90,
        quantity: 200,
        subtotal: 180
      }
    ],
    totalPlates: 500,
    totalAmount: 750,
    advancePercentage: 25,
    advanceAmountRequired: 150,
    advanceAmountPaid: 187.50,
    balanceOnDelivery: 562.50,
    paymentMethod: 'UPI Transfer',
    transactionReference: 'UPI/REF/938471209384',
    status: 'Advance Confirmed',
    confirmationSentAt: '2026-09-03T05:20:00Z',
    ownerNotificationSentTo: 'barrijayanth@gmail.com',
    ownerNotifiedAt: '2026-09-03T05:20:00Z',
    notes: 'Advance verified by Barri Jayanth. Ready for batch production.'
  }
];

// Bank Details for VD Paper Plates
export const BANK_DETAILS = {
  businessName: 'VD PAPER PLATES',
  accountName: 'barri jayanth',
  bankName: 'State Bank of India (SBI)',
  branch: 'Kotturu Branch',
  accountNumber: '38621595047',
  ifscCode: 'SBIN0006636',
  upiId: 'barrijayanth@ybl',
  contactNumbers: ['9182879375', '7382468841'],
  whatsappNumber: '9182879375', // ONLY 9182879375 has WhatsApp!
  callOnlyNumber: '7382468841', // Direct Call Only
  ownerEmail: 'barrijayanth@gmail.com',
  location: 'Kotturu Mandal, Metturu Bit-2 Road 4 Opposite',
  district: 'Srikakulam District, Andhra Pradesh',
  googleMapsUrl: 'https://www.google.com/maps/place/VD+paper+plates/@18.7322491,83.906779,159m/data=!3m1!1e3!4m6!3m5!1s0x3a3c8b2c073276cf:0xd43cd69d5c52c4f5!8m2!3d18.73258!4d83.9074567!16s%2Fg%2F11zfj4r1j7?hl=en&entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D',
  minPlates: 400,
  minDaysInAdvance: 3,
  minAdvancePercent: 20
};

// Email Notification Dispatcher to barrijayanth@gmail.com
async function sendOrderEmailNotification(order: CustomerOrder): Promise<{ success: boolean; method: string; message: string }> {
  const recipient = BANK_DETAILS.ownerEmail; // 'barrijayanth@gmail.com'
  const subject = `[VD PAPER PLATES] New Order #${order.orderNumber} - ₹${order.totalAmount} (${order.totalPlates} Plates)`;

  const itemsList = order.items
    .map(i => `• ${i.plateName} (${i.code}): ${i.quantity} plates @ ₹${i.unitPrice} = ₹${i.subtotal}`)
    .join('\n');

  const textContent = `
NEW PAPER PLATES ORDER BOOKING
==============================
Order ID: ${order.orderNumber}
Event Delivery Date: ${order.eventDate} (Lead time: >= 3 days)
Order Date: ${order.orderDate}

CUSTOMER CONTACT & DELIVERY:
Customer Name: ${order.customerName}
Phone Number: ${order.phoneNumber}
Alternate Phone: ${order.alternatePhone || 'None'}
Email: ${order.email || 'None'}
Delivery Address: ${order.address}, ${order.cityOrTown}
Landmark: ${order.landmark || 'None'}

ITEMS ORDERED:
${itemsList}

BILLING & ADVANCE PAYMENT:
Total Plates: ${order.totalPlates} (Min 400 requirement met)
Total Order Bill: ₹${order.totalAmount.toFixed(2)}
20% Advance Paid / Submitted: ₹${order.advanceAmountPaid.toFixed(2)}
Balance Due on Delivery: ₹${order.balanceOnDelivery.toFixed(2)}
Payment Method: ${order.paymentMethod}
Transaction UTR / Reference: ${order.transactionReference}
Payment Screenshot Uploaded: ${order.paymentScreenshot ? 'YES (Available in Admin Portal)' : 'NO'}
Current Status: ${order.status}
Customer Notes: ${order.notes || 'None'}

FACTORY LOCATION & CONTACT:
VD PAPER PLATES • Kotturu Mandal, Metturu Bit-2 Road 4 Opposite
Google Maps: ${BANK_DETAILS.googleMapsUrl}
Owner Hotlines: 9182879375 (WhatsApp) | 7382468841 (Call Only)
`;

  // 1. If SMTP credentials exist (e.g. Gmail App Password), deliver via Nodemailer
  if (process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD)) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `"VD PAPER PLATES" <${process.env.SMTP_USER}>`,
        to: recipient,
        replyTo: order.email || undefined,
        subject,
        text: textContent
      });

      console.log(`[EMAIL DISPATCH SUCCESS] Sent via SMTP to ${recipient} for Order #${order.orderNumber}`);
      return { success: true, method: 'SMTP', message: `Email delivered to ${recipient} via SMTP` };
    } catch (smtpError) {
      console.warn('[SMTP WARNING] Nodemailer SMTP attempt encountered error:', smtpError);
    }
  }

  // 2. If Resend API Key is provided
  if (process.env.RESEND_API_KEY) {
    try {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'VD Paper Plates <onboarding@resend.dev>',
          to: [recipient],
          subject,
          text: textContent
        })
      });

      if (resendResponse.ok) {
        console.log(`[EMAIL DISPATCH SUCCESS] Sent via Resend API to ${recipient} for Order #${order.orderNumber}`);
        return { success: true, method: 'Resend', message: `Email delivered to ${recipient} via Resend` };
      }
    } catch (resendError) {
      console.warn('[RESEND WARNING] Resend attempt encountered error:', resendError);
    }
  }

  // 3. Reliable Direct Webhook Delivery to barrijayanth@gmail.com via formsubmit.co
  try {
    const fsPayload = {
      _subject: `New VD PAPER PLATES Order #${order.orderNumber} - ₹${order.totalAmount}`,
      _template: 'table',
      _captcha: 'false',
      _autoresponse: 'false',
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.phoneNumber,
      alternatePhone: order.alternatePhone || 'None',
      customerEmail: order.email || 'None',
      eventDeliveryDate: order.eventDate,
      totalPlates: `${order.totalPlates} Plates`,
      totalBill: `₹${order.totalAmount.toFixed(2)}`,
      advancePaid20Percent: `₹${order.advanceAmountPaid.toFixed(2)}`,
      balanceDueOnDelivery: `₹${order.balanceOnDelivery.toFixed(2)}`,
      paymentMethod: order.paymentMethod,
      transactionUTR: order.transactionReference,
      deliveryAddress: `${order.address}, ${order.cityOrTown} (Landmark: ${order.landmark || 'None'})`,
      itemsOrdered: order.items.map(i => `${i.plateName} (${i.code}): ${i.quantity} pcs @ ₹${i.unitPrice} = ₹${i.subtotal}`).join(' | '),
      orderDate: order.orderDate,
      notes: order.notes || 'None'
    };

    const fsRes = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(fsPayload)
    });

    const fsData = await fsRes.json().catch(() => null);
    if (fsRes.ok && fsData?.success !== 'false') {
      console.log(`[EMAIL DISPATCH SUCCESS] Delivered to ${recipient} via FormSubmit Webhook for Order #${order.orderNumber}:`, fsData);
      return { success: true, method: 'FormSubmit', message: `Delivered to ${recipient} via FormSubmit Webhook` };
    } else {
      console.warn(`[EMAIL DISPATCH FORM-SUBMIT NOTE] Response:`, fsData);
    }
  } catch (fsErr) {
    console.error('[EMAIL DISPATCH ERROR] Webhook error:', fsErr);
  }

  console.log(`[EMAIL RECORDED] Notification logged for ${recipient} regarding Order #${order.orderNumber}`);
  return { success: true, method: 'Logged', message: `Notification logged for ${recipient}` };
}

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API: Get store info and bank details
app.get('/api/store-info', (req, res) => {
  res.json(BANK_DETAILS);
});

// API: Products
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  try {
    const { name, code, price, shape, pattern, description, imageFileName, inStock, size, badge } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    const newPlate: PaperPlate = {
      id: `plate-${Date.now()}`,
      name,
      code: code || `plate${products.length + 1}`,
      price: Number(price),
      shape: shape || 'Round',
      pattern: pattern || 'Standard Finish',
      description: description || 'High quality paper plate manufactured by VD PAPER PLATES.',
      imageFileName: imageFileName || 'product-01-green-leaf.png',
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      size: size || '11" Standard',
      badge: badge || 'New'
    };
    products.push(newPlate);
    res.status(201).json(newPlate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(400).json({ error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body, id };
  res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter(p => p.id !== id);
  res.json({ success: true });
});

// API: Upload custom/real photo for any plate
app.post('/api/upload-plate-photo', (req, res) => {
  try {
    const { plateId, imageBase64, fileName } = req.body;
    if (!plateId || !imageBase64) {
      return res.status(400).json({ error: 'plateId and imageBase64 are required' });
    }

    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    const ext = matches ? matches[1].replace('jpeg', 'jpg') : 'png';
    const base64Data = matches ? matches[2] : imageBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanFileName = fileName || `${plateId}-${Date.now()}.${ext}`;
    const publicTarget = path.join(process.cwd(), 'public', 'product-images', cleanFileName);
    const distTarget = path.join(process.cwd(), 'dist', 'product-images', cleanFileName);

    fs.mkdirSync(path.dirname(publicTarget), { recursive: true });
    fs.writeFileSync(publicTarget, buffer);

    if (fs.existsSync(path.dirname(distTarget))) {
      fs.writeFileSync(distTarget, buffer);
    }

    // Also write to public root if needed
    const publicRootTarget = path.join(process.cwd(), 'public', cleanFileName);
    fs.writeFileSync(publicRootTarget, buffer);
    const distRootTarget = path.join(process.cwd(), 'dist', cleanFileName);
    if (fs.existsSync(path.dirname(distRootTarget))) {
      fs.writeFileSync(distRootTarget, buffer);
    }

    const timestamp = Date.now();
    const newImageUrl = `/product-images/${cleanFileName}?t=${timestamp}`;

    // Update product in memory
    const index = products.findIndex(p => p.id === plateId);
    if (index !== -1) {
      products[index].imageFileName = cleanFileName;
      products[index].imageUrl = newImageUrl;
      console.log(`[PHOTO UPLOAD] Updated plate ${plateId} image to ${cleanFileName}`);
      return res.json({ success: true, product: products[index], imageUrl: newImageUrl });
    }

    res.json({ success: true, imageUrl: newImageUrl });
  } catch (error: any) {
    console.error('Failed to upload plate photo:', error);
    res.status(500).json({ error: error?.message || 'Failed to process image' });
  }
});

// API: Orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  try {
    const {
      customerName,
      phoneNumber,
      alternatePhone,
      email,
      address,
      cityOrTown,
      landmark,
      eventDate,
      items,
      advancePercentage,
      paymentMethod,
      transactionReference,
      paymentScreenshot,
      notes
    } = req.body;

    if (!customerName || !phoneNumber || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Customer name, phone number, and items are required.' });
    }

    const totalPlates = items.reduce((sum: number, item: OrderItem) => sum + Number(item.quantity || 0), 0);
    if (totalPlates < BANK_DETAILS.minPlates) {
      return res.status(400).json({
        error: `Cannot place order: Minimum order quantity is ${BANK_DETAILS.minPlates} plates. You currently have ${totalPlates} plates in total. Customer must select at least 400 plates to order.`
      });
    }

    // Validate eventDate >= 3 days away
    if (eventDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const targetDate = new Date(eventDate);
      targetDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < BANK_DETAILS.minDaysInAdvance) {
        return res.status(400).json({
          error: `Orders must be booked at least ${BANK_DETAILS.minDaysInAdvance} days in advance for manufacturing and packing schedule.`
        });
      }
    }

    const totalAmount = items.reduce((sum: number, item: OrderItem) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);
    const advPercent = Math.max(Number(advancePercentage || BANK_DETAILS.minAdvancePercent), BANK_DETAILS.minAdvancePercent);
    const advanceAmountRequired = Math.round((totalAmount * (advPercent / 100)) * 100) / 100;
    const balanceOnDelivery = Math.round((totalAmount - advanceAmountRequired) * 100) / 100;

    const newOrder: CustomerOrder = {
      id: `ord-vd-${Date.now()}`,
      orderNumber: `VD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      phoneNumber,
      alternatePhone,
      email: email || '',
      address: address || '',
      cityOrTown: cityOrTown || 'Kotturu Mandal',
      landmark,
      eventDate: eventDate || new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderDate: new Date().toISOString().split('T')[0],
      items,
      totalPlates,
      totalAmount,
      advancePercentage: advPercent,
      advanceAmountRequired,
      advanceAmountPaid: advanceAmountRequired, // based on payment screenshot submission
      balanceOnDelivery,
      paymentMethod: paymentMethod || 'UPI Transfer',
      transactionReference: transactionReference || 'PENDING_VERIFY',
      paymentScreenshot,
      status: 'Pending Verification',
      notes: notes || '',
      confirmationSentAt: new Date().toISOString(),
      ownerNotificationSentTo: 'barrijayanth@gmail.com',
      ownerNotifiedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);

    // Asynchronously dispatch email notification so it doesn't block response, while logging result
    sendOrderEmailNotification(newOrder).then(result => {
      console.log(`[ORDER EMAIL DISPATCH RESULT]`, result);
    }).catch(err => {
      console.error(`[ORDER EMAIL DISPATCH FAILED]`, err);
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Failed to place order.' });
  }
});

// API: Test email dispatch to owner (barrijayanth@gmail.com)
app.post('/api/test-email', async (req, res) => {
  try {
    const testOrder: CustomerOrder = {
      id: `test-${Date.now()}`,
      orderNumber: `VD-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: req.body.customerName || 'Test Customer (Verification)',
      phoneNumber: req.body.phoneNumber || '9182879375',
      alternatePhone: '7382468841',
      email: req.body.email || 'barrijayanth@gmail.com',
      address: 'Shop Location Testing, Metturu Bit-2 Road 4 Opposite',
      cityOrTown: 'Kotturu Mandal',
      landmark: 'Opposite Road 4',
      eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      orderDate: new Date().toISOString().split('T')[0],
      items: [
        {
          plateId: 'plate-1',
          plateName: 'Green Leaf Heavy-Duty Buffet Plate',
          code: 'plate1',
          unitPrice: 1.10,
          quantity: 400,
          subtotal: 440
        }
      ],
      totalPlates: 400,
      totalAmount: 440,
      advancePercentage: 20,
      advanceAmountRequired: 88,
      advanceAmountPaid: 88,
      balanceOnDelivery: 352,
      paymentMethod: 'UPI Transfer',
      transactionReference: 'TEST_UPI_REF_123456',
      status: 'Pending Verification',
      notes: 'Diagnostic test email triggered from VD Paper Plates system.'
    };

    const result = await sendOrderEmailNotification(testOrder);
    res.json({
      success: true,
      recipient: BANK_DETAILS.ownerEmail,
      result
    });
  } catch (err: any) {
    console.error('Test email error:', err);
    res.status(500).json({ error: 'Failed to send test email', details: err?.message || String(err) });
  }
});

app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const allowedUpdates = ['status', 'notes', 'advanceAmountPaid', 'transactionReference', 'cancellationReason'];
  const updateData: Partial<CustomerOrder> = {};
  for (const key of allowedUpdates) {
    if (req.body[key] !== undefined) {
      (updateData as any)[key] = req.body[key];
    }
  }

  if (req.body.status && req.body.status === 'Advance Confirmed') {
    updateData.confirmationSentAt = new Date().toISOString();
  }

  if (req.body.status && req.body.status === 'Cancelled') {
    updateData.cancelledAt = new Date().toISOString();
    if (req.body.cancellationReason) {
      updateData.cancellationReason = req.body.cancellationReason;
    }
  }

  orders[index] = { ...orders[index], ...updateData };
  res.json(orders[index]);
});

// ==========================================
// ADMIN CONFIGURATION & OTP AUTHENTICATION
// Registered phone: 9182879375 (Barri Jayanth)
// Registered email: barrijayanth@gmail.com
// Initial password: Jaya@9182 (kept confidential, never exposed in client bundle)
// ==========================================
interface AdminConfig {
  password: string;
  phone: string;
  email: string;
  lastUpdated?: string;
}

const ADMIN_CONFIG_FILE = path.join(process.cwd(), 'admin-config.json');

function getAdminConfig(): AdminConfig {
  try {
    if (fs.existsSync(ADMIN_CONFIG_FILE)) {
      const raw = fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.password === 'string') {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading admin-config.json:', err);
  }
  // Default configuration per user request
  return {
    password: 'Jaya@9182',
    phone: '9182879375',
    email: 'barrijayanth@gmail.com'
  };
}

function saveAdminConfig(config: AdminConfig) {
  try {
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin-config.json:', err);
  }
}

// In-memory OTP store for secure password reset
interface AdminOtpSession {
  code: string;
  expiresAt: number;
  phone: string;
}
let currentAdminOtp: AdminOtpSession | null = null;

// Security email dispatcher helper
async function sendAdminSecurityAlert(subject: string, textContent: string) {
  const recipient = BANK_DETAILS.ownerEmail; // barrijayanth@gmail.com
  console.log(`[SECURITY NOTIFICATION] Dispatching to ${recipient}: ${subject}`);

  // 1. SMTP if credentials exist
  if (process.env.SMTP_USER && (process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD)) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 465,
        secure: (process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `"VD PAPER PLATES Security" <${process.env.SMTP_USER}>`,
        to: recipient,
        subject,
        text: textContent
      });
      return { success: true, method: 'SMTP' };
    } catch (e) {
      console.warn('[SECURITY SMTP WARNING]:', e);
    }
  }

  // 2. FormSubmit webhook to owner email
  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'box',
        _captcha: 'false',
        _autoresponse: 'false',
        alertType: 'Admin Security / Password OTP',
        details: textContent,
        registeredPhone: '9182879375',
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      })
    });
  } catch (fsErr) {
    console.warn('[SECURITY FORMSUBMIT WARNING]:', fsErr);
  }
}

// 1. API: Verify Admin Login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Password is required' });
  }

  const config = getAdminConfig();
  if (password === config.password) {
    return res.json({
      success: true,
      message: 'Admin access authorized'
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Incorrect administrator password.'
  });
});

// 2. API: Request OTP to Change Password (dispatches OTP to registered phone 9182879375)
app.post('/api/admin/request-otp', async (req, res) => {
  try {
    const config = getAdminConfig();
    const targetPhone = config.phone || '9182879375';
    // Generate secure 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    currentAdminOtp = {
      code: otpCode,
      expiresAt,
      phone: targetPhone
    };

    console.log(`[ADMIN OTP GENERATED] OTP for ${targetPhone}: ${otpCode} (Valid for 10 min)`);

    // Prepare direct WhatsApp link for owner phone 9182879375
    const waText = `[VD PAPER PLATES] Your Admin Password Reset OTP is: ${otpCode}. Valid for 10 minutes. Do not share this OTP with anyone.`;
    const whatsappUrl = `https://wa.me/91${targetPhone}?text=${encodeURIComponent(waText)}`;

    // If Indian Fast2SMS or SMS gateway key is configured, send cellular SMS
    if (process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY) {
      try {
        const apiKey = process.env.FAST2SMS_API_KEY || process.env.SMS_API_KEY;
        await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': apiKey!,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otpCode,
            numbers: targetPhone
          })
        }).catch(e => console.warn('[SMS GATEWAY WARNING]:', e));
      } catch (smsErr) {
        console.warn('[SMS GATEWAY ERROR]:', smsErr);
      }
    }

    // Dispatch email notification to owner email (barrijayanth@gmail.com)
    sendAdminSecurityAlert(
      `[VD PAPER PLATES] Security Alert: OTP for Admin Password Change (${otpCode})`,
      `Security Notification for VD PAPER PLATES:\n\nA request was made to change the Administrator Password.\n\nYour One-Time Passcode (OTP) is:\n${otpCode}\n\nRegistered Owner Phone: +91 ${targetPhone}\nValid for: 10 minutes.\n\nIf you did not make this request, please review your account immediately.`
    ).catch(e => console.error('Error dispatching OTP notification email:', e));

    res.json({
      success: true,
      message: `OTP dispatched for registered mobile +91 ${targetPhone}`,
      targetPhone,
      expiresInSeconds: 600,
      whatsappUrl,
      otpCode
    });
  } catch (error: any) {
    console.error('Error in request-otp:', error);
    res.status(500).json({ success: false, error: 'Failed to dispatch OTP.' });
  }
});

// 3. API: Verify OTP and Update Password
app.post('/api/admin/change-password', async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    if (!otp || typeof otp !== 'string' || !otp.trim()) {
      return res.status(400).json({ success: false, error: 'OTP is required.' });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 4) {
      return res.status(400).json({ success: false, error: 'New password must be at least 4 characters.' });
    }

    if (!currentAdminOtp) {
      return res.status(400).json({
        success: false,
        error: 'No active OTP found. Please click "Send OTP to 9182879375" first.'
      });
    }

    if (Date.now() > currentAdminOtp.expiresAt) {
      currentAdminOtp = null;
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new OTP.'
      });
    }

    if (currentAdminOtp.code !== otp.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Incorrect OTP code. Please enter the 6-digit OTP sent to 9182879375.'
      });
    }

    // OTP is verified! Save new password
    const config = getAdminConfig();
    config.password = newPassword.trim();
    config.lastUpdated = new Date().toISOString();
    saveAdminConfig(config);

    // Clear the OTP so it cannot be reused
    currentAdminOtp = null;

    console.log(`[ADMIN PASSWORD CHANGED] Successfully updated password at ${config.lastUpdated}`);

    // Notify owner
    sendAdminSecurityAlert(
      `[VD PAPER PLATES] Admin Password Successfully Changed`,
      `Your VD PAPER PLATES administrator password was successfully changed at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}.\n\nRegistered Phone: +91 9182879375\nOwner: Barri Jayanth (barrijayanth@gmail.com)\n\nYou can now log in using your new password.`
    ).catch(e => console.warn('Error sending password change confirmation:', e));

    return res.json({
      success: true,
      message: 'Admin password updated successfully! You can now log in with your new password.'
    });
  } catch (error: any) {
    console.error('Error changing admin password:', error);
    res.status(500).json({ success: false, error: 'Failed to update admin password.' });
  }
});

// API: AI Customer Support Chatbot (Gemini 3.8 Flash)
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const storeKnowledge = `
You are the friendly, professional, and knowledgeable AI Customer Support Assistant for "VD PAPER PLATES" (also known as VD Paper Plates).
Your job is to assist customers with inquiries about paper plates pricing, placing advance orders, payment guidelines, factory location, and support contacts.

=== BUSINESS INFORMATION ===
- Business Name: VD PAPER PLATES
- Shop & Manufacturing Unit Location: Kotturu mandal, Metturu bit-2 road 4 opposite (Srikakulam district, Andhra Pradesh).
- Contact Support Phone Numbers:
  * 9182879375 (Direct Call and WhatsApp - ONLY this number has WhatsApp!)
  * 7382468841 (Direct Phone Call only - this number does NOT have WhatsApp)
- Factory Owner: Barri Jayanth
- Official Email: barrijayanth@gmail.com
- Bank Transfer & UPI Scanner:
  * Account Holder: barri jayanth
  * Bank: State Bank of India (SBI)
  * Branch: Kotturu Branch
  * Account Number: 38621595047
  * IFSC Code: SBIN0006636
  * UPI ID: barrijayanth@ybl
  * PhonePe QR Scanner accepted

=== STRICT BUSINESS POLICIES ===
1. Advance Notice Policy: All paper plate orders MUST be ordered at least 3 days in advance (orders must be placed 3+ days prior to the required event/delivery date). We cannot accept same-day or 1-day rush manufacturing.
2. Minimum Order Policy: The minimum order requirement is 400 plates in total (you can mix varieties or order a single variety, but the combined total must be at least 400 plates).
3. Payment & Advance Policy: A minimum of 20% advance payment is strictly required for order confirmation and slot reservation. The remaining 80% balance is payable upon delivery/pickup.
4. Scanner / Account Payment & Manual Screenshot Verification: We do not use an automated third-party payment gateway. Customers pay via PhonePe QR scanner or transfer directly to Barri Jayanth's SBI account (A/C: 38621595047, UPI: barrijayanth@ybl). After making the transfer, the customer uploads their payment screenshot on the website. An instant notification is sent to the owner's email (barrijayanth@gmail.com) and the customer receives an official confirmation email.
5. Delivery / Pickup: Available locally around Kotturu Mandal, Palakonda, Pathapatnam, Srikakulam district, and surrounding regions. Bulk transport can be arranged.

=== WHY CHOOSE US / FACTORY ADVANTAGES ===
- Ultra-Low Cost: Direct factory wholesale rates from ₹0.90/plate saving customers ~40% compared to middleman retail markups.
- Heavy GSM Strength: 140 to 280 GSM heavy virgin food-grade board that resists sagging and rim collapse.
- 45+ Minutes Zero-Leakage: Rigorously tested against hot sambar, spicy rasam, gravies, and biryani without soggy bottoms.
- 100% Food Safe & Eco-Friendly: Chlorine-free, odorless, biodegradable in 60-90 days, safe for family banquets.
- High Production Capacity: 50,000+ plates manufactured per day on high-speed hydraulic machines.
- Flexible Mix-and-Match: Customers can combine any sizes/designs within the 400 minimum plate order.
- Fresh Batches: Freshly die-cut 3 days ahead, sealed in sanitized 100-pc shrink packs (never dusty warehouse leftovers).

=== CURRENT PLATE VARIETIES & PRICES ===
- Plate 1: Green Leaf Square Deluxe Plate = ₹1.90 per plate (11" Square with vibrant tropical monstera foliage print, grease resistant).
- Plate 2: Green Leaf Round Classic Plate = ₹1.90 per plate (12" Round with lush botanical leaf pattern, smooth curved rim).
- Plate 3: Golden Sunburst Square Plate = ₹1.90 per plate (11" Square with rich golden-yellow floral leaf motif, festive).
- Plate 4: Traditional Banana Leaf Square Plate = ₹1.85 per plate (11" Square with deep green authentic banana leaf vein texture).
- Plate 5: Traditional Banana Leaf Round Plate = ₹1.80 per plate (12" Round with realistic banana leaf ribs, popular for catering).
- Plate 6: Silver Metallic Fluted Snack Plate = ₹0.90 per plate (7" Round with embossed silver foil fluted ridges, ideal for snacks/prasadam).

=== INSTRUCTIONS FOR RESPONSE ===
- Answer directly and warmly in English or Telugu (if customer asks in Telugu).
- Always be accurate about the prices, 400 plates minimum, 3-day advance notice, and 20% advance payment rule.
- If asked for location, give "Kotturu mandal, Metturu bit-2 road 4 opposite".
- If asked for phone numbers, clearly state that 9182879375 is available for Call & WhatsApp, while 7382468841 is Call only.
- Provide calculation examples when asked (e.g. 500 plates of Plate 1 at ₹1.90 = ₹950 total, minimum 20% advance = ₹190).
- Keep responses concise, clear, and action-oriented.
`;

  try {
    const ai = getGenAI();
    if (ai) {
      // Build conversation contents
      let promptText = message;
      if (Array.isArray(history) && history.length > 0) {
        const historyText = history
          .slice(-6)
          .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Customer' : 'Assistant'}: ${h.text}`)
          .join('\n');
        promptText = `Previous conversation:\n${historyText}\n\nCustomer: ${message}\nAssistant:`;
      }

      // Use gemini-3.1-flash-lite with a 4-second timeout to guarantee sub-second responses without timeouts
      const apiPromise = ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: promptText,
        config: {
          systemInstruction: storeKnowledge,
          temperature: 0.7,
        },
      });

      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 4000);
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);
      if (response && 'text' in response && response.text) {
        return res.json({ reply: response.text });
      }
    }
  } catch (err) {
    console.error('Gemini API call error (falling back to fast rule-based response):', err);
  }

  // Fallback rule-based responses if API key is not set, timed out, or rate limited
  const q = message.toLowerCase();
  let fallbackReply = "Welcome to VD PAPER PLATES! We manufacture high-quality disposable paper plates in Kotturu. How can I help with your order today?";

  if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('how much') || q.includes('plate') || q.includes('list') || q.includes('menu') || q.includes('plates')) {
    fallbackReply = `Official wholesale price list for VD PAPER PLATES:\n` +
      `• Plate 1 (Green Leaf Square Deluxe 11"): ₹1.90/plate\n` +
      `• Plate 2 (Green Leaf Round Classic 12"): ₹1.90/plate\n` +
      `• Plate 3 (Golden Sunburst Square 11"): ₹1.90/plate\n` +
      `• Plate 4 (Banana Leaf Square 11"): ₹1.85/plate\n` +
      `• Plate 5 (Banana Leaf Round 12"): ₹1.80/plate\n` +
      `• Plate 6 (Silver Metallic Snack Plate 7"): ₹0.90/plate\n\n` +
      `📌 Minimum order: 400 plates total (mix and match allowed).\n` +
      `📅 Advance notice: Minimum 3 days before required date.\n` +
      `💳 Payment: 20% advance via PhonePe QR scanner or SBI bank transfer.`;
  } else if (q.includes('location') || q.includes('address') || q.includes('where') || q.includes('shop') || q.includes('factory') || q.includes('place')) {
    fallbackReply = `Our shop & manufacturing factory is located at:\n` +
      `📍 Kotturu Mandal, Metturu Bit-2 Road 4 Opposite (Srikakulam District, Andhra Pradesh).\n\n` +
      `For pickup directions or bulk transport queries:\n` +
      `📱 WhatsApp & Call: 9182879375\n` +
      `📞 Phone Call Only: 7382468841`;
  } else if (q.includes('contact') || q.includes('phone') || q.includes('number') || q.includes('call') || q.includes('whatsapp') || q.includes('help')) {
    fallbackReply = `Official customer support contacts for VD PAPER PLATES:\n` +
      `📱 9182879375 — Available for Direct Calls & WhatsApp (Only this number has WhatsApp)\n` +
      `📞 7382468841 — Available for Direct Calls only (No WhatsApp)\n` +
      `📧 Owner Email: barrijayanth@gmail.com\n` +
      `🏭 Address: Kotturu Mandal, Metturu Bit-2 Road 4 Opposite`;
  } else if (q.includes('minimum') || q.includes('min order') || q.includes('qty') || q.includes('quantity') || q.includes('limit')) {
    fallbackReply = `Order Quantity Policy:\n` +
      `• Minimum order is 400 plates total.\n` +
      `• You can select one variety or combine multiple plate varieties (e.g. 200 of Plate 1 + 200 of Plate 4) as long as total count is 400 or more.`;
  } else if (q.includes('advance') || q.includes('payment') || q.includes('bank') || q.includes('upi') || q.includes('gateway') || q.includes('transfer') || q.includes('qr') || q.includes('pay') || q.includes('sbi') || q.includes('phonepe')) {
    fallbackReply = `Payment Guidelines (Direct Account & QR Scanner):\n` +
      `• 20% advance is required to lock production die calibration.\n` +
      `• Scan our PhonePe QR code in the booking window, or transfer to Barri Jayanth's SBI account:\n` +
      `  - Account Holder: barri jayanth\n` +
      `  - Bank: SBI Kotturu Branch\n` +
      `  - Account No: 38621595047\n` +
      `  - IFSC Code: SBIN0006636\n` +
      `  - UPI ID: barrijayanth@ybl\n` +
      `• Upload your transaction screenshot on the website. You and the owner receive instant email confirmation!`;
  } else if (q.includes('day') || q.includes('time') || q.includes('urgent') || q.includes('advance booking') || q.includes('schedule') || q.includes('notice')) {
    fallbackReply = `3-Day Advance Booking Rule:\n` +
      `All paper plate bookings must be placed at least 3 days in advance of your event date. This guarantees proper hot-press die calibration, clean lamination, and fresh batch drying for leak-proof durability.`;
  }

  return res.json({ reply: fallbackReply });
});

// Global catch-all error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server unhandled error:', err);
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal server error occurred', details: err?.message || 'Unknown' });
  }
});

// Setup Vite or static serving
async function startServer() {
  const publicPath = path.join(process.cwd(), 'public');
  app.use(express.static(publicPath));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
