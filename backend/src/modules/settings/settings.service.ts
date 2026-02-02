import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SystemSetting } from '@prisma/client';

@Injectable()
export class SettingsService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<SystemSetting[]> {
        return this.prisma.systemSetting.findMany();
    }

    async findByKey(key: string): Promise<SystemSetting | null> {
        return this.prisma.systemSetting.findUnique({
            where: { key },
        });
    }

    async upsert(key: string, value: string): Promise<SystemSetting> {
        return this.prisma.systemSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }
}
