import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class DepartmentAddOrUpdateDto{
    @IsNumber({},{message:"id必须是一个数字"})
    @ApiProperty({
        type:Number,
        example:1,
        description:"修改部门信息的时候传递的参数"
    })
    id?:number;

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的部门名称",
        description:"添加或修改的部门名称"
    })
    name:string

    @IsNotEmpty()
    @ApiProperty({
        type:String,
        example:"添加或修改的部门描述",
        description:"添加或修改的部门描述"
    })
    sn:string
}