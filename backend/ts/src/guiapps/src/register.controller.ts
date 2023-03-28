import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';

import {
  Response,
  Request,
} from 'express';
import { AppsStorageService } from './services/apps-storage.service';

import { GuardClientService } from './services/guard-client.service';
import { Apps } from './services/init.service';


@Controller()
export class RegisterController {

  public tick = 2;

  constructor(
    private readonly _guardClientService: GuardClientService,
    private readonly _appsStorageService: AppsStorageService,
  ) {}

  @Post('v1/register')
  public register(@Res() res: Response, @Req() req: Request, @Body() apps: Apps) {
    // this.tick = 5;
    const auth = req.headers.authorization;
    const token = auth.replace('Bearer ', '');

    console.log(token, 'token');

    const valid = this._guardClientService.validate(token);
    const isTokenExpired = this._guardClientService.isTokenExpired(token);

    if (isTokenExpired) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Token expired' });
    }

    if (!valid) {
      return res.status(HttpStatus.FORBIDDEN).send({ message: 'Token not valid' });
    }

    if (!apps || !Object.keys(apps).length) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing Apps' });
    }

    this._appsStorageService.register(apps);

    res.status(HttpStatus.OK).send();
  }

  @Post('v1/unregister')
  public unregister(@Res() res: Response, @Req() req: Request,  @Body() apps: string[]) {
    const auth = req.headers.authorization;
    const token = auth.replace('Bearer ', '');

    console.log('unregister');

    const valid = this._guardClientService.validate(token);
    console.log(token, 'token');
    const isTokenExpired = this._guardClientService.isTokenExpired(token);
    console.log(isTokenExpired);

    if (this.tick > 0) {
      console.log('isecp');
      // console.log('not valid');
      this.tick -= 1;

      return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Token expired' });
    }

    if (!valid) {
      console.log('not vaaaaaaaaaal');

      return res.status(HttpStatus.FORBIDDEN).send({ message: 'Token not valid' });
    }

    if (!apps?.length) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing Apps' });
    }

    this._appsStorageService.unregister(apps);

    res.status(HttpStatus.OK).send();
  }

  @Post('v1/healthcheck')
  public health(@Res() res: Response, @Req() req: Request,  @Body() apps: string[]) {
    const auth = req.headers.authorization;
    const token = auth.replace('Bearer ', '');

    console.log('health');
    console.log(auth, '');

    const valid = this._guardClientService.validate(token);
    const isTokenExpired = this._guardClientService.isTokenExpired(token);

    if (isTokenExpired) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Token expired' });
    }

    if (!valid) {
      return res.status(HttpStatus.FORBIDDEN).send({ message: 'Token not valid' });
    }

    if (!apps?.length) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message: 'Missing Apps' });
    }

    const message = this._appsStorageService.health(apps);

    if (message) {
      return res.status(HttpStatus.BAD_REQUEST).send({ message });
    }

    res.status(HttpStatus.OK).send();
  }
}
