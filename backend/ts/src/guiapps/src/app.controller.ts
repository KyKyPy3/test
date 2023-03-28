import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Response, Request } from 'express';
import { readdirSync } from 'fs';

import { join } from 'path';

import { AppService } from './app.service';

@Controller()
export class AppController {

  constructor(
    private readonly _appService: AppService,
    private readonly _configService: ConfigService,
  ) {}

  @Get('v1/apps')
  public getApps(@Res() res: Response) {
    const path = this._configService.get<string>('RootPath');
    const appConfigName = this._configService.get<string>('AppConfigName');

    const Apps: Record<string, unknown> = {};

    readdirSync(path, { withFileTypes: true }).forEach((direct) => {
      if (direct.isDirectory()) {
        const config = this._appService.getJSON(appConfigName, direct.name);

        if (config) {
          Apps[direct.name] = config;
        }
      }
    });

    res.status(HttpStatus.OK).json(Apps);
  }

  // TODO: Slash Double | Ошибка
  @Get('v1/apps//:appName/platform/plugins')
  public getProductPlatformPlugins(@Res() res: Response, @Req() req: Request) {
    const pluginsConfigName = this._configService.get<string>('PluginsConfigName');

    const appName = req.params.appName;

    const platformConfig = this._appService.getJSON(pluginsConfigName, join(appName, 'platform'));

    res.status(HttpStatus.OK).json(platformConfig);
  }

  @Get('v1/apps/platform/plugins')
  public getPlatformPlugins(@Res() res: Response) {
    const pluginsConfigName = this._configService.get<string>('PluginsConfigName');
    const platformFolderName = this._configService.get<string>('PlatformFolderName');

    const platformPluginsConfig = this._appService.getJSON(pluginsConfigName, platformFolderName);

    res.status(HttpStatus.OK).json(platformPluginsConfig);
  }

  // TODO ОШИБКа нет
  @Get('v1/apps/:appName/platform/info')
  public getProductPlatformApp(@Res() res: Response, @Req() req: Request) {
    const appConfigName = this._configService.get<string>('AppConfigName');
    const platformFolderName = this._configService.get<string>('PlatformFolderName');

    const appName = req.params.appName;

    const platformAppConfig = this._appService.getJSON(appConfigName, join(appName, platformFolderName));

    res.status(HttpStatus.OK).json(platformAppConfig);
  }

  @Get('v1/plugins')
  public getPlugins(@Res() res: Response) {
    const path = this._configService.get<string>('RootPath');
    const pluginsConfigName = this._configService.get<string>('PluginsConfigName');

    const Plugins: Record<string, unknown> = {};

    readdirSync(path, { withFileTypes: true }).forEach((direct) => {
      if (direct.isDirectory()) {
        const config = this._appService.getJSON(pluginsConfigName, direct.name);

        if (config) {
          Plugins[direct.name] = config;
        }
      }
    });

    res.status(HttpStatus.OK).json(Plugins);
  }

  @Get('v1/apps/:appName/plugins')
  public getPluginByAppName(@Res() res: Response, @Req() req: Request) {
    const pluginsConfigName = this._configService.get<string>('PluginsConfigName');
    const appName = req.params.appName;

    const productPluginsConfig = this._appService.getJSON(pluginsConfigName, appName);

    res.status(HttpStatus.OK).json(productPluginsConfig);
  }
}
