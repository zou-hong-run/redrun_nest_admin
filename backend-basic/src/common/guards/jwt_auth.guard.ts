import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Observable } from "rxjs";
import { IS_PUBLIC_KEY } from "src/common/decorators/public.decorator";
import { RedisCacheService } from "src/common/redis/redis.service";
import { LOGIN_INFO_TOKEN } from "src/common/redis/redisConstant";

@Injectable()
export class JwtAuthGarud extends AuthGuard("jwt"){
    constructor(
        private readonly reflector:Reflector,
        private readonly redisCacheService:RedisCacheService,
        private readonly jwtService:JwtService,
    ){
        super()
    }
    async canActivate(context: ExecutionContext): Promise<any> {
        const request = context.switchToHttp().getRequest();

        // 校验token是否过期
        let token = request.headers.authorization?.replace('Bearer ', '');
        if(token){
            let decode = this.jwtService.decode(token);
            let {username,id,admin} = decode as any;
            if(id){
                const isExpire = await this.redisCacheService.get(LOGIN_INFO_TOKEN+id);
                // token已经过期了，校验失败
                if(!isExpire){
                    throw new UnauthorizedException();
                    return false
                }
            }
            // 将username挂载到request身上
            username && (request.username = username)
            // 将id挂载到全局request身上
            id && (request.id = id)
            // 将用户是否超级管理员挂载上
            admin && (request.admin = admin)
        }


        // 使用Public装饰器，不进行token校验
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[
            context.getHandler(),
            context.getClass()
        ])
        if(isPublic){
            return true;
        }
        return super.canActivate(context);
    }
    // handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    //     if(err||!user){
    //         throw err || new UnauthorizedException();
    //     }
    //     return user
    // }
}