import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtConstants } from "./constant";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            // 提供从请求中提取 JWT 的方法。我们将使用在 API 请求的授权头中提供token的标准方法。这里描述了其他选项。
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // 这意味着，如果我们的路由提供了一个过期的 JWT ，请求将被拒绝，并发送 401 Unauthorized 的响应。
            ignoreExpiration: false,
            // 解码用
            secretOrKey: jwtConstants.secret,
        })
    }
    async validate(payload:any){
        return {
            id:payload.id,
            username:payload.username,
            admin:payload.admin
        }
    }
}