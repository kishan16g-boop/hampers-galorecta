import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import products from '@/data/products'

const instagramOrderInput = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(20),
  customerName: z.string().trim().min(1).max(120),
  customerPhone: z.string().trim().min(6).max(20),
  details: z.string().trim().max(500).optional(),
})

export type InstagramOrderInput = z.infer<typeof instagramOrderInput>

export const submitInstagramOrder = createServerFn({ method: 'POST' })
  .inputValidator((input: InstagramOrderInput) => instagramOrderInput.parse(input))
  .handler(async ({ data }) => {
    const selectedItems = data.items.map((item) => {
      const product = products.find((entry) => entry.id === item.productId)
      if (!product) throw new Error('A product in your bag is no longer available.')
      return { product, quantity: item.quantity }
    })

    const totalAmount = selectedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity * 100,
      0,
    )

    const [{ db }, { orders }] = await Promise.all([
      import('../../db/index.js'),
      import('../../db/schema.js'),
    ])

    const [order] = await db
      .insert(orders)
      .values({
        status: 'instagram_inquiry',
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
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        shippingAddress: data.details ?? null,
      })
      .returning({ id: orders.id })

    if (!order) throw new Error('Unable to save your order details. Please try again.')

    return { orderId: order.id }
  })
