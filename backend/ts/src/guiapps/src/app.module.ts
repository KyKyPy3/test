import { HttpModule } from '@nestjs/axios';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConsuleModule } from './consul/consule.module';
import { RegisterController } from './register.controller';
import { AppsStorageService } from './services/apps-storage.service';

import { BridgeService } from './services/bridge.service';
import { GuardClientService } from './services/guard-client.service';

import { InitService } from './services/init.service';
import { StreamMiddleware } from './stream.middleware';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      load: [() => ({
        IP: process.env.IP,
        CLIENT_PATH: process.env.CLIENT_PATH || 'client',
        MODE: process.env.MODE,
        PORT: process.env.PORT || 4200,
        SD_DISCOVERY_NODE: process.env.SD_DISCOVERY_NODE || 'central',
        SD_DISCOVERY_BYNAME_PORT: process.env.SD_DISCOVERY_BYNAME_PORT || 8080,
        SD_REGISTER_MODE: process.env.SD_REGISTER_MODE,

        AppConfigName: 'app.json',
        PluginsConfigName: 'plugins.json',
        PlatformFolderName: 'platform',
        RootPath: join(__dirname, '..', process.env.CLIENT_PATH || 'client'),
      })],
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [{
        rootPath: join(__dirname, '..', configService.get<string>('CLIENT_PATH')),
      }],
    }),
    ConsuleModule,
  ],
  controllers: [
    AppController,
    RegisterController,
  ],
  providers: [
    AppService,
    InitService,
    BridgeService,
    GuardClientService,
    AppsStorageService,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(StreamMiddleware).forRoutes('/');
  }
}
