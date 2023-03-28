import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request, Response, NextFunction } from 'express';
import { existsSync } from 'fs';
import { join, relative, resolve } from 'path';
import { AppService } from './app.service';


@Injectable()
export class StreamMiddleware implements NestMiddleware {
  constructor(
    private readonly _appService: AppService,
    private readonly _configService: ConfigService,
  ) {}

  public use(req: Request, res: Response, next: NextFunction) {
    const fileWithExtension = req.url.match(/\.(\w{2,4})(?:$|\?)/);
    const toApi = req.url.match(`/v[0-9]+/`);

    if (!(fileWithExtension || toApi)) {
      const path = this._configService.get<string>('RootPath');
      const fullPath = join(path, req.url);

      if (!existsSync(fullPath)) {
        let currentPath = fullPath;

        let rel;
        while (rel !== '') {
          const result = this._getPath(currentPath, res, path);
          if (result) {
            res.sendFile(resolve(result)); return;
          } else {
            rel = relative(path, currentPath);
            currentPath += '/..';
          }
        }
      }

      const result = this._getPath(fullPath, res, path);

      if (result) {
        res.sendFile(resolve(result)); return;
      }
    }

    // if (req.url.includes('/vision') && PORT !== '5000') {
    //   res.redirect(`http://localhost:5000${req.url}`);
    // }

    next();
  }

  private _getPath(path: string, res: Response, basePath: string) {
    const appConfigName = this._configService.get<string>('AppConfigName');
    const platformFolderName = this._configService.get<string>('PlatformFolderName');

    const filePath = join(path, 'index.html');
    const appPath = join(path, appConfigName);
    const isProduct = existsSync(filePath) && existsSync(appPath);

    let result = '';
    if (isProduct || (!existsSync(filePath) && existsSync(appPath))) {
      const app = this._appService.getJSONPath(appConfigName, path);

      if (app?.platform === 'self') {
        result = filePath;
      } else {
        result = join(basePath, platformFolderName, 'index.html');
      }
    }

    return result;
  }
}
