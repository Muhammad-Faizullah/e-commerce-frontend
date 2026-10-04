import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDownRight, ArrowRight, Menu, Search, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { garmentCategories } from '@/data/categories';
import { SignInPage, SignUpPage } from '@/pages/account';

const queryClient = new QueryClient();

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return garmentCategories.filter((category) => {
      const matchesCategory = selectedCategory === 'all' || category.slug === selectedCategory;
      const searchableText = `${category.name} ${category.shortDescription} ${category.description}`.toLocaleLowerCase();
      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [selectedCategory, search]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
  };

  const selectCategory = (slug: string) => {
    setSelectedCategory(slug);
    setSearch('');
    scrollTo('collections');
  };

  const closeSearch = () => {
    setSearch('');
    setSelectedCategory('all');
    setSearchOpen(false);
  };

  return (
    <div className="storefront">
      <div className="announcement">South Asian dressing, considered for every day</div>
      <header className="site-header">
        <div className="header-inner">
          <button
            className="icon-action mobile-menu"
            aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <a className="brand-mark" href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} data-testid="link-header-home">
            dastoor<span>SOUTH ASIAN WEAR</span>
          </a>
          <nav className={`nav-links ${menuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
            {garmentCategories.map((category) => (
              <button key={category.slug} onClick={() => selectCategory(category.slug)} data-testid={`nav-category-${category.slug}`}>{category.name}</button>
            ))}
            <button onClick={() => scrollTo('our-way')} data-testid="nav-our-way">Our way</button>
          </nav>
          <div className="header-actions">
            <Link href="/signin" className="header-signin" data-testid="link-header-signin">Sign in</Link>
            <button
              className="icon-action"
              aria-label={searchOpen ? 'Close category search' : 'Search categories'}
              aria-expanded={searchOpen}
              onClick={() => {
                if (searchOpen) closeSearch();
                else {
                  setSearchOpen(true);
                  window.setTimeout(() => document.getElementById('category-search')?.focus(), 0);
                }
              }}
              data-testid="button-search-categories"
            >
              {searchOpen ? <X size={19} strokeWidth={1.5} /> : <Search size={19} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="search-bar">
            <Search size={16} aria-hidden="true" />
            <input
              id="category-search"
              type="search"
              value={search}
              onChange={(event) => { setSearch(event.target.value); setSelectedCategory('all'); }}
              onKeyDown={(event) => { if (event.key === 'Escape') closeSearch(); }}
              placeholder="Search garment categories…"
              aria-label="Search garment categories"
              data-testid="input-category-search"
            />
            {search && <button onClick={() => setSearch('')} aria-label="Clear category search" data-testid="button-clear-category-search"><X size={16} /></button>}
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero" aria-label="Dastoor introduction">
          <div className="hero-panel">
            <div className="hero-copy">
              <div className="eyebrow">A wardrobe shaped by ritual</div>
              <h1>Made for the<br /><em>moments</em> between.</h1>
              <p>South Asian menswear for familiar days and the gatherings that bring us together. Explore the garment families that make up the Dastoor point of view.</p>
              <button className="text-link" onClick={() => scrollTo('collections')}>Explore the categories <ArrowRight size={14} /></button>
            </div>
            <div className="hero-art">
              <img
                src="/collections/editorial-hero.jpg"
                alt="Editorial portrait of a man wearing an ivory kurta in a warm stone courtyard."
                fetchPriority="high"
              />
              <div className="hero-seal">A point<br />of view</div>
            </div>
            <div className="hero-index">01 — An introduction</div>
          </div>
        </section>

        <section id="collections" className="section-wrap collection-section" aria-labelledby="category-heading">
          <div className="intro-row">
            <div>
              <div className="eyebrow">The garment edit</div>
              <h2 id="category-heading" data-testid="text-category-heading">A few ways to dress.</h2>
            </div>
            <p data-testid="text-category-intro">Start with a category. These photographs are editorial references for the Dastoor wardrobe, not confirmed product listings.</p>
          </div>
          <div className="category-controls">
            <div className="filter-row" aria-label="Filter garment categories">
              <button
                className={`filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => { setSelectedCategory('all'); setSearch(''); }}
                aria-pressed={selectedCategory === 'all'}
                data-testid="filter-all-categories"
              >
                All categories
              </button>
              {garmentCategories.map((category) => (
                <button
                  key={category.slug}
                  className={`filter-pill ${selectedCategory === category.slug ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory(category.slug); setSearch(''); }}
                  aria-pressed={selectedCategory === category.slug}
                  data-testid={`filter-category-${category.slug}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            <span className="result-count" aria-live="polite" data-testid="text-category-count">
              {visibleCategories.length} {visibleCategories.length === 1 ? 'category' : 'categories'}
            </span>
          </div>
          <div className="category-grid">
            {visibleCategories.length ? visibleCategories.map((category, index) => (
              <article className="category-card" key={category.slug} data-testid={`card-category-${category.slug}`}>
                <div className="category-image">
                  <img
                    src={category.image}
                    alt={category.imageAlt}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    data-testid={`img-category-${category.slug}`}
                  />
                  <span className="image-caption">{category.imageCaption}</span>
                </div>
                <div className="category-info">
                  <div className="category-topline">
                    <h3>{category.name}</h3>
                    <span className="category-index">0{garmentCategories.indexOf(category) + 1}</span>
                  </div>
                  <p>{category.description}</p>
                  <button className="text-link" onClick={() => selectCategory(category.slug)} data-testid={`button-explore-${category.slug}`}>
                    Explore {category.name} <ArrowDownRight size={14} />
                  </button>
                </div>
              </article>
            )) : (
              <div className="empty-categories" role="status" data-testid="status-empty-categories">
                <h3>No category found.</h3>
                <p>Try another search, or return to the full garment edit.</p>
                <button className="text-link" onClick={() => { setSearch(''); setSelectedCategory('all'); }} data-testid="button-show-all-categories">Show all categories <ArrowRight size={14} /></button>
              </div>
            )}
          </div>

          <section className="story-band" id="our-way" aria-labelledby="story-heading">
            <div className="story-image">
              <img src="/collections/waistcoats.jpg" alt="Editorial portrait showing the texture and shape of a sand waistcoat over an ivory kurta." loading="lazy" />
            </div>
            <div className="story-copy">
              <div className="eyebrow">A little more considered</div>
              <h2 id="story-heading">Tradition, with<br />room to breathe.</h2>
              <p>We take the familiar and make it feel like yours. Easy silhouettes, considered details and clothes that belong in the rhythm of real life.</p>
              <button className="text-link" onClick={() => scrollTo('collections')} data-testid="button-return-to-categories">Return to the garment edit <ArrowRight size={14} /></button>
            </div>
          </section>

          <div className="editorial-note">
            <strong>A preview of the Dastoor wardrobe.</strong>
            <span>The images on this page are editorial category imagery only. They do not indicate specific products, availability or a live catalogue.</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <a className="brand-mark" href="#top" onClick={(event) => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} data-testid="link-footer-home">
              dastoor<span>SOUTH ASIAN WEAR</span>
            </a>
            <p>An independent South Asian menswear point of view, made for everyday wear and gatherings.</p>
          </div>
          <div className="footer-nav">
            <div className="footer-col">
              <strong>Explore categories</strong>
              {garmentCategories.map((category) => (
                <button key={category.slug} onClick={() => selectCategory(category.slug)} data-testid={`footer-category-${category.slug}`}>{category.name}</button>
              ))}
            </div>
            <div className="footer-col">
              <strong>Discover</strong>
              <button onClick={() => scrollTo('our-way')} data-testid="footer-our-way">Our way</button>
              <button onClick={() => scrollTo('top')} data-testid="footer-back-to-top">Back to top</button>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Dastoor. A considered wardrobe.</span>
          <span>Editorial storefront preview</span>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/signin" component={SignInPage} /><Route path="/signup" component={SignUpPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;