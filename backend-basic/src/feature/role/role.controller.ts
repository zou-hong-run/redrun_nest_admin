import { Body, Controller, Delete, Get, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { RoleService } from "./role.service";
import { GetListDto } from "src/dto/getList.dto";
import { RoleAddOrUpdateDto } from "src/dto/role/addOrUpdate.dto";
import { RequiredPermission } from "src/common/decorators/required_permission.decorator";


@ApiTags("角色相关的接口")
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({
    summary:"获取角色列表",
  })
  @Get("getList")
  @RequiredPermission({name:"角色列表",expression:"role:list"})
  async getList(@Query() query:GetListDto){
    let [result,total] = await this.roleService.getList(query);
    return {
      currentPage:query.pageNum,
      pageSize:query.pageSize,
      totalCount:total,
      data:result
    }
  }


  @ApiOperation({
    summary:"删除角色列表",
  })
  @ApiParam({
    name:"id",
    type:Number,
    description:"要删除角色的id"
  })
  @Delete(":id")
  @RequiredPermission({name:"角色删除",expression:"role:delete"})
  async deleteList(@Param() param:{id:number}){
    let result = await this.roleService.delete(param.id);
    return result;
  }

  @ApiOperation({
    summary:"添加/修改角色列表",
  })
  @Post("saveOrUpdate")
  @RequiredPermission({name:"添加或修改角色列表",expression:"role:saveOrUpdate"})
  async saveOrUpdate(@Body() body:RoleAddOrUpdateDto){
    let result = await this.roleService.saveOrUpdate(body);
    return result;
  }

  @ApiOperation({
    summary:"查找单个角色",
  })
  @Post("findOne/:id")
  @ApiParam({
    name:"id",
    type:Number,
    description:"单个角色的id"
  })
  @RequiredPermission({name:"查询单个角色",expression:"role:findOne"})
  async findOne(@Param() param:{id:number}){

    let result = await this.roleService.findOne(param.id);
    return result;
  }

}
