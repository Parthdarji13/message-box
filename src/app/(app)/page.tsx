'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';

export default function Home() {
    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            .home * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
            @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
            @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
            .grid-bg {
                position: fixed; inset: 0;
                background-image:
                    linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px);
                background-size: 40px 40px;
                pointer-events: none; z-index: 0;
            }
            .scanline {
                position: fixed; left: 0; right: 0; height: 2px;
                background: linear-gradient(transparent, rgba(0,255,200,0.05), transparent);
                animation: scanline 6s linear infinite;
                pointer-events: none; z-index: 0;
            }
            .corner { position: absolute; width: 10px; height: 10px; }
            .corner-tl { top: -1px; left: -1px; border-top: 2px solid #00ffc8; border-left: 2px solid #00ffc8; }
            .corner-tr { top: -1px; right: -1px; border-top: 2px solid #00ffc8; border-right: 2px solid #00ffc8; }
            .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid #00ffc8; border-left: 2px solid #00ffc8; }
            .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid #00ffc8; border-right: 2px solid #00ffc8; }
            .hero { animation: fadeUp 0.8s ease; }
            .cta-btn {
                background: transparent;
                border: 1px solid #00ffc8;
                border-radius: 4px;
                color: #00ffc8;
                padding: 0 28px; height: 48px;
                font-size: 13px; font-weight: 600;
                letter-spacing: 2px; text-transform: uppercase;
                cursor: pointer; transition: all 0.3s;
                font-family: 'Space Grotesk', sans-serif;
                text-decoration: none;
                display: inline-flex; align-items: center;
            }
            .cta-btn:hover {
                background: rgba(0,255,200,0.08);
                box-shadow: 0 0 20px rgba(0,255,200,0.2);
                color: #fff;
            }
            .cta-btn-outline {
                background: transparent;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 4px;
                color: rgba(255,255,255,0.4);
                padding: 0 28px; height: 48px;
                font-size: 13px; font-weight: 600;
                letter-spacing: 2px; text-transform: uppercase;
                cursor: pointer; transition: all 0.3s;
                font-family: 'Space Grotesk', sans-serif;
                text-decoration: none;
                display: inline-flex; align-items: center;
            }
            .cta-btn-outline:hover {
                border-color: rgba(255,255,255,0.3);
                color: rgba(255,255,255,0.8);
            }
            .msg-card {
                background: rgba(6,15,20,0.95);
                border: 1px solid rgba(0,255,200,0.1);
                border-radius: 6px; padding: 1.5rem;
                position: relative;
                animation: float 4s ease-in-out infinite;
                transition: border-color 0.2s;
            }
            .msg-card:hover { border-color: rgba(0,255,200,0.3); }
            .stat-card {
                background: rgba(6,15,20,0.95);
                border: 1px solid rgba(0,255,200,0.1);
                border-radius: 6px; padding: 1.5rem;
                position: relative; text-align: center;
                transition: border-color 0.2s;
            }
            .stat-card:hover { border-color: rgba(0,255,200,0.25); }
        `}</style>

        <div className="home" style={{ minHeight: '100vh', background: '#060a0d', position: 'relative' }}>
            <div className="grid-bg" />
            <div className="scanline" />

            {/* Glow orbs */}
            <div style={{ position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,200,0.06), transparent 70%)', top: '-200px', right: '-100px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,0,255,0.06), transparent 70%)', bottom: '-100px', left: '-100px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Hero Section */}
            <main style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 60px)', padding: '4rem 2rem', textAlign: 'center' }}>

                <div className="hero">
                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '2rem', padding: '6px 16px', background: 'rgba(0,255,200,0.05)', border: '1px solid rgba(0,255,200,0.15)', borderRadius: '20px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffc8', boxShadow: '0 0 8px #00ffc8', animation: 'blink 2s ease-in-out infinite' }} />
                        <span style={{ fontSize: '11px', color: 'rgba(0,255,200,0.7)', letterSpacing: '2px', textTransform: 'uppercase' }}>Anonymous Messaging Platform</span>
                    </div>

                    {/* Heading */}
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: '700', color: '#fff', lineHeight: 1.15, letterSpacing: '-1px', marginBottom: '1.5rem', maxWidth: '700px' }}>
                        Dive into the World of<br />
                        <span style={{ color: '#00ffc8' }}>Anonymous</span> Conversations
                    </h1>

                    <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', maxWidth: '730px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
                        Where your identity remains a secret. Send and receive messages without revealing who you are.
                    </p>

                    {/* CTA Buttons */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/sign-up" className="cta-btn">
                            Get Started
                        </Link>
                        <Link href="/sign-in" className="cta-btn-outline">
                            Sign In
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '500px', width: '100%', margin: '4rem auto 3rem' }}>
                    {[
                        { value: '100%', label: 'Anonymous' },
                        { value: '∞', label: 'Messages' },
                        { value: '0', label: 'Tracking' },
                    ].map((stat, i) => (
                        <div key={i} className="stat-card">
                            <div className="corner corner-tl" /><div className="corner corner-tr" />
                            <div className="corner corner-bl" /><div className="corner corner-br" />
                            <p style={{ fontSize: '24px', fontWeight: '700', color: '#00ffc8', marginBottom: '4px' }}>{stat.value}</p>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Carousel */}
                <div style={{ width: '100%', maxWidth: '560px' }}>
                    <p style={{ fontSize: '11px', color: 'rgba(0,255,200,0.4)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        Recent Messages
                    </p>
                    <Carousel
                        plugins={[Autoplay({ delay: 2500 })]}
                        opts={{ loop: true }}
                        style={{ width: '100%' }}
                    >
                        <CarouselContent>
                            {messages.map((message, index) => (
                                <CarouselItem key={index}>
                                    <div className="msg-card" style={{ animationDelay: `${index * 0.5}s` }}>
                                        <div className="corner corner-tl" /><div className="corner corner-tr" />
                                        <div className="corner corner-bl" /><div className="corner corner-br" />
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffc8', boxShadow: '0 0 6px #00ffc8' }} />
                                            <span style={{ fontSize: '12px', color: '#00ffc8', fontWeight: '600', letterSpacing: '0.5px' }}>{message.title}</span>
                                        </div>
                                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.6, textAlign: 'left' }}>
                                            {message.content}
                                        </p>
                                        <p style={{ fontSize: '11px', color: 'rgba(0,255,200,0.3)', marginTop: '10px', textAlign: 'left', letterSpacing: '0.5px' }}>
                                            {message.received}
                                        </p>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid rgba(0,255,200,0.06)',
                padding: '1.5rem 2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'relative', zIndex: 10,
                background: 'rgba(6,10,13,0.9)',
            }}>
                <span style={{ fontSize: '12px', color: 'rgba(0,255,200,0.3)', letterSpacing: '1px' }}>
                    MSG-BOX v1.0
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)' }}>
                    © 2026 Message Box. All rights reserved.
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(0,255,200,0.3)', letterSpacing: '1px' }}>
                    SECURE CONNECTION
                </span>
            </footer>
        </div>
        </>
    );
}