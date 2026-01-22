
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+ params is a Promise
) {
    try {
        // await params in case it's a promise (Next.js 15 behavior, good practice for 16)
        const { id } = await params;
        const body = await request.json();
        const { points } = body;

        if (typeof points !== 'number') {
            return NextResponse.json({ error: 'Invalid points value' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                points: user.points + points
            },
            select: {
                id: true,
                name: true,
                username: true,
                points: true,
                is_member: true,
                join_date: true,
                level: true
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Update points error:', error);
        return NextResponse.json({ error: 'Failed to update points' }, { status: 500 });
    }
}
