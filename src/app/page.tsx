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

  const coffees = [
    {
      name: 'Эспрессо',
      description: 'Крепкий и насыщенный кофе с богатым вкусом',
      image: coffeeImage,
      color: 'from-amber-900 to-amber-700',
      price: '350 ₸'
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

  const nextCoffee = () => {
    setDirection('next');
    setIsZooming(true);
    setTimeout(() => {
      setCurrentCoffeeIndex((prev) => (prev + 1) % coffees.length);
      setIsZooming(false);
    }, 300);
  };

  const prevCoffee = () => {
    setDirection('prev');
    setIsZooming(true);
    setTimeout(() => {
      setCurrentCoffeeIndex((prev) => (prev - 1 + coffees.length) % coffees.length);
      setIsZooming(false);
    }, 300);
  };

  const goToCoffee = (index: number) => {
    if (index === currentCoffeeIndex) return;
    setDirection(index > currentCoffeeIndex ? 'next' : 'prev');
    setIsZooming(true);
    setTimeout(() => {
      setCurrentCoffeeIndex(index);
      setIsZooming(false);
    }, 300);
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let handleResize;

    const handleScroll = () => {
      const navbar = navbarRef.current;
      if (!navbar) return;

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
      } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);

    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
      // initAnimations();
    }, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (handleResize) window.removeEventListener('resize', handleResize);
    };
  }, []);

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
          
          {/* Coffee Carousel */}
          <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
            <div className="relative">
              {/* Главная карточка */}
              <div className={`relative halftone-carousel rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${isZooming ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`} style={{ backgroundColor: '#4a4a4a' }}>
                {/* Декоративные элементы */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
                    {/* Изображение кофе */}
                    <div className="flex-shrink-0">
                      <div className={`transform transition-all duration-500 ${isZooming ? direction === 'next' ? 'rotate-12 scale-75' : '-rotate-12 scale-75' : 'rotate-0 scale-100'}`}>
                        <img 
                          src={typeof coffees[currentCoffeeIndex].image === 'string' ? coffees[currentCoffeeIndex].image : coffees[currentCoffeeIndex].image.src} 
                          alt={coffees[currentCoffeeIndex].name}
                          className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain drop-shadow-2xl"
                        />
                      </div>
                    </div>

                    {/* Информация */}
                    <div className="flex-1 text-white text-center md:text-left">
                      <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                        <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm font-medium uppercase tracking-wider opacity-90">
                          Напиток дня
                        </span>
                      </div>
                      <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 transition-all duration-500 ${isZooming ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>
                        {coffees[currentCoffeeIndex].name}
                      </h2>
                      <p className={`text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 opacity-90 transition-all duration-500 delay-100 ${isZooming ? 'translate-x-8 opacity-0' : 'translate-x-0 opacity-100'}`}>
                        {coffees[currentCoffeeIndex].description}
                      </p>
                      <div className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center md:justify-start transition-all duration-500 delay-200 ${isZooming ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
                        <span className="text-2xl sm:text-3xl font-bold">{coffees[currentCoffeeIndex].price}</span>
                        <button className="bg-white text-stone-900 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-stone-100 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base">
                          Заказать
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Стрелки навигации */}
              <button
                onClick={prevCoffee}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 md:-translate-x-6 bg-white/90 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all active:scale-95 group z-10"
              >
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-stone-900 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button
                onClick={nextCoffee}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 md:translate-x-6 bg-white/90 backdrop-blur-sm p-2 sm:p-3 md:p-4 rounded-full shadow-xl hover:bg-white hover:scale-110 transition-all active:scale-95 group z-10"
              >
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-stone-900 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Индикаторы */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6 md:mt-8">
              {coffees.map((coffee, index) => (
                <button
                  key={index}
                  onClick={() => goToCoffee(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentCoffeeIndex
                      ? 'bg-white w-8 sm:w-10 md:w-12 h-2 sm:h-2.5 md:h-3'
                      : 'bg-white/30 w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 hover:bg-white/50'
                  }`}
                  aria-label={`Перейти к ${coffee.name}`}
                />
              ))}
            </div>

            {/* Миниатюры */}
            <div className="hidden md:flex justify-center gap-4 mt-8">
              {coffees.map((coffee, index) => (
                <button
                  key={index}
                  onClick={() => goToCoffee(index)}
                  className={`transition-all duration-300 ${
                    index === currentCoffeeIndex
                      ? 'scale-100 opacity-100'
                      : 'scale-75 opacity-40 hover:opacity-70 hover:scale-90'
                  }`}
                >
                  <div className={`bg-gradient-to-br bg-gray-800 p-4 rounded-2xl shadow-lg`}>
                    <img 
                      src={typeof coffee.image === 'string' ? coffee.image : coffee.image.src} 
                      alt={coffee.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                </button>
              ))}
            </div>
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