import { Response } from 'express';
export declare class ApiResponse {
    static success(res: Response, data: any, message?: string, statusCode?: number): Response<any, Record<string, any>>;
    static error(res: Response, message?: string, statusCode?: number, errors?: any): Response<any, Record<string, any>>;
    static created(res: Response, data: any, message?: string): Response<any, Record<string, any>>;
    static badRequest(res: Response, message?: string, errors?: any): Response<any, Record<string, any>>;
    static unauthorized(res: Response, message?: string): Response<any, Record<string, any>>;
    static forbidden(res: Response, message?: string): Response<any, Record<string, any>>;
    static notFound(res: Response, message?: string): Response<any, Record<string, any>>;
    static conflict(res: Response, message?: string, errors?: any): Response<any, Record<string, any>>;
}
//# sourceMappingURL=api.response.utility.d.ts.map