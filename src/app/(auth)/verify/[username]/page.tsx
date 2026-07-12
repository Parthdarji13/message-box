'use client';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { verifySchema } from '@/schemas/verifyschema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: '' },
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });
            toast({ title: 'Success', description: response.data.message });
            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Verification Failed',
                description: axiosError.response?.data.message ?? 'An error occurred.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            .verify-root * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
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
                color: #e0fff8; font-size: 18px;
                letter-spacing: 8px; text-align: center;
                outline: none; transition: all 0.2s;
                font-family: 'Space Grotesk', sans-serif;
            }
            .neon-input::placeholder { color: rgba(0,255,200,0.2); letter-spacing: 4px; font-size: 14px; }
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
        `}</style>

        <div className="verify-root" style={{
            minHeight: '100vh', background: '#060a0d',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', position: 'relative', overflow: 'hidden'
        }}>
            <div className="grid-bg" />
            <div className="scanline" />

            {/* Glow */}
            <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)', top: '-100px', right: '10%', filter: 'blur(40px)', pointerEvents: 'none' }} />

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
                                Verification
                            </span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                            Verify<br />
                            <span style={{ color: '#00ffc8' }}>Account_</span>
                        </h1>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '8px' }}>
                            Enter the 6-digit code sent to your email
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }: any) => (
                                    <FormItem>
                                        <FormLabel style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            Verification Code
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                className="neon-input"
                                                placeholder="• • • • • •"
                                                maxLength={6}
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
                                style={{ opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? (
                                    <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Verifying...</>
                                ) : 'Verify Access'}
                            </button>
                        </form>
                    </Form>
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