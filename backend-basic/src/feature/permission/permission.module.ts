import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from 'src/entities/permisson.entity';
import { Role } from 'src/entities/role.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Permission,Role])
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports:[PermissionService]
})
export class PermissionModule {}
