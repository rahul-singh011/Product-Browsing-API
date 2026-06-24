import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import './App.css'

const API = 'https://product-browsing-api-49iq.onrender.com'

const CATEGORY = {
  Electronics: {
    color: '#8b7cf7',
    images: [
      'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=640&h=480&fit=crop&q=80'
    ],
  },
  Clothing: {
    color: '#f472b6',
    images: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=640&h=480&fit=crop&q=80',
    ],
  },
  Books: {
    color: '#2dd4bf',
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=640&h=480&fit=crop&q=80'
    ],
  },
  'Home & Kitchen': {
    color: '#fb923c',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=640&h=480&fit=crop&q=80',
    ],
  },
  Sports: {
    color: '#4ade80',
    images: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=640&h=480&fit=crop&q=80',
    ],
  },
  Beauty: {
    color: '#e879f9',
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=640&h=480&fit=crop&q=80',
      'https://plus.unsplash.com/premium_photo-1661404164814-9d3c137097aa?w=640&h=480&fit=crop&q=80',
      'https://plus.unsplash.com/premium_photo-1683120952553-af3ec9cd60c0?w=640&h=480&fit=crop&q=80'
    ],
  },
  Toys: {
    color: '#fbbf24',
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=640&h=480&fit=crop&q=80',
      'https://plus.unsplash.com/premium_photo-1664373233010-7c4abae40f78?w=640&h=480&fit=crop&q=80',
    ],
  },
  Automotive: {
    color: '#94a3b8',
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=640&h=480&fit=crop&q=80',
    ],
  },
  Grocery: {
    color: '#86efac',
    images: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1553531889-56cc480ac5cb?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=640&h=480&fit=crop&q=80',
    ],
  },
  'Office Supplies': {
    color: '#67e8f9',
    images: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=640&h=480&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=640&h=480&fit=crop&q=80',
    ],
  },
}

const DEFAULT_CATEGORY = {
  color: '#8b7cf7',
  images: [
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=640&h=480&fit=crop&q=80',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=640&h=480&fit=crop&q=80',
  ],
}

function getCategoryMeta(name) {
  return CATEGORY[name] || DEFAULT_CATEGORY
}

function getProductImage(product) {
  const meta = getCategoryMeta(product.category)
  return meta.images[product.id % meta.images.length]
}

function ProductCard({ product, index }) {
  const { color } = getCategoryMeta(product.category)
  const image = getProductImage(product)
  const date = new Date(product.created_at).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
  const price = parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })

  return (
    <article
      className="product-card"
      style={{
        '--card-color': color,
        animationDelay: `${Math.min(index * 0.04, 0.4)}s`,
      }}
    >
      <div className="product-card__media">
        <img
          className="product-card__img"
          src={image}
          alt={product.name}
          loading="lazy"
        />
        <div className="product-card__overlay" />
        <span className="product-card__badge">{product.category}</span>
        {/* <div className="product-card__hover">
          <span className="product-card__hover-text">View product</span>
        </div> */}
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__meta">
          <span className="product-card__sku">#{product.id}</span>
          <span className="product-card__date">{date}</span>
        </div>
        <div className="product-card__footer">
          <div className="product-card__price-wrap">
            <span className="product-card__price-label">Price</span>
            <span className="product-card__price">₹{price}</span>
          </div>
          <button className="product-card__cta" type="button" aria-label={`Add ${product.name}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__visual" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__line skeleton-card__line--short" />
        <div className="skeleton-card__line skeleton-card__line--long" />
        <div className="skeleton-card__line skeleton-card__line--medium" />
      </div>
    </div>
  )
}

export default function App() {
  const [products, setProducts]       = useState([])
  const [categories, setCategories]   = useState([])
  const [category, setCategory]       = useState('')
  const [cursor, setCursor]           = useState(null)
  const [hasNext, setHasNext]         = useState(false)
  const [loading, setLoading]         = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError]             = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/products/categories`)
      .then(r => setCategories(r.data.data.map(c => c.category ?? c)))
      .catch(() => {})
  }, [])

  const fetchFirst = useCallback(async (cat) => {
    setLoading(true)
    setError(null)
    setProducts([])
    setCursor(null)
    try {
      const params = { limit: 20 }
      if (cat) params.category = cat
      const r = await axios.get(`${API}/api/products`, { params })
      setProducts(r.data.data)
      setCursor(r.data.pagination.nextCursor)
      setHasNext(r.data.pagination.hasNextPage)
    } catch {
      setError('Failed to load products. The API may be waking up — try again in 30 seconds.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFirst(category) }, [category, fetchFirst])

  const loadMore = async () => {
    if (!cursor || loadingMore) return
    setLoadingMore(true)
    try {
      const params = { limit: 20, cursor }
      if (category) params.category = category
      const r = await axios.get(`${API}/api/products`, { params })
      setProducts(prev => [...prev, ...r.data.data])
      setCursor(r.data.pagination.nextCursor)
      setHasNext(r.data.pagination.hasNextPage)
    } catch {
      setError('Failed to load more.')
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <div className="app">
      <div className="app-bg" aria-hidden="true">
        <div className="app-bg__orb app-bg__orb--1" />
        <div className="app-bg__orb app-bg__orb--2" />
        <div className="app-bg__grid" />
      </div>

      <header className="header">
        <div className="header__inner">
          <div className="header__brand">
            <div className="header__logo">P</div>
            <span className="header__name">ProductShelf</span>
          </div>
          <div className="header__stats">
            <span className="header__stat">
              <span className="header__stat-dot" />
              Live catalogue
            </span>
            <span className="header__stat">200,000+ products</span>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero__eyebrow">Cursor-paginated API</div>
          <h1 className="hero__title">
            Discover your next<br />
            <em>favourite product</em>
          </h1>
          <p className="hero__subtitle">
            Browse a catalogue of 200k products with seamless infinite scroll —
            no duplicates, no skips, just clean pagination.
          </p>
        </section>

        <section className="filters">
          <p className="filters__label">Filter by category</p>
          <div className="filters__pills">
            {['', ...categories].map(cat => {
              const active = category === cat
              const color = cat ? getCategoryMeta(cat).color : 'var(--accent)'
              return (
                <button
                  key={cat || 'all'}
                  className={`filter-pill${active ? ' filter-pill--active' : ''}`}
                  style={{ '--pill-color': color }}
                  onClick={() => setCategory(cat)}
                >
                  <span className="filter-pill__text">
                    {cat || 'All categories'}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {!loading && (
          <div className="toolbar">
            <p className="toolbar__count">
              Showing <strong>{products.length}</strong> products
              {category && <> in <strong>{category}</strong></>}
            </p>
            {hasNext && (
              <span className="toolbar__badge">More available ↓</span>
            )}
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button className="error-banner__retry" onClick={() => fetchFirst(category)}>
              Try again
            </button>
          </div>
        )}

        <div className={`grid${loading ? ' grid--loading' : ''}`}>
          {loading
            ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
          }
        </div>

        {!loading && hasNext && (
          <div className="load-more">
            <button
              className="load-more__btn"
              onClick={loadMore}
              disabled={loadingMore}
            >
              <span className="load-more__btn-text">
                {loadingMore && <span className="load-more__spinner" />}
                {loadingMore ? 'Loading more...' : 'Load more products'}
              </span>
            </button>
          </div>
        )}

        {!loading && !hasNext && products.length > 0 && (
          <p className="end-message">
            You've reached the end — <strong>{products.length}</strong> products loaded
            {category ? ` in ${category}` : ''}.
          </p>
        )}

        {!loading && products.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <p className="empty-state__title">No products found</p>
            <p className="empty-state__text">
              {category
                ? `Nothing in "${category}" right now. Try another category.`
                : 'The catalogue appears empty. Check back soon.'}
            </p>
          </div>
        )}
      </main>

      <footer className="footer">
        Built with <strong>React</strong> &amp; <strong>cursor-based pagination</strong> · ProductShelf © 2026
      </footer>
    </div>
  )
}
