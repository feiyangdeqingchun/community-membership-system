"use client";

import React, { useState, useEffect, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Upload,
    Camera,
    Loader2,
    CheckCircle2,
    Store,
    Sparkles,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StorePage({ params }: { params: Promise<{ storeId: string }> }) {
    const { storeId } = use(params);
    const { currentUser, merchants, addPoints, isLoading } = useAuth();
    const router = useRouter();

    const [status, setStatus] = useState<"idle" | "uploading" | "ocr" | "success">("idle");
    const [earnedPoints, setEarnedPoints] = useState(0);
    const [merchantName, setMerchantName] = useState("合作商家");

    useEffect(() => {
        if (!isLoading && !currentUser) {
            router.push("/login");
        }
    }, [currentUser, isLoading, router]);

    useEffect(() => {
        const merchant = merchants.find(m => m.id === storeId);
        if (merchant) {
            setMerchantName(merchant.name);
        }
    }, [merchants, storeId]);

    const handleUpload = () => {
        setStatus("uploading");

        // 模拟文件上传进度
        setTimeout(() => {
            setStatus("ocr");

            // 模拟 OCR 识别逻辑
            setTimeout(() => {
                const points = Math.floor(Math.random() * 50) + 10; // 随机 10-60 积分
                setEarnedPoints(points);
                if (currentUser) {
                    addPoints(points);
                }
                setStatus("success");
            }, 2500);
        }, 1500);
    };

    if (isLoading || !currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navbar */}
            <nav className="p-4 flex items-center gap-4 bg-white border-b border-border sticky top-0 z-10">
                <button
                    onClick={() => router.push("/")}
                    className="p-2 rounded-xl border border-border hover:bg-slate-50 active-scale transition-all"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Scanning Store</p>
                    <h1 className="font-bold">{merchantName}</h1>
                </div>
            </nav>

            <div className="p-6">
                <div className="bg-white rounded-3xl p-8 border border-border card-shadow text-center space-y-8 overflow-hidden relative">

                    {status === "idle" && (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                                <div className="relative p-6 rounded-full bg-primary/10 text-primary">
                                    <Store className="w-12 h-12" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">欢迎光临 {merchantName}</h2>
                                <p className="text-muted-foreground px-4">请点击下方按钮上传本次消费小票，核验通过后即可获得积分。</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleUpload}
                                    className="w-full py-5 rounded-2xl bg-primary text-white font-bold text-lg hover-scale active-scale shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
                                >
                                    <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    上传小票领积分
                                </button>
                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-slate-50 py-2 rounded-xl">
                                    <Info className="w-3 h-3" />
                                    <span>单笔消费满 10 元起送积分</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {(status === "uploading" || status === "ocr") && (
                        <div className="py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="relative flex justify-center">
                                <div className="w-24 h-24 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Upload className={cn(
                                        "w-8 h-8 text-primary transition-all duration-500",
                                        status === "uploading" ? "animate-bounce" : "opacity-30 scale-75"
                                    )} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold">
                                    {status === "uploading" ? "正在上传小票..." : "AI 正在识别金额..."}
                                </h3>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full bg-primary transition-all duration-700",
                                            status === "uploading" ? "w-1/2" : "w-full"
                                        )}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">请勿关闭页面，这可能需要几秒钟</p>
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="py-4 space-y-8 animate-in zoom-in duration-500">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-green-200 rounded-full blur-2xl" />
                                <div className="relative p-6 rounded-full bg-green-100 text-green-600">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-2xl font-black">验证成功！</h2>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-2xl border border-primary/10">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <span className="font-bold text-primary">获得 {earnedPoints} 积分</span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    您的当前总积分为: <span className="font-bold text-foreground">{currentUser.points}</span>
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full py-4 rounded-2xl border-2 border-primary text-primary font-bold hover:bg-primary/5 active-scale transition-all"
                                >
                                    回首页
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
