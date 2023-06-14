import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthLoginDto } from 'src/dto/auth/login.dto';
import { Employee } from 'src/entities/employee.entity';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags("auth授权相关的接口")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary:"获取验证码接口",
  })
  @Get("code")
  @Public()
  async getList(){
    let result = await this.authService.code();
    return result;
  }

  @Public()
  @ApiOperation({
    summary:"登录接口",
  })
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Request() req,@Body() body:AuthLoginDto){
    let result = await this.authService.login(body,req.user);
    return result;
  }

  
  @ApiOperation({
    summary:"退出登录接口",
  })
  @ApiBearerAuth()
  @Post("logout")
  async logout(@Req() req:any){
    let employee = req.user as Employee|null;
    if(employee){
      let employeeId = employee.id
      let result = await this.authService.logout(employeeId);
      return result;
    }
    return "你尚未登录！！！"
  }
}
