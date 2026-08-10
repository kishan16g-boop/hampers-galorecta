# Project Guide

## Overview

This repository contains the Hampers Galore ecommerce storefront for a gifting business in Chitradurga, Karnataka. It is a TanStack Start application deployed on Netlify, with Stripe Checkout for payments and Netlify Database for durable order records.

## Architecture

- `src/routes/` contains file-based pages for the storefront, product details, and checkout outcomes.
- `src/components/Storefront.tsx` contains the homepage sections, responsive navigation, shopping bag state, and cart drawer.
- `src/components/BuyButton.tsx` contains the shared checkout button and payment availability states.
- `src/data/products.ts` is the owner-editable product catalog and source of truth for current items and prices.
- `src/lib/stripe.ts` validates carts, creates pending orders, and starts Stripe Checkout sessions.
- `db/` contains the Drizzle schema and Netlify Database client.
- `netlify/functions/stripe-webhook.ts` verifies Stripe events and completes order records.
- `public/images/` contains the supplied logo and replaceable product artwork.
- `src/styles.css` contains the complete visual system and responsive rules.

## Coding conventions

- Use TypeScript with strict typing and avoid `any`.
- Use PascalCase for React components and camelCase for functions and values.
- Keep product prices as whole rupees in the catalog; Stripe amounts are expressed in paise.
- Keep server-only payment and database access out of client components.
- Validate all checkout input before looking up products or creating an order.
- Preserve accessible labels, keyboard-operable controls, and reduced-motion support.
- Follow the established plum, cream, peach, and gold brand palette unless the brand direction changes.

## Database changes

Update `db/schema.ts`, then generate a descriptive migration with `npx drizzle-kit generate --name <imperative_name>`. Do not apply migrations manually; Netlify applies files from `netlify/database/migrations/` during deployment.

## Payment decisions

Stripe Checkout is hosted by Stripe so card and available payment details never pass through the application. A pending database order is created before redirecting to Stripe. The signed `checkout.session.completed` webhook records the customer and shipping details and marks the order paid.

## Product editing

The catalog is intentionally file-based so the owner can easily change products and replace images without changing checkout logic. Product IDs must remain unique and stable because checkout and existing order records reference them.
