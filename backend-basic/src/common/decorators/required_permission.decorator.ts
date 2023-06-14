import { SetMetadata } from "@nestjs/common"

export const setPermissionExpression = "setPermissionExpression"

/**
 * 如果数据库没有权限 就 添加权限
 * @param name 
 * @param expression 
 * @returns 
 */
export const RequiredPermission = (setPermissionObj:{name:string,expression:string})=>{
    return SetMetadata(setPermissionExpression,setPermissionObj);
}