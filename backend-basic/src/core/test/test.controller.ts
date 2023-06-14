import { Controller, Get, HttpException, Inject } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RedisCacheService } from "src/common/redis/redis.service";

@ApiTags("测试接口")
@Controller("test")
export class TestController{
    constructor(
        @Inject(RedisCacheService)
        private readonly redisCacheSerivce:RedisCacheService,
    ){}

    @ApiOperation({summary:"测试redis"})
    @Get("testRedis")
    async testRedis(){
        let key = "test-redis";
        let value = "123456"
        let result1 = await this.redisCacheSerivce.set(key,value);
        console.log(result1);
        let result2 = await this.redisCacheSerivce.get(key);
        console.log(result2);
        return "ok"
    }

    @ApiOperation({summary:"测试异常"})
    @Get("testException")
    async testException(){
        throw new HttpException("这是一个异常",455)
    }


}
