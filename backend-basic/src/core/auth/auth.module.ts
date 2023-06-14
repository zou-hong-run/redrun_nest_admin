import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { RedisCacheService } from 'src/common/redis/redis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { JwtStrategy } from './jwt.strategy';
import { Permission } from 'src/entities/permisson.entity';
import { PermissionModule } from 'src/feature/permission/permission.module';
import { Role } from 'src/entities/role.entity';
import { RoleModule } from 'src/feature/role/role.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Employee,Permission,Role]),
    PassportModule,
    PermissionModule,
    RoleModule,
    JwtModule.register({
      secret:jwtConstants.secret,
      signOptions:{expiresIn:"1800s"}
    })
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    RedisCacheService,
    LocalStrategy,
    JwtStrategy,
  ],
  exports:[AuthService]

})
export class AuthModule {}
