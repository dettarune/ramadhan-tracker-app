import { IsNotEmpty, IsOptional, IsNumber, Min, IsString, IsUrl } from 'class-validator';

export class CreateProductDTO {

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0) 
    price: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0) 
    stock: number;

    @IsOptional()
    @IsUrl()
    image?: string;

}

export class updateProductDTO {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0) 
    price?: number;

    @IsOptional()
    @IsNumber()
    @Min(0) 
    stock?: number;

    @IsOptional()
    @IsUrl()
    image?: string;

}