import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { createProxyMiddleware } from 'http-proxy-middleware';

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const IP = configService.get<string>('IP');
  const PORT = configService.get<number>('PORT');

  if (IP) {
    const HOST = 'localhost';
    const API_SERVICE_URL = `https://${IP}`;

    // Proxy endpoints
    app.use(
      [/^\/api\/(?!guiApps).*$/],
      createProxyMiddleware({
        target: API_SERVICE_URL,
        secure: false,
        changeOrigin: true,
        cookieDomainRewrite: HOST,
      }),
    );

    app.use(
      '/api/guiApps/*',
      createProxyMiddleware({
        target: `http://localhost:${PORT}/`,
        changeOrigin: true,
        pathRewrite: {
          '/api/guiApps/': '/',
        },
      }),
    );
  }

  app.enableCors();

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  await app.listen(PORT);
}

void bootstrap();
