import { Injectable, Optional } from '@nestjs/common';
import { ConsuleService } from '../consul/consule.service';


@Injectable()
export class BridgeService {
  constructor(
    @Optional() private readonly consulService: ConsuleService,
  ) {}

  public async getService(name: string) {
    return this.consulService.getService(name);
  }
}
