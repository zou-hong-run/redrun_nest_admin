import { RedisService } from "@liaoliaots/nestjs-redis";
import { Injectable } from "@nestjs/common";
@Injectable()
export class RedisCacheService{
    public client;

    constructor(private redisService:RedisService){
        this.getClient()
    }
    async getClient(){
        this.client = await this.redisService.getClient()
    }
    // 设置值
    async set(key:string,value:any,seconds?:number){
        value = JSON.stringify(value);
        if(!this.client){
            await this.getClient();
        }
        if(!seconds){
            await this.client.set(key,value);
        }else{
            await this.client.set(key,value,'EX',seconds)
        }
    }
    // 获取值
    async get(key:string){
        if(!this.client){
            await this.getClient();
        }
        const data:any = await this.client.get(key);
        if(!data){return;}
        return JSON.parse(data)
    }
    // 删除值
    async delete(key:string){
        if(!this.client){
            await this.getClient();
        }
        await this.client.del(key)
    }
}