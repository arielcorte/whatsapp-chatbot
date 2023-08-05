import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatflowService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async query(data: { question: string; sessionId: string }): Promise<string> {
    console.log('quering');
    console.log(data);
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          this.configService.get<string>('FLOWISE_API_URL'),
          {
            question: data.question,
            overrideConfig: { sessionId: data.sessionId },
          },
          {
            headers: {
              Authorization:
                this.configService.get<string>('FLOWISE_API_BEARER'),
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      //const response = await lastValueFrom(
      //  this.httpService.get('https://pokeapi.co/api/v2/pokemon/ditto'),
      //);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}
