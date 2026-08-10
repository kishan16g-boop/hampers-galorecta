export interface Product {
  id: number
  name: string
  image: string
  description: string
  shortDescription: string
  price: number
  category: string
  includes: Array<string>
  badge?: string
}

// Edit this list to update products, prices, descriptions, and images.
// Prices are written in Indian rupees (not paise).
const products: Array<Product> = [
  {
    id: 1,
    name: 'Little Joys Hamper',
    image: '/images/little-joys.svg',
    description:
      'A cheerful gift box made for little celebrations. It brings together playful accessories, a pocket diary, and a tiny toy car in our signature keepsake packaging.',
    shortDescription: 'Hair clips, mini car, diary and sweet surprises.',
    price: 899,
    category: 'Kids',
    badge: 'Bestseller',
    includes: ['Colourful hair clips', 'Mini toy car', 'Pocket diary', 'Assorted chocolates'],
  },
  {
    id: 2,
    name: 'Bookish Bliss Box',
    image: '/images/bookish-bliss.svg',
    description:
      'A thoughtful pause packed into a box for readers, writers, teachers, and friends. The selection pairs a beautiful book with stationery and cosy little treats.',
    shortDescription: 'A book, journal, pen and cosy reading treats.',
    price: 1299,
    category: 'Books & Journals',
    badge: 'New',
    includes: ['Curated book', 'Hardbound journal', 'Premium pen', 'Bookmark and treats'],
  },
  {
    id: 3,
    name: 'Her Happy Things',
    image: '/images/happy-things.svg',
    description:
      'A soft, pretty hamper filled with useful everyday favourites. It is a lovely choice for birthdays, thank-you gifts, friendship celebrations, and just-because moments.',
    shortDescription: 'Clips, scrunchies, diary and self-care favourites.',
    price: 1099,
    category: 'For Her',
    includes: ['Statement hair clips', 'Soft scrunchies', 'Mini diary', 'Self-care surprise'],
  },
  {
    id: 4,
    name: 'Tiny Racer Treat Box',
    image: '/images/tiny-racer.svg',
    description:
      'Made for young car lovers, this energetic hamper mixes miniature vehicles with creative stationery and treats for a gift that feels instantly exciting.',
    shortDescription: 'Mini cars, activity book, stationery and treats.',
    price: 999,
    category: 'Kids',
    includes: ['Two mini cars', 'Activity book', 'Fun stationery', 'Assorted chocolates'],
  },
  {
    id: 5,
    name: 'Make It Yours Hamper',
    image: '/images/make-it-yours.svg',
    description:
      'Start with a beautiful base hamper and tell us who it is for. We will help you shape the mix around the occasion, age, interests, and your preferred budget.',
    shortDescription: 'A personalised hamper built around your occasion.',
    price: 1499,
    category: 'Custom',
    badge: 'Personalise',
    includes: ['Curated gift selection', 'Personal message card', 'Gift wrapping', 'Occasion styling'],
  },
  {
    id: 6,
    name: 'Mini Hamper',
    image: '/images/little-joys.svg',
    description:
      'A compact hamper filled with seven thoughtfully selected products. It is an easy, cheerful gift for birthdays, thank-you moments, and small celebrations.',
    shortDescription: 'A compact gift hamper with seven curated products.',
    price: 900,
    category: 'Everyday Gifts',
    badge: '7 Products',
    includes: [
      'Mini diary',
      'Decorative pen',
      'Hair accessory',
      'Small keepsake',
      'Chocolate treat',
      'Personal message card',
      'Gift-ready packaging',
    ],
  },
  {
    id: 7,
    name: 'Normal Hamper',
    image: '/images/happy-things.svg',
    description:
      'A versatile normal-size hamper with a balanced selection of thoughtful gifts, treats, and finishing touches for a memorable celebration.',
    shortDescription: 'A thoughtfully arranged normal-size gift hamper.',
    price: 1499,
    category: 'Classic Hampers',
    includes: ['Curated gift selection', 'Sweet treats', 'Personal message card', 'Gift-ready packaging'],
  },
  {
    id: 8,
    name: 'Normal Hamper Plus',
    image: '/images/bookish-bliss.svg',
    description:
      'An upgraded normal-size hamper with a fuller mix of gifts and premium presentation, made for birthdays and meaningful occasions.',
    shortDescription: 'A fuller normal-size hamper with premium touches.',
    price: 1799,
    category: 'Classic Hampers',
    badge: 'Premium',
    includes: ['Expanded gift selection', 'Premium treat', 'Personal message card', 'Premium gift packaging'],
  },
  {
    id: 9,
    name: 'Large Hamper',
    image: '/images/make-it-yours.svg',
    description:
      'A generously sized hamper designed for milestone celebrations, special occasions, and impressive gifting with a larger curated selection.',
    shortDescription: 'A generous hamper for big celebrations and milestones.',
    price: 3000,
    category: 'Premium Hampers',
    badge: 'Large',
    includes: ['Large curated gift selection', 'Premium treats', 'Personal message card', 'Celebration styling'],
  },
  {
    id: 10,
    name: 'Rakhi Hamper',
    image: '/images/happy-things.svg',
    description:
      'A festive Rakhi hamper for celebrating the bond between siblings. This base option can be personalised with gifts and treats to suit your preferred budget.',
    shortDescription: 'Festive sibling gifting, with options starting at ₹499.',
    price: 499,
    category: 'Rakhi',
    badge: 'Starts at ₹499',
    includes: ['Rakhi-themed selection', 'Sweet treat', 'Personal message card', 'Festive gift packaging'],
  },
]

export default products
