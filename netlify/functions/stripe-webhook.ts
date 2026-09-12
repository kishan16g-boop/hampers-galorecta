import type { Config } from '@netlify/functions'
import { and, eq, inArray } from 'drizzle-orm'
import Stripe from 'stripe'
import { db } from '../../db/index.js'
import { orders } from '../../db/schema.js'
import { getInstagramConfig, sendInstagramOrder } from './lib/instagram.js'

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const stripeSecretKey = Netlify.env.get('STRIPE_SECRET_KEY')
  const webhookSecret = Netlify.env.get('STRIPE_WEBHOOK_SECRET')

  if (!stripeSecretKey || !webhookSecret) {
    return new Response('Webhook is not configured', { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) return new Response('Missing signature', { status: 400 })

  const stripe = new Stripe(stripeSecretKey)
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    )
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded' ||
    event.type === 'checkout.session.async_payment_failed'
  ) {
    const session = event.data.object
    const orderId = Number(session.metadata?.order_id)

    if (Number.isInteger(orderId)) {
      const shippingDetails = session.collected_information?.shipping_details
      const address = shippingDetails?.address ?? session.customer_details?.address
      const paymentFailed = event.type === 'checkout.session.async_payment_failed'
      const paymentPaid = !paymentFailed && session.payment_status === 'paid'

      const [updatedOrder] = await db
        .update(orders)
        .set({
          status: paymentFailed ? 'failed' : paymentPaid ? 'paid' : 'processing',
          customerName: shippingDetails?.name ?? session.customer_details?.name ?? null,
          customerEmail: session.customer_details?.email ?? null,
          customerPhone: session.customer_details?.phone ?? null,
          shippingAddress: address ? JSON.stringify(address) : null,
          paidAt: paymentPaid ? new Date() : null,
        })
        .where(
          and(
            eq(orders.id, orderId),
            eq(orders.checkoutSessionId, session.id),
            eq(orders.amount, session.amount_total ?? -1),
            eq(orders.currency, session.currency ?? ''),
          ),
        )
        .returning({ id: orders.id })

      if (paymentPaid && updatedOrder) {
        await notifyInstagram(updatedOrder.id)
      }
    }
  }

  return Response.json({ received: true })
}

async function notifyInstagram(orderId: number) {
  const config = getInstagramConfig()
  if (!config) return

  const [order] = await db
    .update(orders)
    .set({
      instagramNotificationStatus: 'sending',
      instagramNotificationError: null,
    })
    .where(
      and(
        eq(orders.id, orderId),
        eq(orders.status, 'paid'),
        inArray(orders.instagramNotificationStatus, ['pending', 'failed']),
      ),
    )
    .returning({
      id: orders.id,
      amount: orders.amount,
      currency: orders.currency,
      items: orders.items,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      customerPhone: orders.customerPhone,
      shippingAddress: orders.shippingAddress,
    })

  if (!order) return

  try {
    await sendInstagramOrder(config, order)
    await db
      .update(orders)
      .set({
        instagramNotificationStatus: 'sent',
        instagramNotifiedAt: new Date(),
        instagramNotificationError: null,
      })
      .where(eq(orders.id, order.id))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Instagram notification failed'
    await db
      .update(orders)
      .set({
        instagramNotificationStatus: 'failed',
        instagramNotificationError: message.slice(0, 500),
      })
      .where(eq(orders.id, order.id))
  }
}

export const config: Config = {
  path: '/api/stripe-webhook',
}
