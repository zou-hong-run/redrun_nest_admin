import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService:AuthService){
        super()
    }

    async validate(username:string,password:string):Promise<any>{
        const user = await this.authService.validateEmployee(username,password);
        if(!user){
            throw new UnauthorizedException();
        }
        // console.log("local校验成功，挂载成功","user!!!!");
        return user;
    }
}