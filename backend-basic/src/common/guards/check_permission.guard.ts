import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { RedisCacheService } from "../redis/redis.service";
import { LOGIN_INFO_EXPRESSION } from "../redis/redisConstant";
import { Reflector } from "@nestjs/core";
import { setPermissionExpression } from "../decorators/required_permission.decorator";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";


// 权限拦截
@Injectable()
export class CheckPermissionAuard implements CanActivate{
    constructor(
        private readonly redisCacheService:RedisCacheService,
        private readonly reflector:Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        // 因为jwt策略，所以这里可以拿到东西
        const {username,id,admin} = request;
        const method = request.method;
        const path = request.path?.slice(1);
        // console.log(method,path);

        // 如果@Public修饰的直接放行，不进行权限校验
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[
            context.getHandler(),context.getClass()
        ]);
        if(isPublic)return true;

        
        if(id){
            if(admin){
                console.log("超管来啦！！！");
                return true;
            }

            // 拿到该用户相对应的所有权限列表
            let permissions = await this.redisCacheService.get(LOGIN_INFO_EXPRESSION+id);
            permissions = JSON.parse(permissions);
            console.log(permissions,"当前用户拥有的权限");// ["express","expression"]

            // 如果有路由权限校验，就拿到当前校验的路由，和 用户所有的权限列表对比
            const setPermissionObj = this.reflector.get(setPermissionExpression,context.getHandler());
            if(setPermissionObj){
                const {name,expression} = setPermissionObj;
                // console.log(name,expression);
                if(name&&expression){
                    let result = permissions.find(item=>{
                        return item === expression
                    })
                    // console.log(result);
                    if(result){
                        console.log(expression,":请求，权限通过！ ");
                        return true
                    }else{
                        console.log(expression,":请求，没有权限！");
                        throw new UnauthorizedException();
                    }
                }
            }

            

           
        }

        

     

        // console.log(request.id,request.username,request.admin,"=======");
        
        return true;
    }
    
}