import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { api } from './config/apiConfig';
import { ResponseTransformInterceptor } from './lib/interceptors/response-transform.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './lib/filter/exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    app.setGlobalPrefix(api.globalPrefix);
    app.enableCors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] });

    const swaggerConfig = new DocumentBuilder()
        .setTitle('WUW APIs')
        .setDescription('API docs for WUW project')
        .setVersion('1.0.0')
        .addSecurity('Authorization', {
            type: 'http',
            scheme: 'bearer',
        })
        .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(api.swaggerPrefix, app, document);

    await app.listen(api.apiPort);
}
bootstrap();
