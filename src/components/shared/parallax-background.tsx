'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ParallaxHeroProps {
  imageUrl: string;
  session: any;
}

export function ParallaxHero({ imageUrl, session }: ParallaxHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate dynamic styles based on scroll
  const initialSize = 110; // Start at 110% so full image is visible
  const newSize = Math.max(100, initialSize - (scrollY / 5)); // Zoom out slower
  const blurAmount = Math.min(8, scrollY / 120);
  const opacity = Math.max(0, 1 - (scrollY / 800));

  return (
    <section className="relative overflow-hidden">
      {/* Fixed Parallax Background */}
      <div
        className="fixed top-0 left-0 right-0 w-full pointer-events-none"
        style={{
          height: '70vh',
          zIndex: 0,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: mounted ? `${newSize}%` : '110%',
            filter: mounted ? `blur(${blurAmount}px)` : 'blur(0px)',
            opacity: mounted ? opacity : 1,
            transition: 'background-size 0.1s ease-out',
            boxShadow: '0 -50px 20px -20px #232323 inset',
          }}
        />
        
        {/* Dark overlay for text readability */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-[#121212]"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tight drop-shadow-2xl">
            NBA Standings <br />Predictions
          </h1>

          {/* Inspirational Text */}
          <div className="space-y-4">
            <p className="text-2xl md:text-3xl text-white/90 font-semibold drop-shadow-lg">
              "Hot takes. Cold results."
            </p>
            <p className="text-lg md:text-xl text-white/80 drop-shadow-md">
              Predict the season. Get your money up. Prove you know ball.
            </p>
          </div>

          {/* CTA Button */}
          {session?.user ? (
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/predictions/new">
                <Button size="lg" className="text-lg shadow-2xl">
                  Make Your Prediction
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/login">
                <Button size="lg" className="text-lg shadow-2xl">
                  Login to Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}