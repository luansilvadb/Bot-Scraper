import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [ProxyController],
    providers: [ProxyService, PrismaService, ConfigService],
    exports: [ProxyService],
})
export class ProxyModule { }
