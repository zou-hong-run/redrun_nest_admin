import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseColumnToNumber, parseIdToNumber } from 'src/common/utils';
import { RoleAddOrUpdateDto } from 'src/dto/role/addOrUpdate.dto';


import { GetListDto } from 'src/dto/getList.dto';
import { Permission } from 'src/entities/permisson.entity';
import { Role } from 'src/entities/role.entity';

import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository:Repository<Role>,
        @InjectRepository(Permission)
        private readonly permissionRepository:Repository<Permission>
    ){}


    async getList(query:GetListDto):Promise<any>{
        let result = await this.roleRepository
        .createQueryBuilder("role")
        .leftJoinAndSelect("role.permissions","permissions")
        .orderBy("role.id","ASC")
        .skip(query.pageSize * (query.pageNum - 1))
        .take(query.pageSize)
        .getMany();
        let count = await this.roleRepository.count();

        return [result,count]
    }

    async delete(id:number){
        parseIdToNumber(id);
        let depart = await this.roleRepository.findOne({
            where:{id}
        });
        if(!depart){
           throw new HttpException("该角色不存在",202);
        }

        await this.roleRepository.remove(depart);
        return "删除成功"
    }

    async saveOrUpdate(body:RoleAddOrUpdateDto){
        // 用户角色 解析出来
        let {permissionIds,...partsBody} = body;
        let allPermissoins:Permission[] = [];
        for(const permissonId of permissionIds){
            let onePermisson = await this.permissionRepository.findOne({
                where:{id:permissonId as any}
            })
            allPermissoins.push(onePermisson)
        }


        let newRole = new Role();
        // 将角色绑定到角色身上
        newRole.permissions = allPermissoins;
        body.id = parseColumnToNumber("id",partsBody.id);
        Object.assign(newRole,partsBody);
        // 更新
        if(body.id){
            newRole.id = body.id;
            let result = await this.roleRepository.save(newRole);
            return "更新成功"
        }else{
            let result = await this.roleRepository.save(newRole);
            return "添加成功"
        }
    }

    async findOne(id:number){
        parseIdToNumber(id);
        let result = await this.roleRepository.findOne({
            where:{id},
            relations:["permissions"]
        });
        return result;
    }
}
