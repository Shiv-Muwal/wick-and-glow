// React version of STATE from maeri-admin-panel.html

export const initialAdminState = {
  theme: 'light',
  sidebarCollapsed: false,
  products: [
    { id: 1, name: 'Rose Aroma Candle', price: 899, category: 'Floral', fragrance: 'Rose & Jasmine', stock: 34, description: 'A romantic blend of fresh roses and delicate jasmine.', emoji: '🌹' },
    { id: 2, name: 'Sandalwood Bliss', price: 1199, category: 'Woody', fragrance: 'Sandalwood & Vanilla', stock: 28, description: 'Warm, grounding notes of rich sandalwood and creamy vanilla.', emoji: '🌿' },
    { id: 3, name: 'Citrus Sunrise', price: 749, category: 'Citrus', fragrance: 'Lemon & Orange Zest', stock: 52, description: 'Uplifting blend of fresh citrus to brighten your mornings.', emoji: '🍊' },
    { id: 4, name: 'Lavender Dreams', price: 849, category: 'Herbal', fragrance: 'Lavender & Mint', stock: 19, description: 'Calming lavender with a cool hint of fresh mint.', emoji: '💜' },
    { id: 5, name: 'Oud Royale', price: 1599, category: 'Oriental', fragrance: 'Oud & Amber', stock: 12, description: 'A luxurious blend of rich oud wood and warm amber.', emoji: '✨' },
    { id: 6, name: 'Coconut Paradise', price: 699, category: 'Tropical', fragrance: 'Coconut & Sea Salt', stock: 41, description: 'Escape to a tropical beach with coconut and sea salt.', emoji: '🥥' },
  ],
  orders: [
    { id: '#ORD-001', customer: 'Priya Sharma', product: 'Rose Aroma Candle', amount: 1798, status: 'delivered', date: '2024-01-15' },
    { id: '#ORD-002', customer: 'Rohit Verma', product: 'Sandalwood Bliss', amount: 1199, status: 'shipped', date: '2024-01-16' },
    { id: '#ORD-003', customer: 'Ananya Gupta', product: 'Lavender Dreams', amount: 849, status: 'pending', date: '2024-01-17' },
    { id: '#ORD-004', customer: 'Karan Malhotra', product: 'Oud Royale', amount: 3198, status: 'delivered', date: '2024-01-14' },
    { id: '#ORD-005', customer: 'Nidhi Patel', product: 'Citrus Sunrise', amount: 1498, status: 'cancelled', date: '2024-01-13' },
    { id: '#ORD-006', customer: 'Arjun Singh', product: 'Coconut Paradise', amount: 699, status: 'shipped', date: '2024-01-17' },
    { id: '#ORD-007', customer: 'Simran Kaur', product: 'Rose Aroma Candle', amount: 899, status: 'pending', date: '2024-01-18' },
  ],
  customers: [
    { id: 1, name: 'Priya Sharma', email: 'priya@email.com', orders: 5, spend: 7250, color: '#84a59d' },
    { id: 2, name: 'Rohit Verma', email: 'rohit@email.com', orders: 3, spend: 3899, color: '#f6bd60' },
    { id: 3, name: 'Ananya Gupta', email: 'ananya@email.com', orders: 7, spend: 9200, color: '#f5cac3' },
    { id: 4, name: 'Karan Malhotra', email: 'karan@email.com', orders: 2, spend: 3198, color: '#84a59d' },
    { id: 5, name: 'Nidhi Patel', email: 'nidhi@email.com', orders: 4, spend: 4650, color: '#f6bd60' },
    { id: 6, name: 'Arjun Singh', email: 'arjun@email.com', orders: 6, spend: 6800, color: '#a78bfa' },
  ],
  blogs: [
    { id: 1, title: 'How to Choose the Perfect Candle for Every Mood', date: '2024-01-10', published: true, excerpt: 'Discover how fragrance affects your mood and wellbeing, and find your perfect scent...', emoji: '🕯️' },
    { id: 2, title: 'The Art of Hand-Poured Soy Candles', date: '2024-01-05', published: true, excerpt: 'Behind the scenes of our artisan candle making process and what makes it special...', emoji: '✨' },
    { id: 3, title: 'Top Fragrances for a Cozy Winter Home', date: '2023-12-20', published: false, excerpt: 'Warm up your space with these seasonal scent combinations perfect for winter...', emoji: '❄️' },
  ],
  coupons: [
    { id: 1, code: 'WELCOME10', discount: 10, expiry: '2024-03-31', active: true },
    { id: 2, code: 'SUMMER20', discount: 20, expiry: '2024-06-30', active: true },
    { id: 3, code: 'FESTIVE15', discount: 15, expiry: '2024-01-26', active: false },
    { id: 4, code: 'FIRST50', discount: 50, expiry: '2024-02-28', active: true },
  ],
};

