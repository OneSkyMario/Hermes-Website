"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Bot, LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import AuthModal from '@/components/common/AuthModal';

export default function SiteHeader() {
  const { user, logout, loading } = useAuth();
  const [auth, setAuth] = useState<'login' | 'register' | null>(null);
  return <>
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Otto home"><span className="brand-icon"><Bot size={22}/></span>otto<span className="brand-dot">.</span></Link>
      <nav className="site-nav" aria-label="Main navigation">
        <Link href="/#menu">Coffee</Link><Link href="/mainMeal/1">Food <span className="nav-demo">demo</span></Link><Link href="/#delivery">Delivery</Link>
      </nav>
      <div className="site-account">
        {user ? <><span className="account-name">{user.full_name || user.email}</span><button className="button button-secondary icon-button" onClick={logout} aria-label="Log out"><LogOut size={18}/></button></> : <><button className="login-link" disabled={loading} onClick={() => setAuth('login')}>Log in</button><button className="button button-primary" disabled={loading} onClick={() => setAuth('register')}>Sign up <ArrowUpRight size={16}/></button></>}
      </div>
    </header>
    {auth && <AuthModal key={auth} isOpen initialLogin={auth === 'login'} onClose={() => setAuth(null)}/>}
  </>;
}
