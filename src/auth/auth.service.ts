import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';


@Injectable()
export class AuthService {

    generateToken(){
        return randomInt(100000, 999999).toString()
    }

}
