import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const beautyBot = await prisma.bot.upsert({
        where: { id: 'beauty-bot-demo' },
        update: {},
        create: {
            id: 'beauty-bot-demo',
            name: 'Beauty Bot',
            targetUrl: 'https://www.amazon.com.br/s?k=beleza',
            affiliateTag: 'demo-tag',
            telegramToken: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
            chatId: '123456789',
            scheduleCron: '0 * * * *',
            status: 'ACTIVE',
        },
    });

    console.log({ beautyBot });
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
