import { Body, Controller, Get, Param, Post} from '@nestjs/common';
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
    return 'No client client id provided';
  }

  @Get('data/:id')
  async getClientData(@Param('id') id: string): Promise<string> {
    return this.wclientRepository.findOne({ where: { id } }).then((wclient) => {
      if (!wclient) return 'Client not found';
      return `| ID: ${wclient.id} | Name: ${wclient.name} | Status: ${
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
    return 'No client client id provided';
  }

  @Get('message-count/:id')
  async getMessageCount(@Param('id') id: string): Promise<string> {
    return this.wclientRepository.findOne({ where: { id } }).then((wclient) => {
      if (!wclient) return 'Client not found';
      return `| ID: ${wclient.id} | Name: ${
        wclient.name
      } | Message count: ${wclient.messageCount.toString()} |`;
    });
  }

  @Get('get-all')
  async getAll(): Promise<string> {
    return this.wclientRepository
      .find({ select: { id: true, name: true } })
      .then((wclients) => {
        return wclients
          .map(
            (wclient, i) =>
              `${i + 1}. <a href="/wclient/data/${wclient.id}"> ${
                wclient.name
              } | ${wclient.id}</a>`,
          )
          .join('<br>');
      });
  }

  @Post('create')
  create(@Body() body: Wclient) {
    return this.wclientRepository.save(body);
  }
}
