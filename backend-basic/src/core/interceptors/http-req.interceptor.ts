import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { Observable, map} from 'rxjs'
export interface Repsonse<T>{
    data:T
}

@Injectable()
export class HttpReqTransformInterceptro<T>
    implements NestInterceptor<T,Repsonse<T>>
{
    intercept(context:ExecutionContext,next:CallHandler):Observable<Repsonse<T>>{
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        
        return next
        .handle()
        .pipe(map(data=>{
            return {
                code:200,
                msg:"请求成功",
                status:"success",
                data
            }
        }))
    }

}