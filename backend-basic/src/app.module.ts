import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TestModule } from './core/test/test.module';
import { DepartmentModule } from './feature/department/department.module';
import { EmployeeModule } from './feature/employee/employee.module';
import { RoleModule } from './feature/role/role.module';
import { PermissionModule } from './feature/permission/permission.module';
import { APP_GUARD } from '@nestjs/core';
import { RequiredPermissionAuard } from './common/guards/required_permission.guard';
import { AuthModule } from './core/auth/auth.module';
import { CommonModule } from './common/common.module';
import { JwtAuthGarud } from './common/guards/jwt_auth.guard';
import { JwtService } from '@nestjs/jwt';
import { CheckPermissionAuard } from './common/guards/check_permission.guard';

@Module({
  imports: [
    // 数据库
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'nest_rbac',
      autoLoadEntities:true,
      synchronize: true,
    }),
    // redis
    RedisModule.forRoot({
      config:{
        // url:"redis://:123456@127.0.0.1:6379/1",
        url:"redis://:@127.0.0.1:6379/1",
        onClientCreated(client){
          // client.on('error',(error=>console.log(error.name+"=="+error.message)))
          console.log("redis connected");
        }
      }
        // // @ts-ignore
        // host: 'localhost:6379/0',
        // port: 6379,
        // password: '123456',
        // onClientReady(redis){
        //   console.log("redis is connected!");
        // },
    }),
    CommonModule,
    TestModule,
    AuthModule,
    DepartmentModule,
    EmployeeModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [
    JwtService,
    {
      provide:APP_GUARD,
      useClass:RequiredPermissionAuard
    },
    {
      provide:APP_GUARD,
      useClass:JwtAuthGarud
    },
    {
      provide:APP_GUARD,
      useClass:CheckPermissionAuard
    }
  ],
})
export class AppModule {}
