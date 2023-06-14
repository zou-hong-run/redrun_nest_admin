import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetListDto } from 'src/dto/getList.dto';
import { EmployeeAddOrUpdateDto } from 'src/dto/employee/addOrUpdate.dto';
import { RequiredPermission } from 'src/common/decorators/required_permission.decorator';

@ApiTags("员工相关的接口")
@ApiBearerAuth()
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @ApiOperation({
    summary:"获取员工列表",
  })
  @Get("getList")
  @RequiredPermission({name:"员工列表",expression:"employee:list"})
  async getList(@Query() query:GetListDto){
    let [result,total] = await this.employeeService.getList(query);
    return {
      currentPage:query.pageNum,
      pageSize:query.pageSize,
      totalCount:total,
      data:result
    }
  }


  @ApiOperation({
    summary:"删除员工列表",
  })
  @ApiParam({
    name:"id",
    type:Number,
    description:"要删除员工的id"
  })
  @Delete(":id")
  @RequiredPermission({name:"员工删除",expression:"employee:delete"})
  async deleteList(@Param() param:{id:number}){
    let result = await this.employeeService.delete(param.id);
    return result;
  }

  @ApiOperation({
    summary:"添加/修改员工列表",
  })
  @Post("saveOrUpdate")
  @RequiredPermission({name:"员工添加或修改",expression:"employee:saveOrUpdate"})
  async saveOrUpdate(@Body() body:EmployeeAddOrUpdateDto){
    let result = await this.employeeService.saveOrUpdate(body);
    return result;
  }

  @ApiOperation({
    summary:"查找单个员工",
  })
  @Post("findOne/:id")
  @ApiParam({
    name:"id",
    type:Number,
    description:"单个员工的id"
  })
  @RequiredPermission({name:"查询单个员工",expression:"employee:findOne"})
  async findOne(@Param() param:{id:number}){

    let result = await this.employeeService.findOne(param.id);
    return result;
  }

  @ApiOperation({
    summary:"修改单个员工为超级管理员",
  })
  @Put("updateOneToAdmin/:id")
  @ApiParam({
    name:"id",
    type:Number,
    description:"单个员工的id"
  })
  @RequiredPermission({name:"更改管理员状态",expression:"employee:updateState"})
  async updateOneToAdmin(@Param() param:{id:number}){

    let result = await this.employeeService.updateOneToAdmin(param.id);
    return result;
  }


}
