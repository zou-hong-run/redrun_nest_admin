
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AuthLoginDto{
    @IsString({message:"uuid是一个字符串"})
    @IsNotEmpty()
    @ApiProperty({
        type:Number,
        example:"eageeg45eg46",
        description:"登录时候传递的uuid"
    })
    uuid:string;

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"xiaowang",
        description:"用户名"
    })
    username:string

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"123456",
        description:"密码"
    })
    password:string;

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"123456",
        description:"验证码"
    })
    code:string
}