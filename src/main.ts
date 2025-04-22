import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.enableCors({
        origin: ['http://localhost:3000'],
        credential: true,
    });

    const config = new DocumentBuilder()
        .setTitle('FX Trading API')
        .setDescription(
            'This collection contains endpoints for user authentication, wallet management, and transaction tracking for a multi-currency FX trading platform.',
        )
        .setVersion('1.0')
        .addTag('fx-trading')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
