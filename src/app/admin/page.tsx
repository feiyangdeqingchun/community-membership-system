"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    Users,
    UserPlus,
    TrendingUp,
    ArrowLeft,
    Search,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminDashboard() {
    const { users, addMember } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const actualMembers = (users || []).filter(u => u.is_member);
    const filteredMembers = actualMembers.filter(u =>
        u.name.includes(searchQuery) || u.username.includes(searchQuery)
    );

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            addMember(newName);
            setNewName("");
            setShowAddModal(false);
        }
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-bold">管理后台</h1>
                </div>
                <Link href="/login" className="text-sm text-muted-foreground underline">
                    退出登录
                </Link>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-border card-shadow flex flex-col gap-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-sm font-medium">总会员</span>
                        <Users className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-bold">{actualMembers.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-border card-shadow flex flex-col gap-1">
                    <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-sm font-medium">活跃度</span>
                        <TrendingUp className="w-4 h-4" />
                    </div>
                    <p className="text-2xl font-bold">88%</p>
                </div>
            </div>

            {/* Search & Actions */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="搜索姓名/账号..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="p-2 rounded-xl bg-primary text-white hover:opacity-90 active-scale shadow-lg shadow-primary/20"
                >
                    <UserPlus className="w-6 h-6" />
                </button>
            </div>

            {/* Member List */}
            <div className="space-y-3">
                <h2 className="text-sm font-semibold text-muted-foreground px-1 uppercase tracking-wider">会员列表</h2>
                <div className="space-y-3">
                    {filteredMembers.map(member => (
                        <div
                            key={member.id}
                            className="p-4 rounded-2xl bg-white border border-border hover:border-primary/50 transition-colors flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    {member.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-semibold">{member.name}</h3>
                                    <p className="text-xs text-muted-foreground">账号: {member.username}</p>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-2">
                                <div>
                                    <p className="text-sm font-bold text-primary">{member.points} 积分</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{member.level}会员</p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    ))}

                    {filteredMembers.length === 0 && (
                        <div className="py-12 text-center text-muted-foreground bg-white rounded-2xl border border-dashed border-border">
                            未找到相关会员
                        </div>
                    )}
                </div>
            </div>

            {/* Add Member Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold">新增会员</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 -mr-2 text-muted-foreground hover:text-black"
                            >
                                关闭
                            </button>
                        </div>
                        <form onSubmit={handleAddMember} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">会员姓名</label>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="请输入姓名"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-xs text-primary/80">
                                提示：添加成功后将自动生成用户名，默认密码为 <strong>123</strong>。
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:opacity-90 active-scale shadow-lg shadow-primary/20 mt-4"
                            >
                                确认添加
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
