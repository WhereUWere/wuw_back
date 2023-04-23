import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { api } from './config/apiConfig';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix(api.globalPrefix);

    const swaggerConfig = new DocumentBuilder()
        .setTitle('WUW APIs')
        .setDescription('API docs for WUW test project')
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
