import { Contains, IsEmail, IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator"
import { verify } from "crypto"

export class CreateUserDTO {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @Matches(/[A-Z]/, { message: 'Password harus mengandung minimal satu huruf besar' })
    password: string

    @IsNotEmpty()
    @IsEmail()
    email: string
    
}

export class LoginUserDTO {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    password: string

    @IsNotEmpty()
    @IsEmail()
    email: string
    
}

export class emailDTO {
    @IsEmail()
    email: string
}

export class verifyTokenDTO {
    @IsNotEmpty({ message: 'Token Tidak Boleh Kosong' })
    @IsString()
    token: string
}

