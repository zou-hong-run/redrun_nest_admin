import { HttpException, Injectable, Request } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { waitForDebugger } from 'inspector';
import { RedisCacheService } from 'src/common/redis/redis.service';
import { LOGIN_INFO_EXPRESSION, LOGIN_INFO_TOKEN, LOGIN_USER_INFO, LOGIN_VERIGY_CODE, USER_LOGIN_EXPIRE_TIME, VERIFY_CODE_EXPIRE_TIME } from 'src/common/redis/redisConstant';
import { AuthLoginDto } from 'src/dto/auth/login.dto';
import { Employee } from 'src/entities/employee.entity';
import { PermissionService } from 'src/feature/permission/permission.service';
import { RoleService } from 'src/feature/role/role.service';
import * as svg_captcha from 'svg-captcha';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';


@Injectable()
export class AuthService {
    constructor(
        private readonly redisCacheService:RedisCacheService,
        @InjectRepository(Employee)
        private readonly employeeRepository:Repository<Employee>,
        private readonly jwtService:JwtService,
        private readonly permissionService:PermissionService,
        private readonly roleService:RoleService,
    ){}

    async code(){
        const captcha = svg_captcha.create({
            size:4,
            fontSize:50,
            width:100,
            height:34,
            noise:1,
            background:"#efefef"
        })
        let uuid = uuidV4();

        // svg
        const data = captcha.data;
        // 验证码文字
        const text = captcha.text;

        console.log(text,"偷偷的看验证码哈哈哈");
        // 存储redis
        await this.redisCacheService.set(LOGIN_VERIGY_CODE+uuid,text,VERIFY_CODE_EXPIRE_TIME);
        
        return {
            uuid,
            data,
        }
    }

    async login(body:AuthLoginDto,user:Employee){
        let employee = user;

        let {code,username,password,uuid} = body;
        // 验证码
        this.check("code",code)
        this.check("username",username)
        this.check("password",password)
        this.check("uuid",uuid)

        // 校验验证码
        let redisCode:string = await this.redisCacheService.get(LOGIN_VERIGY_CODE+uuid);
        if(!redisCode){ throw new HttpException("验证码错误",401)}
        if(redisCode.toLocaleLowerCase() !== code.toLocaleLowerCase()){
            throw new HttpException("验证码错误",401)
        }

        if(!employee){ throw new HttpException("查无此人",202)}
        
        // 设置 jwt token
        const payload = {username:employee.username,id:employee.id,admin:employee.admin};
        let token = this.jwtService.sign(payload);
        

        // 将用户信息存在redis里面 
        await this.redisCacheService
        .set(
            LOGIN_USER_INFO+employee.id,
            JSON.stringify(employee),
            USER_LOGIN_EXPIRE_TIME
        );
        
        // 将token使用redis缓存下来 如果有就覆盖刷新，没有就重新创建
        await this.redisCacheService.set(
            LOGIN_INFO_TOKEN+employee.id,
            token,
            USER_LOGIN_EXPIRE_TIME
        )


        // 将用户权限列表存在redis里面
        let allPermissions = [];
        for(let role of employee.roles){
            let permissions = await this.roleService.findOne(role.id);
            permissions.permissions.forEach(permission=>{
                allPermissions.push(permission.expression)
            })
        }
        await this.redisCacheService.set(
            LOGIN_INFO_EXPRESSION+employee.id,
            JSON.stringify(allPermissions),
            USER_LOGIN_EXPIRE_TIME
        )
        
        return {
            access_token:token
        };
    }

    async logout(id:number){
        // 删除redis中的用户信息
        await this.redisCacheService.delete(LOGIN_USER_INFO+id);

        // 删除redis中用户的权限信息
        await this.redisCacheService.delete(LOGIN_INFO_EXPRESSION+id);
        // 删除redis中的jwt
        await this.redisCacheService.delete(LOGIN_INFO_TOKEN+id);
        
        return "退出成功"
    }

    /**
     * 检索用户并确认密码，这里 密码应该是加密的
     * @param username 
     * @param password 
     * @returns 
     */
    async validateEmployee(username:string,password:string):Promise<any>{
        const employee = await this.employeeRepository.findOne({
            where:{
                username,
                password
            }
        })
        if(employee&&employee.password === password){
            // 将用户密码解析出去，安全
            const {password:pass,...result} = employee;
            return result;
        }
        return null;
    }

    check(name:string,value:string){
        if(!value){
            throw new HttpException("不能为空",204);
            return false
        } 
        return true
    }
}
