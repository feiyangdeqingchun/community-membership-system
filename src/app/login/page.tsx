"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogIn, User, Lock, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        console.log('[LOGIN] Starting login with username:', username);
        try {
            const success = await login(username, password);
            console.log('[LOGIN] Login function returned:', success);
            console.log('[LOGIN] Current username:', username);

            if (success) {
                console.log('[LOGIN] Login successful, checking username for redirect...');
                if (username === "admin") {
                    console.log('[LOGIN] Redirecting to /admin');
                    router.push("/admin");
                } else {
                    console.log('[LOGIN] Redirecting to /');
                    router.push("/");
                }
            } else {
                console.log('[LOGIN] Login failed, showing error');
                setError("账号或密码错误");
            }
        } catch (err) {
            console.error('[LOGIN] Exception caught:', err);
            setError("登录失败，请稍后重试");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-white to-primary/5">
            <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-4 rounded-3xl bg-primary text-white mb-4 shadow-xl shadow-primary/30 active-scale transition-transform duration-500 hover:rotate-12">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">会员中心</h1>
                    <p className="text-muted-foreground">欢迎使用社群专属管理系统</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="账号"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 group-focus-within:border-primary transition-all text-base"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                placeholder="密码"
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-border focus:outline-none focus:ring-4 focus:ring-primary/10 group-focus-within:border-primary transition-all text-base"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm font-medium text-destructive bg-destructive/5 p-3 rounded-lg text-center animate-shake">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg hover-scale active-scale shadow-xl shadow-primary/20 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                        登录
                    </button>
                </form>

                <div className="pt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        还不是会员？请联系管理员录入身份
                    </p>
                </div>
            </div>
        </div>
    );
}
