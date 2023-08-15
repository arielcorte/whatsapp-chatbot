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
  }): Promise<string> {
    console.log('quering', data.clientApi);
    console.log(data);
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          data.clientApi.url,
          {
            question: data.question,
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
    }
  }
}
