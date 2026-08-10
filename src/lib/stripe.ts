import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import products from '@/data/products'

const checkoutInput = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(20),
})

const checkoutStatusInput = z.object({
  sessionId: z.string().trim().regex(/^cs_(?:test_|live_)?[A-Za-z0-9]+$/).max(255),
})

export type CheckoutInput = z.infer<typeof checkoutInput>
export type CheckoutStatus = 'paid' | 'processing' | 'failed' | 'unknown'

export const getStripeEnabled = createServerFn({ method: 'GET' }).handler(
  () => !!process.env.STRIPE_SECRET_KEY,
)

export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((input: CheckoutInput) => checkoutInput.parse(input))
  .handler(async ({ data }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Online payment is being configured. Please try again soon.')
    }

    const selectedItems = data.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId)
      if (!product) throw new Error('A product in your cart is no longer available.')
      return { product, quantity: item.quantity }
    })

    const totalAmount = selectedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity * 100,
      0,
    )

    const [{ eq }, { db }, { orders }] = await Promise.all([
      import('drizzle-orm'),
      import('../../db/index.js'),
      import('../../db/schema.js'),
    ])

    const [order] = await db
      .insert(orders)
      .values({
        status: 'pending',
        amount: totalAmount,
        currency: 'inr',
        items: JSON.stringify(
          selectedItems.map(({ product, quantity }) => ({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
          })),
        ),
      })
      .returning({ id: orders.id })

    if (!order) throw new Error('Unable to create your order. Please try again.')

    const { default: Stripe } = await import('stripe')
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const siteUrl = process.env.URL ?? process.env.SITE_URL ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: selectedItems.map(({ product, quantity }) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: product.name,
            description: product.shortDescription,
          },
          unit_amount: product.price * 100,
        },
        quantity,
      })),
      shipping_address_collection: { allowed_countries: ['IN'] },
      phone_number_collection: { enabled: true },
      customer_creation: 'always',
      metadata: { order_id: String(order.id) },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
    })

    await db
      .update(orders)
      .set({ checkoutSessionId: session.id })
      .where(eq(orders.id, order.id))

    return session.url
  })

export const getCheckoutStatus = createServerFn({ method: 'GET' })
  .inputValidator((input: z.infer<typeof checkoutStatusInput>) =>
    checkoutStatusInput.parse(input),
  )
  .handler(async ({ data }): Promise<CheckoutStatus> => {
    if (!process.env.STRIPE_SECRET_KEY) return 'unknown'

    const [{ and, eq }, { db }, { orders }, { default: Stripe }] = await Promise.all([
      import('drizzle-orm'),
      import('../../db/index.js'),
      import('../../db/schema.js'),
      import('stripe'),
    ])

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

    try {
      const session = await stripe.checkout.sessions.retrieve(data.sessionId)
      const orderId = Number(session.metadata?.order_id)

      if (!Number.isInteger(orderId)) return 'unknown'

      const [order] = await db
        .select({ id: orders.id, status: orders.status })
        .from(orders)
        .where(
          and(
            eq(orders.id, orderId),
            eq(orders.checkoutSessionId, session.id),
            eq(orders.amount, session.amount_total ?? -1),
            eq(orders.currency, session.currency ?? ''),
          ),
        )
        .limit(1)

      if (!order) return 'unknown'

      const status: CheckoutStatus =
        session.payment_status === 'paid'
          ? 'paid'
          : session.status === 'expired'
            ? 'failed'
            : 'processing'

      if (status === 'paid' && order.status !== 'paid') {
        await db
          .update(orders)
          .set({ status: 'paid', paidAt: new Date() })
          .where(eq(orders.id, order.id))
      }

      return status
    } catch {
      return 'unknown'
    }
  })
