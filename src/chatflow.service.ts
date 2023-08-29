import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatflowService {
  constructor(private readonly httpService: HttpService) {}

  async query(data: {
    question: string;
    sessionId: string;
    clientApi: { url: string; key: string };
    author?: string;
    to?: string;
  }): Promise<string> {
    console.log('quering', data.clientApi);
    console.log(data);
    const clientApiUrl = data.clientApi.url.startsWith('http')
      ? 'http://flowise:3000' + data.clientApi.url.replace(/.*\/api/g, '/api')
      : 'http://flowise:3000' + data.clientApi.url;
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          clientApiUrl,
          {
            question:
              data.author && data.to
                ? `${data.author} dijo a ${data.to}: ${data.question}`
                : data.question,
            overrideConfig: { sessionId: data.sessionId },
          },
          {
            headers: {
              Authorization: data.clientApi.key,
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
      return 'failed';
    }
  }
}
