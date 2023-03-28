import { Injectable } from '@nestjs/common';

import { BridgeService } from './bridge.service';

import jsonwebtoken from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GuardClientService {

  public token: string;

  public publicKey: string;

  private _port: number;

  private readonly SD_DISCOVERY_NODE: string;

  constructor(
    private readonly _bridge: BridgeService,
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService,
  ) {
    this.SD_DISCOVERY_NODE = this._configService.get<string>('SD_DISCOVERY_NODE');
  }

  public async init() {
    await this._setGuardPort();

    if (this.SD_DISCOVERY_NODE !== 'central') {
      await this.auth();
    }

    await this._getPubKey();
  }

  private async _setGuardPort() {
    const service = await this._bridge.getService('Guard-central');

    if (!service) {
      console.log('Guard-central not defined');
    }

    this._port = service.Port;

    console.log(this._port);
  }

  public async _renewToken() {
    let renewalSuccess = false;

    const headersRequest = {
      Authorization: this.token,
    };
  
    await firstValueFrom(this._httpService.get(`http://qa-4869.infowatch.ru:${this._port}/v1/logonService/refresh`,
      { headers: headersRequest }))
      .then((response) => {
        if (response && response.status === 200) {
          this.token = response.headers.authorization;
          renewalSuccess = true;
          console.log('Token renewed');
        } else if (response && response.status === 403) {
          console.log('Error: Forbidden. You do not have permission to perform this action.');
        } else if (response && response.status >= 500) {
          console.log('Error: Internal Server Error. The server encountered an error processing the request.');
        }
      });
  
    return renewalSuccess;
  }

  public async auth() {
    const str = 'GuiApps:GuiAppsSrvPassword';
    
    // curl http://guard-central:8080/v1/logonService
    
    const buff = Buffer.from(str);
    const base64data = buff.toString('base64');

    const headersRequest = {
      Authorization: `Basic ${base64data}`,
    };

    await firstValueFrom(this._httpService.get(`http://qa-4869.infowatch.ru:${this._port}/v1/logonService`, { headers: headersRequest }))
      .then((res) => {
        this.token = res.headers.authorization;
        console.log('Auth complete');
      })
      .catch(() => {
        console.log('Auth error');
      });
  }

  public validate(token: string) {
    try {
      jsonwebtoken.verify(token, this.publicKey);
      return true;
    } catch {
      console.log('Validate false');

      return false;   
    }
  }
    
  public async _getPubKey() {
    await firstValueFrom(this._httpService.get(`http://qa-4869.infowatch.ru:${this._port}/v1/pubkey`,
      { 
        responseType: 'blob',  
        headers: {
          'Content-Type': 'application/octet-stream',
          'Accept': 'application/octet-stream, application/json, text/plain, */*', 
        }, 
      },
    )).then((res) => {
      this.publicKey = res.data;
 
      console.log(this.publicKey);
    }).catch(() => {
      console.log('get public key error');
    });
  }
    
  private _parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
    
    return JSON.parse(jsonPayload);
  }
    
  public getParsedToken(token: string) {
    if (token && token !== 'null') {
      const parsedToken = this._parseJwt(token);
    
      return parsedToken;
    }
    
    return {};
  }
    
  public isTokenExpired(token: string) {
    const parsedToken = this.getParsedToken(token);
    console.log(parsedToken);
    
    if (parsedToken.exp) {
      return parsedToken.exp < new Date().valueOf() / 1000;
    }
    
    return true;
  }
}