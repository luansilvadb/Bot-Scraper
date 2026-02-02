import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Proxy, Prisma } from '@prisma/client';
import axios from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);

    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ProxyCreateInput): Promise<Proxy> {
        return this.prisma.proxy.create({
            data,
        });
    }

    async findAll(): Promise<Proxy[]> {
        return this.prisma.proxy.findMany();
    }

    async findOne(id: string): Promise<Proxy> {
        const proxy = await this.prisma.proxy.findUnique({
            where: { id },
        });
        if (!proxy) throw new NotFoundException('Proxy not found');
        return proxy;
    }

    async update(id: string, data: Prisma.ProxyUpdateInput): Promise<Proxy> {
        return this.prisma.proxy.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Proxy> {
        return this.prisma.proxy.delete({
            where: { id },
        });
    }

    async checkProxy(id: string): Promise<boolean> {
        const proxy = await this.findOne(id);
        const protocol = proxy.protocol.toLowerCase();
        const proxyUrl = `${protocol}://${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;

        const agent = new HttpsProxyAgent(proxyUrl);

        try {
            this.logger.log(`Checking proxy: ${proxy.host}:${proxy.port}`);
            const response = await axios.get('https://www.amazon.com.br', {
                httpsAgent: agent,
                timeout: 5000,
            });

            const isOnline = response.status === 200;

            await this.prisma.proxy.update({
                where: { id },
                data: {
                    status: isOnline ? 'ONLINE' : 'OFFLINE',
                    lastChecked: new Date(),
                },
            });

            return isOnline;
        } catch (error) {
            this.logger.error(`Proxy check failed for ${proxy.host}:${proxy.port}: ${error.message}`);

            await this.prisma.proxy.update({
                where: { id },
                data: {
                    status: 'OFFLINE',
                    lastChecked: new Date(),
                },
            });

            return false;
        }
    }
}
