'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Send, Sparkles, MessageSquare } from 'lucide-react';

export default function SendMessage() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
        "What's your favorite movie?",
        "Do you have any pets?",
        "What's your dream job?"
    ]);
    const { username } = useParams<{ username: string }>();

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMsg('');
        setErrorMsg('');
        try {
            const response = await axios.post('/api/send-message', { username, content });
            setSuccessMsg(response.data.message);
            setContent('');
        } catch (error: any) {
            setErrorMsg(error.response?.data.message || 'Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMessageClick = (message: string) => {
        setContent(message.trim());
    };

    const parseMessages = (messageString: string) => {
        return messageString
            .split(/\s*\|\|\s*|\s*\|\s*/)
            .map((msg) => msg.trim())
            .filter((msg) => msg !== "");
    };

    const handleSuggestMessages = async () => {
        setIsSuggestLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const response = await axios.post('/api/suggest-messages');
            const parsedMessages = parseMessages(response.data?.message || '');
            setSuggestedMessages(parsedMessages.length > 0 ? parsedMessages : [
                "What's your favorite movie?",
                "Do you have any pets?",
                "What's your dream job?"
            ]);
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || 'Failed to generate suggestions');
            setSuggestedMessages([
                "What's your favorite movie?",
                "Do you have any pets?",
                "What's your dream job?"
            ]);
        } finally {
            setIsSuggestLoading(false);
        }
    };

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            .send-root * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
            @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
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
            .neon-card {
                background: rgba(6,15,20,0.95);
                border: 1px solid rgba(0,255,200,0.1);
                border-radius: 6px; padding: 1.5rem;
                position: relative; animation: fadeIn 0.3s ease;
            }
            .neon-textarea {
                width: 100%; min-height: 120px;
                background: rgba(0,255,200,0.03);
                border: 1px solid rgba(0,255,200,0.15);
                border-radius: 4px; padding: 12px 16px;
                color: #e0fff8; font-size: 14px;
                outline: none; transition: all 0.2s; resize: vertical;
                font-family: 'Space Grotesk', sans-serif;
                letter-spacing: 0.3px; line-height: 1.6;
            }
            .neon-textarea::placeholder { color: rgba(0,255,200,0.2); }
            .neon-textarea:focus {
                border-color: rgba(0,255,200,0.5);
                background: rgba(0,255,200,0.04);
                box-shadow: 0 0 0 1px rgba(0,255,200,0.15);
            }
            .send-btn {
                background: transparent; border: 1px solid #00ffc8;
                border-radius: 4px; color: #00ffc8;
                padding: 0 24px; height: 46px;
                font-size: 13px; font-weight: 600;
                letter-spacing: 2px; text-transform: uppercase;
                cursor: pointer; transition: all 0.3s;
                font-family: 'Space Grotesk', sans-serif;
                display: flex; align-items: center; gap: 8px;
            }
            .send-btn:hover:not(:disabled) {
                background: rgba(0,255,200,0.08);
                box-shadow: 0 0 20px rgba(0,255,200,0.2); color: #fff;
            }
            .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
            .suggest-btn {
                background: transparent;
                border: 1px solid rgba(0,255,200,0.2);
                border-radius: 4px; color: rgba(0,255,200,0.6);
                padding: 0 20px; height: 40px;
                font-size: 12px; font-weight: 600;
                letter-spacing: 1.5px; text-transform: uppercase;
                cursor: pointer; transition: all 0.3s;
                font-family: 'Space Grotesk', sans-serif;
                display: flex; align-items: center; gap: 8px;
            }
            .suggest-btn:hover:not(:disabled) {
                border-color: #00ffc8; color: #00ffc8;
                background: rgba(0,255,200,0.05);
            }
            .suggest-btn:disabled { opacity: 0.4; cursor: not-allowed; }
            .msg-suggestion {
                background: rgba(0,255,200,0.03);
                border: 1px solid rgba(0,255,200,0.1);
                border-radius: 4px; padding: 12px 16px;
                color: rgba(255,255,255,0.6); font-size: 13px;
                cursor: pointer; transition: all 0.2s; text-align: left;
                width: 100%; font-family: 'Space Grotesk', sans-serif;
                line-height: 1.5;
            }
            .msg-suggestion:hover {
                border-color: rgba(0,255,200,0.4);
                color: rgba(255,255,255,0.9);
                background: rgba(0,255,200,0.06);
            }
            .cta-btn {
                background: transparent; border: 1px solid #00ffc8;
                border-radius: 4px; color: #00ffc8;
                padding: 0 24px; height: 44px;
                font-size: 12px; font-weight: 600;
                letter-spacing: 2px; text-transform: uppercase;
                cursor: pointer; transition: all 0.3s;
                font-family: 'Space Grotesk', sans-serif;
                text-decoration: none;
                display: inline-flex; align-items: center;
            }
            .cta-btn:hover { background: rgba(0,255,200,0.08); color: #fff; }
        `}</style>

        <div className="send-root" style={{
            minHeight: '100vh', background: '#060a0d',
            position: 'relative', paddingBottom: '3rem'
        }}>
            <div className="grid-bg" />
            <div className="scanline" />

            {/* Glow */}
            <div style={{ position: 'fixed', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,200,0.06), transparent 70%)', top: '-100px', right: '-100px', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

            <div style={{ maxWidth: '680px', margin: '0 auto', padding: '3rem 2rem', position: 'relative', zIndex: 10 }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', padding: '5px 14px', background: 'rgba(0,255,200,0.05)', border: '1px solid rgba(0,255,200,0.15)', borderRadius: '20px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffc8', boxShadow: '0 0 8px #00ffc8', animation: 'blink 2s ease-in-out infinite' }} />
                        <span style={{ fontSize: '11px', color: 'rgba(0,255,200,0.7)', letterSpacing: '2px', textTransform: 'uppercase' }}>Anonymous Message</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                        Send to <span style={{ color: '#00ffc8' }}>@{username}_</span>
                    </h1>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                        Your identity will remain completely anonymous
                    </p>
                </div>

                {/* Message Form */}
                <div className="neon-card" style={{ marginBottom: '1.25rem' }}>
                    <div className="corner corner-tl" /><div className="corner corner-tr" />
                    <div className="corner corner-bl" /><div className="corner corner-br" />

                    <p style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                        Your Message
                    </p>

                    <form onSubmit={handleSendMessage}>
                        <textarea
                            className="neon-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your anonymous message here..."
                            rows={4}
                        />

                        {/* Success/Error */}
                        {successMsg && (
                            <p style={{ fontSize: '12px', color: '#00ffc8', marginTop: '8px', letterSpacing: '0.5px' }}>
                                ✓ {successMsg}
                            </p>
                        )}
                        {errorMsg && (
                            <p style={{ fontSize: '12px', color: '#ff4466', marginTop: '8px', letterSpacing: '0.5px' }}>
                                ✗ {errorMsg}
                            </p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                            <button
                                type="submit"
                                className="send-btn"
                                disabled={isLoading || !content.trim()}
                            >
                                {isLoading
                                    ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                                    : <><Send size={14} /> Send Message</>
                                }
                            </button>
                        </div>
                    </form>
                </div>

                {/* AI Suggestions */}
                <div className="neon-card" style={{ marginBottom: '2rem' }}>
                    <div className="corner corner-tl" /><div className="corner corner-tr" />
                    <div className="corner corner-bl" /><div className="corner corner-br" />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            AI Suggestions
                        </p>
                        <button
                            className="suggest-btn"
                            onClick={handleSuggestMessages}
                            disabled={isSuggestLoading}
                        >
                            {isSuggestLoading
                                ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</>
                                : <><Sparkles size={12} /> Suggest</>
                            }
                        </button>
                    </div>

                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginBottom: '12px', letterSpacing: '0.3px' }}>
                        Click any message to use it
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {suggestedMessages.map((message, index) => (
                            <button
                                key={index}
                                className="msg-suggestion"
                                onClick={() => handleMessageClick(message)}
                            >
                                <MessageSquare size={12} style={{ display: 'inline', marginRight: '8px', color: '#00ffc8', verticalAlign: 'middle' }} />
                                {message}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '2rem 0' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,200,0.06)' }} />
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', letterSpacing: '1px' }}>MSG-BOX</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,200,0.06)' }} />
                </div>

                {/* CTA */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>
                        Want your own anonymous message board?
                    </p>
                    <Link href="/sign-up" className="cta-btn">
                        Create Your Account
                    </Link>
                </div>
            </div>
        </div>
        </>
    );
}