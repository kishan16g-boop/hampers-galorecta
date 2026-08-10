import { Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Check,
  Gift,
  Heart,
  MapPin,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import products from '@/data/products'
import { CheckoutButton } from './BuyButton'

type Cart = Record<number, number>

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function Storefront() {
  const [cart, setCart] = useState<Cart>({})
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const savedCart = window.localStorage.getItem('hampers-galore-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as Cart)
      } catch {
        window.localStorage.removeItem('hampers-galore-cart')
      }
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) window.localStorage.setItem('hampers-galore-cart', JSON.stringify(cart))
  }, [cart, ready])

  const cartItems = useMemo(
    () =>
      products
        .filter((product) => cart[product.id])
        .map((product) => ({ product, quantity: cart[product.id] ?? 0 })),
    [cart],
  )

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  const changeQuantity = (productId: number, change: number) => {
    setCart((current) => {
      const quantity = Math.max(0, (current[productId] ?? 0) + change)
      const next = { ...current, [productId]: quantity }
      if (quantity === 0) delete next[productId]
      return next
    })
  }

  const addToCart = (productId: number) => {
    changeQuantity(productId, 1)
    setCartOpen(true)
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Hampers Galore home">
          <img src="/images/hampers-galore-logo.jpg" alt="Hampers Galore" />
          <span>
            <strong>Hampers Galore</strong>
            <small>Chitradurga, Karnataka</small>
          </span>
        </a>
        <nav className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'}>
          <a href="#shop" onClick={() => setMenuOpen(false)}>Shop hampers</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="#delivery" onClick={() => setMenuOpen(false)}>Delivery</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button menu-button"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
          <button
            className="cart-button"
            type="button"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={19} />
            <span>Bag</span>
            <b>{cartCount}</b>
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy reveal">
          <p className="eyebrow"><Sparkles size={15} /> Wrapped with joy in Chitradurga</p>
          <h1>Little things.<br /><em>Big happy feelings.</em></h1>
          <p className="hero-intro">
            Thoughtfully packed hampers with books, diaries, hair accessories,
            mini cars and delightful gifting finds for every kind of celebration.
          </p>
          <div className="hero-actions">
            <a href="#shop" className="button button-primary">
              Find a hamper <ArrowRight size={18} />
            </a>
            <a href="#custom" className="text-link">Make it personal</a>
          </div>
          <div className="trust-line">
            <span><ShieldCheck /> Secure payment</span>
            <span><PackageCheck /> Carefully packed</span>
            <span><MapPin /> Karnataka based</span>
          </div>
        </div>
        <div className="hero-art reveal reveal-late" aria-label="A celebration gift hamper">
          <div className="hero-orbit orbit-one">books</div>
          <div className="hero-orbit orbit-two">little joys</div>
          <div className="hero-gift">
            <img src="/images/hampers-galore-logo.jpg" alt="" />
            <span className="ribbon ribbon-v" />
            <span className="ribbon ribbon-h" />
            <Heart className="gift-heart" fill="currentColor" />
          </div>
          <span className="spark spark-one">✦</span>
          <span className="spark spark-two">✦</span>
          <span className="spark spark-three">✦</span>
        </div>
      </section>

      <section className="marquee" aria-label="Store highlights">
        <div>
          <span>Gifts that feel personal</span><i>✦</i>
          <span>Made with care</span><i>✦</i>
          <span>Delivery across India</span><i>✦</i>
          <span>Prices in Indian rupees</span><i>✦</i>
        </div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The gift edit</p>
            <h2>Pick their kind of happy</h2>
          </div>
          <p>Small treasures, joyful colours, and beautiful wrapping—already brought together for you.</p>
        </div>
        <div className="product-grid">
          {products.map((product, index) => (
            <article className={`product-card product-card-${(index % 3) + 1}`} key={product.id}>
              <Link
                to="/products/$productId"
                params={{ productId: String(product.id) }}
                className="product-image-wrap"
              >
                {product.badge ? <span className="product-badge">{product.badge}</span> : null}
                <img src={product.image} alt={product.name} className="product-image" />
                <span className="view-product">View details <ArrowRight size={16} /></span>
              </Link>
              <div className="product-info">
                <p>{product.category}</p>
                <h3>{product.name}</h3>
                <span>{product.shortDescription}</span>
                <div className="product-bottom">
                  <strong>{rupees.format(product.price)}</strong>
                  <button type="button" onClick={() => addToCart(product.id)}>
                    <Plus size={18} /> Add to bag
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="story-section" id="story">
        <div className="story-visual">
          <div className="story-card story-card-main">
            <Gift />
            <p>Chosen with care</p>
            <span>for the people you love</span>
          </div>
          <div className="story-card story-card-small">A little joy from Karnataka</div>
        </div>
        <div className="story-copy">
          <p className="eyebrow">Our Chitradurga story</p>
          <h2>Gifting should feel warm, never ordinary.</h2>
          <p>
            Hampers Galore brings useful, playful and thoughtful finds into one beautiful box.
            Every hamper is arranged to make the opening moment feel as special as the gift itself.
          </p>
          <div className="story-points">
            <span><Check /> Thoughtfully selected items</span>
            <span><Check /> Neat, gift-ready presentation</span>
            <span><Check /> Personal message included</span>
          </div>
        </div>
      </section>

      <section className="custom-section" id="custom">
        <div>
          <p className="eyebrow">Made for their moment</p>
          <h2>Want something more personal?</h2>
          <p>Choose our custom hamper and share the occasion, interests and message after ordering. We make the details feel just right.</p>
        </div>
        <button type="button" className="button button-light" onClick={() => addToCart(5)}>
          Start a custom hamper <ArrowRight size={18} />
        </button>
      </section>

      <section className="delivery-section" id="delivery">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">From us to them</p>
            <h2>Simple, safe gifting</h2>
          </div>
        </div>
        <div className="steps-grid">
          <article><span>01</span><ShoppingBag /><h3>Choose</h3><p>Pick a ready hamper or start with a personalised one.</p></article>
          <article><span>02</span><ShieldCheck /><h3>Pay securely</h3><p>Complete payment through the protected Stripe checkout.</p></article>
          <article><span>03</span><Gift /><h3>We wrap</h3><p>Your gifts are checked, arranged and packed with care.</p></article>
          <article><span>04</span><PackageCheck /><h3>We deliver</h3><p>Your hamper begins its journey from Chitradurga.</p></article>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img src="/images/hampers-galore-logo.jpg" alt="Hampers Galore logo" />
          <div><strong>Hampers Galore</strong><span>Gifts made to feel personal.</span></div>
        </div>
        <div><p>Based in Chitradurga, Karnataka, India</p><p>All prices shown in Indian rupees.</p></div>
        <a href="#top">Back to top ↑</a>
      </footer>

      {cartOpen ? (
        <div className="cart-layer" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <button className="cart-backdrop" type="button" aria-label="Close bag" onClick={() => setCartOpen(false)} />
          <aside className="cart-drawer">
            <div className="cart-header">
              <div><p className="eyebrow">Your picks</p><h2>Gift bag <span>{cartCount}</span></h2></div>
              <button className="icon-button" type="button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X /></button>
            </div>
            {cartItems.length ? (
              <>
                <div className="cart-items">
                  {cartItems.map(({ product, quantity }) => (
                    <div className="cart-item" key={product.id}>
                      <img src={product.image} alt="" />
                      <div><h3>{product.name}</h3><p>{rupees.format(product.price)}</p>
                        <div className="quantity-control">
                          <button type="button" onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus /></button>
                          <span>{quantity}</span>
                          <button type="button" onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Subtotal</span><strong>{rupees.format(cartTotal)}</strong></div>
                  <p>Delivery cost, if applicable, is confirmed at checkout.</p>
                  <CheckoutButton
                    items={cartItems.map(({ product, quantity }) => ({ productId: product.id, quantity }))}
                    label={`Pay ${rupees.format(cartTotal)} securely`}
                  />
                  <span className="secure-note"><ShieldCheck /> Secure checkout powered by Stripe</span>
                </div>
              </>
            ) : (
              <div className="empty-cart">
                <ShoppingBag />
                <h3>Your gift bag is waiting</h3>
                <p>Add something thoughtful from our hamper collection.</p>
                <button type="button" className="button button-primary" onClick={() => setCartOpen(false)}>Browse hampers</button>
              </div>
            )}
          </aside>
        </div>
      ) : null}
    </main>
  )
}
