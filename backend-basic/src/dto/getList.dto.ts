import { ApiProperty } from "@nestjs/swagger";

export class GetListDto{
    @ApiProperty({
        example:1,
        description:"请求第第几页数据"
    })
    pageNum:number;

    @ApiProperty({
        example:1,
        description:"每页多少条数据"
    })
    pageSize:number
}
