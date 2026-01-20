// File: app/not-found.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Construction } from 'lucide-react';
import './404.css';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="page-wrapper error-page">
      <div className="container error-container">
        <div className="error-content">
          <div className="section-header-tag">System Malfunction // 404</div>
          
          {/* 3D Robot Scene */}
          <div className="scene3d">
            <div className="robot-3d">
              <div className="face front">
                <div className="eye-row">
                  <div className="eye"></div>
                  <div className="eye"></div>
                </div>
                <div className="mouth"></div>
              </div>
              <div className="face back"></div>
              <div className="face right"><span>OTTO-04</span></div>
              <div className="face left"><span>ERROR</span></div>
              <div className="face top"></div>
              <div className="face bottom"></div>
            </div>
          </div>

          <h1 className="coffee-title">Grid Sector Missing</h1>
          <p className="order-description">
            Autonomous unit is stuck in a logic loop. 
            The requested coordinates do not exist in the current hub.
          </p>

          <button className="launch-btn" onClick={() => router.push('/')}>
            <ArrowLeft size={18} /> Re-Initialize Home
          </button>
        </div>
      </div>
    </div>
  );
}