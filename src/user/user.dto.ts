import { Contains, IsEmail, IsNotEmpty, Matches, Min } from "class-validator"

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