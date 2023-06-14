import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionService } from "src/feature/permission/permission.service";
import { setPermissionExpression } from "../decorators/required_permission.decorator";

// 将所有设置了权限装饰器的 路由全部收集起来，存储权限表中
@Injectable()
export class RequiredPermissionAuard implements CanActivate{
    constructor(
        private reflector:Reflector,
        private readonly permissionService:PermissionService
    ){}

    // 全局守卫，所有请求都会走一遍 设置了装饰器 才拦截 不设置的不管他
    async canActivate(context: ExecutionContext):Promise<any>{
        const setPermissionObj = this.reflector.get(setPermissionExpression,context.getHandler())
        if(setPermissionObj){
            const {name,expression} = setPermissionObj;
            // console.log(name,expression);
            // 这里有个重复加载的问题

            let findPermission = await this.permissionService.findOneByName(name);
            if(findPermission){
                // console.log("auth:存在就放行");
                return true;
            }else{
                let result = await this.permissionService.load({name,expression});
                // console.log(result,"auth:不存在就添加");
            }
        }
        return true
    }
}