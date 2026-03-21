import {
  Product,
  Customer,
  Order,
  Blog,
  Coupon,
  Review,
} from '../models/index.js';

const SEED_PRODUCTS = [
  {
    _id: 'p1',
    name: 'Floral Clay Candle',
    category: 'Floral',
    fragrance: 'Rose Petal',
    price: 899,
    originalPrice: 1099,
    emoji: '🌸',
    imageClass: 'bg-[linear-gradient(135deg,#f5cac3,#f7ede2)]',
    badge: 'bestseller',
    description:
      'Handcrafted with natural soy wax, this stunning floral clay candle blooms with the soft scent of fresh rose petals. Perfect for meditation, gifting, or home décor. Burns for 40+ hours.',
    galleryColor: '#f5cac3',
    stock: 34,
  },
  {
    _id: 'p2',
    name: 'Rose Aroma Candle',
    category: 'Floral',
    fragrance: 'Rose Petal',
    price: 749,
    emoji: '🌹',
    imageClass: 'bg-[linear-gradient(135deg,#e8b4b8,#f5cac3)]',
    badge: 'new',
    description:
      'Indulge in the timeless elegance of pure rose essence. Hand-poured in small batches using premium soy wax and pure rose essential oil. A luxurious sensory experience.',
    galleryColor: '#e8b4b8',
    stock: 52,
  },
  {
    _id: 'p3',
    name: 'White Oudh Soy Candle',
    category: 'Woody',
    fragrance: 'White Oudh',
    price: 1249,
    emoji: '🤍',
    imageClass: 'bg-[linear-gradient(135deg,#f0ebe3,#e8ddd0)]',
    badge: 'premium',
    description:
      'A sophisticated blend of white oudh and warm amber. This premium soy candle fills your space with an exotic, grounding fragrance that lingers for hours.',
    galleryColor: '#f0ebe3',
    stock: 12,
  },
  {
    _id: 'p4',
    name: 'Lavender Calm Candle',
    category: 'Herbal',
    fragrance: 'French Lavender',
    price: 699,
    emoji: '💜',
    imageClass: 'bg-[linear-gradient(135deg,#c8b4d4,#e8d8f0)]',
    badge: '',
    description:
      'Unwind and relax with the soothing scent of French lavender. This calming candle is perfect for bedtime rituals, yoga sessions, or anytime you need a moment of peace.',
    galleryColor: '#c8b4d4',
    stock: 41,
  },
  {
    _id: 'p5',
    name: 'Butterfly Pot Candle',
    category: 'Decorative',
    fragrance: 'Jasmine',
    price: 1099,
    emoji: '🦋',
    imageClass: 'bg-[linear-gradient(135deg,#b4d4e8,#d4eaf5)]',
    badge: 'limited',
    description:
      'A whimsical butterfly-shaped candle in a hand-painted terracotta pot. Each piece is uniquely crafted making it a perfect art piece and a luxurious candle in one.',
    galleryColor: '#b4d4e8',
    stock: 18,
  },
  {
    _id: 'p6',
    name: 'Vintage Glass Candle',
    category: 'Classic',
    fragrance: 'Sandalwood Vanilla',
    price: 849,
    emoji: '🏺',
    imageClass: 'bg-[linear-gradient(135deg,#e8d4b4,#f5e8d4)]',
    badge: '',
    description:
      'Inspired by vintage Parisian elegance, this candle comes in a beautiful reusable amber glass jar. A blend of sandalwood, vanilla, and musk creates a warm, sophisticated ambiance.',
    galleryColor: '#e8d4b4',
    stock: 28,
  },
];

export async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;

  await Product.insertMany(SEED_PRODUCTS);

  await Customer.insertMany([
    { name: 'Priya Sharma', email: 'priya@email.com', color: '#84a59d', ordersCount: 5, spend: 7250 },
    { name: 'Rohit Verma', email: 'rohit@email.com', color: '#f6bd60', ordersCount: 3, spend: 3899 },
    { name: 'Ananya Gupta', email: 'ananya@email.com', color: '#f5cac3', ordersCount: 7, spend: 9200 },
    { name: 'Karan Malhotra', email: 'karan@email.com', color: '#84a59d', ordersCount: 2, spend: 3198 },
    { name: 'Nidhi Patel', email: 'nidhi@email.com', color: '#f6bd60', ordersCount: 4, spend: 4650 },
    { name: 'Arjun Singh', email: 'arjun@email.com', color: '#a78bfa', ordersCount: 6, spend: 6800 },
    { name: 'Simran Kaur', email: 'simran@email.com', color: '#c8b4d4', ordersCount: 1, spend: 899 },
  ]);

  await Order.insertMany([
    { _id: '#ORD-001', customerName: 'Priya Sharma', customerEmail: 'priya@email.com', productLabel: 'Floral Clay Candle', amount: 1798, status: 'delivered', date: '2024-01-15', items: [] },
    { _id: '#ORD-002', customerName: 'Rohit Verma', customerEmail: 'rohit@email.com', productLabel: 'White Oudh Soy Candle', amount: 1199, status: 'shipped', date: '2024-01-16', items: [] },
    { _id: '#ORD-003', customerName: 'Ananya Gupta', customerEmail: 'ananya@email.com', productLabel: 'Lavender Calm Candle', amount: 849, status: 'pending', date: '2024-01-17', items: [] },
    { _id: '#ORD-004', customerName: 'Karan Malhotra', customerEmail: 'karan@email.com', productLabel: 'White Oudh Soy Candle', amount: 3198, status: 'delivered', date: '2024-01-14', items: [] },
    { _id: '#ORD-005', customerName: 'Nidhi Patel', customerEmail: 'nidhi@email.com', productLabel: 'Rose Aroma Candle', amount: 1498, status: 'cancelled', date: '2024-01-13', items: [] },
    { _id: '#ORD-006', customerName: 'Arjun Singh', customerEmail: 'arjun@email.com', productLabel: 'Vintage Glass Candle', amount: 699, status: 'shipped', date: '2024-01-17', items: [] },
    { _id: '#ORD-007', customerName: 'Simran Kaur', customerEmail: 'simran@email.com', productLabel: 'Floral Clay Candle', amount: 899, status: 'pending', date: '2024-01-18', items: [] },
  ]);

  await Blog.insertMany([
    {
      title: 'How to Choose the Perfect Candle for Every Mood',
      date: '2024-01-10',
      published: true,
      excerpt:
        'Discover how fragrance affects your mood and wellbeing, and find your perfect scent...',
      emoji: '🕯️',
      tag: 'Wellness',
    },
    {
      title: 'The Art of Hand-Poured Soy Candles',
      date: '2024-01-05',
      published: true,
      excerpt: 'Behind the scenes of our artisan candle making process and what makes it special...',
      emoji: '✨',
      tag: 'Craft',
    },
    {
      title: 'Top Fragrances for a Cozy Winter Home',
      date: '2023-12-20',
      published: false,
      excerpt:
        'Warm up your space with these seasonal scent combinations perfect for winter...',
      emoji: '❄️',
      tag: 'Seasonal',
    },
  ]);

  await Coupon.insertMany([
    { code: 'WELCOME10', discount: 10, expiry: '2024-03-31', active: true },
    { code: 'SUMMER20', discount: 20, expiry: '2024-06-30', active: true },
    { code: 'FESTIVE15', discount: 15, expiry: '2024-01-26', active: false },
    { code: 'FIRST50', discount: 50, expiry: '2024-02-28', active: true },
  ]);

  await Review.insertMany([
    {
      customerName: 'Priya Sharma',
      initials: 'PS',
      avatarColor: '#84a59d',
      rating: 5,
      body: 'Absolutely love the Rose Aroma Candle! The fragrance fills the entire room and lasts for hours. Will definitely order again.',
      reviewDate: 'Jan 15, 2024',
      productId: 'p2',
    },
    {
      customerName: 'Rohit Verma',
      initials: 'RV',
      avatarColor: '#f6bd60',
      rating: 4,
      body: 'Sandalwood Bliss is truly blissful! Great packaging too. Only wish the burn time was a bit longer.',
      reviewDate: 'Jan 16, 2024',
    },
  ]);

  console.log('MongoDB seeded (demo products, orders, customers, blogs, coupons, reviews).');
}
