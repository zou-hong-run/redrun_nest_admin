import { Module } from "@nestjs/common";
import { TestController } from "./test.controller";
import { RedisCacheService } from "src/common/redis/redis.service";

@Module({
    imports:[],
    controllers:[
        TestController
    ],
    providers:[
        RedisCacheService
    ],
    exports:[RedisCacheService]
})
export class TestModule{}