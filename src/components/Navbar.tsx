'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { LogOut } from 'lucide-react';

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            .navbar * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
            .logout-btn {
                background: transparent;
                border: 1px solid rgba(255,68,102,0.2);
                border-radius: 4px; padding: 0 12px;
                height: 32px; color: rgba(255,68,102,0.5);
                font-size: 11px; letter-spacing: 1px;
                cursor: pointer; transition: all 0.2s;
                font-family: 'Space Grotesk', sans-serif;
                display: flex; align-items: center; gap: 6px;
                text-transform: uppercase;
            }
            .logout-btn:hover { border-color: #ff4466; color: #ff4466; }
            .login-btn {
                background: transparent;
                border: 1px solid rgba(0,255,200,0.2);
                border-radius: 4px; padding: 0 16px;
                height: 32px; color: rgba(0,255,200,0.6);
                font-size: 11px; letter-spacing: 1px;
                cursor: pointer; transition: all 0.2s;
                font-family: 'Space Grotesk', sans-serif;
                text-transform: uppercase; text-decoration: none;
                display: flex; align-items: center;
            }
            .login-btn:hover { border-color: #00ffc8; color: #00ffc8; background: rgba(0,255,200,0.05); }
        `}</style>

        <nav className="navbar" style={{
            borderBottom: '1px solid rgba(0,255,200,0.08)',
            padding: '1rem 2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(6,10,13,0.95)',
            backdropFilter: 'blur(10px)',
            position: 'sticky', top: 0, zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#00ffc8', boxShadow: '0 0 10px #00ffc8',
                    animation: 'blink 2s ease-in-out infinite'
                }} />
                <Link href="/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff', letterSpacing: '-0.3px' }}>
                        MESSAGE <span style={{ color: '#00ffc8' }}>BOX</span>
                    </span>
                </Link>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {session ? (
                    <>
                        <span style={{ fontSize: '12px', color: 'rgba(0,255,200,0.4)', letterSpacing: '1px' }}>
                            @{user?.username || user?.email}
                        </span>
                        <button className="logout-btn" onClick={() => signOut()}>
                            <LogOut size={12} /> Logout
                        </button>
                    </>
                ) : (
                    <Link href="/sign-in" className="login-btn">
                        Login
                    </Link>
                )}
            </div>
        </nav>
        </>
    );
}

export default Navbar;