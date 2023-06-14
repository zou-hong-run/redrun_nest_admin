import { ApiProperty } from "@nestjs/swagger";

export class PhotoCreateDto{
    @ApiProperty({
        example:"I and You ❤",
        type:String
    })
    name:string;

    @ApiProperty({
        example:"I am near beautifull girl",
        type:String
    })
    description:string;

    @ApiProperty({
        example:"photo-with-you.jpg",
        type:String
    })
    filename:string

    @ApiProperty({
        example:1,
        type:Number
    })
    views:number

    @ApiProperty({
        example:true,
        type:Boolean
    })
    isPublished:boolean

}