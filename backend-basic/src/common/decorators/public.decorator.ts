import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = 'isPublic';

// token不拦截，而且权限也不拦截
export const Public = ()=>SetMetadata(IS_PUBLIC_KEY,true);