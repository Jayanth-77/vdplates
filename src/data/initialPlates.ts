import { PaperPlate, StoreInfo } from '../types';

export const STORE_INFO: StoreInfo = {
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
  district: 'Srikakulam District, Andhra Pradesh - 532455',
  googleMapsUrl: 'https://www.google.com/maps/place/VD+paper+plates/@18.7322491,83.906779,159m/data=!3m1!1e3!4m6!3m5!1s0x3a3c8b2c073276cf:0xd43cd69d5c52c4f5!8m2!3d18.73258!4d83.9074567!16s%2Fg%2F11zfj4r1j7?hl=en&entry=ttu&g_ep=EgoyMDI2MDgzMS4wIKXMDSoASAFQAw%3D%3D',
  minPlates: 400,
  minDaysInAdvance: 3,
  minAdvancePercent: 20
};

export const INITIAL_PLATES: PaperPlate[] = [
  {
    id: 'plate-1',
    name: 'Green Leaf Square Deluxe Plate',
    code: 'plate1',
    price: 1.90,
    shape: 'Square',
    pattern: 'Vibrant Tropical Leaf Pattern',
    description: 'Square paper plate with glossy green tropical monstera leaf print. Heavy GSM paper board with grease and oil resistance. Ideal for banquets and celebrations.',
    imageFileName: 'plate1.jpg.jpeg',
    inStock: true,
    size: '11" x 11"',
    badge: 'Popular'
  },
  {
    id: 'plate-2',
    name: 'Green Leaf Round Classic Plate',
    code: 'plate2',
    price: 1.90,
    shape: 'Round',
    pattern: 'Lush Botanical Leaves Pattern',
    description: 'Round dining paper plate featuring continuous fresh green foliage leaf print with a crimped edge. Ideal for meal buffets and family functions.',
    imageFileName: 'plate2.jpg.jpeg',
    inStock: true,
    size: '12" Round',
    badge: 'Best Seller'
  },
  {
    id: 'plate-3',
    name: 'Golden Sunburst Square Plate',
    code: 'plate3',
    price: 1.90,
    shape: 'Square',
    pattern: 'Warm Golden Floral Leaf Motif',
    description: 'Square festive paper plate adorned with rich golden-yellow and warm orange floral curved leaf patterns. Best for poojas, weddings, and traditional gatherings.',
    imageFileName: 'plate3.jpg.jpeg',
    inStock: true,
    size: '11" x 11"',
    badge: 'Festive Special'
  },
  {
    id: 'plate-4',
    name: 'Traditional Banana Leaf Square Plate',
    code: 'plate4',
    price: 1.85,
    shape: 'Square',
    pattern: 'Deep Green Banana Leaf with Central Stem',
    description: 'Square eco-style paper plate replicating a fresh banana leaf with authentic longitudinal stem and delicate ribs. Thick board supports hot food servings.',
    imageFileName: 'plate4.jpg.jpeg',
    inStock: true,
    size: '11" x 11"',
    badge: 'Traditional Dining'
  },
  {
    id: 'plate-5',
    name: 'Traditional Banana Leaf Round Plate',
    code: 'plate5',
    price: 1.80,
    shape: 'Round',
    pattern: 'Realistic Fresh Banana Leaf Ribs',
    description: 'Round authentic banana leaf texture plate. South Indian feast favorite with smooth curved rim and premium wax-free water-resistant coating.',
    imageFileName: 'plate5.jpg.jpeg',
    inStock: true,
    size: '12" Round',
    badge: 'Catering Favorite'
  },
  {
    id: 'plate-6',
    name: 'Silver Metallic Fluted Snack Plate',
    code: 'plate6',
    price: 0.90,
    shape: 'Round',
    pattern: 'Embossed Metallic Silver Foil Rim',
    description: 'Fluted silver foil laminated round plate / snack katori bowl with embossed rim grooves. Perfect for breakfast tiffins, sweets, prasadam, and snacks.',
    imageFileName: 'plate6.jpg.jpeg',
    inStock: true,
    size: '7" Round',
    badge: 'Best Value'
  }
];
