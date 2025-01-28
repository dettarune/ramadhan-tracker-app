import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateProductDTO, updateProductDTO } from './DTO/products.dto';

@Injectable()
export class ProductsService {

    constructor( 
            private prismaServ: PrismaService,
            private redisService: RedisService,
            private jwtService: JwtService
        ){}

        async addProduct(reqProduct: CreateProductDTO, user: any): Promise<any> {
            try {
                return await this.prismaServ.products.create({
                    data: {
                        ...reqProduct, 
                        userId: user, 
                        created_at: new Date(),   
                    }
                });
            } catch (error) {
                console.log(error.message);
            }
        }

        async updateProduct(reqProduct: updateProductDTO, id: number): Promise<any> {
            try {

                return await this.prismaServ.products.update({
                    where: {id: id},
                    data: {
                        ...reqProduct,
                        updated_at: new Date()
                    }
                });
            } catch (error) {
                console.log(error.message);
            }
        }
        
        async delProduct(id:number): Promise<any> {
            try {
                return await this.prismaServ.products.delete({
                    where: {id}
                })
            } catch (error) {
                console.log(error.message);
            }
        }

}
