import {
  Inject,
  Injectable,
} from '@nestjs/common';

import Consul from 'consul';

export interface IService {
  ID: string;
  Service: string;
  Tags: string[];
  Address: string;
  Port: number;
  EnableTagOverride: boolean;
  CreateIndex: number;
  ModifyIndex: number;
}

@Injectable()
export class ConsuleService {
  constructor(
    @Inject('CONSUL_AGENT') private readonly _consul: Consul.Consul,
  ) {}

  public async getService(name: string) {
    const servicesMap = await this._getServicesList();

    const service = servicesMap[name];
    
    console.log(service, 'service');

    return service;
  }

  private async _getServicesList() {
    const services: Record<string, IService> = await this._consul.agent.service.list();

    return services;
  }
}
