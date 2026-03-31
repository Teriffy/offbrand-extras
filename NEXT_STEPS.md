# Next Steps - Prague For You Guest Services

## Immediate Actions (This Week)

### 1. Create External Accounts

- [ ] **Stripe Account**
  - Go to https://stripe.com
  - Sign up and complete onboarding
  - Get test API keys (pk_test_*, sk_test_*)
  - Later: Get live API keys (pk_live_*, sk_live_*)

- [ ] **Supabase Account**
  - Go to https://supabase.com
  - Create new project (region: EU recommended)
  - Get connection strings and API keys

- [ ] **Resend Account**
  - Go to https://resend.com
  - Sign up and verify your domain (pragueforyou.cz)
  - Get API key

### 2. Configure Local Environment

```bash
cd /Users/evzenleonenko/Root/Projekty/ofbd-extra

# Copy example to actual env file
cp .env.local.example .env.local

# Edit .env.local with your keys from above
nano .env.local  # or use your editor

# Required values:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_...)
# STRIPE_SECRET_KEY (sk_test_...)
# STRIPE_WEBHOOK_SECRET (will get after webhook setup)
# RESEND_API_KEY
# NEXT_PUBLIC_BASE_URL=http://localhost:3000 (for local dev)
```

### 3. Apply Database Migrations

```bash
# Make sure Supabase CLI is installed
npm install -g supabase

# Link your Supabase project
supabase link

# Push migrations to your Supabase project
supabase db push
```

Verify in Supabase dashboard:
- [ ] `products` table created with 7 items
- [ ] `orders` table exists
- [ ] `order_items` table exists
- [ ] RLS policies enabled

### 4. Test Locally

```bash
# Start dev server
npm run dev

# Test guest shop
open http://localhost:3000/?res=TEST123&name=John+Doe

# Test admin dashboard
open http://localhost:3000/admin/dashboard

# Verify:
# - Products load correctly
# - Add to cart works
# - Cart persists (try refresh)
# - Admin dashboard shows stats
```

### 5. Setup Stripe Webhook Locally (Optional but Recommended)

```bash
# Install Stripe CLI
# macOS: brew install stripe/stripe-cli/stripe
# or download from https://stripe.com/docs/stripe-cli

# Listen for Stripe events locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will output a signing secret, add to .env.local:
# STRIPE_WEBHOOK_SECRET=whsec_...
```

## Before Deployment (Next Week)

### 6. Setup Vercel

- [ ] Create Vercel account at https://vercel.com
- [ ] Connect GitHub repository
  ```bash
  git init
  git add .
  git commit -m "Initial commit: Prague For You Guest Services"
  git remote add origin https://github.com/YOUR_USERNAME/prague-for-you-extras.git
  git push -u origin main
  ```
- [ ] Import project into Vercel from GitHub

### 7. Configure Vercel Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add all values from your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_...)
STRIPE_SECRET_KEY (sk_test_...)
STRIPE_WEBHOOK_SECRET (will update after webhook setup)
RESEND_API_KEY
NEXT_PUBLIC_BASE_URL=https://services.pragueforyou.cz (or temp Vercel domain)
```

### 8. Configure Custom Domain

- [ ] In Vercel: Settings → Domains
- [ ] Add: `services.pragueforyou.cz`
- [ ] Update DNS records at your domain registrar
- [ ] Wait for DNS propagation (5-30 minutes)

### 9. Setup Stripe Webhook for Production

1. In Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://services.pragueforyou.cz/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
5. Copy signing secret
6. Update Vercel environment variable: `STRIPE_WEBHOOK_SECRET`

### 10. Test Full Flow with Stripe Test Mode

```
Test card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
```

Verify:
- [ ] Can add products to cart
- [ ] Checkout redirects to Stripe
- [ ] Test payment succeeds
- [ ] Order appears in Supabase
- [ ] Confirmation email sent
- [ ] Order visible in admin dashboard
- [ ] Webhook events logged in Stripe

## Going Live (When Ready)

### 11. Switch to Stripe Live Keys

⚠️ **Only after testing completely with test mode!**

1. Get live keys from Stripe Dashboard
2. Update in Vercel environment variables:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_SECRET_KEY=sk_live_...`
3. Create live webhook endpoint in Stripe
4. Test with small real payment (€1 or similar)

### 12. Setup Monitoring

- [ ] Vercel: Setup error notifications
- [ ] Stripe: Subscribe to webhook failure alerts
- [ ] Supabase: Setup database usage alerts
- [ ] Resend: Setup email bounce monitoring

### 13. Anthony's PMS Email Configuration

Update Better Hotel PMS to send guest emails with link:

```
Subject: Your Prague For You Stay - Special Offers

Hello {MAIN_GUEST_NAME},

During your stay, enjoy our special services:
https://services.pragueforyou.cz/?res={RES_CODE}&name={MAIN_GUEST_NAME}

Browse drinks, laundry, pet services and more!

Best regards,
Prague For You
```

(Replace `{RES_CODE}` and `{MAIN_GUEST_NAME}` with your PMS variable names)

## Maintenance Checklist (Weekly)

- [ ] Check Stripe webhook logs for failures
- [ ] Review orders in admin dashboard
- [ ] Check Resend email delivery rates
- [ ] Monitor Vercel deployment status
- [ ] Update product prices/availability as needed

## Support Contacts

- **Stripe Support**: https://support.stripe.com
- **Supabase Support**: https://supabase.com/support
- **Vercel Support**: https://vercel.com/support
- **Resend Support**: https://resend.com/support

## Files to Review Before Going Live

- [ ] `README.md` - Full documentation
- [ ] `DEPLOYMENT.md` - Deployment guide
- [ ] `.env.local.example` - All required env variables
- [ ] `supabase/migrations/` - Database schema
- [ ] `src/app/api/webhooks/stripe/route.ts` - Webhook handler

## Estimated Timeline

- **Setup accounts & local config**: 1-2 hours
- **Test locally**: 1 hour
- **Deploy to Vercel**: 30 minutes
- **Setup Stripe & webhook**: 1 hour
- **Full testing**: 1-2 hours
- **Total**: 4-6 hours for complete setup

## Questions?

Evžene, once you have the accounts and API keys, let me know and I can help you:
- Configure environment variables
- Debug any issues
- Optimize the setup
- Add additional features
- Handle any questions from Anthony

Ready when you are! 🚀
