'use client'
import React, { useState } from 'react';
import { ShoppingCart, ChevronDown, Star, Clock } from 'lucide-react';
import './navbar.css';

export default function DodoPizzaHomepage() {
  const [activeCategory, setActiveCategory] = useState('Пиццы');
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = [
    'Пиццы', 'Комбо', 'Закуски', 'Коктейли', 'Кофе', 'Напитки', 'Десерты', 'Соусы', 'Другие товары', 'Завтрак'
  ];

  const promoCards = [
    { title: 'Детская', subtitle: 'новинка Play Dodo комбо', bg: 'from-teal-400 to-teal-500', img: '🎮' },
    { title: '-25%', subtitle: 'на первый заказ', bg: 'from-orange-500 to-orange-600', img: '🍕' },
    { title: 'Новинка:', subtitle: 'Крылья с соусами', bg: 'from-red-900 to-red-800', img: '🍗' },
    { title: 'Настройте', subtitle: 'вкус пиццы', bg: 'from-orange-50 to-orange-100', textDark: true, img: '🍕' },
    { title: 'Пицца для ума', subtitle: '', bg: 'from-orange-500 to-orange-600', img: '📚' },
    { title: 'Выгодное', subtitle: 'комбо', bg: 'from-orange-100 to-orange-200', textDark: true, img: '🍕' }
  ];

  const popularPizzas = [
    { name: 'Аррива!', price: '2 150', img: '🍕' },
    { name: 'Креветки со сладким чили', price: '2 650', img: '🍤' }
  ];

  const pizzas = [
    { 
      name: 'Пепперони', 
      desc: 'Пикантная пепперони, увеличенная порция моцареллы, томатный соус',
      price: '2 150',
      img: '🍕'
    },
    { 
      name: 'Сырная', 
      desc: 'Моцарелла, сыры чеддер и пармезан, фирменный соус альфредо',
      price: '1 890',
      img: '🧀'
    },
    { 
      name: 'Цыпленок барбекю', 
      desc: 'Цыпленок, бекон, соус барбекю, томатный соус, моцарелла',
      price: '2 350',
      img: '🍗'
    },
    { 
      name: 'Ветчина и сыр', 
      desc: 'Ветчина, моцарелла, фирменный соус альфредо',
      price: '1 950',
      img: '🥓'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white  ">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">🌐 Язык</span>
            </div>
          
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-white top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl">
                🍕
              </div>
              <div>
                <h1 className="text-2xl font-bold">ДОДО ПИЦЦА</h1>
                <p className="text-xs text-gray-600">
                  Сеть №1 в Казахстане <span className="text-orange-500">по количеству пиццерий</span>
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div>
              <p className="text-sm text-gray-600">Доставка пиццы <span className="font-bold">Алматы</span></p>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="font-bold">31 мин</span>
                <span>•</span>
                <span className="font-bold">4.8</span>
                <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
              </div>
            </div>

            {/* Cart & Login */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <ShoppingCart size={24} />
              </div>
              <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600">
                Корзина
              </button>
              <button className="text-gray-700 font-medium">Войти</button>
            </div>
          </div>
        </div>
      </header>

      {/* Categories Menu */}
      <div 
        id="navbar" 
        className={`sticky top-[0px] z-40 ${isScrolled ? 'scrolled' : ''}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 overflow-x-auto py-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-orange-100 text-orange-600'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
                                                                                                                                                                                                                                                                                                                                
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Promo Cards */}
        <div className="grid grid-cols-6 gap-4 mb-12">
          {promoCards.map((card, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${card.bg} rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform ${
                idx < 3 ? 'col-span-2' : 'col-span-2'
              } ${card.textDark ? 'text-gray-900' : 'text-white'} flex flex-col justify-between min-h-[200px]`}
            >
              <div>
                <h3 className="text-2xl font-bold mb-1">{card.title}</h3>
                <p className="text-lg">{card.subtitle}</p>
              </div>
              <div className="text-6xl text-right opacity-50">{card.img}</div>
            </div>
          ))}
        </div>

        {/* Popular Orders */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Часто заказывают</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularPizzas.map((pizza, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="w-32 h-32 mx-auto mb-4 text-6xl flex items-center justify-center">
                  {pizza.img}
                </div>
                <h3 className="font-bold text-lg mb-2">{pizza.name}</h3>
                <p className="text-gray-600 text-sm mb-4">от {pizza.price} тг.</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pizzas Grid */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Пиццы</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pizzas.map((pizza, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-orange-100 to-yellow-50 flex items-center justify-center text-8xl">
                  {pizza.img}
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{pizza.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{pizza.desc}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold">от {pizza.price} ₸</p>
                    <button className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full font-medium hover:bg-orange-200">
                      Выбрать
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}