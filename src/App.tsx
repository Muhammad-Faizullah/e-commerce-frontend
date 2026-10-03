import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Product = {
  id: number;
  brand: string;
  name: string;
  price: number;
  product_variant: { id: number; size: string; quantity: number; color: string }[];
  product_image: { id: number; product: number; image_file: string }[];
  category_detail: { id: number; name: string };
  publish: boolean;
};

const products: Product[] = [
  { id: 101, brand: 'Dastoor Essentials', name: 'The Everyday Kurta', price: 4800, product_variant: [{ id: 1, size: 'M', quantity: 5, color: 'Ivory' }], product_image: [{ id: 1, product: 101, image_file: '/products/white_kurta.jpeg' }], category_detail: { id: 1, name: 'Kurtas' }, publish: true },
  { id: 102, brand: 'Dastoor Essentials', name: 'Midnight Cotton Kurta', price: 5200, product_variant: [{ id: 2, size: 'M', quantity: 4, color: 'Black' }], product_image: [{ id: 2, product: 102, image_file: '/products/black_kurta.jpeg' }], category_detail: { id: 1, name: 'Kurtas' }, publish: true },
  { id: 103, brand: 'Dastoor Occasion', name: 'The Jodhpur Suit', price: 24800, product_variant: [{ id: 3, size: 'L', quantity: 2, color: 'Blue' }], product_image: [{ id: 3, product: 103, image_file: '/products/blue_suits.jpeg' }], category_detail: { id: 2, name: 'Occasionwear' }, publish: true },
  { id: 104, brand: 'Dastoor Occasion', name: 'Sandstone Waistcoat', price: 11200, product_variant: [{ id: 4, size: 'M', quantity: 3, color: 'Sandstone' }], product_image: [{ id: 4, product: 104, image_file: '/products/waistcoat.jpeg' }], category_detail: { id: 3, name: 'Waistcoats' }, publish: true },
];

const money = (price: number) => `Rs. ${price.toLocaleString('en-PK')}`;

function Home() {
  const [category, setCategory] = useState('All pieces');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bag, setBag] = useState<Record<number, number>>({});
  const [toast, setToast] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const visibleProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'All pieces' || product.category_detail.name === category;
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${product.name} ${product.brand} ${product.category_detail.name}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }), [category, search]);
  const bagCount = Object.values(bag).reduce((total, count) => total + count, 0);
  const bagItems = products.filter((product) => bag[product.id]);
  const bagSubtotal = bagItems.reduce((sum, product) => sum + product.price * bag[product.id], 0);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };
  const selectCategory = (value: string) => {
    setCategory(value);
    setSearch('');
    scrollTo('collections');
  };
  const addToBag = (product: Product) => {
    setBag((current) => ({ ...current, [product.id]: (current[product.id] || 0) + 1 }));
    setToast(`${product.name} added to your bag`);
  };
  const updateBag = (id: number, delta: number) => {
    setBag((current) => {
      const nextCount = (current[id] || 0) + delta;
      const next = { ...current };
      if (nextCount <= 0) delete next[id];
      else next[id] = nextCount;
      return next;
    });
  };
  const toggleFavorite = (product: Product) => {
    setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id]);
    setToast(favorites.includes(product.id) ? 'Removed from your saved pieces' : 'Saved for this visit');
  };
  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubscribed(false);
      setToast('Enter a valid email address to join our letter');
      return;
    }
    setSubscribed(true);
    setEmail('');
  };

  return (
    <div className="storefront">
      <div className="announcement">A considered wardrobe, for every gathering <span aria-hidden="true">·</span> Preview prices shown in PKR</div>
      <header className="site-header">
        <div className="header-inner">
          <button className="icon-action mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} data-testid="button-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <a className="brand-mark" href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} data-testid="link-brand-home">dastoor<span>SOUTH ASIAN WEAR</span></a>
          <nav className={`nav-links ${menuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
            <button onClick={() => selectCategory('Kurtas')} data-testid="nav-kurtas">Kurtas</button>
            <button onClick={() => selectCategory('Occasionwear')} data-testid="nav-occasionwear">Occasionwear</button>
            <button onClick={() => selectCategory('Waistcoats')} data-testid="nav-waistcoats">Waistcoats</button>
            <button onClick={() => scrollTo('our-way')} data-testid="nav-our-way">Our way</button>
          </nav>
          <div className="header-actions">
            <button className="icon-action" aria-label={searchOpen ? 'Close search' : 'Search pieces'} data-testid="button-search" onClick={() => { setSearchOpen(!searchOpen); if (searchOpen) setSearch(''); else window.setTimeout(() => document.getElementById('store-search')?.focus(), 0); }}>
              {searchOpen ? <X size={19} strokeWidth={1.5} /> : <Search size={19} strokeWidth={1.5} />}
            </button>
            <button className="icon-action" aria-label="Open your bag" data-testid="button-open-bag" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={19} strokeWidth={1.5} /><span className="bag-count" data-testid="text-bag-count">{bagCount}</span>
            </button>
          </div>
        </div>
        {searchOpen && <div className="search-bar"><Search size={16} /><input id="store-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setCategory('All pieces'); }} placeholder="Search kurtas, occasionwear…" aria-label="Search collection" data-testid="input-search" /><button onClick={() => { setSearch(''); setSearchOpen(false); }} aria-label="Close search"><X size={17} /></button></div>}
      </header>

      <main id="top">
        <section className="hero" aria-label="New season collection">
          <div className="hero-panel">
            <div className="hero-copy">
              <div className="eyebrow">New season, familiar rituals</div>
              <h1>Made for the<br /><em>moments</em> between.</h1>
              <p>Clothes that feel like you, whether it’s a long Sunday lunch or the day you’ve been looking forward to.</p>
              <button className="button-primary" onClick={() => selectCategory('All pieces')} data-testid="button-discover">Discover the collection <ArrowRight size={15} /></button>
            </div>
            <div className="hero-art">
              <img src="/products/white_kurta.jpeg" alt="Ivory kurta from the Dastoor everyday collection" />
              <div className="hero-seal">Worn well<br />everywhere</div>
            </div>
          </div>
        </section>

        <section className="section-wrap" aria-label="Shop by occasion">
          <div className="category-strip">
            <button className="category-tile" onClick={() => selectCategory('Kurtas')} data-testid="tile-kurtas"><span>Kurtas<small>Easy, every day</small></span><ArrowDownRight size={18} /></button>
            <button className="category-tile" onClick={() => selectCategory('Occasionwear')} data-testid="tile-occasionwear"><span>Occasionwear<small>For the good days</small></span><ArrowDownRight size={18} /></button>
            <button className="category-tile" onClick={() => selectCategory('Waistcoats')} data-testid="tile-waistcoats"><span>Waistcoats<small>The finishing touch</small></span><ArrowDownRight size={18} /></button>
          </div>

          <section id="collections" className="collection-section">
            <div className="section-heading">
              <div><div className="eyebrow">A few good things</div><h2>Pieces to come back to.</h2><p>Thoughtful staples, made for more than one kind of day.</p></div>
              <button className="text-link" onClick={() => { setCategory('All pieces'); setSearch(''); }} data-testid="button-view-all">View everything <ArrowRight size={14} /></button>
            </div>
            <div className="filter-row" aria-label="Filter by category">
              {['All pieces', 'Kurtas', 'Occasionwear', 'Waistcoats'].map((item) => (
                <button key={item} className={`filter-pill ${category === item ? 'active' : ''}`} onClick={() => { setCategory(item); setSearch(''); }} aria-pressed={category === item} data-testid={`filter-${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</button>
              ))}
            </div>
            <div className="product-grid" data-testid="product-grid">
              {visibleProducts.length ? visibleProducts.map((product, index) => (
                <article className="product-card" key={product.id} data-testid={`card-product-${product.id}`}>
                  <div className="product-image">
                    <img src={product.product_image[0]?.image_file} alt={product.name} loading={index > 1 ? 'lazy' : 'eager'} />
                    {product.id === 101 && <span className="product-tag">A good place to start</span>}
                    {product.id === 103 && <span className="product-tag">For the occasion</span>}
                    <button className={`favorite-button ${favorites.includes(product.id) ? 'is-favorite' : ''}`} onClick={() => toggleFavorite(product)} aria-label={favorites.includes(product.id) ? `Remove ${product.name} from saved pieces` : `Save ${product.name}`} aria-pressed={favorites.includes(product.id)} data-testid={`button-save-${product.id}`}><Heart size={17} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} strokeWidth={1.5} /></button>
                    <button className="quick-add" onClick={() => addToBag(product)} data-testid={`button-add-${product.id}`}>Add to bag <Plus size={13} /></button>
                  </div>
                  <div className="product-info">
                    <div className="product-brand">{product.brand}</div>
                    <div className="product-title-row"><h3 data-testid={`text-product-name-${product.id}`}>{product.name}</h3><span className="product-price" data-testid={`text-product-price-${product.id}`}>{money(product.price)}</span></div>
                    <p className="product-note">{product.category_detail.name === 'Kurtas' ? 'Soft cotton · Thoughtfully cut' : product.category_detail.name === 'Occasionwear' ? 'A little occasion, a lot of ease' : 'An easy layer, finished by hand'}</p>
                  </div>
                </article>
              )) : <div className="empty-products"><Sparkles size={20} /><p>No pieces found for “{search}”. Try another search.</p><button className="text-link" onClick={() => { setSearch(''); setCategory('All pieces'); }}>Clear search</button></div>}
            </div>
          </section>

          <section className="story-band" id="our-way">
            <div className="story-image"><img src="/products/waistcoat.jpeg" alt="Sandstone waistcoat, an easy layer for family gatherings" loading="lazy" /></div>
            <div className="story-copy">
              <div className="eyebrow">A little more considered</div>
              <h2>Tradition, with<br />room to breathe.</h2>
              <p>We take the familiar and make it feel like yours. Easy silhouettes, honest materials, and details that don’t need explaining.</p>
              <button className="text-link" onClick={() => scrollTo('collections')} data-testid="button-our-approach">Find your kind of classic <ArrowRight size={14} /></button>
            </div>
          </section>

          <section className="service-row" aria-label="Shopping details">
            <div className="service-item"><Truck /><div><strong>Kurtas to occasionwear</strong><span>A small edit for different kinds of days</span></div></div>
            <div className="service-item"><Sparkles /><div><strong>Preview prices in PKR</strong><span>Sample values until the catalogue is connected</span></div></div>
            <div className="service-item"><Heart /><div><strong>Local preview only</strong><span>Bag and favorites aren’t saved yet</span></div></div>
          </section>
        </section>

        <section className="newsletter" aria-label="Join the Dastoor letter">
          <div className="eyebrow">A note from us, now and then</div>
          <h2>Good things, occasionally.</h2>
          <p>New arrivals, thoughtful notes, and an invitation when there’s something worth sharing.</p>
          <form className="newsletter-form" onSubmit={submitNewsletter}>
            <input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setSubscribed(false); }} placeholder="Your email address" aria-label="Your email address" required data-testid="input-newsletter-email" />
            <button type="submit" data-testid="button-newsletter-submit">Count me in <ArrowRight size={14} /></button>
          </form>
          <div className="newsletter-demo">Preview only · your email isn’t stored.</div>
          {subscribed && <div className="subscribe-feedback" role="status" data-testid="status-newsletter"><Check size={14} /> Thanks for your interest. This preview won’t save your email.</div>}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand"><a className="brand-mark" href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>dastoor<span>SOUTH ASIAN WEAR</span></a><p>A storefront preview for South Asian menswear, built around kurtas and occasionwear.</p></div>
          <div className="footer-nav">
            <div className="footer-col"><strong>Explore</strong><button onClick={() => selectCategory('Kurtas')}>Kurtas</button><button onClick={() => selectCategory('Occasionwear')}>Occasionwear</button><button onClick={() => selectCategory('Waistcoats')}>Waistcoats</button></div>
            <div className="footer-col"><strong>Find us</strong><button onClick={() => setToast('Contact details will be added in a later step.')}>Get in touch</button><button onClick={() => scrollTo('our-way')}>Our way</button><button onClick={() => setToast('Returns information will be added in a later step.')}>Returns & exchanges</button></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Dastoor. Made for the moments that matter.</span><span>Demo storefront · Local preview only</span></div>
      </footer>

      {cartOpen && <div className="drawer-backdrop" role="presentation" onClick={() => setCartOpen(false)}>
        <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your shopping bag" onClick={(event) => event.stopPropagation()} data-testid="panel-cart">
          <div className="cart-head"><div><span className="eyebrow">Your edit</span><h2>Your bag <span>({bagCount})</span></h2></div><button className="icon-action" onClick={() => setCartOpen(false)} aria-label="Close bag" data-testid="button-close-bag"><X size={20} /></button></div>
          {bagItems.length ? <>
            <div className="cart-items">{bagItems.map((product) => <div className="cart-item" key={product.id}>
                <img src={product.product_image[0]?.image_file} alt="" />
              <div className="cart-item-copy"><span>{product.brand}</span><strong>{product.name}</strong><b>{money(product.price)}</b><div className="quantity-control"><button onClick={() => updateBag(product.id, -1)} aria-label={`Remove one ${product.name}`} data-testid={`button-decrease-${product.id}`}><Minus size={12} /></button><span>{bag[product.id]}</span><button onClick={() => updateBag(product.id, 1)} aria-label={`Add one ${product.name}`} data-testid={`button-increase-${product.id}`}><Plus size={12} /></button></div></div>
              <button className="remove-item" onClick={() => setBag((current) => { const next = { ...current }; delete next[product.id]; return next; })} aria-label={`Remove ${product.name}`} data-testid={`button-remove-${product.id}`}><X size={15} /></button>
            </div>)}</div>
            <div className="cart-summary"><div><span>Subtotal</span><strong>{money(bagSubtotal)}</strong></div><small>Delivery and any applicable taxes calculated at checkout.</small><button className="button-primary" onClick={() => { setCartOpen(false); setToast('This is a preview bag — checkout isn’t available yet.'); }} data-testid="button-demo-checkout">Continue <ArrowRight size={15} /></button><small className="demo-note">Demo only · Nothing in your bag is saved or ordered.</small></div>
          </> : <div className="cart-empty"><ShoppingBag size={28} strokeWidth={1.3} /><h3>A little room for something good.</h3><p>Your bag is empty for now. Find a piece you’ll reach for often.</p><button className="button-primary" onClick={() => { setCartOpen(false); scrollTo('collections'); }}>Explore pieces <ArrowRight size={15} /></button></div>}
        </aside>
      </div>}
      {toast && <div className="toast-note" role="status" data-testid="status-toast">{toast}</div>}
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;