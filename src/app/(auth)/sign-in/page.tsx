'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { signinSchema } from '@/schemas/signinschema';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: { identifier: '', password: '' },
    });

    const onSubmit = async (data: z.infer<typeof signinSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });

            if (result?.error) {
                toast.error(result.error);
            } else {
                router.replace('/dashboard');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            .signin-root * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
            @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
            .grid-bg {
                position: absolute; inset: 0;
                background-image:
                    linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px);
                background-size: 40px 40px;
                pointer-events: none;
            }
            .scanline {
                position: absolute; left: 0; right: 0; height: 2px;
                background: linear-gradient(transparent, rgba(0,255,200,0.06), transparent);
                animation: scanline 4s linear infinite;
                pointer-events: none;
            }
            .neon-input {
                width: 100%; height: 48px;
                background: rgba(0,255,200,0.03);
                border: 1px solid rgba(0,255,200,0.15);
                border-radius: 4px;
                padding: 0 16px;
                color: #e0fff8; font-size: 14px;
                outline: none; transition: all 0.2s;
                font-family: 'Space Grotesk', sans-serif;
                letter-spacing: 0.5px;
            }
            .neon-input::placeholder { color: rgba(0,255,200,0.2); }
            .neon-input:focus {
                border-color: rgba(0,255,200,0.6);
                background: rgba(0,255,200,0.05);
                box-shadow: 0 0 0 1px rgba(0,255,200,0.2), 0 0 20px rgba(0,255,200,0.05);
            }
            .neon-btn {
                width: 100%; height: 50px;
                background: transparent;
                border: 1px solid #00ffc8;
                border-radius: 4px;
                color: #00ffc8; font-size: 14px; font-weight: 600;
                letter-spacing: 2px; text-transform: uppercase;
                cursor: pointer; position: relative; overflow: hidden;
                transition: all 0.3s;
                font-family: 'Space Grotesk', sans-serif;
                display: flex; align-items: center; justify-content: center; gap: 8px;
            }
            .neon-btn:hover {
                box-shadow: 0 0 20px rgba(0,255,200,0.3);
                background: rgba(0,255,200,0.05);
                color: #fff;
            }
            .neon-btn:active { transform: scale(0.98); }
            .corner { position: absolute; width: 12px; height: 12px; }
            .corner-tl { top: -1px; left: -1px; border-top: 2px solid #00ffc8; border-left: 2px solid #00ffc8; }
            .corner-tr { top: -1px; right: -1px; border-top: 2px solid #00ffc8; border-right: 2px solid #00ffc8; }
            .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid #00ffc8; border-left: 2px solid #00ffc8; }
            .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid #00ffc8; border-right: 2px solid #00ffc8; }
            .signup-link { color: rgba(0,255,200,0.5); text-decoration: none; font-size: 13px; letter-spacing: 0.5px; transition: color 0.2s; border-bottom: 1px solid rgba(0,255,200,0.2); padding-bottom: 1px; }
            .signup-link:hover { color: #00ffc8; border-bottom-color: #00ffc8; }
        `}</style>

        <div className="signin-root" style={{
            minHeight: '100vh', background: '#060a0d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', position: 'relative', overflow: 'hidden'
        }}>
            <div className="grid-bg" />
            <div className="scanline" />

            {/* Glow orbs */}
            <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)', top: '-100px', right: '10%', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,0,255,0.1), transparent 70%)', bottom: '10%', left: '5%', filter: 'blur(40px)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 10 }}>
                <div style={{
                    background: 'rgba(6,15,20,0.95)',
                    border: '1px solid rgba(0,255,200,0.12)',
                    borderRadius: '6px', padding: '2.5rem 2rem',
                    position: 'relative',
                }}>
                    <div className="corner corner-tl" />
                    <div className="corner corner-tr" />
                    <div className="corner corner-bl" />
                    <div className="corner corner-br" />

                    {/* Header */}
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ffc8', boxShadow: '0 0 10px #00ffc8', animation: 'blink 2s ease-in-out infinite' }} />
                            <span style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                                System Access
                            </span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                            Welcome<br />
                            <span style={{ color: '#00ffc8' }}>Back_</span>
                        </h1>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                            Sign in to your account
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Identifier */}
                            <FormField
                                name="identifier"
                                control={form.control}
                                render={({ field }: any) => (
                                    <FormItem>
                                        <FormLabel style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            Email or Username
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                className="neon-input"
                                                placeholder="email or username"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage style={{ fontSize: '11px', color: '#ff4466' }} />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }: any) => (
                                    <FormItem>
                                        <FormLabel style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                className="neon-input"
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage style={{ fontSize: '11px', color: '#ff4466' }} />
                                    </FormItem>
                                )}
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="neon-btn"
                                style={{ marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Authenticating...</>
                                ) : 'Access System'}
                            </button>
                        </form>
                    </Form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '1.5rem 0 1rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,200,0.08)' }} />
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(0,255,200,0.08)' }} />
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
                        No account?{' '}
                        <Link href="/sign-up" className="signup-link">
                            Create one
                        </Link>
                    </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0' }}>
                    <span style={{ fontSize: '10px', color: 'rgba(0,255,200,0.2)', letterSpacing: '1px' }}>MSG-BOX v1.0</span>
                    <span style={{ fontSize: '10px', color: 'rgba(0,255,200,0.2)', letterSpacing: '1px' }}>SECURE CONNECTION</span>
                </div>
            </div>
        </div>
        </>
    );
}