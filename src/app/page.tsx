"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Settings,
  MapPin,
  CreditCard,
  Award,
  CircleDashed,
  ChevronRight,
  LogOut
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function HomePage() {
  const auth = useAuth() as any;
  const { currentUser, logout, isLoading } = auth;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push("/login"); // Fixed: redirect to login
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircleDashed className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // 模拟动态二维码内容 (包含用户信息和时间戳)
  const qrValue = JSON.stringify({
    id: currentUser.id,
    name: currentUser.name,
    ts: Date.now()
  });

  return (
    <div className="p-5 space-y-6 pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black">Digital Card</h1>
        <div className="flex gap-2">
          <button
            onClick={() => logout()}
            className="p-2 rounded-full bg-white border border-border hover:bg-red-50 hover:border-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Membership Card */}
      <div className="relative aspect-[1.6/1] w-full card-gradient rounded-3xl p-6 text-white card-shadow overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

        <div className="relative h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-white/70 uppercase tracking-widest">Premium Member</p>
              <h2 className="text-2xl font-bold mt-1">{currentUser.name}</h2>
            </div>
            <Award className="w-8 h-8 text-white/30" />
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-white/60 mb-1 uppercase tracking-tighter">Member ID</p>
                <p className="font-mono text-sm tracking-widest">
                  **** **** {currentUser.id.slice(-4).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/60 mb-1 uppercase tracking-tighter">Current Level</p>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                  {currentUser.level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Points & QR Section */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-border card-shadow flex flex-col items-center justify-center text-center space-y-2 group hover-scale">
          <div className="p-3 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-primary">{currentUser.points}</p>
            <p className="text-xs text-muted-foreground">当前积分</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-border card-shadow flex flex-col items-center justify-center text-center space-y-2 group hover-scale">
          <div className="p-3 rounded-full bg-white border-4 border-dotted border-primary/20">
            <QRCodeSVG value={qrValue} size={48} level="M" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">身份二维码</p>
            <p className="text-[10px] text-muted-foreground">每 60s 刷新</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground px-1">常用功能</h3>
        <div className="space-y-2">
          <Link href="/store/ktv001" className="flex items-center justify-between p-4 bg-white rounded-2xl border border-border hover:border-primary/50 transition-all active-scale group">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-primary/10 transition-colors">
                <MapPin className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="font-medium">模拟到店扫码 (KTV)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>

          <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-border hover:border-primary/50 transition-all active-scale group text-left">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-primary/10 transition-colors">
                <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
              </div>
              <span className="font-medium">修改登录密码</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
