import { Contains, IsEmail, IsNotEmpty, IsNumber, Matches, Min } from "class-validator"

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
    
    @IsNotEmpty()
    token: string
}

export class recoveryDTO {
    @IsEmail()
    email: string
}