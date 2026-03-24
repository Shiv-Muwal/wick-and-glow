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

const shippingAddressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: true },
    line2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true, lowercase: true },
    phone: { type: String, default: '' },
    shippingAddress: { type: shippingAddressSchema, default: undefined },
    productLabel: { type: String, required: true },
    subtotal: { type: Number, default: 0 },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    shippingFee: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'cod' },
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

/** Storefront accounts (JWT auth). */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true }
);

const cartItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true }
);

/** Single-row admin panel password (bcrypt). If absent, login uses ADMIN_LOGIN_PASSWORD from .env. */
const adminCredentialsSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { _id: false }
);

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
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
export const AdminCredentials =
  mongoose.models.AdminCredentials ||
  mongoose.model('AdminCredentials', adminCredentialsSchema);
