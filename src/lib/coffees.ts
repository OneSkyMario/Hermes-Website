import espresso from '@/assets/espresso.webp'
export interface Coffee {
    productID: number;
    name: string;
    subtitle: string;
    description: string;
    imagestr: string;
    price: string;
    color: string;
    temperature: string;
    brewTime: string;
    origin: string;
    volume: string;
    caffeine: string;
    intensity: string;
    bgGradient: string;
    accentColor: string;
  }
  
  export const coffees: Coffee[] = [
    {
      productID: 0,
      name: 'Эспрессо',
      subtitle: 'Классическая Серия',
      description: 'Крепкий и насыщенный кофе с богатым вкусом',
      imagestr: espresso.src,
      price: '350 ₸',
      color: 'Темно-коричневый',
      temperature: '92-96°C',
      brewTime: '25-30 сек',
      origin: 'Эфиопия, Сидамо',
      volume: '30 мл',
      caffeine: '80 мг',
      intensity: '10/10',
      bgGradient: 'from-amber-900 to-amber-700',
      accentColor: 'bg-amber-600'
    },
    {
      productID: 1,
      name: 'Капучино',
      subtitle: 'Молочная Коллекция',
      description: 'Идеальный баланс эспрессо и молочной пенки',
      imagestr: espresso.src,
      price: '450 ₸',
      color: 'Карамельный',
      temperature: '65-70°C',
      brewTime: '2-3 мин',
      origin: 'Италия, Традиция',
      volume: '180 мл',
      caffeine: '75 мг',
      intensity: '6/10',
      bgGradient: 'from-orange-800 to-orange-600',
      accentColor: 'bg-orange-500'
    },
    {
      productID: 2,
      name: 'Латте',
      subtitle: 'Нежная Серия',
      description: 'Нежный кофе с большим количеством молока',
      imagestr: espresso.src,
      price: '500 ₸',
      color: 'Светло-коричневый',
      temperature: '60-65°C',
      brewTime: '3-4 мин',
      origin: 'Бразилия, Сантос',
      volume: '240 мл',
      caffeine: '68 мг',
      intensity: '4/10',
      bgGradient: 'from-yellow-800 to-yellow-600',
      accentColor: 'bg-yellow-500'
    },
    {
      productID: 3,
      name: 'Американо',
      subtitle: 'Классическая Линия',
      description: 'Классический кофе для ценителей простоты',
      imagestr: espresso.src,
      price: '380 ₸',
      color: 'Янтарный',
      temperature: '85-90°C',
      brewTime: '1-2 мин',
      origin: 'Колумбия, Медельин',
      volume: '150 мл',
      caffeine: '77 мг',
      intensity: '7/10',
      bgGradient: 'from-stone-800 to-stone-600',
      accentColor: 'bg-stone-500'
    },
    {
      productID: 4,
      name: 'Мокка',
      subtitle: 'Премиум Коллекция',
      description: 'Сладкое сочетание кофе и шоколада',
      imagestr: espresso.src,
      price: '550 ₸',
      color: 'Шоколадный',
      temperature: '65-70°C',
      brewTime: '3-4 мин',
      origin: 'Йемен, Мокка',
      volume: '200 мл',
      caffeine: '70 мг',
      intensity: '5/10',
      bgGradient: 'from-red-900 to-red-700',
      accentColor: 'bg-red-600'
    }
  ];