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
    pattern: 'Vibrant Tropical Green Leaf Pattern',
    description: 'Square paper plate with glossy green tropical monstera leaf print. Heavy GSM paper board with grease and oil resistance. Ideal for banquets and celebrations.',
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
    description: 'Square dining paper plate featuring authentic fresh banana leaf design and smooth curved edges. Ideal for meal buffets, weddings, and traditional gatherings.',
    imageFileName: 'product-02-banana-leaf-green.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Best Seller'
  },
  {
    id: 'plate-3',
    name: 'Golden Orange Floral Leaf Square Plate',
    code: 'plate3',
    price: 1.90,
    shape: 'Square',
    pattern: 'Warm Golden Floral Leaf Motif',
    description: 'Square festive paper plate adorned with rich golden-yellow and warm orange floral curved leaf patterns. Best for poojas, weddings, and traditional celebrations.',
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
    description: 'Square eco-style paper plate replicating festive red and forest green foliage. Heavy-duty coated board supports hot food servings.',
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
    description: 'Square botanical orange and green leaf pattern plate. South Indian feast favorite with smooth curved rim and premium grease-resistant coating.',
    imageFileName: 'product-05-orange-green-leaf.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Catering Favorite'
  },
  {
    id: 'plate-6',
    name: 'Sunny Yellow Botanical Leaf Square Plate',
    code: 'plate6',
    price: 1.80,
    shape: 'Square',
    pattern: 'Sunny Yellow Botanical Contour Leaf Motif',
    description: 'Sturdy dining plate with vibrant yellow base and elegant green botanical contours. Perfect for meals, tiffins, sweets, prasadam, and snacks.',
    imageFileName: 'product-06-yellow-leaf.png',
    inStock: true,
    size: '11" x 11"',
    badge: 'Best Value'
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
