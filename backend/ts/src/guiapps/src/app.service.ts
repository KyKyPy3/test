import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AppService {

  constructor(
    private readonly _configService: ConfigService,
  ){}

  public getJSON(configName: string, dirName: string) {
    const path = this._configService.get<string>('RootPath');

    const pathToJson = join(path, dirName, configName);

    if (existsSync(pathToJson)) {
      const buffer = readFileSync(pathToJson, 'utf-8');

      try {
        const config: Record<string, unknown> = JSON.parse(buffer);

        return config;
      } catch {
        console.error('error');
      }
    }

    return undefined;
  }

  public getJSONPath(configName: string, path: string) {
    const pathToJson = join(path, configName);
    if (existsSync(pathToJson)) {
      const buffer = readFileSync(pathToJson, 'utf-8');

      try {
        const config: Record<string, unknown> = JSON.parse(buffer);

        return config;
      } catch {
        console.error('error');
      }
    }

    return undefined;
  }
}
