import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from './entities/photo.entity';
import { PhotoMeta } from './entities/photo.meta.entity';
import { Author } from './entities/author.entity';
import { Album } from './entities/album.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'nestjs_test',
      autoLoadEntities:true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Photo,PhotoMeta,Author,Album])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
