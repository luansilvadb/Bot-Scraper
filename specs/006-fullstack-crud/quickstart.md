# Quickstart: CRUD Completo Fullstack

**Feature**: 006-fullstack-crud
**Date**: 2026-02-01

Este guia fornece instruções rápidas para desenvolvedores que vão implementar esta feature.

---

## Prerequisites

Antes de começar, certifique-se de que o ambiente está configurado:

```bash
# Backend (em terminal 1)
cd backend
npm install
npx prisma generate
npm run start:dev

# Frontend (em terminal 2)
cd frontend
npm install
npm run dev
```

**Serviços necessários**:
- PostgreSQL rodando localmente
- Redis rodando localmente (para BullMQ)

---

## Backend: Padrão de Módulo CRUD

### Estrutura de Arquivos

Cada entidade deve seguir esta estrutura:

```
src/modules/<entity>/
├── dto/
│   ├── create-<entity>.dto.ts
│   ├── update-<entity>.dto.ts
│   └── query-<entity>.dto.ts
├── <entity>.controller.ts
├── <entity>.service.ts
└── <entity>.module.ts
```

### Padrão de DTO com Validação

```typescript
// src/modules/bots/dto/create-bot.dto.ts
import { IsString, IsNotEmpty, IsUrl, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { BotStatus } from '@prisma/client';

export class CreateBotDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  targetUrl: string;

  @IsString()
  @IsNotEmpty()
  affiliateTag: string;

  @IsString()
  @IsNotEmpty()
  telegramToken: string;

  @IsString()
  @IsNotEmpty()
  chatId: string;

  @IsString()
  @IsNotEmpty()
  scheduleCron: string;

  @IsOptional()
  @IsEnum(BotStatus)
  status?: BotStatus;

  @IsOptional()
  @IsUUID()
  proxyId?: string;
}
```

### Padrão de Controller

```typescript
// src/modules/bots/bots.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BotsService } from './bots.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { QueryBotDto } from './dto/query-bot.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('bots')
@UseGuards(AuthGuard)
export class BotsController {
  constructor(private readonly botsService: BotsService) {}

  @Post()
  create(@Body() createBotDto: CreateBotDto) {
    return this.botsService.create(createBotDto);
  }

  @Get()
  findAll(@Query() query: QueryBotDto) {
    return this.botsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBotDto: UpdateBotDto) {
    return this.botsService.update(id, updateBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botsService.remove(id);
  }
}
```

### Padrão de Service com Paginação

```typescript
// src/modules/bots/bots.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBotDto } from './dto/create-bot.dto';
import { QueryBotDto } from './dto/query-bot.dto';

@Injectable()
export class BotsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryBotDto) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { status }),
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.bot.findMany({
        where,
        skip,
        take: limit,
        include: { proxy: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.bot.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const item = await this.prisma.bot.findUnique({
      where: { id },
      include: { proxy: true },
    });
    if (!item) throw new NotFoundException('Bot not found');
    return item;
  }

  // ... create, update, remove methods
}
```

---

## Frontend: Padrão de Feature CRUD

### Estrutura de Arquivos

```
src/features/<entity>/
├── <Entity>List.tsx      # Página principal com tabela
├── <Entity>Form.tsx      # Formulário reutilizável
├── Create<Entity>Modal.tsx
├── Edit<Entity>Modal.tsx
└── api.ts                # Hooks react-query
```

### Padrão de API Hooks

```typescript
// src/features/bots/api.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

interface Bot {
  id: string;
  name: string;
  // ... outros campos
}

interface QueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

// List
export function useBots(params?: QueryParams) {
  return useQuery({
    queryKey: ['bots', params],
    queryFn: async () => {
      const { data } = await api.get('/bots', { params });
      return data;
    },
  });
}

// Get one
export function useBot(id: string) {
  return useQuery({
    queryKey: ['bots', id],
    queryFn: async () => {
      const { data } = await api.get(`/bots/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// Create
export function useCreateBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBot: Partial<Bot>) => {
      const { data } = await api.post('/bots', newBot);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
    },
  });
}

// Update
export function useUpdateBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Bot> & { id: string }) => {
      const { data: result } = await api.patch(`/bots/${id}`, data);
      return result;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
      queryClient.invalidateQueries({ queryKey: ['bots', id] });
    },
  });
}

// Delete
export function useDeleteBot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/bots/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bots'] });
    },
  });
}
```

### Padrão de Lista com Tabela

```tsx
// src/features/bots/BotList.tsx
import { useState } from 'react';
import { 
  Table, TableHeader, TableRow, TableCell, TableBody,
  Button, Input, Spinner 
} from '@fluentui/react-components';
import { useBots, useDeleteBot } from './api';

export function BotList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  
  const { data, isLoading, error } = useBots({ page, search });
  const deleteMutation = useDeleteBot();

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Input 
        placeholder="Search bots..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data.map((bot) => (
            <TableRow key={bot.id}>
              <TableCell>{bot.name}</TableCell>
              <TableCell>{bot.targetUrl}</TableCell>
              <TableCell>{bot.status}</TableCell>
              <TableCell>
                <Button onClick={() => openEditModal(bot.id)}>Edit</Button>
                <Button 
                  appearance="secondary"
                  onClick={() => confirmDelete(bot.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Pagination */}
      <div>
        Page {data?.meta.page} of {data?.meta.totalPages}
        <Button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
        <Button disabled={page >= data?.meta.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    </div>
  );
}
```

---

## Testing Quick Reference

### Backend Unit Test

```typescript
// src/modules/bots/bots.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BotsService } from './bots.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('BotsService', () => {
  let service: BotsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,
        {
          provide: PrismaService,
          useValue: {
            bot: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<BotsService>(BotsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should return paginated results', async () => {
    const mockBots = [{ id: '1', name: 'Test Bot' }];
    jest.spyOn(prisma.bot, 'findMany').mockResolvedValue(mockBots);
    jest.spyOn(prisma.bot, 'count').mockResolvedValue(1);

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.data).toEqual(mockBots);
    expect(result.meta.total).toBe(1);
  });
});
```

### Backend E2E Test

```typescript
// test/bots.e2e-spec.ts
process.env.SKIP_TELEGRAM = 'true';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('Bots (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    const configService = app.get(ConfigService);
    adminToken = `Bearer ${configService.get('ADMIN_PASSWORD')}`;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/bots (GET)', () => {
    return request(app.getHttpServer())
      .get('/bots')
      .set('Authorization', adminToken)
      .expect(200)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('data');
      });
  });
});
```

---

## Common Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Run migrations
npx prisma migrate dev

# Run backend tests
npm run test
npm run test:e2e

# Run frontend dev server
npm run dev

# Lint and format
npm run lint
npm run format
```
