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
          'http://20.226.191.61:3000/api/v1/prediction/5aaca379-0683-4947-bf05-50f01bafb091',
          {
            question: data.question,
            overrideConfig: { sessionId: data.sessionId },
          },
          {
            headers: {
              Authorization:
                'Bearer ipCJq+F5R0H9rAfLiTJQGEZVmWhaTbkGw3Qo9gTclN8=',
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
