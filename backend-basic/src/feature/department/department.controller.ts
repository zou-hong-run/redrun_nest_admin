import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProperty, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetListDto } from 'src/dto/getList.dto';
import { DepartmentAddOrUpdateDto } from 'src/dto/department/addOrUpdate.dto';
import { RequiredPermission } from 'src/common/decorators/required_permission.decorator';

@ApiTags("部门相关的接口")
@Controller('department')
@ApiBearerAuth()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiOperation({
    summary:"获取部门列表",
  })
  @Get("getList")
  @RequiredPermission({name:"部门列表",expression:"department:list"})
  async getList(@Query() query:GetListDto){
    let [result,total] = await this.departmentService.getList(query);
    return {
      currentPage:query.pageNum,
      pageSize:query.pageSize,
      totalCount:total,
      data:result
    }
  }

  @ApiOperation({
    summary:"删除部门列表",
  })
  @ApiParam({
    name:"id",
    type:Number,
    description:"要删除部门的id"
  })
  @Delete(":id")
  @RequiredPermission({name:"部门删除",expression:"department:delete"})
  async deleteList(@Param() param:{id:number}){
    let result = await this.departmentService.delete(param.id);
    return result;
  }

  @ApiOperation({
    summary:"添加/修改部门列表",
  })
  @Post("saveOrUpdate")
  @RequiredPermission({name:"部门添加或修改",expression:"department:saveOrUpdate"})
  async saveOrUpdate(@Body() body:DepartmentAddOrUpdateDto){
    let result = await this.departmentService.saveOrUpdate(body);
    return result;
  }

  @ApiOperation({
    summary:"查找单个部门",
  })
  @Post("findOne/:id")
  @ApiParam({
    name:"id",
    type:Number,
    description:"单个部门的id"
  })
  @RequiredPermission({name:"查询单个部门",expression:"department:findOne"})
  async findOne(@Param() param:{id:number},@Request() req){
    console.log("=============findoned token params",req.user);
    let result = await this.departmentService.findOne(param.id);
    return result;
  }

}
