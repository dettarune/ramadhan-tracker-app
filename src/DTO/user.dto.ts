import { Contains, IsEmail, IsNotEmpty, IsNumber, Matches, Min } from "class-validator"

export class CreateUserDTO {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @Min(8,{message: 'Password harus memiliki minimal 8 karakter'})
    @Matches(/[A-Z]/, { message: 'Password harus mengandung minimal satu huruf besar' })
    password: string

    @IsEmail()
    email: string
    
}

export class LoginUserDTO {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    @Min(8,{message: 'Password harus memiliki minimal 8 karakter'})
    @Matches(/[A-Z]/, { message: 'Password harus mengandung minimal satu huruf besar' })
    password: string

    @IsNotEmpty()
    @IsEmail()
    email: string
    
    @IsNotEmpty()
    @IsNumber()
    token: number
}

export class verifyDTO {
    @IsNotEmpty()
    token: string
}