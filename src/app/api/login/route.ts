
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: '用户名和密码不能为空' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                username,
                password // 注意：生产环境应使用 hash 比对
            }
        });

        if (!user) {
            return NextResponse.json({ error: '账号或密码错误' }, { status: 401 });
        }

        // 返回不包含密码的用户信息
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(userWithoutPassword);

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: '登录服务异常' }, { status: 500 });
    }
}
