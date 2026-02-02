import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('pending')
    findAllPending() {
        return this.productsService.findAllPending();
    }

    @Post(':id/approve')
    approve(@Param('id') id: string) {
        return this.productsService.approve(id);
    }

    @Post(':id/reject')
    reject(@Param('id') id: string) {
        return this.productsService.reject(id);
    }
}
