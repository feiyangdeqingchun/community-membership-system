
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// 获取所有用户
export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                username: true,
                points: true,
                is_member: true,
                join_date: true,
                level: true,
                // 不返回 password
            }
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// 创建新用户
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        // 生成简单的用户名和密码
        const count = await prisma.user.count();
        const newId = (count + 100).toString(); // 避免与现有 ID 冲突
        const username = `user${newId}`;
        const password = '123';

        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                password,
                is_member: true,
                level: '普通会员',
                points: 0
            }
        });

        return NextResponse.json(newUser);
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
