import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SystemSetting, Prisma } from '@prisma/client';
import { SettingQueryDto, UpsertSettingDto } from './dto';
import { PaginatedResponseDto } from '../../common/dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    query: SettingQueryDto,
  ): Promise<PaginatedResponseDto<SystemSetting>> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.SystemSettingWhereInput = {};

    if (search) {
      where.key = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.systemSetting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { key: 'asc' },
      }),
      this.prisma.systemSetting.count({ where }),
    ]);

    return new PaginatedResponseDto(data, total, page, limit);
  }

  async findByKey(key: string): Promise<SystemSetting> {
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key },
    });
    if (!setting) {
      throw new NotFoundException(`Setting with key "${key}" not found`);
    }
    return setting;
  }

  async upsert(dto: UpsertSettingDto): Promise<SystemSetting> {
    return this.prisma.systemSetting.upsert({
      where: { key: dto.key },
      update: { value: dto.value },
      create: { key: dto.key, value: dto.value },
    });
  }

  async remove(key: string): Promise<SystemSetting> {
    await this.findByKey(key);
    return this.prisma.systemSetting.delete({
      where: { key },
    });
  }
}
