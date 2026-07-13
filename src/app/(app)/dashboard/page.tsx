'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/model/user';
import { acceptMessageschema } from '@/schemas/acceptMessageschema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Copy, Loader2, LogOut, RefreshCcw, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const { toast } = useToast();

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await axios.delete(`/api/delete-message/${messageId}`);
            setMessages(messages.filter((message) => (message as any)._id !== messageId));
            toast({ title: 'Success', description: 'Message deleted' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({ title: 'Error', description: axiosError.response?.data.message ?? 'Failed to delete message' });
        }
    };

    const { data: session } = useSession();

const form = useForm<{ acceptMessages: boolean }>({
        resolver: zodResolver(acceptMessageschema),
        defaultValues: { acceptMessages: false },
    });

const { watch, setValue } = form;
    const acceptMessages = watch('acceptMessages');

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages ?? false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({ title: 'Error', description: axiosError.response?.data.message ?? 'Failed to fetch settings' });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data.messages || []);
            if (refresh) toast({ title: 'Refreshed!', description: 'Showing latest messages' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({ title: 'Error', description: axiosError.response?.data.message ?? 'Failed to fetch messages' });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (!session || !session.user) return;
        fetchMessages();
        fetchAcceptMessage();
    }, [session, fetchAcceptMessage, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });
            setValue('acceptMessages', response.data.isAcceptingMessages ?? !acceptMessages);
            toast({ title: response.data.message });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({ title: 'Error', description: axiosError.response?.data.message ?? 'Failed to update settings' });
        }
    };

    if (!session || !session.user) {
        return (
            <div style={{ minHeight: '100vh', background: '#060a0d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'rgba(0,255,200,0.5)', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '2px' }}>
                    PLEASE LOGIN
                </p>
            </div>
        );
    }

    const { username } = session.user as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: 'Copied!', description: 'Profile URL copied to clipboard' });
    };

    return (
        <>
        <style href="dashboard-styles" precedence="default">{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            .dash * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
            @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
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
                background: linear-gradient(transparent, rgba(0,255,200,0.04), transparent);
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
                transition: border-color 0.2s;
            }
            .neon-card:hover { border-color: rgba(0,255,200,0.25); }
            .copy-btn {
                background: transparent;
                border: 1px solid rgba(0,255,200,0.2);
                border-radius: 4px; padding: 0 14px;
                height: 40px; color: rgba(0,255,200,0.6);
                font-size: 12px; letter-spacing: 1px;
                cursor: pointer; transition: all 0.2s;
                font-family: 'Space Grotesk', sans-serif;
                display: flex; align-items: center; gap: 6px;
                white-space: nowrap;
            }
            .copy-btn:hover { border-color: #00ffc8; color: #00ffc8; background: rgba(0,255,200,0.05); }
            .refresh-btn {
                background: transparent;
                border: 1px solid rgba(0,255,200,0.15);
                border-radius: 4px; padding: 0 16px;
                height: 38px; color: rgba(0,255,200,0.6);
                font-size: 12px; letter-spacing: 1px;
                cursor: pointer; transition: all 0.2s;
                font-family: 'Space Grotesk', sans-serif;
                display: flex; align-items: center; gap: 8px;
                text-transform: uppercase;
            }
            .refresh-btn:hover { border-color: #00ffc8; color: #00ffc8; }
            .delete-btn {
                background: transparent;
                border: 1px solid rgba(255,68,102,0.15);
                border-radius: 4px;
                color: rgba(255,68,102,0.4);
                width: 30px; height: 30px;
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; transition: all 0.2s; flex-shrink: 0;
            }
            .delete-btn:hover { border-color: #ff4466; color: #ff4466; background: rgba(255,68,102,0.05); }
            .toggle-btn {
                background: transparent; border: none;
                cursor: pointer; padding: 4px;
                display: flex; align-items: center; gap: 10px;
                transition: color 0.2s;
            }
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
            .profile-input {
                flex: 1; height: 40px;
                background: rgba(0,255,200,0.03);
                border: 1px solid rgba(0,255,200,0.08);
                border-radius: 4px; padding: 0 12px;
                color: rgba(255,255,255,0.35); font-size: 13px;
                font-family: 'Space Grotesk', sans-serif;
                overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
                outline: none;
            }
            .msg-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 12px;
            }
        `}</style>

        <div className="dash" style={{ minHeight: '100vh', background: '#060a0d', position: 'relative' }}>
            <div className="grid-bg" />
            <div className="scanline" />

            {/* Navbar */}
            {/* <nav style={{
                borderBottom: '1px solid rgba(0,255,200,0.08)',
                padding: '1rem 2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(6,10,13,0.95)',
                backdropFilter: 'blur(10px)',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffc8', boxShadow: '0 0 10px #00ffc8', animation: 'blink 2s ease-in-out infinite' }} />
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#fff', letterSpacing: '-0.3px' }}>
                        MSG<span style={{ color: '#00ffc8' }}>BOX</span>
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(0,255,200,0.4)', letterSpacing: '1px' }}>
                        @{username}
                    </span>
                    <button className="logout-btn" onClick={() => signOut()}>
                        <LogOut size={12} /> Logout
                    </button>
                </div>
            </nav> */}

            {/* Content */}
            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 10 }}>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ffc8', boxShadow: '0 0 8px #00ffc8', animation: 'blink 2s ease-in-out infinite' }} />
                        <span style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '3px', textTransform: 'uppercase' }}>Dashboard</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', letterSpacing: '-0.5px' }}>
                        Welcome, <span style={{ color: '#00ffc8' }}>{username}_</span>
                    </h1>
                </div>

                {/* Profile URL */}
                <div className="neon-card" style={{ marginBottom: '1rem' }}>
                    <div className="corner corner-tl" /><div className="corner corner-tr" />
                    <div className="corner corner-bl" /><div className="corner corner-br" />
                    <p style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                        Your Profile Link
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input className="profile-input" value={profileUrl} disabled />
                        <button className="copy-btn" onClick={copyToClipboard}>
                            <Copy size={13} />
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Toggle + Refresh */}
                <div className="neon-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="corner corner-tl" /><div className="corner corner-tr" />
                    <div className="corner corner-bl" /><div className="corner corner-br" />
                    <button
                        className="toggle-btn"
                        onClick={handleSwitchChange}
                        disabled={isSwitchLoading}
                        style={{ color: acceptMessages ? '#00ffc8' : 'rgba(255,255,255,0.3)' }}
                    >
                        {isSwitchLoading ? (
                            <Loader2 size={22} style={{ animation: 'spin 1s linear infinite', color: '#00ffc8' }} />
                        ) : acceptMessages ? (
                            <ToggleRight size={26} />
                        ) : (
                            <ToggleLeft size={26} />
                        )}
                        <div>
                            <p style={{ fontSize: '13px', color: '#fff', fontWeight: '500', textAlign: 'left' }}>
                                {acceptMessages ? 'Accepting messages' : 'Not accepting messages'}
                            </p>
                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                                Toggle to control message receiving
                            </p>
                        </div>
                    </button>

                    <button className="refresh-btn" onClick={() => fetchMessages(true)} disabled={isLoading}>
                        {isLoading
                            ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
                            : <RefreshCcw size={13} />
                        }
                        Refresh
                    </button>
                </div>

                {/* Messages */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Messages
                    </span>
                    <span style={{
                        fontSize: '11px', padding: '2px 8px',
                        background: 'rgba(0,255,200,0.08)',
                        border: '1px solid rgba(0,255,200,0.15)',
                        borderRadius: '20px', color: '#00ffc8'
                    }}>
                        {messages.length}
                    </span>
                </div>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 size={24} style={{ color: '#00ffc8', animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="neon-card" style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="corner corner-tl" /><div className="corner corner-tr" />
                        <div className="corner corner-bl" /><div className="corner corner-br" />
                        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '14px', letterSpacing: '1px' }}>NO MESSAGES YET</p>
                        <p style={{ color: 'rgba(255,255,255,0.1)', fontSize: '12px', marginTop: '8px' }}>
                            Share your profile link to receive anonymous messages
                        </p>
                    </div>
                ) : (
                    <div className="msg-grid">
                        {messages.map((message: any) => (
                            <div key={message._id} className="neon-card">
                                <div className="corner corner-tl" /><div className="corner corner-tr" />
                                <div className="corner corner-bl" /><div className="corner corner-br" />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', lineHeight: 1.6, flex: 1 }}>
                                        {message.content}
                                    </p>
                                    <button className="delete-btn" onClick={() => handleDeleteMessage(message._id)}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                                <p style={{ fontSize: '11px', color: 'rgba(0,255,200,0.3)', marginTop: '10px', letterSpacing: '0.5px' }}>
                                    {new Date(message.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default UserDashboard;