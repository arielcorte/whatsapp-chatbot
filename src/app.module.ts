import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhoamiController } from './whoami.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatbotModule } from './chatbot/chatbot.module';
import { WhoamiService } from './whoami.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './chatsapp.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),
    ChatbotModule,
  ],
  controllers: [AppController, WhoamiController],
  providers: [AppService, WhoamiService],
})
export class AppModule {}
