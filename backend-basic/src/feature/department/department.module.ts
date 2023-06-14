import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from 'src/entities/department.entity';
import { Employee } from 'src/entities/employee.entity';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Department,Employee]),
    PermissionModule
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
  exports:[DepartmentService]
})
export class DepartmentModule {}
