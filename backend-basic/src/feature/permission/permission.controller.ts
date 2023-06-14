import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetListDto } from 'src/dto/getList.dto';
import { PermissionAddOrUpdateDto } from 'src/dto/permission/addOrUpdate.dto';

@ApiTags("权限相关的接口")
@ApiBearerAuth()
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}
  
  @ApiOperation({
    summary:"获取权限列表",
  })
  
  @Get("getList")
  async getList(@Query() query:GetListDto){
    let [result,total] = await this.permissionService.getList(query);
    return {
      currentPage:query.pageNum,
      pageSize:query.pageSize,
      totalCount:total,
      data:result
    }
  }

  @ApiOperation({
    summary:"删除权限列表",
  })
  @ApiParam({
    name:"id",
    type:Number,
    description:"要删除权限的id"
  })
  @Delete(":id")
  async deleteList(@Param() param:{id:number}){
    let result = await this.permissionService.delete(param.id);
    return result;
  }

  @ApiOperation({
    summary:"添加/修改权限列表",
  })
  @Post("saveOrUpdate")
  async saveOrUpdate(@Body() body:PermissionAddOrUpdateDto){
    let result = await this.permissionService.saveOrUpdate(body);
    return result;
  }

  @ApiOperation({
    summary:"查找单个权限",
  })
  @Post("findOne/:id")
  @ApiParam({
    name:"id",
    type:Number,
    description:"单个权限的id"
  })
  async findOne(@Param() param:{id:number}){

    let result = await this.permissionService.findOne(param.id);
    return result;
  }

  @ApiOperation({
    summary:"加载权限，将装饰器中的权限加载到数据库中",
  })
  @Get("load")
  async load(){

    // let result = await this.permissionService.load();
    // return result;
  }

}
