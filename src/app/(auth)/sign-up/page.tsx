"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupschema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function SignUpPage() {
    const [username, setUsername] = useState('')
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debounced = useDebounceCallback(setUsername, 300)
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: { username: '', email: '', password: '' }
    })

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true)
                setUsernameMessage('')
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique()
    }, [username])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast.success(response.data.message)
            router.replace(`/verify/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
            .signup-root * { font-family: 'Space Grotesk', sans-serif; box-sizing: border-box; }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
            @keyframes scanline { 0% { top: -10%; } 100% { top: 110%; } }
            @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
            .neon-input {
                width: 100%;
                height: 48px;
                background: rgba(0,255,200,0.03);
                border: 1px solid rgba(0,255,200,0.15);
                border-radius: 4px;
                padding: 0 44px 0 16px;
                color: #e0fff8;
                font-size: 14px;
                outline: none;
                transition: all 0.2s;
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
                width: 100%;
                height: 50px;
                background: transparent;
                border: 1px solid #00ffc8;
                border-radius: 4px;
                color: #00ffc8;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 2px;
                text-transform: uppercase;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: all 0.3s;
                font-family: 'Space Grotesk', sans-serif;
            }
            .neon-btn::before {
                content: '';
                position: absolute;
                inset: 0;
                background: rgba(0,255,200,0);
                transition: background 0.3s;
            }
            .neon-btn:hover::before { background: rgba(0,255,200,0.08); }
            .neon-btn:hover {
                box-shadow: 0 0 20px rgba(0,255,200,0.3), inset 0 0 20px rgba(0,255,200,0.05);
                color: #fff;
            }
            .neon-btn:active { transform: scale(0.98); }
            .corner { position: absolute; width: 12px; height: 12px; }
            .corner-tl { top: -1px; left: -1px; border-top: 2px solid #00ffc8; border-left: 2px solid #00ffc8; }
            .corner-tr { top: -1px; right: -1px; border-top: 2px solid #00ffc8; border-right: 2px solid #00ffc8; }
            .corner-bl { bottom: -1px; left: -1px; border-bottom: 2px solid #00ffc8; border-left: 2px solid #00ffc8; }
            .corner-br { bottom: -1px; right: -1px; border-bottom: 2px solid #00ffc8; border-right: 2px solid #00ffc8; }
            .grid-bg {
                position: absolute;
                inset: 0;
                background-image:
                    linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px);
                background-size: 40px 40px;
                pointer-events: none;
            }
            .scanline {
                position: absolute;
                left: 0; right: 0;
                height: 2px;
                background: linear-gradient(transparent, rgba(0,255,200,0.06), transparent);
                animation: scanline 4s linear infinite;
                pointer-events: none;
            }
            .signin-link {
                color: rgba(0,255,200,0.5);
                text-decoration: none;
                font-size: 13px;
                letter-spacing: 0.5px;
                transition: color 0.2s;
                border-bottom: 1px solid rgba(0,255,200,0.2);
                padding-bottom: 1px;
            }
            .signin-link:hover { color: #00ffc8; border-bottom-color: #00ffc8; }
        `}</style>

        <div className="signup-root" style={{
            minHeight: '100vh',
            background: '#060a0d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Grid background */}
            <div className="grid-bg" />
            <div className="scanline" />

            {/* Glow orbs */}
            <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,255,200,0.08), transparent 70%)', top: '-100px', right: '10%', filter: 'blur(40px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(120,0,255,0.1), transparent 70%)', bottom: '10%', left: '5%', filter: 'blur(40px)', pointerEvents: 'none' }} />

            {/* Main card */}
            <div style={{
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Card inner */}
                <div style={{
                    background: 'rgba(6,15,20,0.95)',
                    border: '1px solid rgba(0,255,200,0.12)',
                    borderRadius: '6px',
                    padding: '2.5rem 2rem',
                    position: 'relative',
                }}>
                    {/* Corner decorations */}
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
                            Create<br />
                            <span style={{ color: '#00ffc8' }}>Account_</span>
                        </h1>
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '8px', letterSpacing: '0.3px' }}>
                            Anonymous message platform
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Username */}
                            <FormField
                                name="username"
                                control={form.control}
                                render={({ field }: any) => (
                                    <FormItem>
                                        <FormLabel style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <div style={{ position: 'relative' }}>
                                                <input
                                                    className="neon-input"
                                                    placeholder="enter username"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        debounced(e.target.value)
                                                    }}
                                                />
                                                <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                                                    {isCheckingUsername && <Loader2 size={14} style={{ color: '#00ffc8', animation: 'spin 1s linear infinite' }} />}
                                                    {!isCheckingUsername && usernameMessage === "Username is unique" && <CheckCircle size={14} style={{ color: '#00ffc8' }} />}
                                                    {!isCheckingUsername && usernameMessage && usernameMessage !== "Username is unique" && <XCircle size={14} style={{ color: '#ff4466' }} />}
                                                </div>
                                            </div>
                                        </FormControl>
                                        {usernameMessage && (
                                            <p style={{ fontSize: '11px', color: usernameMessage === "Username is unique" ? '#00ffc8' : '#ff4466', letterSpacing: '0.5px' }}>
                                                {usernameMessage}
                                            </p>
                                        )}
                                        <FormMessage style={{ fontSize: '11px', color: '#ff4466' }} />
                                    </FormItem>
                                )}
                            />

                            {/* Email */}
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }: any) => (
                                    <FormItem>
                                        <FormLabel style={{ fontSize: '11px', color: 'rgba(0,255,200,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                className="neon-input"
                                                type="email"
                                                placeholder="you@example.com"
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

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="neon-btn"
                                style={{ marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                        Processing...
                                    </span>
                                ) : 'Initialize Account'}
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
                        Already have access?{' '}
                        <Link href="/sign-in" className="signin-link">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Bottom tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0', }}>
                    <span style={{ fontSize: '10px', color: 'rgba(0,255,200,0.2)', letterSpacing: '1px' }}>MSG-BOX v1.0</span>
                    <span style={{ fontSize: '10px', color: 'rgba(0,255,200,0.2)', letterSpacing: '1px' }}>SECURE CONNECTION</span>
                </div>
            </div>
        </div>
        </>
    )
}