import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: { type: String, required: true },
    fragrance: { type: String, default: '' },
    emoji: { type: String, default: '🕯️' },
    imageClass: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
    badge: { type: String, default: '' },
    description: { type: String, required: true },
    galleryColor: { type: String, default: '#f5cac3' },
    stock: { type: Number, default: 0 },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  color: { type: String, required: true },
  ordersCount: { type: Number, default: 0 },
  spend: { type: Number, default: 0 },
});

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    productLabel: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    date: { type: String, required: true },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  published: { type: Boolean, default: false },
  excerpt: { type: String, default: '' },
  emoji: { type: String, default: '🕯️' },
  tag: { type: String, default: 'Journal' },
  content: { type: String },
  coverImageUrl: { type: String, default: '' },
  coverCloudinaryPublicId: { type: String, default: '' },
});

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  discount: { type: Number, required: true },
  expiry: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const contactMessageSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  createdAt: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  initials: { type: String, required: true },
  avatarColor: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  body: { type: String, required: true },
  reviewDate: { type: String, required: true },
  productId: { type: String },
});

export const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);
export const Customer =
  mongoose.models.Customer || mongoose.model('Customer', customerSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export const Coupon =
  mongoose.models.Coupon || mongoose.model('Coupon', couponSchema);
export const ContactMessage =
  mongoose.models.ContactMessage ||
  mongoose.model('ContactMessage', contactMessageSchema);
export const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model('NewsletterSubscriber', newsletterSchema);
export const Review =
  mongoose.models.Review || mongoose.model('Review', reviewSchema);
