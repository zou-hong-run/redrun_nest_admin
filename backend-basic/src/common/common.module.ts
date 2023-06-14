import { Module } from "@nestjs/common";
import { RedisCacheService } from "./redis/redis.service";

@Module({
    imports:[],
    controllers:[],
    providers:[RedisCacheService],
    exports:[RedisCacheService]
})
export class CommonModule{

}