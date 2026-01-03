'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Coffee, ChevronLeft, ChevronRight } from 'lucide-react';

import './navbar.css'
import './page.css';
import coffeeImage from '../assets/espresso.webp';
import cappuccinoImage from '../assets/espresso.webp'; // Temporary, replace with cappiccuno.webp
import latteImage from '../assets/espresso.webp'; // Temporary, replace with latte.webp
import robotImage from '../assets/image.png'; // Add your robot PNG here

export default function Homepage() {
  const navbarRef = useRef<HTMLElement>(null);
  const robotRef = useRef<HTMLImageElement>(null);
  const [currentCoffeeIndex, setCurrentCoffeeIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [direction, setDirection] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const coffees = [
    {
      name: 'Эспрессо',
      description: 'Крепкий и насыщенный кофе с богатым вкусом',
      image: coffeeImage,
      color: 'from-amber-900 to-amber-700',
      price: '0 ₸'
    },
    {
      name: 'Капучино',
      description: 'Идеальный баланс эспрессо и молочной пенки',
      image: cappuccinoImage,
      color: 'from-orange-800 to-orange-600',
      price: '450 ₸'
    },
    {
      name: 'Латте',
      description: 'Нежный кофе с большим количеством молока',
      image: latteImage,
      color: 'from-yellow-800 to-yellow-600',
      price: '500 ₸'
    },
    {
      name: 'Американо',
      description: 'Классический кофе для ценителей простоты',
      image: coffeeImage,
      color: 'from-stone-800 to-stone-600',
      price: '380 ₸'
    },
    {
      name: 'Мокка',
      description: 'Сладкое сочетание кофе и шоколада',
      image: coffeeImage,
      color: 'from-red-900 to-red-700',
      price: '550 ₸'
    }
  ];

  
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const index = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(index);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    
    const itemWidth = container.offsetWidth;
    container.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth'
    });
  };
  

  return (
    <div>
      <header>
        <h1>OTTO</h1>
        <p className="subtitle">Transportation Services</p>
      </header>

      <nav id='navbar' ref={navbarRef}>
        <div className="dropdown">
          <a href="#Drinks">Drinks</a>
          <div className="dropdown-content">
            <a href="#Coffee">Coffee</a>
            <a href="#">Tea</a>
            <a href="#">Juice</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="#Food">Food</a>
          <div className="dropdown-content">
            <a href="#">Pizza</a>
          </div>
        </div>
        <div className="dropdown">
        <a href="#contact">Contact</a>
         
        </div>
      </nav>

      <main>
        <section id="recommendation" className="info-section">
          <div className="section-header">
            <h2>Today's Recommendation</h2>
          </div>
          <div className="halftone-line"></div>
          <div className="sketch-container">
            <div className="sketch-item">
              <h3>Caramel Macchiato</h3>
              <p>Espresso with steamed milk and caramel drizzle.</p>
            </div>
            <div className="sketch-item">
              <h3>Margherita Pizza</h3>
              <p>Classic pizza with fresh tomatoes, mozzarella, and basil.</p>
            </div>
          </div>
        </section>

        <section id="menu" className="info-section">
          <div className="section-header">
            <h2 id="Coffee">Coffee</h2>
          </div>
          <div className="halftone-line"></div>
          
          {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-scroll overflow-y-hidden  snap-x snap-mandatory scrollbar-hide hover:shadow-[5px_5px_0_#6b6b6b] hover:-translate-y-1 hover:scale-[1.01] transition-all duration-300 rounded-3xl"
        
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="flex">
            {coffees.map((coffee, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full snap-start snap-always px-4"
              >
                <div
                  className=""
                >
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 md:p-12">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Coffee Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={coffee.image.src}
                          alt={coffee.name}
                          className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-2xl drop-shadow-2xl ring-4 ring-white/30"
                        />
                      </div>

                      {/* Coffee Info */}
                      <div className="flex-1 text-white text-center md:text-left">
                        <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
                          <Coffee className="w-5 h-5" />
                          <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                            Напиток дня
                          </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                          {coffee.name}
                        </h2>

                        <p className="text-lg md:text-xl mb-6 opacity-90">
                          {coffee.description}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                          <span className="text-3xl md:text-4xl font-bold">
                            {coffee.price}
                          </span>
                          <button className="bg-white text-stone-900 px-8 py-3 rounded-full font-semibold hover:bg-stone-100 transition-all hover:scale-105 active:scale-95 shadow-lg">
                            Заказать
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      
          </div>
          {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6 position: relative">
          {coffees.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-8 h-3 bg-stone-700'
                  : 'w-3 h-3 bg-stone-400 hover:bg-stone-500'
              }`}
              aria-label={`Go to coffee ${index + 1}`}
            />
          ))}
        </div>
        </section>



        <section id="robot" className="" style={{ position: 'relative', overflow: 'visible' }}>
          {/* Floating Robot Image */}
          <img 
            ref={robotRef}
            src={robotImage.src}
            alt="Floating Robot"
            className="floating"
            style={{
              position: 'absolute',
              width: 'clamp(100px, 15vw, 200px)',
              height: 'auto',
              top: 'clamp(-50px, -8vw, -100px)',
              right: 'clamp(5%, 10vw, 10%)',
              filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))',
              cursor: 'pointer',
              zIndex: 10,
              transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
          />
          
        
        </section>

        <section className="cta-section">
          <h2>Ready to Order?</h2>
          <div className="halftone-line-gradient" style={{margin: '30px auto', maxWidth: '600px'}}></div>
          <p>
            Go now! We're waiting to serve you.
          </p>
          <a href="#contact" className="cta-button">Place Order Now</a>
        </section>
      </main>

      <footer>
        <p>&copy; 2026 OTTO Transportation Services | All Rights Reserved</p>
        <p>Automated Delivery • Robot Assistance • 24/7 Service</p>
      </footer>
    </div>
  );
}