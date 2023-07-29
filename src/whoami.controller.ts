import { Controller, Get } from '@nestjs/common';
import { WhoamiService } from './whoami.service';

@Controller('whoami')
export class WhoamiController {
  constructor(private readonly whoamiService: WhoamiService) {}

  @Get()
  getWhoami(): string {
    return this.whoamiService.getWhoami();
  }
}
