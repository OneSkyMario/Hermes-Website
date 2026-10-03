"use client";
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/common/AuthModal';
export default function RegistrationPage() {
  const router = useRouter();
  return <AuthModal isOpen initialLogin={false} onClose={() => router.push('/')} />;
}
