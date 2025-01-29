import { Body, Controller, Delete, HttpException, HttpStatus, Param, Patch, Post, Req, UseFilters, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateProductDTO, updateProductDTO } from './DTO/products.dto';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/guard/user/user.guard';
import { Request } from 'express';
import { HttpExceptionFilter } from 'src/error/error.filters';

@Controller('/api/products')
@UseFilters(HttpExceptionFilter)
export class ProductsController {
    constructor(
        private prismaServ: PrismaService,
        private redisService: RedisService,
        private jwtService: JwtService,
        private productServ: ProductsService
    ) { }


    
    @Post('')
    @UseGuards(AuthGuard)
    async addProduct(@Body() reqProduct: CreateProductDTO, @Req() { user }: Request): Promise<any> {
        try {
        
            const { id } = user;
            const result = await this.productServ.addProduct(reqProduct, parseInt(id))

            return {
                message: `Succes Add Product ${result.name}!`,
                data: result
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    @Patch('/update/:id')
    @UseGuards(AuthGuard)
    async updateProduct(@Body() req: CreateProductDTO, @Param('id') id: number): Promise<any> {
        try {
            const result = await this.productServ.updateProduct(req, id)

            return {
                message: `Succes Update Product ${result.name}`,
                data: result
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    @Delete('/delete/:id')
    @UseGuards(AuthGuard)
    async delProduct(@Param() id: number): Promise<any> {
        try {
            return await this.productServ.delProduct(id)
        } catch (error) {
            console.log(error.message);
        }
    }
}
