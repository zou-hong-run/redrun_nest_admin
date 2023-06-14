import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseIdToNumber } from 'src/common/utils';
import { GetListDto } from 'src/dto/getList.dto';
import { PermissionAddOrUpdateDto } from 'src/dto/permission/addOrUpdate.dto';
import { Permission } from 'src/entities/permisson.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository:Repository<Permission>,
    ){}

    async getList(query:GetListDto):Promise<any>{
        let result = await this.permissionRepository
        .createQueryBuilder("permission")
        .orderBy("permission.id","ASC")
        .skip(query.pageSize * (query.pageNum - 1))
        .take(query.pageSize)
        .getMany();
        let count = await this.permissionRepository.count();

        return [result,count]
    }

    async delete(id:number){
        parseIdToNumber(id);
        let depart = await this.permissionRepository.findOne({
            where:{id}
        });
        if(!depart){
           throw new HttpException("该权限不存在",202);
        }

        await this.permissionRepository.remove(depart);
        return "删除成功"
    }

    async saveOrUpdate(body:PermissionAddOrUpdateDto){
        let newPermission = new Permission();
        newPermission.name = body.name;
        newPermission.expression = body.expression;
        parseIdToNumber(body.id);
        // 更新
        if(body.id){
            newPermission.id = body.id;
            await this.permissionRepository.save(newPermission);
            return "更新成功"
        }else{
            let result = await this.permissionRepository.save(newPermission);
            return "添加成功"
        }
    }

    async findOne(id:number){
        parseIdToNumber(id);
        let result = await this.permissionRepository.findOne({
            where:{id}
        });
        return result;
    }
    async findOneByName(name:string){
        let result = await this.permissionRepository.findOne({
            where:{name:name}
        });
        return result;
    }
    async load(body:PermissionAddOrUpdateDto){
        let result = await this.saveOrUpdate(body);
        return result;
    }


}
