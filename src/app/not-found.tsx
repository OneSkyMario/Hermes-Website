import Link from 'next/link';
import { ArrowLeft, Bot } from 'lucide-react';
import SiteHeader from '@/components/navigation/SiteHeader';
import './404.css';

export default function NotFound() {
  return <div className="app-shell"><SiteHeader/><main id="main-content" className="error-page"><Bot size={72} strokeWidth={1}/><p className="eyebrow">404 / Route not found</p><h1>A little off route.</h1><p>This page isn’t on our map. Let’s get you back to the menu.</p><Link className="button button-primary" href="/"><ArrowLeft size={18}/> Back to Otto</Link></main></div>;
}
