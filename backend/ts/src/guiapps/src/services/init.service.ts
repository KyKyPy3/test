import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';

import {
  existsSync,
  readdirSync,
} from 'fs';

import { join } from 'path';

import { GuardClientService } from './guard-client.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BehaviorSubject, catchError, EMPTY, firstValueFrom, of, retry, switchMap, timer } from 'rxjs';

export type SdDiscoverMode = string;

export type Apps = Record<string, SdDiscoverMode>;

@Injectable()
export class InitService implements OnApplicationBootstrap, OnApplicationShutdown {

  constructor(
    private readonly _guardClientService: GuardClientService,
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService,
  ) {
    this.SD_DISCOVERY_NODE = this._configService.get<string>('SD_DISCOVERY_NODE');
  }

  private readonly SD_DISCOVERY_NODE: string;

  private readonly _tick = 0;

  public async onApplicationBootstrap() {
    await this._guardClientService.init();

    console.log(this.SD_DISCOVERY_NODE, 'SD_DISCOVERY_NODE');
    console.log(this._configService.get<string>('SD_REGISTER_MODE'), 'SD_REGISTER_MODE');

    if (this.SD_DISCOVERY_NODE !== 'central') {
      await this._register();
      this._healthCheck();
    }
  }

  public async onApplicationShutdown() {
    if (this.SD_DISCOVERY_NODE !== 'central') {
      await this._unregisterTwo();
    }
  }

  private async _register() {
    const apps = this._getApps();
    const SD_DISCOVERY_NODE = this._configService.get<string>('SD_DISCOVERY_NODE');

    const headersRequest = {
      Authorization: `${this._guardClientService.token}`,
    };

    await firstValueFrom(this._httpService.post('http://localhost:4200/v1/register', apps, { headers: headersRequest })
      .pipe(
        retry({
          delay: 3000,
        }),
      ))
      .then(() => {
        console.log(`Register ${SD_DISCOVERY_NODE}`);
      });
  }

  // private async _unregister() {
  //   const apps = this._getApps('array');

  //   const headersRequest = {
  //     Authorization: `${this._guardClientService.token}`
  //   };

  //   await firstValueFrom(this._httpService.post('http://localhost:4200/v1/unregister', apps, { headers: headersRequest })
  //     .pipe(
  //       retry({
  //         count: 3,
  //         delay: async () => {
  //           console.log('delay');

  //           await this._guardClientService.renewToken()
  //         },
  //       }),
  //       catchError((e) => {
  //         console.log(e.response.data.message)

  //         return of(null);
  //       })
  //     ));
  // }

  private async _unregisterTwo(retryCount = 0) {
    const apps = this._getApps('array');
  
    const headersRequest = {
      Authorization: `${this._guardClientService.token}`,
    };

    console.log('unregister-two');
  
    await firstValueFrom(this._httpService.post('http://localhost:4200/v1/unregister', apps, { headers: headersRequest })
      .pipe(
        catchError(async (error) => {
          const shouldRetry = await this.handleError(error, 'unregister');

          console.log(shouldRetry, 'shouldRetry');
  
          if (shouldRetry && retryCount < 3) {
            await this.delayPromise(1000);
            
            return this._unregisterTwo(retryCount + 1);
          } else {
            console.log(error.response.data.message);

            return of(null);
          }
        }),
      ));
  }

  private async handleError(error: any, source: string = '') {
    const status = error.response.status;

    if (status === 401) { // Token expired
      const refreshed = await this._guardClientService._renewToken();
  
      if (!refreshed) { // Refresh token failed, re-authenticate
        await this._guardClientService.auth();
      }
  
      return true;
    } else if (status === 403) {
      await this._guardClientService.auth();

      return true;
    } else if (status === 400) {
      return false;

    } else if (status >= 500) {
      console.log(`Error ${source}: Internal Server Error. The server encountered an error processing the request.`);

      return true;
    } else {
      console.log(`Error: ${source}`, error.message);

      return false;
    }
  }

  private async delayPromise(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private _getApps(type: 'array' | 'object' = 'object') {
    const path = this._configService.get<string>('RootPath');
    const appConfigName = this._configService.get<string>('AppConfigName');

    const apps: Apps = {};
    const appsArray: string[] = [];

    readdirSync(path, { withFileTypes: true }).forEach((dirent) => {
      if (dirent.isDirectory() && dirent.name !== 'platform') {
        const pathToJson = join(path, dirent.name, appConfigName);

        if (existsSync(pathToJson)) {
          if (type === 'array') {
            appsArray.push(dirent.name);
          } else {
            apps[dirent.name] = `${this.SD_DISCOVERY_NODE}`;
          }
        }
      }
    });

    return type === 'array' ? appsArray : apps;
  }


  public healthCheckInteval = new BehaviorSubject<number>(5000);

  private _healthCheck() {

    this.healthCheckInteval.asObservable().pipe(
      switchMap((time: number) => timer(time)),
      switchMap(() => {
        const apps = this._getApps('array');

        const headers = {
          Authorization: `${this._guardClientService.token}`,
        };

        return this._httpService.post('http://localhost:4200/v1/healthcheck', apps, { headers });
      }),
      catchError(async (error) => {
        const status = error.response.status;

        if (status === 401) { // Token expired
          const refreshed = await this._guardClientService._renewToken();
      
          if (!refreshed) { // Refresh token failed, re-authenticate
            await this._guardClientService.auth();
          }

          this.healthCheckInteval.next(0);
      
          return EMPTY;
        } else if (status === 403) {
          await this._guardClientService.auth();
    
          this.healthCheckInteval.next(0);

          return EMPTY;
        } else if (status === 400) {
          await this._register();

          this.healthCheckInteval.next(0);

          return EMPTY;
        }

        return EMPTY;
      }),
    )
      .subscribe(() => {
        this.healthCheckInteval.next(5000);
      });
  }
}
