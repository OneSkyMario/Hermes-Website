// File: app/coffee/[id]/page.tsx (Individual coffee detail page)
'use client';

import { useRouter, useParams } from 'next/navigation';
import { Coffee, MapPin, Thermometer, Clock, Star, User, ArrowLeft } from 'lucide-react';
import { coffees } from '@/lib/coffees';
import { useState } from 'react';

export default function CoffeeDetail() {
  const router = useRouter();
  const params = useParams();
  const coffeeId = Number(params.id);
  
  const selectedCoffee = coffees.find(c => c.productID === coffeeId);
  const [activeView, setActiveView] = useState('inside');

  if (!selectedCoffee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Кофе не найден</h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Вернуться назад
          </button>
        </div>
      </div>
    );
  }

  const handleCoffeeClick = (productID: number) => {
    router.push(`/coffee/${productID}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-300 rounded-full transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Coffee className="w-8 h-8" />
              <span className="text-xl font-bold">Lyros Coffee</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-6">
            {['Models', 'Services', 'Shop', 'Purchase', 'Contact'].map((item) => (
              <button
                key={item}
                className={`px-4 py-2 rounded-full transition-all ${
                  item === 'Models' 
                    ? 'bg-black text-white' 
                    : 'text-gray-700 hover:bg-gray-300'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-semibold">Grayson Adler</div>
              <div className="text-xs text-gray-600">Account manager</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 p-8">
          {/* Left Column - Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-2">
                {selectedCoffee.name}
              </h1>
              <p className="text-gray-600 text-lg">{selectedCoffee.subtitle}</p>
            </div>

            <div className="text-4xl font-bold text-gray-900">
              {selectedCoffee.price}
            </div>

            {/* Origin Map */}
            <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-700" />
                <span className="text-sm font-semibold">Происхождение</span>
              </div>
              <div className="text-sm text-gray-700">{selectedCoffee.origin}</div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5 text-gray-700" />
                  <span className="text-xs text-gray-600">Температура</span>
                </div>
                <div className="text-lg font-bold">{selectedCoffee.temperature}</div>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <span className="text-xs text-gray-600">Время</span>
                </div>
                <div className="text-lg font-bold">{selectedCoffee.brewTime}</div>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Coffee className="w-5 h-5 text-gray-700" />
                  <span className="text-xs text-gray-600">Цвет</span>
                </div>
                <div className="text-sm font-semibold">{selectedCoffee.color}</div>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-gray-700" />
                  <span className="text-xs text-gray-600">Крепость</span>
                </div>
                <div className="text-sm font-semibold">{selectedCoffee.intensity}</div>
              </div>
            </div>
          </div>

          {/* Right Column - 3D View */}
          <div className="space-y-6">
            {/* View Toggles */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setActiveView('inside')}
                className={`flex flex-col items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
                  activeView === 'inside' 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/30'
                }`}
              >
                <Coffee className="w-6 h-6" />
                <span className="text-sm font-semibold">Inside</span>
              </button>
              <button
                onClick={() => setActiveView('topped')}
                className={`flex flex-col items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
                  activeView === 'topped' 
                    ? 'bg-white shadow-lg' 
                    : 'bg-white/30'
                }`}
              >
                <Coffee className="w-6 h-6" />
                <span className="text-sm font-semibold">Topped</span>
              </button>
            </div>

            {/* Coffee Cup Display */}
            <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${selectedCoffee.bgGradient} flex items-center justify-center shadow-2xl overflow-hidden`}>
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              <div className="relative z-10 text-center">
                <Coffee className="w-48 h-48 text-white/90 mx-auto mb-4" />
                <div className="text-white text-lg font-semibold">{selectedCoffee.name}</div>
              </div>
              
              {/* Floating Info Cards */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="text-xs text-gray-600 mb-1">Объем</div>
                <div className="font-bold">{selectedCoffee.volume}</div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <div className="text-xs text-gray-600 mb-1">Кофеин</div>
                <div className="font-bold">{selectedCoffee.caffeine}</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-lg mb-3">Забронировать место</h3>
              <p className="text-sm text-gray-700 mb-4">
                Закажите ваш любимый кофе заранее и избегайте очередей
              </p>
              <button className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all">
                Заказать сейчас
              </button>
            </div>
          </div>
        </div>

        {/* Coffee Selection */}
        <div className="px-8 pb-8">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {coffees.map((coffee) => (
              <button
                key={coffee.productID}
                onClick={() => handleCoffeeClick(coffee.productID)}
                className={`flex-shrink-0 w-40 p-4 rounded-2xl transition-all ${
                  selectedCoffee.productID === coffee.productID
                    ? 'bg-white shadow-lg scale-105'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${coffee.bgGradient} flex items-center justify-center mb-3 mx-auto`}>
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <div className="text-sm font-semibold text-center mb-1">
                  {coffee.name}
                </div>
                <div className="text-xs text-gray-600 text-center">
                  {coffee.price}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}