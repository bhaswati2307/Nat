# 🌿 NatHerb – Fresh Ayurvedic Ecommerce Platform

A production-ready, full-featured ecommerce website inspired by [nathabit.in](https://nathabit.in), built with pure HTML, CSS & JavaScript — **no Shopify, no external frameworks**.

---

## ✅ Completed Features

### 🏠 Homepage (`index.html`)
- Announcement bar with copyable coupon code (NEWHABIT250)
- Sticky header with mega dropdown navigation
- Horizontal category scroll chips (like nathabit.in)
- Auto-playing hero slider with 3 slides (prev/next + dots)
- Trending & New Launch product carousels
- Shop by Concern section (Hair Fall, Acne, Dryness etc.)
- Must-Have Collections grid
- Animated statistics section (5M+ customers)
- Why Us / brand values section
- Customer testimonials
- Key Ingredients showcase
- Newsletter subscription with coupon offer
- Full footer with social, links, payment badges

### 🛍 Shop / Category Page (`shop.html`)
- URL-based filtering: `?category=hair`, `?tag=new_launch`, `?search=query`
- Sidebar filters: Category, Price Range, Product Type, Rating
- Sort by: Featured, Price, Rating, Reviews, Discount
- Active filter chips with remove option
- Product grid with pagination (12 per page)
- Mobile filter toggle button
- Real-time product count

### 📦 Product Detail Page (`product.html`)
- URL slug-based routing: `?slug=product-slug`
- Image gallery with thumbnails
- Product badges (BEST SELLER, NEW LAUNCH, AWARD WINNER, FEATURED)
- Rating with star display + review count
- Price with discount percentage
- Quantity selector
- Add to Cart + Buy Now + Wishlist buttons
- Pincode delivery check (simulated)
- Product tabs: Description, Ingredients, How to Use, Benefits
- Customer reviews section with rating bars + helpful votes
- Submit review modal with star rating input
- Related products carousel

### 🛒 Cart
- Persistent cart stored in localStorage
- Cart sidebar (slide-in from right) on all pages
- Quantity update and item removal
- Coupon code application with API validation
- Real-time subtotal/discount/shipping/total calculation
- Free shipping threshold (₹599)

### 💳 Checkout (`checkout.html`)
- 3-step checkout flow with step indicators
- Contact info + delivery address form
- 4 payment methods: UPI, Card, Net Banking, Cash on Delivery
  - UPI ID verification
  - Card number formatting
  - Bank selection for Net Banking
  - COD surcharge (₹40)
- Order review step with address + items summary
- **Order creation via API** and redirect to confirmation
- Form validation

### ✅ Order Confirmation (`order-confirmation.html`)
- Success animation with order details
- Visual order timeline (Placed → Processing → Shipped → Delivered)
- Links to Invoice and Order Tracking
- Fun ayurvedic kitchen message

### 📋 Order Tracking (`orders.html`)
- Search by order number or email
- List view of all orders with status badges
- Order detail with live timeline
- Tracking number + courier display
- Cancel order functionality
- Invoice download link
- Support escalation button

### 🧾 Invoice (`invoice.html`)
- Professional GST invoice with NatHerb branding
- Bill To / Ship To addresses
- Itemized table with tax breakdown (18% GST)
- PAID stamp for completed orders
- Print-ready layout
- Download as PDF (via print dialog)

### 👤 Account (`account.html`)
- Login with email/password (session stored in localStorage)
- Registration with form validation
- Dashboard: orders count, wishlist count, loyalty points
- Recent orders list
- Address management
- Profile editor (name, phone, skin type, hair type)
- Loyalty points display
- Logout

### ❤️ Wishlist (`wishlist.html`)
- All wishlisted products displayed in product grid
- Add All to Cart button
- Clear Wishlist button
- Persistent via localStorage

### 💬 Customer Support (`support.html`)
- 4 contact channels: Live Chat, WhatsApp, Email, Phone
- Full FAQ system with 12+ FAQs, category filters, and search
- Support ticket form with category, priority, order reference
- Ticket status checker
- **Tickets saved to DB via API**
- My Tickets section for logged-in users
- **Live chat widget** with bot responses
- Quick reply buttons in chat

### 🖥 Admin Dashboard (`admin.html`)
- **Login gate** (admin@natherb.com / admin123)
- Dashboard with 4 KPI cards (Orders, Revenue, Customers, Open Tickets)
- Chart.js Revenue + Orders bar/line chart (last 7 days)
- Category donut chart
- Orders management: filter by status, search, update status/tracking
- **Products catalog** view
- **Customers database** view
- **Support ticket management** with reply functionality
- **Coupon management** with create form
- **CSV export** for orders
- Sticky sidebar navigation

---

## 📁 Project Structure

```
index.html              Homepage
shop.html               Product listing with filters
product.html            Product detail page
checkout.html           Multi-step checkout
order-confirmation.html Post-purchase confirmation
orders.html             Order tracking
invoice.html            Printable GST invoice
account.html            Login / Register / Dashboard
wishlist.html           Saved products
support.html            Help center + Live chat
admin.html              Admin dashboard

css/
  style.css             Complete design system

js/
  utils.js              Cart, Wishlist, Auth, API helpers
```

---

## 🗄 Database Tables (RESTful API)

| Table | Purpose |
|-------|---------|
| `products` | Product catalog with images, pricing, ratings |
| `orders` | Customer orders with status, items, shipping |
| `users` | Customer accounts |
| `reviews` | Product reviews |
| `support_tickets` | Customer support requests |
| `coupons` | Discount codes |

---

## 🔗 Key URLs / Routes

| Page | URL | Params |
|------|-----|--------|
| Homepage | `index.html` | — |
| All Products | `shop.html` | — |
| By Category | `shop.html` | `?category=hair\|face\|body\|trending` |
| By Subcategory | `shop.html` | `?category=hair&sub=shampoos` |
| New Launches | `shop.html` | `?tag=new_launch` |
| Search | `shop.html` | `?search=query` |
| Product Detail | `product.html` | `?slug=product-slug` |
| Checkout | `checkout.html` | — |
| Confirmation | `order-confirmation.html` | `?order=NH12345678&id=uuid` |
| Track Order | `orders.html` | `?order=NH12345678` |
| Invoice | `invoice.html` | `?id=uuid` or `?order=NH12345678` |
| Account | `account.html` | — |
| Wishlist | `wishlist.html` | — |
| Support | `support.html` | `?type=order\|product\|payment` |
| Admin | `admin.html` | — |

---

## 💳 Payment Methods (Simulated)

- **UPI** – UPI ID validation + major UPI apps
- **Credit/Debit Card** – Number formatting, expiry, CVV
- **Net Banking** – Bank selection dropdown
- **Cash on Delivery** – ₹40 COD surcharge

> Production payment gateway can be integrated by replacing the `placeOrder()` function in `checkout.html` with Razorpay or Stripe JS SDK calls.

---

## 🔑 Admin Access

**URL:** `/admin.html`
- **Email:** admin@natherb.com
- **Password:** admin123

---

## 📌 Features Not Yet Implemented

- Real payment gateway (Razorpay/Stripe integration)
- SMS/Email notifications for order updates
- OTP-based login
- Product image upload in admin
- Blog / Content pages
- Skin Quiz results page
- Gift cards
- Subscriptions / auto-replenishment
- Real-time inventory management
- Push notifications
- App Store / Play Store links

---

## 🚀 Recommended Next Steps

1. **Integrate Razorpay** – Replace simulate `placeOrder()` with Razorpay Payment JS
2. **Add real email notifications** – Use EmailJS or a webhook to send order confirmations
3. **Enhance admin product editor** – Add image upload, description editor, stock management
4. **Add more products** – Use the admin panel or `TableDataAdd` to expand the catalog
5. **SEO optimization** – Add proper meta tags, sitemap, structured data
6. **Performance** – Add image lazy loading, CSS/JS minification
7. **Analytics** – Integrate Google Analytics 4

---

*Built with ❤️ using Pure HTML + CSS + JavaScript. No Shopify. No frameworks.*
