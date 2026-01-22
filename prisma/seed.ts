import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Check if admin exists
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            id: 'admin',
            name: '管理员',
            username: 'admin',
            password: 'admin',
            is_member: false,
            level: '普通',
            points: 0
        }
    })

    // Create Merchants
    await prisma.merchant.upsert({
        where: { id: 'ktv001' },
        update: {},
        create: {
            id: 'ktv001',
            name: '星光 KTV'
        }
    })

    await prisma.merchant.upsert({
        where: { id: 'coffee002' },
        update: {},
        create: {
            id: 'coffee002',
            name: '街角咖啡'
        }
    })

    // Create Test User (Normal Member)
    await prisma.user.upsert({
        where: { username: 'testuser' },
        update: {},
        create: {
            name: '测试用户',
            username: 'testuser',
            password: '123',
            is_member: true,
            level: '普通会员',
            points: 100
        }
    })

    console.log({ admin })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
