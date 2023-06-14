import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhotoCreateDto } from './dto/photo_create.dto';
import { Photo } from './entities/photo.entity';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PhotoMeta } from './entities/photo.meta.entity';
import { PhotoMetaCreateDto } from './dto/photo_meta_create.dto';
import { Album } from './entities/album.entity';
import { Author } from './entities/author.entity';

@ApiTags("测试接口")
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(Photo)
    private photosRepository:Repository<Photo>,
    @InjectRepository(PhotoMeta)
    private photosMetaRepository:Repository<PhotoMeta>,
    @InjectRepository(Author)
    private authorRepository:Repository<Author>,
    @InjectRepository(Album)
    private albumRepository:Repository<Album>
    ) {}

  @Get("hello")
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({summary:"添加photo测试",description:"接口详细描述信息"})
  @ApiBody({
    type:PhotoCreateDto
  })
  @Post()
  async createPhoto(@Body() photo:PhotoCreateDto):Promise<Photo>{

    let newPhoto = new Photo();
    newPhoto.name = photo.name;
    newPhoto.description = photo.description;
    newPhoto.filename = photo.filename;
    newPhoto.views = photo.views;
    newPhoto.isPublished = photo.isPublished;

    let haha = await this.photosRepository.save(newPhoto);
    console.log(haha);
    return haha;
  }

  @Get()
  @ApiOperation({summary:"查询测试接口",description:"接口详细描述信息"})
  async test():Promise<string>{
    let allPhotos = await this.photosRepository.find();
    console.log("allPhotos",allPhotos);
    let firstPhotos = await this.photosRepository.findOne({
      where:{id:1}
    });
    console.log("firstPhotos",firstPhotos);
    let meAndYou = await this.photosRepository.findOne({
      where:{
        name:"I and You ❤"
      }
    })
    console.log("meAndYou",meAndYou);
    let allViewedPhotos = await this.photosRepository.find({
      where:{views:1}
    })
    console.log("allViewedPhotos",allViewedPhotos);
    let [all,count] = await this.photosRepository.findAndCount();
    console.log("findAndCount",all,"===",count);
    
    return "ok"
  }

  @ApiOperation({summary:"删除测试接口",description:"接口详细描述信息"})
  @ApiParam({
    name:"id",
    description:"删除id",
    required:true
  })
  @Delete(":id")
  async delelePhoto(@Param() id:number){
    let photo = await this.photosRepository.findOne({
      where:{id}
    })
    if(!photo) return
    await this.photosRepository.remove(photo);
    console.log("删除成功");
  }

  @ApiOperation({summary:"添加meta关联photo测试",description:"接口详细描述信息"})
  @ApiBody({
    type:PhotoMetaCreateDto
  })
  @Post("addPhotoMeta")
  async createPhotoMeta(@Body() createPhotoMeta:PhotoMetaCreateDto):Promise<any>{

    // 创建 photo
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.isPublished = true;
    photo.views = 1;

    // 创建photometa
    let photoMeta = new PhotoMeta()
    photoMeta.height = createPhotoMeta.height;
    photoMeta.width = createPhotoMeta.width;
    photoMeta.compressed = createPhotoMeta.compressed;
    photoMeta.comment = createPhotoMeta.comment;
    photoMeta.orientation = createPhotoMeta.orientation;
    photoMeta.photo = photo;

    await this.photosRepository.save(photo);
    await this.photosMetaRepository.save(photoMeta);

    console.log("okk");
  }

  @Get("findPhotoMetaLinkPhoto")
  @ApiOperation({summary:"查询findPhotoMetaLinkPhoto接口",description:"接口详细描述信息"})
  async findPhotoMetaLinkPhoto():Promise<any>{
    
    // let result = await this.photosRepository.find({
    //   where:{id:3},
    //   relations:["metadata"]
    // })
    // console.log(result);
    // let result2 = await this.photosMetaRepository.find({
    //   where:{id:1},
    //   relations:["photo"]
    // })
    // console.log(result2);


    // let result = await this.photosRepository
    // .createQueryBuilder("photo")
    // .innerJoinAndSelect("photo.metadata","metadata")
    // .getMany();
    // console.log(result);

    let result = await this.photosRepository.find({
        // 试一试eager
        where:{id:3}
    })
    console.log(result);

  }

  @ApiOperation({summary:"createPhotoMetaCascade测试",description:"接口详细描述信息"})
  @ApiBody({
    type:PhotoMetaCreateDto
  })
  @Post("createPhotoMetaCascade")
  async createPhotoMetaCascade(@Body() createPhotoMeta:PhotoMetaCreateDto):Promise<any>{
    /**
     * 没使用cascade老办法
     *  // 创建 photo
    let photo = new Photo();
    photo.name = "createPhotoMetaCascade";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.isPublished = true;
    photo.views = 1;

    // 创建photometa
    let photoMeta = new PhotoMeta()
    photoMeta.height = createPhotoMeta.height;
    photoMeta.width = createPhotoMeta.width;
    photoMeta.compressed = createPhotoMeta.compressed;
    photoMeta.comment = createPhotoMeta.comment;
    photoMeta.orientation = createPhotoMeta.orientation;
    photoMeta.photo = photo;

    await this.photosRepository.save(photo);
    await this.photosMetaRepository.save(photoMeta);
     */

    // 创建photo，然后一并将关联他的meta也更新了

    let photo = new Photo();
    photo.name = "createPhotoMetaCascade";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.isPublished = true;
    photo.views = 1;

    let photoMeta = new PhotoMeta()
    photoMeta.height = createPhotoMeta.height;
    photoMeta.width = createPhotoMeta.width;
    photoMeta.compressed = createPhotoMeta.compressed;
    photoMeta.comment = createPhotoMeta.comment;
    photoMeta.orientation = createPhotoMeta.orientation;


    photo.metadata = photoMeta;

    await this.photosRepository.save(photo);

    // 另一种错误写法，因为级联的是 metadata所以photo并不会自动保存

    /**
     * let photo = new Photo();
      photo.name = "createPhotoMetaCascade111";
      photo.description = "I am near polar bears";
      photo.filename = "photo-with-bears.jpg";
      photo.isPublished = true;
      photo.views = 1;

      let photoMeta = new PhotoMeta()
      photoMeta.height = createPhotoMeta.height;
      photoMeta.width = createPhotoMeta.width;
      photoMeta.compressed = createPhotoMeta.compressed;
      photoMeta.comment = createPhotoMeta.comment;
      photoMeta.orientation = createPhotoMeta.orientation;
      photoMeta.photo = photo

      await this.photosMetaRepository.save(photoMeta);
     * 
     */

    console.log("啊");

   

    console.log("okk");
  }

  @ApiOperation({summary:"createAlbumsAndPhots",description:"接口详细描述信息"})
  @Put()
  async createAlbumsAndPhots(){
    // 多对多的问题，这里 创建另个 相框，然后保存
    // 当照片保存的时候（包含这两个相框），触发 联结表更新
    // let album1 = new Album();
    // album1.name = "You";

    // let album2 = new Album();
    // album2.name = "I";

    // await this.albumRepository.save(album1)
    // await this.albumRepository.save(album2)

    // let photo = new Photo();
    // photo.name = "you and me";
    // photo.description = "I and you";
    // photo.filename = "w.jpg";
    // photo.albums = [album1,album2];
    // photo.views = 1;
    // photo.isPublished = true;
    // await this.photosRepository.save(photo)

    // 另一种
    // let photo1 = new Photo();
    // photo1.name = "you and me";
    // photo1.description = "I and you";
    // photo1.filename = "w.jpg";
    // photo1.views = 1;
    // photo1.isPublished = true;

    // let photo2 = new Photo();
    // photo2.name = "you and me";
    // photo2.description = "I and you";
    // photo2.filename = "w.jpg";
    // photo2.views = 1;
    // photo2.isPublished = true;

    // await this.photosRepository.save(photo1)
    // await this.photosRepository.save(photo2)

    // let album = new Album();
    // album.name = "I";
    // album.photos = [photo1,photo2];

    // await this.albumRepository.save(album);

    let result = await this.photosRepository.findOne({
      where:{id:10},
      relations:["albums"]
    })
    let result2 = await this.albumRepository.findOne({
      where:{id:10},
      relations:["photos"]
    })
    console.log(result);
    console.log(result2);
    console.log("ok");




  }

}
