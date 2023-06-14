import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PermissionAddOrUpdateDto{
    @IsNumber({},{message:"id必须是一个数字"})
    @ApiProperty({
        type:Number,
        example:1,
        description:"修改权限信息的时候传递的参数"
    })
    id?:number;

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的权限名称",
        description:"添加或修改的权限名称"
    })
    name:string

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的权限描述",
        description:"添加或修改的权限描述"
    })
    expression:string
}