import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Post as PostMethod,
} from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@Controller('proxy')
@UseGuards(AuthGuard)
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @Post()
    create(@Body() createProxyDto: Prisma.ProxyCreateInput) {
        return this.proxyService.create(createProxyDto);
    }

    @Get()
    findAll() {
        return this.proxyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.proxyService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProxyDto: Prisma.ProxyUpdateInput) {
        return this.proxyService.update(id, updateProxyDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.proxyService.remove(id);
    }

    @PostMethod(':id/check')
    check(@Param('id') id: string) {
        return this.proxyService.checkProxy(id);
    }
}
