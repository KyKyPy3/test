import { Injectable } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { interval, throwError } from 'rxjs';

import { Apps } from './init.service';

@Injectable()
export class AppsStorageService {
  private readonly _appsStorageMap = new Map<string, { address: string, lastCheck: number }>();

  constructor() {
    this._startWatch();
  }

  public register(apps: Apps) {
    const lastCheck = new Date().valueOf();

    Object.keys(apps).forEach(app => {
      this._appsStorageMap.set(app, {
        address: apps[app],
        lastCheck,
      });
    });

    console.log(Object.fromEntries(this._appsStorageMap), 'storage write');
    writeFileSync('./appStorage.json', JSON.stringify(Object.fromEntries(this._appsStorageMap), null, 2), 'utf-8');
  }

  public unregister(apps: string[]) {
    apps.forEach(app => {
      this._appsStorageMap.delete(app);
    });

    console.log(Object.fromEntries(this._appsStorageMap), 'storage deleted');
    writeFileSync('./appStorage.json', JSON.stringify(Object.fromEntries(this._appsStorageMap), null, 2), 'utf-8');
  }

  public health(apps: string[]): string | void {
    try {
      const lastCheck = new Date().valueOf();
      apps.forEach(app => {
        const node = this._appsStorageMap.get(app);

        if (!node) {
          throwError(() => 'missing node');
        }

        node.lastCheck = lastCheck;
      });
  
      console.log(Object.fromEntries(this._appsStorageMap), 'storage updated');
      writeFileSync('./appStorage.json', JSON.stringify(Object.fromEntries(this._appsStorageMap), null, 2), 'utf-8');
    } catch (message) {
      console.log(message);

      return message;
    }
  }

  private _startWatch() {
    console.log('storage');

    interval(300000)
      .subscribe(() => {
        const now = new Date().valueOf();
        const unregister: string[] = [];
  
        Array.from(this._appsStorageMap.keys()).forEach(app => {
          const { lastCheck } = this._appsStorageMap.get(app);
          const expired = now < this._addMinutes(lastCheck, 5).valueOf();
  
          if (expired) {
            unregister.push(app);
          }
        });
  
        if (unregister.length) {
          console.log('clear storage');
          this.unregister(unregister);
        }
      });
  }

  private _addMinutes(date: number, minutes: number) {
    const dateCopy = new Date(new Date(date).getTime());
  
    dateCopy.setMinutes(dateCopy.getMinutes() + minutes);
  
    return dateCopy;
  }
}