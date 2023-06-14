import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseIdToNumber } from 'src/common/utils';
import { DepartmentAddOrUpdateDto } from 'src/dto/department/addOrUpdate.dto';
import { GetListDto } from 'src/dto/getList.dto';
import { Department } from 'src/entities/department.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository:Repository<Department>,
    ){}

    async getList(query:GetListDto):Promise<any>{
        let result = await this.departmentRepository
        .createQueryBuilder("department")
        .orderBy("department.id","ASC")
        .skip(query.pageSize * (query.pageNum - 1))
        .take(query.pageSize)
        .getMany();
        let count = await this.departmentRepository.count();

        return [result,count]
    }

    async delete(id:number){
        parseIdToNumber(id);
        let depart = await this.departmentRepository.findOne({
            where:{id}
        });
        if(!depart){
           throw new HttpException("该部门不存在",202);
        }

        await this.departmentRepository.remove(depart);
        return "删除成功"
    }

    async saveOrUpdate(body:DepartmentAddOrUpdateDto){
        let newDepartment = new Department();
        newDepartment.name = body.name;
        newDepartment.sn = body.sn;
        parseIdToNumber(body.id);
        // 更新
        if(body.id){
            newDepartment.id = body.id;
            await this.departmentRepository.save(newDepartment);
            return "更新成功"
        }else{
            let result = await this.departmentRepository.save(newDepartment);
            return "添加成功"
        }
    }

    async findOne(id:number){
        parseIdToNumber(id);
        let result = await this.departmentRepository.findOne({
            where:{id}
        });
        return result;
    }
}
