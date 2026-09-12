import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const orders = pgTable('orders', {
  id: serial().primaryKey(),
  checkoutSessionId: text('checkout_session_id').unique(),
  status: text().notNull().default('pending'),
  amount: integer().notNull(),
  currency: text().notNull().default('inr'),
  items: text().notNull(),
  customerName: text('customer_name'),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone'),
  shippingAddress: text('shipping_address'),
  instagramNotificationStatus: text('instagram_notification_status')
    .notNull()
    .default('pending'),
  instagramNotifiedAt: timestamp('instagram_notified_at'),
  instagramNotificationError: text('instagram_notification_error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  paidAt: timestamp('paid_at'),
})
