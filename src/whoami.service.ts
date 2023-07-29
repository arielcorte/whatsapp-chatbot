import { Injectable } from '@nestjs/common';

@Injectable()
export class WhoamiService {
  getWhoami(): string {
    return 'Created by: Ariel Corte';
  }
}
