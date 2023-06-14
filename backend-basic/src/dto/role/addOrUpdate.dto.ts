import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class RoleAddOrUpdateDto{
    @IsNumber({},{message:"id必须是一个数字"})
    @ApiProperty({
        type:Number,
        example:1,
        description:"修改角色信息的时候传递的参数"
    })
    id?:number;

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的角色名称",
        description:"添加或修改的角色名称"
    })
    name:string

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的角色描述",
        description:"添加或修改的角色描述"
    })
    sn:string

    @IsNotEmpty()
    @ApiProperty({
        example:[1,2,3],
        description:"添加或修改的角色拥有的权限"
    })
    permissionIds:number[]

}