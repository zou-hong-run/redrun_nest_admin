import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { parseColumnToNumber, parseIdToNumber } from 'src/common/utils';
import { EmployeeAddOrUpdateDto } from 'src/dto/employee/addOrUpdate.dto';
import { GetListDto } from 'src/dto/getList.dto';
import { Employee } from 'src/entities/employee.entity';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private readonly employeeRepository:Repository<Employee>,
        @InjectRepository(Role)
        private readonly roleRepository:Repository<Role>
    ){}


    async getList(query:GetListDto):Promise<any>{
        let result = await this.employeeRepository
        .createQueryBuilder("employee")
        .leftJoinAndSelect("employee.department","department")
        .leftJoinAndSelect("employee.roles","roles")
        .orderBy("employee.id","ASC")
        .skip(query.pageSize * (query.pageNum - 1))
        .take(query.pageSize)
        .getMany();
        let count = await this.employeeRepository.count();

        return [result,count]
    }

    async delete(id:number){
        parseIdToNumber(id);
        let depart = await this.employeeRepository.findOne({
            where:{id}
        });
        if(!depart){
           throw new HttpException("该用户不存在",202);
        }

        await this.employeeRepository.remove(depart);
        return "删除成功"
    }

    async saveOrUpdate(body:EmployeeAddOrUpdateDto){
        // 用户角色 解析出来
        let {roleIds,...partsBody} = body;
        let roles:Role[] = [];
        for(const roleId of roleIds){
            let oneRole = await this.roleRepository.findOne({
                where:{id:roleId as any}
            })
            roles.push(oneRole)
        }


        let newEmployee = new Employee();
        // 将角色绑定到用户身上
        newEmployee.roles = roles;
        body.id = parseColumnToNumber("id",partsBody.id);
        body.age = parseColumnToNumber("age",partsBody.age);
        body.admin = parseColumnToNumber("admin",partsBody.admin);
        Object.assign(newEmployee,partsBody);
        // 更新
        if(body.id){
            newEmployee.id = body.id;
            await this.employeeRepository.save(newEmployee);
            return "更新成功"
        }else{
            let result = await this.employeeRepository.save(newEmployee);
            return "添加成功"
        }
    }

    async findOne(id:number){
        parseIdToNumber(id);
        let result = await this.employeeRepository.findOne({
            where:{id},
            relations:["department","roles"]
        });
        return result;
    }

    async updateOneToAdmin(id:number){
        parseIdToNumber(id);
        let employee = await this.employeeRepository.findOne({
            where:{id}
        });
        employee.admin = "1";

        let result = await this.employeeRepository.save(employee);
        return "已经修改为超级管理员了";
    }
}
