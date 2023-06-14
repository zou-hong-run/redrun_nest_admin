import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpReqTransformInterceptro } from './core/interceptors/http-req.interceptor';
import { AllExceptionFilter } from './core/filters/all-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express'
import * as csurf from 'csurf';
import * as session from 'express-session';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(session({
    secret:"my-secret",
    resave:false,
    saveUninitialized:false
  }))

  // 跨域请求
  app.enableCors();

  // 跨站点请求伪造（称为 CSRF 或 XSRF）是一种恶意利用网站，
  app.use(csurf())
  // 全局异常过滤
  app.useGlobalFilters(new AllExceptionFilter())
  // 全局拦截器
  app.useGlobalInterceptors(new HttpReqTransformInterceptro())
  
  // 全局守卫,如果数据库中有 就校验该用户权限，
  // 如果数据库没有就先添加再判断用户的权限是否合法
  // app.useGlobalGuards(new RequiredPermissionAuard(Reflector,PermissionService))

  const options = new DocumentBuilder()
  .setTitle('typeorm example')
  .setDescription('The typeorm API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
