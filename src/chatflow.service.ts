import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatflowService {
  constructor(private readonly httpService: HttpService) {}

  async query(data: { question: string; sessionId: string }): Promise<string> {
    console.log('quering');
    console.log(data);
    try {
      const response = await lastValueFrom(
        this.httpService.post(
          'http://20.226.191.61:3000/api/v1/prediction/0f6a825e-31b9-448f-9f55-04ad16d03dc3',
          {
            question: data.question,
            overrideConfig: { sessionId: data.sessionId },
          },
          {
            headers: {
              Authorization:
                'Bearer Kv0OAPNTNEp2sUQ+603DHMSRUiykguVZrDRqefS4HMQ=',
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
