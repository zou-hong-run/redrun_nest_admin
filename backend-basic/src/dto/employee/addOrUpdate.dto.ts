import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class EmployeeAddOrUpdateDto{
    @IsNumber({},{message:"id必须是一个数字"})
    @ApiProperty({
        type:Number,
        example:1,
        description:"修改员工信息的时候传递的参数"
    })
    id?:number;

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的员工名称",
        description:"添加或修改的员工名称"
    })
    name:string

    
    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的员工昵称",
        description:"添加或修改的员工昵称"
    })
    username:string

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的员密码",
        description:"添加或修改的员工密码"
    })
    password:string

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的员邮箱",
        description:"添加或修改的员工邮箱"
    })
    email:string

    @IsNotEmpty()
    @ApiProperty({
        type:Number,
        example:"添加或修改的员年龄",
        description:"添加或修改的员工的年龄"
    })
    age:number

    @IsNotEmpty()
    @ApiProperty({
        type:Number,
        example:"0",
        description:"添加或修改的超级管理员权限"
    })
    admin:number

    @IsNotEmpty()
    @ApiProperty({
        type:Number,
        example:"0",
        description:"添加或修改该员工属于的部门"
    })
    departmentId:number

    @IsNotEmpty()
    @ApiProperty({
        example:[1,2,3],
        description:"添加或修改该员工拥有的角色"
    })
    roleIds:number[]


}