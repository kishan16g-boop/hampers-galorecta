# Hampers Galore Storefront

A responsive ecommerce website for Hampers Galore, a gifting business based in Chitradurga, Karnataka. Customers can browse gift hampers, keep products in a persistent shopping bag, pay in Indian rupees through Stripe Checkout, and provide an Indian delivery address during payment.

## Key technologies

- TanStack Start, React 19, and TypeScript
- Tailwind CSS with a custom responsive design system
- Stripe Checkout for hosted online payments
- Netlify Database with Drizzle ORM for persistent order records
- Netlify Functions for verified Stripe webhook events
- Netlify deployment through the TanStack Start Vite plugin

## Run locally

1. Install dependencies with `pnpm install`.
2. Add the required environment variables to a local Netlify environment: `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`.
3. Start the Netlify development environment with `netlify dev --port 8889`.
4. Open `http://localhost:8889`.

The storefront remains browsable without Stripe configured. Checkout clearly shows that online payment is being connected until a Stripe secret key is available.

## Stripe setup

Create a Stripe webhook endpoint for `/api/stripe-webhook` and subscribe it to `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.async_payment_failed`. Store the webhook signing secret as `STRIPE_WEBHOOK_SECRET` and the Stripe secret key as `STRIPE_SECRET_KEY` in Netlify environment variables. Never add either value to source control.

Checkout uses INR, accepts Indian delivery addresses, collects a phone number, and stores order status and delivery details only after Stripe verifies the webhook event.

## Edit the shop

- Edit product names, prices, descriptions, categories, and hamper contents in `src/data/products.ts`.
- Add replacement product images to `public/images/`, then update each product's `image` path in `src/data/products.ts`.
- Replace `public/images/hampers-galore-logo.jpg` to update the logo everywhere while keeping the same filename.
- Edit location, delivery, brand story, and homepage wording in `src/components/Storefront.tsx`.
- Edit colours, typography, spacing, and responsive presentation in `src/styles.css`.

Product prices in `src/data/products.ts` are entered as whole rupees. Checkout converts them to paise only when creating the Stripe session.

## Data model

Orders are stored in the Netlify Database `orders` table. The database records the purchased items, amount, Stripe Checkout session, payment status, customer contact details, Indian shipping address, and payment time. Schema definitions live in `db/schema.ts`, and generated migrations live in `netlify/database/migrations/`.
