import { Module } from '@nestjs/common';

import Consul from 'consul';

import { ConsuleService } from './consule.service';

@Module({
  providers: [
    ConsuleService,
    {
      provide: 'CONSUL_AGENT',
      useFactory: () => {
        const consul = new Consul({
          port: '8500',
          host: 'localhost',
        });

        return consul;
      },
    },
  ],
  exports: [ConsuleService],
})
export class ConsuleModule {}
