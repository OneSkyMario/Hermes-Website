'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Coffee, MapPin, Navigation, PackageCheck } from 'lucide-react';
import SiteHeader from '@/components/navigation/SiteHeader';
import MapComponent from './MapComponent/Map';
import { useShop } from './context/ShopContext';
import './page.css';
import './hero.css';

export default function Homepage() {
  const { coffees, loading, error } = useShop();
  const carousel = useRef<HTMLDivElement>(null);
  const [showMap, setShowMap] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollTo = (index: number) => {
    const container = carousel.current;
    container?.scrollTo({ left: container.clientWidth * index, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <div className="app-shell home-shell">
    <SiteHeader />
    <main id="main-content">
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="hero-halftone" aria-hidden="true"/>
        <div className="hero-copy">
          <p className="eyebrow"><span className="blue-dot"/> Autonomous delivery</p>
          <h1 id="hero-title">Your next delivery.<br/><span>A little more autonomous.</span></h1>
          <p className="hero-description">Good coffee. A new way to get there.<br/>Meet Otto, your autonomous delivery companion.</p>
          <div className="hero-actions"><a href="#menu" className="button button-primary">Explore the menu <ArrowRight size={18}/></a><a href="#delivery" className="text-link">Meet the delivery system <ArrowUpRight size={16}/></a></div>
        </div>
      </section>
      <div className="capability-strip"><span><Navigation size={17}/> Autonomous navigation</span><span><MapPin size={17}/> From pickup to doorstep</span><span><PackageCheck size={17}/> Everyday delivery</span><span className="strip-index">OTTO / DELIVERY SYSTEM</span></div>
      <section id="menu" className="home-section" aria-labelledby="menu-title">
        <div className="section-heading"><div><p className="eyebrow">01 / The menu</p><h2 id="menu-title">Your usual. A new route.</h2></div><p>Choose a coffee, pick a store,<br/>and explore robot delivery.</p></div>
        {loading ? <div className="catalog-state" role="status"><Coffee size={28}/><h3>Loading the coffee menu…</h3><p>Finding your next pick.</p></div> : error ? <div className="catalog-state" role="status"><Coffee size={28}/><h3>The menu is temporarily unavailable</h3><p>We couldn’t reach the catalog. Please try again shortly.</p><button className="button button-secondary" onClick={() => window.location.reload()}>Try again <ArrowRight size={16}/></button></div> : coffees.length === 0 ? <div className="catalog-state"><Coffee size={28}/><h3>A fresh menu is on its way</h3><p>No coffees are listed yet. Check back soon.</p></div> : <>
          <div ref={carousel} className="coffee-carousel" onScroll={e => setCurrentIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
            {coffees.map(coffee => <article className="catalog-slide" key={coffee.productID}>
              <div className="catalog-image">{coffee.imagestr ? <Image unoptimized src={coffee.imagestr} alt={coffee.name} width={480} height={400}/> : <Coffee size={100} strokeWidth={1}/>}<span className="image-caption">THE DAILY PICK / COFFEE</span></div>
              <div className="catalog-copy"><p className="eyebrow">Coffee collection</p><h3>{coffee.name}</h3><p>{coffee.description || coffee.subtitle}</p><div className="catalog-bottom"><span className="catalog-price">{coffee.price}</span><Link className="button button-primary" href={`/coffee/${coffee.productID}`}>Choose your coffee <ArrowRight size={17}/></Link></div></div>
            </article>)}
          </div>
          <div className="carousel-controls"><span>{String(currentIndex + 1).padStart(2, '0')} <span className="muted">/ {String(coffees.length).padStart(2, '0')}</span></span><div className="carousel-dots">{coffees.map((coffee, index) => <button key={coffee.productID} aria-label={`Show ${coffee.name}`} aria-pressed={currentIndex === index} onClick={() => scrollTo(index)}/>)}</div><div className="carousel-arrows"><button aria-label="Previous coffee" disabled={currentIndex === 0} onClick={() => scrollTo(currentIndex - 1)}><ChevronLeft size={20}/></button><button aria-label="Next coffee" disabled={currentIndex === coffees.length - 1} onClick={() => scrollTo(currentIndex + 1)}><ChevronRight size={20}/></button></div></div>
        </>}
        <Link href="/mainMeal/1" className="food-link"><span><span className="eyebrow">Something to go with it?</span><strong>Explore the food menu <span className="demo-badge">Demo</span></strong></span><ArrowUpRight size={24}/></Link>
      </section>
      <section id="delivery" className="delivery-section" aria-labelledby="delivery-title">
        <div className="delivery-copy"><p className="eyebrow">02 / Behind the delivery</p><h2 id="delivery-title">Small wheels.<br/>A whole new way.</h2><p>From the first pickup to the final turn, explore how a robot moves through its delivery environment.</p><button onClick={() => setShowMap(true)} className="button button-primary">Explore the map <ArrowUpRight size={17}/></button><p className="demo-note">Interactive demo · sample positions, no live dispatch</p></div>
        <button className="route-preview" onClick={() => setShowMap(true)} aria-label="Open the delivery map demo"><span className="route-preview-label">NAVIGATION / MAP PREVIEW <span className="demo-badge">Demo</span></span><svg viewBox="0 0 580 330" aria-hidden="true"><g fill="#eaf2f7" stroke="#d5e4ee"><rect x="25" y="30" width="120" height="90" rx="8"/><rect x="175" y="30" width="155" height="90" rx="8"/><rect x="360" y="30" width="190" height="90" rx="8"/><rect x="25" y="155" width="180" height="145" rx="8"/><rect x="240" y="155" width="90" height="145" rx="8"/><rect x="360" y="155" width="190" height="145" rx="8"/></g><path d="M90 140h133v85h122V140h130" stroke="#218fea" strokeWidth="3" strokeDasharray="6 6" fill="none"/><circle cx="90" cy="140" r="9" fill="white" stroke="#218fea" strokeWidth="3"/><circle cx="475" cy="140" r="12" fill="#218fea"/><circle cx="475" cy="140" r="4" fill="white"/><g fill="#526b7f" fontSize="11" fontFamily="monospace"><text x="55" y="102">PICKUP</text><text x="425" y="102">DESTINATION</text></g></svg><span className="route-preview-footer"><span><span className="blue-dot"/> A route, from A to B.</span><ArrowUpRight size={18}/></span></button>
      </section>
    </main>
    <footer className="site-footer"><Link href="/" className="brand">otto<span className="brand-dot">.</span></Link><p>Everyday delivery. Thoughtfully autonomous.</p><span>© {new Date().getFullYear()} Otto</span></footer>
    {showMap && <MapComponent onClose={() => setShowMap(false)}/>}
  </div>;
}
