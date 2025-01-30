import { Request } from 'express';

declare module 'express' {
    export interface Request {
        user?: {
            id;
            username: string;
            email: string;
            role: string;
        };
    }
}