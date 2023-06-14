import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { Department } from 'src/entities/department.entity';
import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permisson.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Employee,Department,Role,Permission])
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService],
  exports:[EmployeeService]
})
export class EmployeeModule {}
