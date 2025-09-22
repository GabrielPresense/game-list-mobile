import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir acesso do frontend
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Habilitar validação global
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Configurar Swagger para documentação da API
  const config = new DocumentBuilder()
    .setTitle('Game List API')
    .setDescription('API para gerenciar listas de jogos e filmes/séries')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Escutar em todas as interfaces para permitir acesso externo
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Aplicação rodando em http://0.0.0.0:${port}`);
  console.log(`📚 Documentação Swagger disponível em http://0.0.0.0:${port}/api`);
}
bootstrap();

