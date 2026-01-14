import espresso from '@/assets/espresso.webp'
import { useEffect, useState } from 'react';
export interface Coffee {
    productID: number;
    name: string;
    subtitle: string;
    description: string;
    imagestr: string;
    price: string;
    color: string;
    origin: string;
    volume: string;
    caffeine: string;
  }
 export const coffees = [
        {
          productID: 0,
          name: 'Эспрессо',
          subtitle: 'Классическая Серия',
          description: 'Крепкий и насыщенный кофе с богатым вкусом',
          imagestr: espresso.src,
          price: '350 ₸',
          color: 'Темно-коричневый',
          origin: 'Эфиопия, Сидамо',
          volume: '30 мл',
          caffeine: '80 мг',
        },
        {
          productID: 1,
          name: 'Капучино',
          subtitle: 'Молочная Коллекция',
          description: 'Идеальный баланс эспрессо и молочной пенки',
          imagestr: espresso.src,
          price: '450 ₸',
          color: 'Карамельный',
          origin: 'Италия, Традиция',
          volume: '180 мл',
          caffeine: '75 мг'
        },
        {
          productID: 2,
          name: 'Латте',
          subtitle: 'Нежная Серия',
          description: 'Нежный кофе с большим количеством молока',
          imagestr: espresso.src,
          price: '500 ₸',
          color: 'Светло-коричневый',
          origin: 'Бразилия, Сантос',
          volume: '240 мл',
          caffeine: '68 мг',
        },
        {
          productID: 3,
          name: 'Американо',
          subtitle: 'Классическая Линия',
          description: 'Классический кофе для ценителей простоты',
          imagestr: espresso.src,
          price: '380 ₸',
          color: 'Янтарный',
          origin: 'Колумбия, Медельин',
          volume: '150 мл',
          caffeine: '77 мг',
        },
        {
          productID: 4,
          name: 'Мокка',
          subtitle: 'Премиум Коллекция',
          description: 'Сладкое сочетание кофе и шоколада',
          imagestr: espresso.src,
          price: '550 ₸',
          color: 'Шоколадный',
          origin: 'Йемен, Мокка',
          volume: '200 мл',
          caffeine: '70 мг',
        }
      ]; 