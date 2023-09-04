import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wclient } from './wclient.entity';
import { Repository } from 'typeorm';

@Controller('wclient')
export class WclientController {
  constructor(
    @InjectRepository(Wclient) private wclientRepository: Repository<Wclient>,
  ) {}

  @Get()
  getBase(): string {
    return 'Welcome to the wclient controller';
  }

  @Get('message-count')
  getMessageCounts(): string {
    return 'No client name provided';
  }

  @Get('message-count/:name')
  async getMessageCount(@Param('name') name: string): Promise<string> {
    return await this.wclientRepository
      .findOne({ where: { name } })
      .then((wclient) => {
        return wclient.messageCount.toString();
      });
  }
}
