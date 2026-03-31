# Deployment Guide - Prague For You Guest Services

## Pre-Deployment Checklist

- [ ] All environment variables configured locally
- [ ] Database migrations applied to Supabase
- [ ] Stripe test account created and keys obtained
- [ ] Resend account verified with domain
- [ ] GitHub repository created and code pushed
- [ ] Vercel account created

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Guest services shop"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Connect to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or use Vercel Dashboard:
- Import project from GitHub
- Select repository
- Continue with defaults

### 3. Configure Environment Variables in Vercel

Add the following in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... or pk_test_...
STRIPE_SECRET_KEY=sk_live_... or sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_BASE_URL=https://services.pragueforyou.cz (or your domain)
```

### 4. Configure Custom Domain

In Vercel Dashboard:
- Go to Settings → Domains
- Add domain: `services.pragueforyou.cz`
- Follow DNS configuration steps
- Wait for DNS propagation (5-30 min)

### 5. Setup Stripe Webhook

In Stripe Dashboard:
- Go to Webhooks (Developers → Webhooks)
- Add endpoint: `https://services.pragueforyou.cz/api/webhooks/stripe`
- Select events:
  - `checkout.session.completed`
  - `payment_intent.payment_failed`
- Copy webhook signing secret to Vercel environment variables

### 6. Verify with Stripe Test Mode

1. In Stripe Dashboard, ensure you're in **Test Mode**
2. Get test publishable key: `pk_test_...`
3. Keep test secret key: `sk_test_...`
4. Test the flow:
   - Visit: `https://services.pragueforyou.cz/?res=TEST123&name=John`
   - Add a product to cart
   - Proceed to checkout
   - Use test card: `4242 4242 4242 4242` with any future date and CVC
   - Verify order created in Supabase
   - Check confirmation email in Resend dashboard

### 7. Switch to Production (Stripe Live Keys)

⚠️ **Only after testing successfully with test mode!**

1. Get live keys from Stripe Dashboard
2. Update environment variables in Vercel:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_SECRET_KEY=sk_live_...`
3. Create live webhook endpoint in Stripe
4. Test with small real payment

## Post-Deployment Verification

- [ ] Guest shop loads at main URL
- [ ] Admin dashboard at `/admin/dashboard`
- [ ] Products appear correctly
- [ ] Add to cart works
- [ ] Stripe checkout processes
- [ ] Order created in database
- [ ] Confirmation email sent
- [ ] Order appears in admin panel
- [ ] Webhook events logged

## Monitoring

### Stripe Webhook Logs
- Vercel Dashboard → Logs → All Deployments
- Check `/api/webhooks/stripe` logs
- Stripe Dashboard → Webhooks → View logs

### Database
- Supabase Dashboard → SQL Editor
- Monitor `orders` table for new entries
- Check for any failed checkout attempts

### Emails
- Resend Dashboard → Emails
- Verify confirmation emails being sent
- Check delivery rates

## Rollback

If something goes wrong:

```bash
# Revert last deployment
vercel rollback

# Or redeploy previous version from Vercel Dashboard
```

## Troubleshooting

### Webhook not firing
- Check webhook URL is correct in Stripe
- Verify webhook secret matches in environment
- Look at Stripe webhook logs

### Emails not sending
- Verify domain verified in Resend
- Check API key in Vercel
- Look at Resend dashboard for bounce/block reasons

### Orders not saving
- Check Supabase connection
- Verify service role key
- Check database migrations applied

### Checkout button not working
- Verify Stripe publishable key
- Check browser console for errors
- Ensure reservation code in URL

## Support

For Vercel: https://vercel.com/support
For Stripe: https://support.stripe.com
For Supabase: https://supabase.com/support
For Resend: https://resend.com/support
