import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { api } from './config/apiConfig';
import { ResponseTransformInterceptor } from './lib/interceptors/response-transform.interceptor';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './lib/filter/exception.filter';
import { ValidationError } from 'class-validator';
import { ValidateException } from './lib/exceptions/validate.exception';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory: (_: ValidationError[] = []) => {
                return new ValidateException();
            },
        }),
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
    app.useGlobalInterceptors(new ResponseTransformInterceptor());
    app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
    app.setGlobalPrefix(api.globalPrefix);
    app.enableCors({ origin: true, methods: ['GET', 'POST', 'PUT', 'DELETE'] });
    app.use(cookieParser());

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
