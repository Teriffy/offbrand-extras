# Prague For You - Guest Services Shop

A modern e-commerce platform for hotel guests to purchase extra services (drinks, laundry, pet fees, etc.) during their stay. Guests receive a reservation-specific link via PMS email and can checkout via Stripe.

## Tech Stack

- **Frontend**: Next.js 15 + React 19 (TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Email**: Resend
- **Hosting**: Vercel
- **Styling**: Tailwind CSS

## Project Structure

```
src/
├── app/
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   │   ├── products/       # Products API
│   │   ├── checkout/       # Stripe checkout
│   │   ├── webhooks/stripe # Stripe webhooks
│   │   └── admin/          # Admin CRUD endpoints
│   ├── success/            # Post-payment page
│   └── page.tsx            # Guest shop
├── components/             # Reusable components
├── contexts/               # React contexts (reservation, cart)
├── lib/                    # Utilities
│   ├── supabase/          # DB clients
│   ├── stripe.ts          # Stripe helpers
│   └── email.ts           # Email service
└── types/                 # TypeScript types
```

## Setup Instructions

### 1. Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Configure Supabase
npx supabase start

# Configure environment variables in .env.local
# Required:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# - STRIPE_SECRET_KEY
# - STRIPE_WEBHOOK_SECRET
# - RESEND_API_KEY
# - NEXT_PUBLIC_BASE_URL

# Run dev server
npm run dev
```

Visit `http://localhost:3000` for the guest shop or `http://localhost:3000/admin/dashboard` for admin panel.

### 2. Supabase Setup

```bash
# Push migrations to cloud
npx supabase db push

# Or apply manually from supabase/migrations/
```

The database will be created with:
- `products` table with 7 default items
- `orders` table for tracking payments
- `order_items` table for line items
- RLS policies for security

### 3. Stripe Configuration

1. Create a [Stripe account](https://stripe.com)
2. Get API keys from Stripe Dashboard
3. Set test/live keys in environment variables
4. Create a webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Add webhook secret to `.env.local`

### 4. Resend Setup

1. Create a [Resend account](https://resend.com)
2. Verify your domain
3. Get API key and add to environment variables

### 5. Vercel Deployment

```bash
# Deploy to Vercel
vercel deploy

# Set environment variables in Vercel dashboard
# Configure custom domain (e.g., services.pragueforyou.cz)
```

## Key Features

### Guest Experience

- **Reservation Link**: Email sends link with `?res=CODE&name=GUEST` parameters
- **Product Catalog**: Browse available services with prices
- **Shopping Cart**: Add/remove items, see running total
- **Stripe Checkout**: Secure payment processing
- **Confirmation**: Post-payment success page + email confirmation

### Admin Dashboard

- **Products**: Create, edit, toggle availability, delete
- **Orders**: View all orders, filter by status/reservation code
- **Order Details**: See line items, guest info, payment status
- **Statistics**: Total orders, paid orders, revenue

## API Endpoints

### Public
- `GET /api/products` - List available products
- `POST /api/checkout` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Admin (authenticated)
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PATCH /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product
- `GET /api/admin/orders` - List orders (with filters)
- `GET /api/admin/orders/[id]` - Get order details

## Database Schema

### products
- `id` (uuid, PK)
- `name` (text)
- `description` (text, optional)
- `price_cents` (int, in EUR cents)
- `is_available` (boolean)
- `sort_order` (int)
- `created_at`, `updated_at`

### orders
- `id` (uuid, PK)
- `reservation_code` (text)
- `guest_name` (text)
- `guest_email` (text, optional)
- `stripe_checkout_session_id` (text, unique)
- `stripe_payment_intent_id` (text, unique)
- `status` (pending|paid|failed|refunded)
- `total_cents` (int)
- `created_at`, `updated_at`

### order_items
- `id` (uuid, PK)
- `order_id` (uuid, FK)
- `product_id` (uuid, FK)
- `product_name` (text, snapshot)
- `product_price_cents` (int, snapshot)
- `quantity` (int)
- `subtotal_cents` (int)

## Guest Flow

1. **Email**: Guest receives PMS email with link
   ```
   https://services.pragueforyou.cz/?res=ABC123&name=John+Doe
   ```

2. **Landing**: Site detects reservation code and displays greeting

3. **Shopping**: Browse products, add to cart

4. **Checkout**: Click checkout, redirected to Stripe

5. **Payment**: Guest enters card details, authorizes payment

6. **Success**: Redirected to success page, receives confirmation email

7. **Reconciliation**: Admin sees order linked to reservation code

## Admin Flow

1. **Login**: Navigate to `/admin/dashboard` (basic auth, will need proper login in production)

2. **Products**: Manage pricing, availability, descriptions

3. **Orders**: View incoming orders, track revenue, match with reservations

## Email Confirmation

The order confirmation email includes:
- Guest name greeting
- Order summary with line items
- Total amount
- Reservation code for reconciliation
- Property contact info

## Security

- Environment variables for all secrets
- Row-level security (RLS) in Supabase
- Stripe webhook signature verification
- Service role key for server-side DB access only
- Anon key for public product reads only

## Future Enhancements

- [ ] Proper admin authentication (Supabase Auth)
- [ ] Order refunds/cancellations
- [ ] Email templates with React Email
- [ ] Analytics dashboard
- [ ] Bulk order export
- [ ] Multi-language support
- [ ] Discount codes
- [ ] Product categories

## Troubleshooting

### Webhook not firing
- Verify webhook URL in Stripe dashboard
- Check webhook secret in environment
- Use Stripe CLI locally: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Products not showing
- Verify `is_available = true` in database
- Check Supabase connection

### Stripe checkout fails
- Verify publishable key in browser console
- Check secret key is set server-side
- Ensure test/live keys match environment

## Support

For questions or issues, contact: info@pragueforyou.cz
