import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get('data')
  noDataName(): string {
    return 'No client name provided';
  }

  @Get('data/:name')
  async getClientData(@Param('name') name: string): Promise<string> {
    return this.wclientRepository
      .findOne({ where: { name } })
      .then((wclient) => {
        if (!wclient) return 'Client not found';
        return `| Name: ${wclient.name} | Status: ${
          wclient.status
        } | isActive: ${
          wclient.isActive
        } | Message count: ${wclient.messageCount.toString()} | CreatedAt: ${
          wclient.createdAt
        } | UpdatedAt: ${wclient.updatedAt} |`;
      });
  }

  @Get('message-count')
  noName(): string {
    return 'No client name provided';
  }

  @Get('message-count/:name')
  async getMessageCount(@Param('name') name: string): Promise<string> {
    return this.wclientRepository
      .findOne({ where: { name } })
      .then((wclient) => {
        if (!wclient) return 'Client not found';
        return `| Client name: ${
          wclient.name
        } | Message count: ${wclient.messageCount.toString()} |`;
      });
  }

  @Post('create')
  create(@Body('name') name: string) {
    console.log(name);
    return this.wclientRepository.save({ name });
  }
}
