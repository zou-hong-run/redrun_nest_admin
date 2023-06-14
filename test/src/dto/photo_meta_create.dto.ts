import { ApiProperty } from "@nestjs/swagger";
import { Photo } from "src/entities/photo.entity";

export class PhotoMetaCreateDto{
    @ApiProperty({
        example:64,
        type:Number
    })
    height:number;

    @ApiProperty({
        example:64,
        type:Number
    })
    width:number;

    @ApiProperty({
        example:true,
        type:Boolean
    })
    compressed:boolean;

    @ApiProperty({
        example:"截图",
        type:String
    })
    comment:string;

    @ApiProperty({
        example:"portait",
        type:String
    })
    orientation:string;

}