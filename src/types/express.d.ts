import { Request } from 'express';

declare module 'express' {
    export interface Request {
        user?: {
            id;
            role: string;
            username: string;
            email: string;
        };
    }
}